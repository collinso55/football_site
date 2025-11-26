// components/LeagueLogo.jsx
'use client';

import { useState } from 'react';

export default function LeagueLogo({ src, alt, className, fallback = "https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=⚽" }) {
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