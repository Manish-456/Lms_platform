import React from "react";
import { getChapter } from "@/actions/get-chapter";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/course-progress-button";

export default async function ChapterIdPage({
  params,
}: {
  params: {
    chapterId: string;
    courseId: string;
  };
}) {
  const { userId } = auth();
  const { chapterId, courseId } = params;
  if (!userId) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase
  } = await getChapter({ chapterId, courseId, userId });

  if(!chapter || !course){
    return redirect('/');
  }


  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return <div>
    {
        userProgress?.isCompleted && (
            <Banner variant={"success"} label="You already completed this course" />
        )
    }
    {
        isLocked && (
            <Banner variant={"warning"} label="You need to purchase this course to watch this chapter." />
        )
    }

    <div className="flex flex-col max-w-4xl mx-auto pb-20">
      <div className="p-4">
        <VideoPlayer
        chapterId={chapterId}
        title={chapter.title}
         courseId={courseId}
          nextChapterId={nextChapter?.id}
           playbackId={muxData?.playbackId}
            isLocked={isLocked}
             completeOnEnd={completeOnEnd} />
      </div>
      <div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">
            {chapter.title}
          </h2>
         {
          purchase ? (
              <CourseProgressButton
              chapterId={chapterId}
              nextChapterId={nextChapter?.id!}
              courseId={courseId}
              isCompleted={!!userProgress?.isCompleted}
              />
               
          ) : (
            <CourseEnrollButton courseId={courseId} price={course.price!} />
          )
         }
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description as string} />
        </div>
        {!!attachments.length && (
         <>
         <Separator />
         <div className="p-4">
          {
            attachments.map(attachment => (
              <a href={attachment.url}
              className="flex items-center w-full p-3 bg-sky-200 border text-sky-700 rounded-md hover:underline"
              target="_blank"
              key={attachment.id}>
                <File />
                <p className="line-clamp-1">
              {attachment.name}

                </p>
              </a>
            ))
          }
         </div>
         </>
)}
      </div>
    </div>
  </div>
}
