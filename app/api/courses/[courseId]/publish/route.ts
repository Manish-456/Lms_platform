import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req : Request, {
    params
} : {
    params : {
        courseId : string
    }
}){
    try{
        const {userId} = auth();
        const {courseId} = params;

        if(!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status : 401})

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

        if(!course) return new NextResponse("Not found", {
            status : 404
        });

        const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished);

        if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter){
            return new NextResponse("Missing required field", {status : 400})
        }

        const publishedCourse = await db.course.update({
            where : {
                id : courseId,
                userId
            }, 
            data : {
                isPublished : true
            }
        });

        return NextResponse.json(publishedCourse);

    }catch(err){
   console.error(`COURSE_COURSEID_PUBLISH`, err);
   return new NextResponse("Internal Error", {
    status : 500
   })
    }
}