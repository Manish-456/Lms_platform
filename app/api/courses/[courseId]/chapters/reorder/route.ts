import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(req : Request, {
    params
} : {
    params : {
        courseId : string
    }
}){
    try {
      const {courseId} = params;        
      const {userId} = auth()
      const {list} = await req.json();

      if(!userId) return new NextResponse("Unauthorized", {status : 401});
      if(!courseId) return new NextResponse("Course ID missing", {status : 400});
      
      const ownCourse = await db.course.findUnique({
        where : {
            id : courseId,
            userId
        }
      });

      if(!ownCourse) return new NextResponse("Unauthorized", {status : 401});

      
     for(let item of list){
           await db.chapter.update({
            where : {
               id : item.id,
            },
             data : {
                position : item.position
             }
           })

     }

     return new NextResponse("Success");
    } catch (error) {
       console.error(`[REORDER]`, error);  
       return new NextResponse("Internal Error", {status : 500});
    }
}