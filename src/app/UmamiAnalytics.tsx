import Script from "next/script"

const UmamiAnalytics = () => {
  // <script defer src="https://umami.sao-x.com/script.js" data-website-id="4bd6e65e-0bce-453d-ac2b-9bd5ba9efa09"></script>
  return (
    <>
      <Script
        async
        src='https://umami.sao-x.com/script.js'
        data-website-id='4bd6e65e-0bce-453d-ac2b-9bd5ba9efa09'
      />
    </>
  )
}

export default UmamiAnalytics
