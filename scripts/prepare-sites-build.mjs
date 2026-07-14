import { access, cp, mkdir, rename, rm } from "node:fs/promises";
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

  const standaloneServerEntry = path.join(serverDir, "server.js");
  const sitesServerEntry = path.join(serverDir, "index.js");
  await rename(standaloneServerEntry, sitesServerEntry);

  // Remove build-only artifacts and duplicate output from the final deployable artifact.
  await rm(path.join(distDir, "cache"), { recursive: true, force: true });
  await rm(path.join(distDir, "diagnostics"), { recursive: true, force: true });
  await rm(path.join(distDir, "trace"), { force: true });
  await rm(path.join(distDir, "types"), { recursive: true, force: true });
  await rm(path.join(distDir, "standalone"), { recursive: true, force: true });
  await rm(path.join(distDir, "static"), { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
