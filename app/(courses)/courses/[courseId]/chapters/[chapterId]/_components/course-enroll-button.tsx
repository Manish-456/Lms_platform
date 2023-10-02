"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ICourseEnrollButtonProps {
    courseId : string;
    price : number
}
export default function CourseEnrollButton({courseId, price} : ICourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async() => {
    try {
      setIsLoading(true)
     const response = await axios.post(`/api/courses/${courseId}/checkout`);
     window.location.assign(response.data.url)
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={onClick} disabled={isLoading} className='w-full md:w-auto' size={"sm"}>
      Enroll for {formatPrice(price)}
    </Button>
  )
}
