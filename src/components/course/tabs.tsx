import * as Tabs from "@radix-ui/react-tabs"
import Hw from "@/app/course/[id]/hw/page"
import CourseStuList from "@/app/course/[id]/course-stu-list/page"
import CourseAttendanceRecord from "@/app/course/[id]/course-attendance-record/page"
import { Course } from "@/types"

const CourseTabs = ({ data, id }: { data: Course[]; id: string }) => (
    <Tabs.Root className='' defaultValue='作業'>
        <Tabs.List className='flex justify-around border-b border-main-color-3'>
            {data?.map((item: Course) => (
                <Tabs.Trigger
                    key={item.item}
                    className='group relative w-full p-2'
                    value={item.item}
                >
                    {item.item}
                    <div className='absolute bottom-0 left-0 z-10 h-1 w-full group-data-[state=active]:border-b-[3px] group-data-[state=active]:border-main-color-2'></div>
                </Tabs.Trigger>
            ))}
        </Tabs.List>

        <Tabs.Content className='rounded-b-md pt-2' value='作業' aria-labelledby='作業' id='作業'>
            {/* params.id */}
            <Hw params={{ id: id }} />
        </Tabs.Content>
        <Tabs.Content
            className='rounded-b-md pt-2'
            value='修課學生'
            aria-labelledby='修課學生'
            id='修課學生'
        >
            <CourseStuList params={{ id: id }} />
        </Tabs.Content>
        <Tabs.Content
            className='rounded-b-md pt-2'
            value='出缺勤'
            aria-labelledby='出缺勤'
            id='出缺勤'
        >
            <CourseAttendanceRecord params={{ id: id }} />
        </Tabs.Content>
    </Tabs.Root>
)

export default CourseTabs
