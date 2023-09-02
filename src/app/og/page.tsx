import { IconUserHexagon } from "@tabler/icons-react"

const Test: React.FC = () => {
    return (
        <div className='h-[400px] w-[800px]'>
            <div
                className='h-full w-full px-14 py-12 text-white flex flex-col justify-between'
                style={{
                    background: "linear-gradient(to top left, #EECDA3, #daa3f7, #fdb99b)",
                }}
            >
                <div className='text-3xl font-semibold'>2023-08-31</div>
                <div className='mx-auto text-4xl'>
                    【英國雙聯學位說明會】英國倫敦密德薩斯Middlesex University
                    雙聯學位說明會~歡迎參加
                </div>
                <div className='flex items-center justify-between'>
                    <IconUserHexagon className='flex w-10 h-10' />
                    <div className='text-3xl'>TIPX</div>
                </div>
            </div>
        </div>
    )
}

export default Test
