import { createClient } from "next-sanity";
import { sanityEnv } from "./env";

export const sanityClient = createClient({
  projectId: sanityEnv.projectId || "demo-project",
  dataset: sanityEnv.dataset,
  apiVersion: sanityEnv.apiVersion,
  useCdn: true
});

