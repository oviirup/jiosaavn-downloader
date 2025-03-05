import { getListData, getSongData } from '@/lib/jiosaavn/api';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { downloadList, downloadSong } from './download';

const variants = cva('__JSDX_download_button group relative mr-2', {
  variants: {
    size: {
      large: 'c-btn c-btn--tertiary c-btn--ghost c-btn--icon',
      small: 'u-link',
    },
  },
});

function Button({ token, target, size }: Button.Props) {
  // states --------------------------------------------------------------------

  const [isPending, setIsPending] = React.useState(false);
  const controller = React.useRef(new AbortController());

  // handlers ------------------------------------------------------------------

  const handleOnClick = React.useCallback(async () => {
    if (isPending) {
      controller.current.abort();
      setIsPending(false);
      return;
    }
    setIsPending(true);
    try {
      if (target === 'song') {
        const data = await getSongData({ token });
        await downloadSong(data, controller.current.signal);
      } else if (target === 'album' || target === 'playlist') {
        const data = await getListData({ token, type: target });
        await downloadList(data, controller.current.signal);
      }
    } catch {}
    setIsPending(false);
  }, [token, target, isPending]);

  // render --------------------------------------------------------------------

  return (
    <span
      className={variants({ size })}
      data-target={target}
      data-pending={isPending ? '' : undefined}
      onClick={handleOnClick}>
      <i className="o-icon--large o-icon-download" />

      <svg
        viewBox="0 0 24 24"
        height={24}
        width={24}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden>
        <circle cx={12} cy={12} r={10} />
      </svg>
    </span>
  );
}

namespace Button {
  export type Props = VariantProps<typeof variants> & {
    target: 'song' | 'album' | 'playlist';
    token: string;
  };
}

export { Button };
