import React, { useEffect, useState }  from 'react';
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import Highlight from '~/components/highlight';
import GlobalMenu from '~components/global-menu';
import styleText from "data-text:./base.css"

const styleElement = document.createElement("style")
styleElement.textContent = styleText

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

function Index() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Asking for CSS @media property value from JavaScript
  // fullScreen API not working in some cases
  useEffect(() => {
    const handleFullscreenChange = (e) => {
      setIsFullscreen(e.matches);
    };
  
    const mediaQuery = window.matchMedia('(display-mode: fullscreen)');
    mediaQuery.addEventListener('change', handleFullscreenChange);
  
    return () => {
      mediaQuery.removeEventListener('change', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      {!isFullscreen && (
        <CacheProvider value={styleCache}>
          <Highlight />
          <GlobalMenu />
        </CacheProvider>
      )}
    </>
  );
}

export default Index;