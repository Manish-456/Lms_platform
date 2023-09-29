import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req : Request, {params} : {params :{
    chapterId: string;
    courseId : string;
}}){
try {
    const {courseId, chapterId} = params;
    const {userId} = auth();

    if(!userId) return new NextResponse("Unauthorized", {
        status : 401
    });

    const ownCourse = await db.course.findUnique({
        where : {
            id : courseId,
            userId
        }
    });

    if(!ownCourse) return new NextResponse("Unauthorized", {
        status : 401
    });

    const unPublishedChapter = await db.chapter.update({
        where :{
            id : chapterId,
            courseId
        },
        data : {
            isPublished : false
        }
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
        where : {
            courseId,
            isPublished : true
        }
    });

    if(!publishedChaptersInCourse.length){
     await db.course.update({
        where : {
            id : courseId
        },
        data : {
            isPublished : false
        }
     })
    }


    return NextResponse.json(unPublishedChapter)
} catch (error) {
    console.error(`[CHAPTERID_PUBLISH]`);
    return new NextResponse("Internal Error", {
        status: 500
    })
}
}