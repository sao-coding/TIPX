import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Copy from '@/components/ui/copy'
import { DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import Loading from '@/components/ui/Loading'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import formatDatetime from '@/utils/format-datetime'
import { Student } from '@prisma/client'
import { IconCake, IconDeviceMobile, IconId, IconSchool } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import Location from './location'

const MobileInfo = ({ userId }: { userId: string }) => {
  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ['search-student', userId],
    queryFn: async () => {
      const { data } = await api.get('/search', {
        params: {
          type: 'student',
          userId
        }
      })

      return data
    }
  })

  const TabsListData = [
    { label: '一般', value: 'normal' },
    { label: '統計', value: 'statistics' }
  ]
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <DrawerHeader>
        <DrawerTitle>{student?.name}</DrawerTitle>
        <DrawerDescription>{student?.major}</DrawerDescription>
      </DrawerHeader>
      <Tabs defaultValue='normal'>
        <TabsList className='w-full'>
          {/* <TabsTrigger value='account'>一般</TabsTrigger>
            <TabsTrigger value='password'>統計</TabsTrigger> */}
          {TabsListData.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className='w-full'>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* <TabsContent value='account'>Make changes to your account here.</TabsContent>
          <TabsContent value='password'>Change your password here.</TabsContent> */}
        <TabsContent value='normal'>
          <div className='flex flex-col gap-1'>
            <Card>
              <CardContent className='pt-6'>
                <Location userId={userId} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center space-x-1'>
                  <IconId />
                  <div>{student?.IDNumber}</div>
                  <Copy />
                </div>
                <div className='flex items-center space-x-1'>
                  <IconDeviceMobile />
                  <div>{student?.phone}</div>
                  <Copy />
                </div>
                <div className='flex items-center space-x-1'>
                  <IconCake />
                  {student?.birthday ? (
                    <>
                      <div>{formatDatetime('birthday', student.birthday)}</div>
                      <Copy />
                    </>
                  ) : (
                    <div className='text-gray-400'>未填寫生日</div>
                  )}
                </div>
                <div className='flex items-center space-x-1'>
                  <IconSchool />
                  <div>{student?.previousEducation}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>自傳</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className='-mx-2 h-72 whitespace-pre-line px-2'>
                  {student?.desc}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value='statistics'>正在開發中...</TabsContent>
      </Tabs>

      {/* {JSON.stringify(student)} */}
      {/* <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose>
          <Button variant='outline'>Cancel</Button>
        </DrawerClose>
      </DrawerFooter> */}
    </>
  )
}

export default MobileInfo
