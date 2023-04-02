import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState }  from 'react';
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import GlobalButton from '../components/global-button';
import GlobalCard from '../components/global-card';
import Highlight from './highlight';

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    css: ["style.css"]
}

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

function Index() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [anchor, setAnchor] = useState(false);
  const [data, setData] = useState(false);
  
  return (
    <CacheProvider value={styleCache}>
      <Highlight />
      <GlobalButton setData={setData} success={success} setSuccess={setSuccess} error={error} setError={setError} loading={loading} setLoading={setLoading} setAnchor={setAnchor} />
      <GlobalCard data={data} success={success} anchor={anchor} setAnchor={setAnchor} />
    </CacheProvider>
  );
}

export default Index;