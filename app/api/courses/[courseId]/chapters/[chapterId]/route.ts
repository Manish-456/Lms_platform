import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';
import { isTeacher } from "@/lib/teacher";

const {Video} = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(req : Request,  {
    params
} : {
    params : {
        courseId : string;
        chapterId : string;
    }
}){
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;
        if(!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status : 401});

        const ownCourse = await db.course.findUnique({
            where : {
                id : courseId,
                userId
            }
        });

        if(!ownCourse) return new NextResponse("Unauthorized", {status : 401})

        const chapter = await db.chapter.findUnique({
            where : {
                id : chapterId,
                courseId
            }
        });

        if(!chapter) return new NextResponse("Chapter not found", {status : 404})

        if(chapter.videoUrl){
            const existingMuskdata = await db.muxData.findFirst({
                where : {
                chapterId                     
                }
            })
            if(existingMuskdata){

                await Video.Assets.del(existingMuskdata.assetsId as string);
                await db.muxData.delete({
                    where : {
                        id : existingMuskdata.id
                    }
                })
            }
        };

        const deletedChapter = await db.chapter.delete({
            where : {
                id : chapterId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where : {
                courseId,
                isPublished : true
            }
        })

        if(!publishedChaptersInCourse){
            await db.course.update({
                where : {
                    id : courseId
                },
                data : {
                    isPublished : false
                }
            })
        }

        return NextResponse.json(deletedChapter);
        
    } catch (error) {
        console.error(`[COURSE[COURSEID]]_DELETE`, error);    }
        return new NextResponse("Internal Error", {status : 500})
}

export async function PATCH(req : Request, {
    params
} : {
    params : {
        courseId : string;
        chapterId : string;
    }
}){
    try {
        const {userId} = auth();
        const {courseId, chapterId} = params;
        const {isPublished, ...values} = await req.json()

        if(!userId) return new NextResponse("Unauthorized", {status : 401});
        const ownCourse = await db.course.findUnique({
            where : {
                id : courseId,
                userId
            }
        });

        if(!ownCourse) return new NextResponse("Unauthorized", {status : 401});

        const chapter = await db.chapter.update({
            where : {
                id : chapterId,
                courseId
            }, 

            data : {
            ...values
            }
        });
        
        if(values.videoUrl){
          const existingMuxData = await db.muxData.findFirst({
            where : {
                chapterId : chapterId
            }
          });

          if(existingMuxData){
            await Video.Assets.del(existingMuxData.assetsId);
            await db.muxData.delete({
                where : {
                    id : existingMuxData.id
                }
            });

        }
       const asset = await Video.Assets.create({
        input : values.videoUrl,
        playback_policy : "public",
        test : false
       });

       await db.muxData.create({
        data : {
            chapterId,
            assetsId : asset.id,
            playbackId : asset.playback_ids?.[0]?.id as string
        }
       })
    }

        return NextResponse.json(chapter);

    } catch (error) {
        console.error(`[COURSE[COURSEID]]`, error);
        return new NextResponse("Internal Error", {status : 500})
    }
}