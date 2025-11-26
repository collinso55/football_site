// components/CountryFlag.jsx
'use client';

import { useState } from 'react';

export default function CountryFlag({ src, alt, className, fallback = "/fallback-flag.png" }) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}