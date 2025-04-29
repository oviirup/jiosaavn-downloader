# Changelog

## v3.0.3

### Patch Changes

- 🐛 Fixed [#16](https://github.com/oviirup/jiosaavn-downloader/issues/16): missing meta-tags – by [@oviirup](https://github.com/oviirup)
  - ✨ Transpiled _M4A_ to widely used _MP3_ format
  - 🏷️ Added meta-tags to downloaded files
  - ♻️ Refactored code to normalize file names

## v3.0.2

### Patch Changes

- 🔥 Added support for Firefox – by [@oviirup](https://github.com/oviirup)

## v3.0.1

### Patch Changes

- ✨ Added download button – by [@oviirup](https://github.com/oviirup)
  - 🎧 Download songs, albums, or playlists with one click
  - 🚫 Abort downloads feature
  - 📁 Download albums and playlists as ZIP
  - 🧵 Parallel download feature for faster downloads

### Known Issues

- Downloaded songs do not contain metadata [#16](https://github.com/oviirup/jiosaavn-downloader/issues/16)

## v3.0.0

### Major Changes

- ♻️ Complete rewrite using Plasmo – by [@oviirup](https://github.com/oviirup) in [#36](https://github.com/oviirup/jiosaavn-downloader/pull/36)
  - 📦 Switched to Plasmo.js as the framework
  - 📦 Updated to React 19
  - 🚫 Integrated functional ad blocker
  - 🎨 Dark theme based on system color scheme
