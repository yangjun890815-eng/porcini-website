import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const stagingDir = path.join(root, ".sites-artifact");
const stagingOpenNextDir = path.join(stagingDir, ".open-next");

async function pruneUnusedImageOptimizer() {
  const manifestPath = path.join(stagingOpenNextDir, "open-next.output.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (!manifest.origins?.imageOptimizer) {
    return;
  }

  delete manifest.origins.imageOptimizer;
  manifest.behaviors = manifest.behaviors.filter(
    (behavior) => behavior.origin !== "imageOptimizer"
  );

  const imageOptimizerDir = path.join(stagingOpenNextDir, "image-optimization-function");
  await rm(imageOptimizerDir, { recursive: true, force: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`, "utf8");
}

async function main() {
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(path.join(stagingDir, ".openai"), { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(stagingDir, ".openai", "hosting.json"));
  await cp(path.join(root, ".open-next"), stagingOpenNextDir, { recursive: true });
  await pruneUnusedImageOptimizer();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
