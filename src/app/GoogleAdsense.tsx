import Script from "next/script"

const GoogleAdsense = () => {
  return (
    <>
      <Script
        data-ad-client='ca-pub-2271001084588765'
        crossOrigin='anonymous'
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      />
    </>
  )
}

export default GoogleAdsense
