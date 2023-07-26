import Script from "next/script"

const GoogleAnalytics = () => {
    return (
        <>
            <Script async src='https://www.googletagmanager.com/gtag/js?id=G-EH7GWE7C4H' />
            <Script id='google-analytics'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                
                    gtag('config', 'G-EH7GWE7C4H');
                `}
            </Script>
        </>
    )
}

export default GoogleAnalytics
