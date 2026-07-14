import { access, cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const standaloneDir = path.join(distDir, "standalone");
const serverDir = path.join(distDir, "server");
const hostingDir = path.join(distDir, ".openai");

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(hostingDir, { recursive: true });
  await cp(path.join(root, ".openai", "hosting.json"), path.join(hostingDir, "hosting.json"));

  if (!(await pathExists(standaloneDir))) {
    throw new Error("Next standalone output was not generated at dist/standalone.");
  }

  const appServerDir = path.join(serverDir, "app");
  const staticDir = path.join(distDir, "static");

  await rm(serverDir, { recursive: true, force: true });
  await cp(standaloneDir, serverDir, { recursive: true });
  await mkdir(path.join(serverDir, "dist"), { recursive: true });
  await cp(appServerDir, path.join(serverDir, "dist", "server", "app"), {
    recursive: true
  }).catch(() => {});
  await cp(staticDir, path.join(serverDir, "dist", "static"), {
    recursive: true
  }).catch(() => {});

  const serverPackageJsonPath = path.join(serverDir, "package.json");
  const serverPackageJson = JSON.parse(await readFile(serverPackageJsonPath, "utf8"));
  serverPackageJson.type = "module";
  await writeFile(serverPackageJsonPath, `${JSON.stringify(serverPackageJson, null, 2)}\n`, "utf8");

  const standaloneServerEntry = path.join(serverDir, "server.js");
  const commonJsServerEntry = path.join(serverDir, "app.cjs");
  const esmServerEntry = path.join(serverDir, "index.js");
  await rename(standaloneServerEntry, commonJsServerEntry);
  await writeFile(
    esmServerEntry,
    [
      'import { createRequire } from "node:module";',
      "",
      "const require = createRequire(import.meta.url);",
      'require("./app.cjs");',
      ""
    ].join("\n"),
    "utf8"
  );

  // Remove build-only artifacts and duplicate output from the final deployable artifact.
  await rm(path.join(distDir, "cache"), { recursive: true, force: true });
  await rm(path.join(distDir, "diagnostics"), { recursive: true, force: true });
  await rm(path.join(distDir, "trace"), { force: true });
  await rm(path.join(distDir, "types"), { recursive: true, force: true });
  await rm(path.join(distDir, "standalone"), { recursive: true, force: true });
  await rm(path.join(distDir, "static"), { recursive: true, force: true });
  await rm(path.join(serverDir, "node_modules", "typescript"), {
    recursive: true,
    force: true
  });
  await rm(path.join(serverDir, "node_modules", "next", "dist", "compiled", "next-devtools"), {
    recursive: true,
    force: true
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
