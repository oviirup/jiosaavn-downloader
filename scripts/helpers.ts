import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type Manifest = chrome.runtime.ManifestV3;

const manifestJSON: Manifest = {
  manifest_version: 3,
  name: "",
  version: "",
};

const hashCache = new Set<string>();
export function generateHash(): string {
  const hash = crypto.randomBytes(4).toString("hex").slice(0, 7);
  if (hashCache.has(hash)) return generateHash();
  return hash;
}

export function parseEntries(input: Manifest) {
  const entriesMap = new Map<string, string>();
  const createAssetName = (prefix: string, ext: string, hashed = false) => {
    let filename = `${prefix}`;
    if (hashed) filename += `.${generateHash()}`;
    return { name: filename, path: `${filename}.${ext}` };
  };
  // start with a shallow copy of the input manifest
  Object.assign(manifestJSON, structuredClone(input));
  // background service worker
  if (input.background?.service_worker) {
    const file = createAssetName("sw", "js");
    entriesMap.set(file.name, input.background.service_worker);
    manifestJSON.background = { service_worker: file.path };
  }
  // content scripts
  if (input.content_scripts?.length) {
    manifestJSON.content_scripts = input.content_scripts.map((cs) => {
      const csClone = structuredClone(cs);
      if (cs.js?.length) {
        csClone.js = cs.js.map((jsFile) => {
          const file = createAssetName("content", "js", true);
          entriesMap.set(file.name, jsFile);
          return file.path;
        });
      }
      if (cs.css?.length) {
        // currently tsdown cannot process css entry
      }

      return csClone;
    });
  }
  // create entry object for tsdown
  return Object.fromEntries(entriesMap.entries());
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
