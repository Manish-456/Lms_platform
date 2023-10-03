import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req : Request, {params} : {params : {
    attachmentId : string,
    courseId : string
}}){
    try {
        const {attachmentId, courseId} = params;
        const {userId} = auth();

        if(!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status : 401});
        
        const courseOwner = await db.course.findUnique({
            where : {
                id : courseId,
                userId
            }
        });

        if(!courseOwner) return new NextResponse("Unauthorized", {status : 401});

        const attachment = await db.attachment.delete({
            where : {
                id : attachmentId,
                courseId
            }
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.error(`[COURSE_ATTACHMENT_[ATTACHMENTID]_DELETE]`, error);
        return new NextResponse("Internal Error", {
            status: 400
        })
    }
}