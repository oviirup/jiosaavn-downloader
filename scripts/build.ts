import { build } from "tsdown";
import { manifest } from "@/manifest";
import { generateIcons, generateManifestJson, parseEntries } from "./helpers";

build({
  entry: parseEntries(manifest),
  platform: "browser",
  minify: true,
  format: "cjs",
  css: { transformer: "postcss" },
  onSuccess: async () => {
    await generateIcons();
    await generateManifestJson();
  },
  outExtensions: () => ({ js: ".js" }),
});
