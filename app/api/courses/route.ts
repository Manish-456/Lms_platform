import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    try {
        const {userId} = auth();
        const {title} = await req.json();

        const isAuthorized = isTeacher(userId)

        if(!userId || !isAuthorized) return new NextResponse("Unauthorized", {status : 401});
        if(!title) return new NextResponse("Title is required", {status : 400});

        const course = await db.course.create({
            data : {
                title,
                userId
            }
        });

        return NextResponse.json(course);


    } catch (error : any) {
        console.error(`[COURSES.POST]`, error.message);
        return new NextResponse("Internal Error", {
            status : 500
        })
    }
}