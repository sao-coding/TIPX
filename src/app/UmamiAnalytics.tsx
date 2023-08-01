import Script from "next/script"

const UmamiAnalytics = () => {
    // <script async src="https://umami-analytics-git-main-sao-coding.vercel.app/script.js" data-website-id="4bd6e65e-0bce-453d-ac2b-9bd5ba9efa09"></script>
    return (
        <>
            <Script
                async
                src='https://umami-analytics-git-main-sao-coding.vercel.app/script.js'
                data-website-id='4bd6e65e-0bce-453d-ac2b-9bd5ba9efa09'
            />
        </>
    )
}

export default UmamiAnalytics
