import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req : Request, {params} : {params :{
    chapterId: string;
    courseId : string;
}}){
try {
    const {courseId, chapterId} = params;
    const {userId} = auth();

    if(!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {
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

    const chapter = await db.chapter.findUnique({
        where: {
            id : chapterId,
            courseId
        }
    });

    
    const muxData = await db.muxData.findUnique({
        where : {
            chapterId
        }
    })

    if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) return new NextResponse("Missing required fields", {
        status : 400
    });

    const publishedChapter = await db.chapter.update({
        where :{
            id : chapterId,
            courseId
        },
        data : {
            isPublished : true
        }
    });

    return NextResponse.json(publishedChapter)
} catch (error) {
    console.error(`[CHAPTERID_PUBLISH]`);
    return new NextResponse("Internal Error", {
        status: 500
    })
}
}