import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req : Request, {
    params
} : {
    params : {
        courseId : string
    }
}){
try {
  const {userId} = auth();
  const {courseId} = params;
  const values = await req.json();

  if(!userId) return new NextResponse("Unauthorized", {status : 401});
  if(!courseId) return new NextResponse("Course ID required", {status : 400});

  const course = await db.course.update({
    where : {
       id : courseId,
       userId 
    },
    data : {
        title : values.title
    }
  });

  return NextResponse.json(course);

} catch (error) {
   console.error(`[COURSE[COURSEID]-PATCH]`, error);
   return new NextResponse("Internal Error", {
    status : 500
   })   
}
}