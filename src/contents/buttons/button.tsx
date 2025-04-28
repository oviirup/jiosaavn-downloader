import { getListData, getSongData } from '@/lib/jiosaavn/api'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { downloadList, downloadSong } from './download'

const variants = cva('__JSDX_download_button group relative mr-2', {
  variants: {
    size: {
      large: 'c-btn c-btn--tertiary c-btn--ghost c-btn--icon',
      small: 'u-link',
    },
  },
})

function Button({ token, target, size }: Button.Props) {
  // states --------------------------------------------------------------------

  const [isPending, setIsPending] = React.useState(false)
  const controller = React.useRef(new AbortController())

  // handlers ------------------------------------------------------------------

  const handleOnClick = React.useCallback(async () => {
    if (isPending) {
      controller.current.abort()
      setIsPending(false)
      return
    }
    setIsPending(true)
    try {
      if (target === 'song') {
        const data = await getSongData({ token })
        await downloadSong(data, controller.current.signal)
      } else if (target === 'album' || target === 'playlist') {
        const data = await getListData({ token, type: target })
        await downloadList(data, controller.current.signal)
      }
    } catch {}
    setIsPending(false)
  }, [token, target, isPending])

  // render --------------------------------------------------------------------

  return (
    <span
      className={variants({ size })}
      data-target={target}
      data-pending={isPending ? '' : undefined}
      onClick={handleOnClick}>
      <i className="o-icon--large o-icon-download" />
    </span>
  )
}

namespace Button {
  export type Props = VariantProps<typeof variants> & {
    target: 'song' | 'album' | 'playlist'
    token: string
  }
}

export { Button }
