"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Attachments, Job } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AttachmentUploder } from "@/components/attachment-uploader";
import { Button } from "@/components/ui/button";

interface JobAttachmentsFormProps {
  initialData: Job & { attachments: Attachments[] };
  jobId: string;
}

const formSchema = z.object({
  attachments: z.object({ url: z.string(), name: z.string() }).array(),
});

export const JobAttachmentsForm = ({
  initialData,
  jobId,
}: JobAttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const initialAttachments = Array.isArray(initialData.attachments)
    ? initialData.attachments.map((attachment) => {
        if (
          typeof attachment === "object" &&
          attachment !== null &&
          "url" in attachment &&
          "name" in attachment
        ) {
          return { url: attachment.url, name: attachment.name };
        }
        return { url: "", name: "" };
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialAttachments,
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/jobs/${jobId}/attachments`, values);
      toast.success("Job Updated");
      toogledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (attachment: Attachments) => {
    try {
      setDeletingId(attachment.id);
      await axios.delete(
        `/api/jobs/${jobId}/attachments/${attachment.id}`,
        attachment,
      );
      toast.success("Job attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Job Attachments
        <Button variant="ghost" onClick={toogledEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-6 space-y-3">
          {initialData.attachments.map((item) => (
            <div
              key={item.url}
              className="flex w-full items-center rounded-md border border-purple-200 bg-purple-100 p-3 text-purple-700"
            >
              <File className="mr-3 size-6" />
              <p className="w-full truncate text-sm">{item.name}</p>
              {deletingId === item.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  type="button"
                >
                  <Loader2 className="size-4 animate-spin" />
                </Button>
              )}

              {deletingId !== item.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  type="button"
                  onClick={() => onDelete(item)}
                >
                  <X className="size-4 " />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentUploder
                      value={field.value}
                      onChange={(attachments) => {
                        if (attachments) {
                          onSubmit({ attachments });
                        }
                      }}
                      disable={isSubmitted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitted} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
