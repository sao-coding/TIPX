import * as Tabs from "@radix-ui/react-tabs"
import Hw from "@/app/course/[id]/hw/page"
import CourseStuList from "@/app/course/[id]/course-stu-list/page"
import CourseAttendanceRecord from "@/app/course/[id]/course-attendance-record/page"

const CourseTabs = ({ data, id }: { data: any; id: string }) => (
    <Tabs.Root className='' defaultValue='作業'>
        <Tabs.List
            className='flex justify-around border-b border-main-color-3'
            aria-label='Manage your account'
        >
            {data?.map((item: any) => (
                <Tabs.Trigger
                    key={item.item}
                    className='w-full p-2 data-[state=active]:shadow-tab-line data-[state=active]:shadow-main-color-2'
                    value={item.item}
                >
                    {item.item}
                </Tabs.Trigger>
            ))}
        </Tabs.List>

        <Tabs.Content className='rounded-b-md pt-2' value='作業'>
            {/* params.id */}
            <Hw params={{ id: id }} />
        </Tabs.Content>
        <Tabs.Content className='rounded-b-md pt-2' value='修課學生'>
            <CourseStuList params={{ id: id }} />
        </Tabs.Content>
        <Tabs.Content className='rounded-b-md pt-2' value='出缺勤'>
            <CourseAttendanceRecord params={{ id: id }} />
        </Tabs.Content>
    </Tabs.Root>
)

export default CourseTabs
