// components/LeagueLogo.jsx
'use client';

import { useState, useEffect } from 'react';

export default function LeagueLogo({ src, alt, className, fallback = "https://via.placeholder.com/64x64/F1F5F9/64748B?text=🏆" }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      src={imgSrc || fallback}
      alt={alt}
      className={`${className} object-contain`}
      onError={handleError}
    />
  );
}