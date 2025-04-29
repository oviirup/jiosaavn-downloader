export function saveAs(inputFile: File | Blob, name?: string) {
  const el = document.createElementNS(
    'http://www.w3.org/1999/xhtml',
    'a',
  ) as HTMLAnchorElement
  name ??= 'name' in inputFile ? inputFile.name : 'download'
  // set attributes
  el.download = name
  el.rel = 'noopener'
  el.href = URL.createObjectURL(inputFile)
  // revoke object url after 30 seconds
  setTimeout(() => URL.revokeObjectURL(el.href), 30e3)
  // initiate click event to the link to download, and remove it
  el.click()
  setTimeout(() => el.remove, 5)
}
