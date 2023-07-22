import * as Select from "@radix-ui/react-select"
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"
import { LoginSelect } from "@/types"
import { useState, useEffect } from "react"

const LoginSelect = ({
    data,
    setValue,
}: {
    data: LoginSelect[]
    setValue: (value: string) => void
}) => {
    return (
        <>
            <Select.Root defaultValue={data[0].value} onValueChange={setValue}>
                <Select.Trigger className='box-border flex w-full items-center justify-between rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'>
                    <Select.Value />
                    <Select.Icon asChild>
                        <IconChevronDown />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content className='w-[--radix-select-trigger-width] rounded-md border bg-white p-2 shadow-md'>
                        <Select.ScrollUpButton className='flex items-center justify-center'>
                            <IconChevronUp />
                        </Select.ScrollUpButton>
                        <Select.Viewport>
                            {data.map((item) => (
                                <Select.Item
                                    key={item.value}
                                    value={item.value}
                                    className='cursor-pointer rounded-md p-1 outline-none hover:bg-gray-200'
                                >
                                    <Select.ItemText>{item.name}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className='flex items-center justify-center'>
                            <IconChevronDown />
                        </Select.ScrollDownButton>
                        <Select.Arrow />
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </>
    )
}

export default LoginSelect
