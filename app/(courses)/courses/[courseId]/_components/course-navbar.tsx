import NavbarRoutes from '@/components/navbar-routes';
import { Chapter, Course, UserProgress } from '@prisma/client'
import React from 'react'
import CourseMobileSidebar from './course-mobile-sidebar';

interface ICourseNavbarProps {
    course : Course & {
        chapters : (Chapter & {
            userProgress : UserProgress[] | null
        })[]
    };
    progressCount : number | undefined
}
export default function CourseNavbar({
    course,
    progressCount} : ICourseNavbarProps) {

  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <CourseMobileSidebar
       course={course}
       progressCount={progressCount}
      />
      <NavbarRoutes />
    </div>
  )
}
