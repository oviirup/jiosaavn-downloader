export function normalizeFileName(fileName: string, replacement = '-') {
  return fileName
    .replace(/[\/\?<>\\:\*\|"]/g, replacement) // illegal characters
    .replace(/[\x00-\x1f]/g, replacement) // non-printable characters
    .replace(/[\x80-\x9f]/g, replacement) // controlled characters
    .replace(/^\.+$/, replacement) // reserved posix
    .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])\./i, replacement) // reserved windows
    .replace(/[\. ]+$/, replacement) // tailing slash
    .replace(/\s+/, ' ') // multiple spaces
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}
