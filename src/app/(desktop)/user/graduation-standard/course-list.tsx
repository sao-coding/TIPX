'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDownIcon,
  ArrowUpIcon,
  Calendar,
  Filter,
  Layers,
  SearchIcon,
  Tag,
  X
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { GraduationStandard } from '@/types'

export default function CourseList({ data }: { data: GraduationStandard }) {
  const [selectedSemester, setSelectedSemester] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFailingOnly, setShowFailingOnly] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('table')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: '',
    direction: ''
  })
  const { courses } = data

  // Get unique semesters for filter
  const semesters = useMemo(() => {
    const allSemesters = courses.map((course) => `${course.year}-${course.sem}`)
    return Array.from(new Set(allSemesters)).sort((a, b) => b.localeCompare(a)) // 最新學期優先
  }, [courses])

  // Get all course types
  const courseTypes = ['必修', '選修', '通識']

  // Get unique categories for filter
  const categories = useMemo(() => {
    const allCategories = courses.flatMap((semesterData) =>
      semesterData.grades.map((course) => course.category)
    )
    return Array.from(new Set(allCategories)).sort()
  }, [courses])

  // Update active filters count
  useEffect(() => {
    let count = 0
    if (selectedSemester !== 'all') count++
    if (selectedType !== 'all') count++
    if (selectedCategory !== 'all') count++
    if (searchTerm) count++
    if (showFailingOnly) count++
    setActiveFilters(count)
  }, [selectedSemester, selectedType, selectedCategory, searchTerm, showFailingOnly])

  // Reset all filters
  const resetFilters = () => {
    setSelectedSemester('all')
    setSelectedType('all')
    setSelectedCategory('all')
    setSearchTerm('')
    setShowFailingOnly(false)
  }

  // Sort function for courses
  const requestSort = (key: string) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort courses based on selected criteria
  const filteredCourses = useMemo(() => {
    let result = courses.flatMap((semesterData) => {
      const semesterKey = `${semesterData.year}-${semesterData.sem}`

      if (selectedSemester !== 'all' && semesterKey !== selectedSemester) {
        return []
      }

      return semesterData.grades
        .filter((course) => {
          const matchesSearch =
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesType = selectedType === 'all' || course.type === selectedType
          const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
          const matchesFailing =
            !showFailingOnly || (course.finalGrade > 0 && course.finalGrade < 60)

          return matchesSearch && matchesType && matchesCategory && matchesFailing
        })
        .map((course) => ({
          ...course,
          year: semesterData.year,
          sem: semesterData.sem,
          semesterKey
        }))
    })
    type SortKey =
      | 'semesterKey'
      | 'name'
      | 'credit'
      | 'midtermGrade'
      | 'finalGrade'
      | 'type'
      | 'year'
      | 'sem'
      | 'category'
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const key = sortConfig.key as SortKey
        if (a[key] < b[key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    } else {
      // Default sort by newest semester first
      result.sort((a, b) => b.semesterKey.localeCompare(a.semesterKey))
    }

    return result
  }, [
    courses,
    selectedSemester,
    selectedType,
    selectedCategory,
    searchTerm,
    showFailingOnly,
    sortConfig
  ])

  // Function to get badge color based on course type
  const getTypeColor = (type: string) => {
    switch (type) {
      case '必修':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case '選修':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case '通識':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Function to get text color based on grade
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400 font-medium'
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400 font-medium'
    if (grade >= 70) return 'text-amber-600 dark:text-amber-400 font-medium'
    if (grade >= 60) return 'text-orange-600 dark:text-orange-400 font-medium'
    if (grade > 0) return 'text-red-600 dark:text-red-400 font-medium'
    return 'text-gray-500 dark:text-gray-400'
  }

  // Function to get sort direction icon
  const getSortIcon = (fieldName: string) => {
    if (sortConfig.key !== fieldName) return null
    return sortConfig.direction === 'ascending' ? (
      <ArrowDownIcon className='inline-block h-4 w-4' />
    ) : (
      <ArrowUpIcon className='inline-block h-4 w-4' />
    )
  }

  return (
    <Card>
      <CardHeader className='pb-0'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <CardTitle>課程列表</CardTitle>
            <CardDescription>所有修習課程的詳細資訊</CardDescription>
          </div>
          <Tabs value={viewMode} onValueChange={setViewMode} className='w-full sm:w-auto'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='table'>表格檢視</TabsTrigger>
              <TabsTrigger value='cards'>卡片檢視</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='mt-4 flex items-center gap-2'>
          <div className='relative flex flex-1 items-center'>
            <SearchIcon className='absolute left-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='搜尋課程名稱或類別...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-8 pr-8'
            />
            {searchTerm && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-9 w-9 p-0'
                onClick={() => setSearchTerm('')}
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>清除搜尋</span>
              </Button>
            )}
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' size='sm' className='gap-1'>
                <Filter className='h-4 w-4' />
                篩選
                {activeFilters > 0 && (
                  <Badge
                    variant='secondary'
                    className='ml-1 h-5 w-5 justify-center rounded-full p-0 text-xs'
                  >
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='end' sideOffset={8}>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-medium'>篩選條件</h4>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 px-2 text-sm'
                    onClick={resetFilters}
                  >
                    重設
                  </Button>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <div className='text-sm font-medium'>學期</div>
                  </div>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='選擇學期' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>所有學期</SelectItem>
                      {semesters.map((semester: string, index: number) => (
                        <SelectItem key={`${semester}-${index}`} value={semester}>
                          {semester} 學期
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Tag className='h-4 w-4 text-muted-foreground' />
                    <div className='text-sm font-medium'>課程類型</div>
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='課程類型' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>所有類型</SelectItem>
                      {courseTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Layers className='h-4 w-4 text-muted-foreground' />
                    <div className='text-sm font-medium'>課程類別</div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='課程類別' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>所有類別</SelectItem>
                      {categories.map((category: string) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4 text-muted-foreground' />
                    <div className='text-sm font-medium'>成績</div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='failing-only'
                      checked={showFailingOnly}
                      onCheckedChange={(checked) => setShowFailingOnly(checked === true)}
                    />
                    <label
                      htmlFor='failing-only'
                      className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {'僅顯示不及格課程 (期末成績 < 60)'}
                    </label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {activeFilters > 0 && (
          <div className='mt-2 flex flex-wrap gap-2'>
            {selectedSemester !== 'all' && (
              <Badge variant='secondary' className='flex items-center gap-1 pr-1'>
                學期: {selectedSemester}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-5 w-5 p-0'
                  onClick={() => setSelectedSemester('all')}
                >
                  <X className='h-3 w-3' />
                  <span className='sr-only'>移除學期篩選</span>
                </Button>
              </Badge>
            )}
            {selectedType !== 'all' && (
              <Badge variant='secondary' className='flex items-center gap-1 pr-1'>
                類型: {selectedType}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-5 w-5 p-0'
                  onClick={() => setSelectedType('all')}
                >
                  <X className='h-3 w-3' />
                  <span className='sr-only'>移除類型篩選</span>
                </Button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant='secondary' className='flex items-center gap-1 pr-1'>
                類別: {selectedCategory}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-5 w-5 p-0'
                  onClick={() => setSelectedCategory('all')}
                >
                  <X className='h-3 w-3' />
                  <span className='sr-only'>移除類別篩選</span>
                </Button>
              </Badge>
            )}
            {showFailingOnly && (
              <Badge variant='secondary' className='flex items-center gap-1 pr-1'>
                僅顯示不及格課程
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-5 w-5 p-0'
                  onClick={() => setShowFailingOnly(false)}
                >
                  <X className='h-3 w-3' />
                  <span className='sr-only'>移除不及格篩選</span>
                </Button>
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className='pt-4'>
        {viewMode === 'table' ? (
          <div className='overflow-x-auto rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='cursor-pointer' onClick={() => requestSort('semesterKey')}>
                    學期 {getSortIcon('semesterKey')}
                  </TableHead>
                  <TableHead
                    className='min-w-[200px] cursor-pointer'
                    onClick={() => requestSort('name')}
                  >
                    課程名稱 {getSortIcon('name')}
                  </TableHead>
                  <TableHead className='min-w-20 text-center'>類型</TableHead>
                  <TableHead
                    className='min-w-20 cursor-pointer text-center'
                    onClick={() => requestSort('credit')}
                  >
                    學分 {getSortIcon('credit')}
                  </TableHead>
                  <TableHead
                    className='min-w-20 cursor-pointer text-center'
                    onClick={() => requestSort('midtermGrade')}
                  >
                    期中<span className='hidden sm:inline'>成績</span> {getSortIcon('midtermGrade')}
                  </TableHead>
                  <TableHead
                    className='min-w-20 cursor-pointer text-center'
                    onClick={() => requestSort('finalGrade')}
                  >
                    期末<span className='hidden sm:inline'>成績</span> {getSortIcon('finalGrade')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course: any, index: number) => (
                    <TableRow key={`${course.id}-${course.year}-${course.sem}-${index}`}>
                      <TableCell className='font-medium'>
                        {course.year}-{course.sem}
                      </TableCell>
                      <TableCell>
                        <div>{course.name}</div>
                        <div className='mt-1 text-xs text-muted-foreground'>{course.category}</div>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge className={cn('font-normal', getTypeColor(course.type))}>
                          {course.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center'>{course.credit}</TableCell>
                      <TableCell className={cn(getGradeColor(course.midtermGrade), 'text-center')}>
                        {course.midtermGrade > 0 ? course.midtermGrade : '-'}
                      </TableCell>
                      <TableCell className={cn(getGradeColor(course.finalGrade), 'text-center')}>
                        {course.finalGrade > 0 ? course.finalGrade : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='h-32 text-center'>
                      <div className='flex flex-col items-center justify-center space-y-1'>
                        <div className='text-lg font-medium'>沒有找到符合條件的課程</div>
                        {activeFilters > 0 && (
                          <Button variant='outline' size='sm' onClick={resetFilters}>
                            清除所有篩選
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course: any, index: number) => (
                <Card key={`card-${course.id}-${index}`} className='overflow-hidden'>
                  <CardHeader className='p-4 pb-2'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='line-clamp-1 text-base'>{course.name}</CardTitle>
                        <CardDescription>
                          {course.year}-{course.sem} 學期
                        </CardDescription>
                      </div>
                      <Badge className={cn('min-w-[46px] font-normal', getTypeColor(course.type))}>
                        {course.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='p-4 pt-2'>
                    <div className='grid grid-cols-3 gap-2 text-sm'>
                      <div>
                        <div className='text-muted-foreground'>學分</div>
                        <div className='font-medium'>{course.credit}</div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>期中</div>
                        <div className={getGradeColor(course.midtermGrade)}>
                          {course.midtermGrade > 0 ? course.midtermGrade : '-'}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground'>期末</div>
                        <div className={getGradeColor(course.finalGrade)}>
                          {course.finalGrade > 0 ? course.finalGrade : '-'}
                        </div>
                      </div>
                    </div>
                    <div
                      className='mt-2 truncate text-xs text-muted-foreground'
                      title={course.category}
                    >
                      {course.category}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='col-span-full py-8 text-center text-muted-foreground'>
                <div className='flex flex-col items-center justify-center space-y-1'>
                  <div className='text-lg font-medium'>沒有找到符合條件的課程</div>
                  {activeFilters > 0 && (
                    <Button variant='outline' size='sm' onClick={resetFilters}>
                      清除所有篩選
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className='mt-4 text-sm text-muted-foreground'>
          顯示 {filteredCourses.length} 門課程
          {activeFilters > 0 && ' (已套用篩選)'}
        </div>
      </CardContent>
    </Card>
  )
}
