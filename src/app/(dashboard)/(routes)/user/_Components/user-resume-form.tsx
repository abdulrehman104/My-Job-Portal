"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  File,
  Loader2,
  PlusCircle,
  ShieldCheck,
  ShieldX,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Resumes, UserProfile } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AttachmentUploder } from "@/components/attachment-uploader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserResumeFormProps {
  initialData: (UserProfile & { resumes: Resumes[] }) | null;
  userId: string;
}

const formSchema = z.object({
  resumes: z.object({ url: z.string(), name: z.string() }).array(),
});

export const UserResumeForm = ({
  initialData,
  userId,
}: UserResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isActiveResumeId, setIsActiveResumeId] = useState<string | null>(null);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData?.resumes.map((resume) => {
        if (
          typeof resume === "object" &&
          resume !== null &&
          "url" in resume &&
          "name" in resume
        ) {
          return { url: resume.url, name: resume.name };
        }
        return { url: "", name: "" };
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes,
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/user/${userId}/resumes`, values);
      toast.success("Resumes Uploded");
      toogledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (resume: Resumes) => {
    try {
      setDeletingId(resume.id);
      await axios.delete(`/api/user/${userId}/resumes/${resume.id}`, resume);
      toast.success("Resume removed deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const setActiveResumeId = async (resumeId: string) => {
    try {
      setIsActiveResumeId(resumeId);
      const response = await axios.patch(`/api/user/${userId}`, {
        ActiveResumeById: resumeId,
      });

      toast.success("Resume Activated ");
      router.refresh();
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setIsActiveResumeId(null);
    }
  };

  return (
    <div className="w-full flex-1 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Your Resumes
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
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div key={item.id} className="grid grid-cols-12">
              <div className="col-span-10 flex w-full items-center rounded-md border border-purple-200 bg-purple-100 p-3 text-purple-700">
                <File className="mr-3 size-6" />
                <p className="w-full truncate text-sm">{item.name}</p>

                {deletingId === item.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    type="button"
                  >
                    <Loader2 className="size-4 animate-spin" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1"
                    type="button"
                    onClick={() => onDelete(item)}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>

              <div className="col-span-2 flex items-center justify-start">
                {isActiveResumeId === item.id ? (
                  <div className="flex w-full items-center justify-center">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex size-full items-center justify-center text-lg ",
                      initialData.ActiveResumeById === item.id
                        ? "text-emerald-500"
                        : "text-red-500",
                    )}
                    onClick={() => setActiveResumeId(item.id)}
                  >
                    <p>
                      {initialData.ActiveResumeById === item.id
                        ? "Live"
                        : "Activate"}
                    </p>
                    {initialData.ActiveResumeById === item.id ? (
                      <ShieldCheck className="ml-2 size-4" />
                    ) : (
                      <ShieldX className="ml-2 size-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentUploder
                      value={field.value}
                      onChange={(resumes) => {
                        if (resumes) {
                          onSubmit({ resumes });
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
