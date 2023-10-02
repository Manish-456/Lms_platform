"use client";

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import React from 'react'

interface ICourseEnrollButtonProps {
    courseId : string;
    price : number
}
export default function CourseEnrollButton({courseId, price} : ICourseEnrollButtonProps) {
  return (
    <Button className='w-full md:w-auto' size={"sm"}>
      Enroll for {formatPrice(price)}
    </Button>
  )
}
