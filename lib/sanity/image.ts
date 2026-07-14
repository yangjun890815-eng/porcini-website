import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source?: Image | null) {
  if (!source) {
    return null;
  }

  return builder.image(source).auto("format").fit("crop");
}

