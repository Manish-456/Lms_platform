import { db } from '@/lib/db'
import React from 'react'
import { Categories } from './_components/categories';
import SearchInput from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CoursesList from './_components/courses-list';

export default async function SearchPage(
  {
    searchParams
  } : {
    searchParams : {
      categoryId : string;
      title : string;
    }
  }
) {
  const {userId}= auth();
  const categories = await db.category.findMany({
    orderBy : {
      name : "asc"
    }
  });
  
  if(!userId) return redirect('/')
  const courses = await getCourses({userId, ...searchParams})

  return (
    <>
    <div className="px-6 pt-6 md:hidden md:mb-0 block">
      <SearchInput />
    </div>
    <div className='p-6 space-y-4'>
      <Categories items={categories} />
      <CoursesList items={courses} />
    </div>
    </>
  )
}
