import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const stagingDir = path.join(root, ".sites-artifact");
const stagingServerDir = path.join(stagingDir, "dist", "server");
const stagingOpenNextDir = path.join(stagingServerDir, ".open-next");

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

async function patchWindowsEsmImport() {
  const serverEntryPath = path.join(
    stagingOpenNextDir,
    "server-functions",
    "default",
    "index.mjs"
  );
  const source = await readFile(serverEntryPath, "utf8");
  const patched = source.replace(
    'import(process.cwd()+"/open-next.config.mjs")',
    'import(new URL("./open-next.config.mjs", import.meta.url).href)'
  );
  const patchedNodeModules = patched.replace(
    'from"next/dist/server/next-server.js"',
    'from"./node_modules/next/dist/server/next-server.js"'
  );
  const patchedNextImportMode = patchedNodeModules.replace(
    'import eoe from"./node_modules/next/dist/server/next-server.js";',
    'import * as eoe from"./node_modules/next/dist/server/next-server.js";'
  );
  const patchedNextServerCtor = patchedNextImportMode.replace(
    "new eoe.default({",
    'new (eoe.default?.default ?? eoe["module.exports"]?.default ?? eoe.default)({'
  );

  if (patchedNextServerCtor !== source) {
    await writeFile(serverEntryPath, patchedNextServerCtor, "utf8");
  }
}

async function main() {
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(path.join(stagingDir, ".openai"), { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(stagingDir, ".openai", "hosting.json"));
  await mkdir(stagingServerDir, { recursive: true });
  await cp(path.join(root, ".open-next"), stagingOpenNextDir, { recursive: true });
  await pruneUnusedImageOptimizer();
  await patchWindowsEsmImport();
  await writeFile(
    path.join(stagingServerDir, "package.json"),
    `${JSON.stringify({ type: "module" })}\n`,
    "utf8"
  );
  await writeFile(
    path.join(stagingServerDir, "index.mjs"),
    'await import("./.open-next/server-functions/default/index.mjs");\n',
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
