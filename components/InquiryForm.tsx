"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export type InquiryProductOption = {
  slug: string;
  name: string;
};

type InquiryFormValues = {
  name: string;
  email: string;
  company: string;
  productSlug: string;
  message: string;
};

type InquiryFormErrors = Partial<Record<keyof InquiryFormValues, string>>;

type SubmissionState =
  | {
      type: "idle";
      message: string;
    }
  | {
      type: "success";
      message: string;
    }
  | {
      type: "error";
      message: string;
    };

const initialValues: InquiryFormValues = {
  name: "",
  email: "",
  company: "",
  productSlug: "",
  message: ""
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function InquiryForm({
  products
}: {
  products: InquiryProductOption[];
}) {
  const searchParams = useSearchParams();
  const resetTimerRef = useRef<number | null>(null);

  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const productId = useId();
  const messageId = useId();

  const requestedProductSlug = searchParams.get("product") || "";

  const defaultProductSlug = useMemo(() => {
    if (!requestedProductSlug) {
      return "";
    }

    return products.some((product) => product.slug === requestedProductSlug)
      ? requestedProductSlug
      : "";
  }, [products, requestedProductSlug]);

  const [values, setValues] = useState<InquiryFormValues>({
    ...initialValues,
    productSlug: defaultProductSlug
  });
  const [errors, setErrors] = useState<InquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    type: "idle",
    message: ""
  });

  useEffect(() => {
    setValues((currentValues) => ({
      ...currentValues,
      productSlug: defaultProductSlug
    }));
  }, [defaultProductSlug]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function validateForm(nextValues: InquiryFormValues) {
    const nextErrors: InquiryFormErrors = {};

    if (!nextValues.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!nextValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(nextValues.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!nextValues.message.trim()) {
      nextErrors.message = "Inquiry details are required.";
    }

    return nextErrors;
  }

  function handleFieldChange(
    field: keyof InquiryFormValues,
    nextValue: string
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: nextValue
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmissionState({
        type: "error",
        message: "Please correct the highlighted fields and try again."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState({
      type: "idle",
      message: ""
    });

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          company: values.company.trim(),
          productSlug: values.productSlug,
          message: values.message.trim()
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            partialSuccess?: boolean;
            fieldErrors?: InquiryFormErrors;
          }
        | null;

      if (!response.ok) {
        if (payload?.fieldErrors) {
          setErrors(payload.fieldErrors);
        }

        setSubmissionState({
          type: "error",
          message:
            payload?.message ||
            "Something went wrong while sending your inquiry. Please try again."
        });
        return;
      }

      setSubmissionState({
        type: "success",
        message: payload?.partialSuccess
          ? "Inquiry saved successfully. We'll reply within 24h."
          : "Inquiry sent successfully. We'll reply within 24h."
      });

      resetTimerRef.current = window.setTimeout(() => {
        setValues({
          ...initialValues,
          productSlug: defaultProductSlug
        });
        setErrors({});
        setSubmissionState({
          type: "idle",
          message: ""
        });
      }, 3000);
    } catch {
      setSubmissionState({
        type: "error",
        message:
          "Something went wrong while sending your inquiry. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const nameErrorId = `${nameId}-error`;
  const emailErrorId = `${emailId}-error`;
  const companyErrorId = `${companyId}-error`;
  const productErrorId = `${productId}-error`;
  const messageErrorId = `${messageId}-error`;

  return (
    <div className="rounded-[2rem] border border-brand-stone bg-white p-6 shadow-soft sm:p-8">
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label
              htmlFor={nameId}
              className="mb-2 block text-sm font-semibold text-brand-brown"
            >
              Name *
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) => handleFieldChange("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? nameErrorId : undefined}
              className="w-full rounded-2xl border border-brand-stone bg-brand-cream/30 px-4 py-3 text-brand-brown outline-none transition focus:border-brand-olive"
            />
            {errors.name ? (
              <p id={nameErrorId} className="mt-2 text-sm text-red-700">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor={emailId}
              className="mb-2 block text-sm font-semibold text-brand-brown"
            >
              Email *
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => handleFieldChange("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? emailErrorId : undefined}
              className="w-full rounded-2xl border border-brand-stone bg-brand-cream/30 px-4 py-3 text-brand-brown outline-none transition focus:border-brand-olive"
            />
            {errors.email ? (
              <p id={emailErrorId} className="mt-2 text-sm text-red-700">
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label
              htmlFor={companyId}
              className="mb-2 block text-sm font-semibold text-brand-brown"
            >
              Company
            </label>
            <input
              id={companyId}
              name="company"
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={(event) => handleFieldChange("company", event.target.value)}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? companyErrorId : undefined}
              className="w-full rounded-2xl border border-brand-stone bg-brand-cream/30 px-4 py-3 text-brand-brown outline-none transition focus:border-brand-olive"
            />
            {errors.company ? (
              <p id={companyErrorId} className="mt-2 text-sm text-red-700">
                {errors.company}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-1">
            <label
              htmlFor={productId}
              className="mb-2 block text-sm font-semibold text-brand-brown"
            >
              Product Interest
            </label>
            <select
              id={productId}
              name="productSlug"
              value={values.productSlug}
              onChange={(event) =>
                handleFieldChange("productSlug", event.target.value)
              }
              aria-invalid={Boolean(errors.productSlug)}
              aria-describedby={errors.productSlug ? productErrorId : undefined}
              className="w-full rounded-2xl border border-brand-stone bg-brand-cream/30 px-4 py-3 text-brand-brown outline-none transition focus:border-brand-olive"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.productSlug ? (
              <p id={productErrorId} className="mt-2 text-sm text-red-700">
                {errors.productSlug}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor={messageId}
            className="mb-2 block text-sm font-semibold text-brand-brown"
          >
            Message *
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => handleFieldChange("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? messageErrorId : undefined}
            className="w-full rounded-2xl border border-brand-stone bg-brand-cream/30 px-4 py-3 text-brand-brown outline-none transition focus:border-brand-olive"
            placeholder="Tell us your target market, product format, packaging request, and expected order volume."
          />
          {errors.message ? (
            <p id={messageErrorId} className="mt-2 text-sm text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>

        {submissionState.type === "success" ? (
          <div
            className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            role="status"
          >
            {submissionState.message}
          </div>
        ) : null}

        {submissionState.type === "error" ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {submissionState.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-brown px-6 py-3 font-semibold text-white transition hover:bg-brand-brown/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Sending inquiry..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
