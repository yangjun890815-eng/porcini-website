import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { sanityEnv } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Porcini Origin Studio",
  projectId: sanityEnv.projectId || "your-project-id",
  dataset: sanityEnv.dataset,
  basePath: "/studio",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes
  }
});
