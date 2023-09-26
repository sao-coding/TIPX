import Close from "@/components/Close"
import { Title as TitleType } from "@/types"

const Title = ({ title }: { title: TitleType }) => {
    return (
        <>
            <div
                className={`relative w-full py-2 my-0.5 md:py-1 md:mb-2 md:rounded-xl md:border text-2xl font-bold md:shadow-sm ${title.position}`}
            >
                <>{title.close && <Close />}</>
                {title.title}
            </div>
        </>
    )
}

export default Title
