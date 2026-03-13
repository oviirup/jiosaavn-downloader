import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type Manifest = chrome.runtime.ManifestV3;

const manifestJSON: Manifest = {
  manifest_version: 3,
  name: "",
  version: "",
};

export function parseEntries(input: Manifest) {
  const entriesMap = new Map<string, string>();
  // assign manifest to manifestJSON
  Object.assign(manifestJSON, structuredClone(input));
  if (input.background?.service_worker) {
    entriesMap.set("sw", input.background.service_worker);
    manifestJSON.background = { service_worker: "sw.js" };
  }
  const entries = Object.fromEntries(entriesMap.entries());
  return entries;
}

export async function generateIcons() {
  const sizes = [16, 32, 48, 128];
  const iconFilepath = path.join("src", "icon.svg");
  const iconBuffer = await fs.readFile(iconFilepath);
  // generate icons and update manifest
  async function writeIconFile(iconBuffer: Buffer, size: number) {
    const filename = `icon.${size}.png`;
    const filepath = path.join("dist", filename);
    try {
      // generate resized icon
      const buffer = await sharp(iconBuffer).resize(size).png().toBuffer();
      // write file
      await fs.writeFile(filepath, buffer);
      // update manifest
      manifestJSON.icons ??= {};
      manifestJSON.icons[size] = filename;
      manifestJSON.action ??= {};
      manifestJSON.action.default_icon ??= {};
      manifestJSON.action.default_icon[size] = filename;
    } catch {}
  }
  // generate icons in parallel
  return Promise.all(sizes.map((size) => writeIconFile(iconBuffer, size)));
}

export async function generateManifestJson() {
  const manifestPath = path.join("dist", "manifest.json");
  try {
    await fs.writeFile(manifestPath, JSON.stringify(manifestJSON, null, 2));
  } catch {}
}
