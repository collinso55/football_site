// components/TeamLogo.jsx
'use client';

import { useState } from 'react';

export default function TeamLogo({ src, alt, className, fallback = "/fallback-team.png" }) {
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