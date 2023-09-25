"use client";

import React, { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { Attachment, Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";

interface IAttachmentFormProps {
  courseId: string;
  initialData: Course & { attachments: Attachment[] };
}

const formSchema = z.object({
  url: z.string().min(1),
});

export default function AttachmentForm({
  courseId,
  initialData,
}: IAttachmentFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((prevState) => !prevState);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async(id : string) => {
    try {
      setDeletingId(id);
       await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
       toast.success("Attachment deleted");
       router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }finally {
      setDeletingId(null);
    }

  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {
                initialData.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-xs line-clamp-1">{attachment.name}</p>
                    {deletingId === attachment.id ? (
                      <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                    ) : (
                      <button onClick={() => onDelete(attachment.id)}  className="ml-auto hover:opacity-75 transition">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </>
      )}


      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
}
