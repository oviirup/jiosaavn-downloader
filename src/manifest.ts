import pkg from "../package.json" with { type: "json" };

export const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  homepage_url: pkg.repository,
  permissions: ["storage", "declarativeNetRequest"],
  background: { service_worker: "./src/background/index.ts" },
};
