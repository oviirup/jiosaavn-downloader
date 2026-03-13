import { build } from "tsdown";
import { manifest } from "@/manifest";
import { generateIcons, generateManifestJson, parseEntries } from "./helpers";

build({
  entry: parseEntries(manifest),
  platform: "browser",
  minify: true,
  onSuccess: async () => {
    await generateIcons();
    await generateManifestJson();
  },
  outExtensions: () => ({ js: ".js" }),
});
