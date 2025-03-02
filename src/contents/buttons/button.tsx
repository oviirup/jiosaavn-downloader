import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('__JSDX_download_button group relative', {
  variants: {
    size: {
      large: 'c-btn c-btn--tertiary c-btn--ghost c-btn--icon',
      small: 'u-link',
    },
  },
});

function Button({ token, size }: Button.Props) {
  const handleOnClick = () => {
    console.log(token);
  };
  return (
    <span className={variants({ size })} onClick={handleOnClick}>
      <i className="o-icon--large o-icon-download group-data-[pending]:before:content-[J]" />
      <svg
        viewBox="0 0 24 24"
        height={24}
        width={24}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
