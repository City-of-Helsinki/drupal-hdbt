import { useEffect, useState } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  const mobileBreakpoint = window.getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-m');

  return {
    width,
    height,
    isMobile: width < parseInt(mobileBreakpoint, 10),
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
