import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllProducts } from "@/lib/sanity/queries";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  company: z.string().trim().optional().or(z.literal("")),
  productSlug: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(1, "Inquiry details are required.")
});

type InquiryPayload = z.infer<typeof inquirySchema>;

type AirtableRecordPayload = {
  records: Array<{
    fields: {
      Name: string;
      Email: string;
      Company: string;
      Product: string;
      Message: string;
      Source: string;
      SubmittedAt: string;
    };
  }>;
};

function toFieldErrors(error: z.ZodError<InquiryPayload>) {
  const flattened = error.flatten().fieldErrors;

  return {
    name: flattened.name?.[0],
    email: flattened.email?.[0],
    company: flattened.company?.[0],
    productSlug: flattened.productSlug?.[0],
    message: flattened.message?.[0]
  };
}

async function sendNotificationEmail({
  payload,
  productName
}: {
  payload: InquiryPayload;
  productName: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!resendApiKey || !notificationEmail) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Porcini Origin <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New inquiry from ${payload.name}`,
      html: `
        <h1>New website inquiry</h1>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Company:</strong> ${payload.company || "-"}</p>
        <p><strong>Product:</strong> ${productName || "-"}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br />")}</p>
      `
    }),
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend request failed: ${response.status} ${errorText}`);
  }

  return true;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid JSON request body."
      },
      { status: 400 }
    );
  }

  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid inquiry payload.",
        fieldErrors: toFieldErrors(parsed.error)
      },
      { status: 400 }
    );
  }

  const airtableApiKey = process.env.AIRTABLE_API_KEY;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableTableName = process.env.AIRTABLE_TABLE_NAME || "Inquiries";

  if (!airtableApiKey || !airtableBaseId) {
    console.error("Airtable environment variables are missing.");
    return NextResponse.json(
      {
        ok: false,
        message: "Inquiry service is not configured."
      },
      { status: 500 }
    );
  }

  const payload = parsed.data;

  let productName = "";

  if (payload.productSlug) {
    try {
      const products = await getAllProducts();
      const matchedProduct = products.find(
        (product) => product.slug === payload.productSlug
      );
      productName = matchedProduct?.name || payload.productSlug;
    } catch {
      productName = payload.productSlug;
    }
  }

  const airtableBody: AirtableRecordPayload = {
    records: [
      {
        fields: {
          Name: payload.name,
          Email: payload.email,
          Company: payload.company || "",
          Product: productName,
          Message: payload.message,
          Source: "website-contact-form",
          SubmittedAt: new Date().toISOString()
        }
      }
    ]
  };

  try {
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(airtableBody),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!airtableResponse.ok) {
      const errorText = await airtableResponse.text().catch(() => "");
      console.error("Airtable request failed:", airtableResponse.status, errorText);

      return NextResponse.json(
        {
          ok: false,
          message:
            "We could not save your inquiry right now. Please try again shortly."
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Airtable request error:", error);

    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not save your inquiry right now. Please try again shortly."
      },
      { status: 500 }
    );
  }

  let partialSuccess = false;

  try {
    const resendSent = await sendNotificationEmail({ payload, productName });

    if (!resendSent) {
      partialSuccess = true;
      console.error(
        "Resend notification skipped because RESEND_API_KEY or NOTIFICATION_EMAIL is missing."
      );
    }
  } catch (error) {
    partialSuccess = true;
    console.error("Resend notification failed:", error);
  }

  return NextResponse.json({
    ok: true,
    ...(partialSuccess ? { partialSuccess: true } : {})
  });
}
