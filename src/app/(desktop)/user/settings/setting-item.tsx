import React from 'react'

import { Icon } from '@tabler/icons-react'

interface SettingItemProps {
  icon: Icon
  iconColor: string
  label: string
  children: React.ReactNode
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon: IconComponent,
  iconColor,
  label,
  children
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <IconComponent className={iconColor} />
        {label}
      </div>
      {children}
    </div>
  )
}
