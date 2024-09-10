import Script from 'next/script'

const LogLib = () => {
  return (
    <Script
      src='https://cdn.jsdelivr.net/npm/@loglib/tracker@latest/dist/index.global.js'
      data-id='tipx_sao-x'
    />
  )
}
export default LogLib
