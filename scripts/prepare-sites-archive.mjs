import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const stagingDir = path.join(root, ".sites-artifact");

async function main() {
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(path.join(stagingDir, ".openai"), { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(stagingDir, ".openai", "hosting.json"));
  await cp(path.join(root, ".open-next"), path.join(stagingDir, ".open-next"), { recursive: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
