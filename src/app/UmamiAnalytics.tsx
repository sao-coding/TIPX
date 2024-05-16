import Script from "next/script"

const UmamiAnalytics = () => {
  return (
    <>
      <Script
        async
        src='https://umami.sao-x.com/script.js'
        data-website-id='8982608c-64f8-4e67-99d6-40475cdd7dd9'
      />
    </>
  )
}

export default UmamiAnalytics
