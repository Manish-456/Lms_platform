import { IconBadge } from '@/components/icon-badge'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface IInfoCardProps {
    icon : LucideIcon ,
    variant? : "default" | "success",
    numberOfItems : number,
    label : string
}
export default function InfoCard({icon : Icon, variant, numberOfItems, label} : IInfoCardProps) {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className='font-medium'>{label}</p>
        <p>
            {numberOfItems} {numberOfItems === 1? "Course" : "Courses"}
        </p>
      </div>
    </div>
  )
}
