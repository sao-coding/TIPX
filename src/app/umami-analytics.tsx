import Script from 'next/script'

const UmamiAnalytics = () => {
  return (
    <Script
      src='https://umami.sao-x.com/script.js'
      data-website-id='a7e2fd43-949b-45ed-b9a9-853f2260615a'
    />
  )
}
export default UmamiAnalytics
