import { Toaster } from "react-hot-toast"

const ToasterNotify = () => {
    return (
        <Toaster
            position='top-center'
            toastOptions={{
                className: "bg-card-background dark:text-white !important",
            }}
        />
    )
}

export default ToasterNotify
