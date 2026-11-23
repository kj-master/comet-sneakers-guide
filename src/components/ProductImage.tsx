import { useState } from 'react';
import { Product, PRODUCT_ALT_TEXT, PRODUCT_SWATCH_STYLES } from '../data/sneakers';
import { buildImageSrcSet } from '../utils/device';

interface ProductImageProps {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProductImage({
  product,
  className = '',
  sizes = '(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 360px',
  priority = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !product.img || hasError;
  const swatch = PRODUCT_SWATCH_STYLES[product.id] ?? {
    bg: '#E8E3DA',
    fg: '#141414',
    sub: '#524E48',
  };
  const altText =
    PRODUCT_ALT_TEXT[product.id] ??
    `Comet sneakers ${product.family} ${product.model}, ${product.colour.toLowerCase()} sneaker`;

  if (showFallback) {
    return (
      <div
        className={`relative flex aspect-square w-full flex-col justify-between p-4 select-none ${className}`}
        style={{ backgroundColor: swatch.bg, color: swatch.fg }}
        role="img"
        aria-label={altText}
      >
        <span className="text-sm font-semibold tracking-wide" style={{ color: swatch.sub }}>
          Comet sneakers · {product.family}
        </span>
        <div>
          <p className="text-xl font-bold tracking-tight leading-tight">{product.model}</p>
          <p className="mt-1 text-sm font-medium" style={{ color: swatch.sub }}>
            {product.colour}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-square w-full overflow-hidden bg-[#FFFFFF] ${className}`}>
      <img
        src={product.img}
        srcSet={buildImageSrcSet(product.img)}
        sizes={sizes}
        alt={altText}
        width={800}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
