import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isTeacher } from '../../../../lib/teacher';

const {Video} = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(req : Request, {
  params
} : {
  params : {
    courseId : string
  }
}){
 try {
   const {userId} = auth();
   const {courseId} = params;

   if(!userId) return new NextResponse("Unauthorized", {status : 401});
   if(!courseId) return new NextResponse("Course ID required", {status : 400});

   const course = await db.course.findUnique({
    where : {
      id : courseId,
      userId
    },
    include : {
      chapters : {
        include : {
          muxData : true
        }
      }
    }
   });

   if(!course) return new NextResponse("Not found", {status : 404});

   for(const chapter of course.chapters){
    if(chapter.muxData?.assetsId){
      await Video.Assets.del(chapter.muxData.assetsId);
    }
   };

   const deletedCourse = await db.course.delete({
    where : {
      id : courseId
    }
   });

   return NextResponse.json(deletedCourse);
   
 } catch (error) {
  console.error(`[COURSE[COURSEID]-DELETE]`, error);
  return new NextResponse("Internal Error", {
   status : 500
  })   
 }
}

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

  if(!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status : 401});
  if(!courseId) return new NextResponse("Course ID required", {status : 400});

  const course = await db.course.update({
    where : {
       id : courseId,
       userId 
    },
    data : {
        ...values
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