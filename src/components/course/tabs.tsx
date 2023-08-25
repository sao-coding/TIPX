import * as Tabs from "@radix-ui/react-tabs"
import Hw from "@/app/course/[id]/hw/page"
import CourseStuList from "@/app/course/[id]/course-stu-list/page"
import CourseAttendanceRecord from "@/app/course/[id]/course-attendance-record/page"
import { motion } from "framer-motion"

const CourseTabs = ({ id }: { id: string }) => {
    const tabList = [{ value: "作業" }, { value: "修課學生" }, { value: "出缺勤" }]
    const tabsClassName = ["peer/tabs-作業", "peer/tabs-修課學生", "peer/tabs-出缺勤"]
    return (
        <Tabs.Root defaultValue='作業'>
            <Tabs.List className='flex justify-around border-b border-main-color-3 relative'>
                {tabList?.map((item, index) => (
                    <Tabs.Trigger
                        key={item.value}
                        className={`w-full p-2 ` + tabsClassName[index]}
                        value={item.value}
                        id={"tabs-" + item.value}
                    >
                        {item.value}
                    </Tabs.Trigger>
                ))}
                <motion.div
                    id='tabs-line'
                    className='absolute bottom-0 left-0 h-1 border-b-[3px] border-main-color-2 flex w-1/3 peer-aria-selected/tabs-作業:translate-x-0 peer-aria-selected/tabs-修課學生:translate-x-full peer-aria-selected/tabs-出缺勤:translate-x-[200%] duration-300 ease-in-out'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            </Tabs.List>

            <Tabs.Content
                className='mb-14 rounded-b-md pt-2'
                value='作業'
                aria-labelledby='作業'
                id='作業'
            >
                {/* params.id */}
                <Hw params={{ id: id }} />
            </Tabs.Content>
            <Tabs.Content
                className='mb-14 rounded-b-md pt-2'
                value='修課學生'
                aria-labelledby='修課學生'
                id='修課學生'
            >
                <CourseStuList params={{ id: id }} />
            </Tabs.Content>
            <Tabs.Content
                className='mb-14 rounded-b-md pt-2'
                value='出缺勤'
                aria-labelledby='出缺勤'
                id='出缺勤'
            >
                <CourseAttendanceRecord params={{ id: id }} />
            </Tabs.Content>
        </Tabs.Root>
    )
}

export default CourseTabs
