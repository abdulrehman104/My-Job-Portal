"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lightbulb, Loader, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Job } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getGenerativeAiResponse } from "@/scripts/ai-studio";

interface ShortDescriptionFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1),
});

export const ShortDescriptionForm = ({
  initialData,
  jobId,
}: ShortDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData.short_description || "",
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated");
      toogledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const handlePromptGenerator = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Could you craft a concise job description for a ${prompt} proition in fewer then 400 character?`;
      await getGenerativeAiResponse(customPrompt).then((data) => {
        form.setValue("short_description", data);
        setIsPrompting(false);
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Short Description
        <Button variant="ghost" onClick={toogledEditing}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="mt-2 text-sm">{initialData.short_description}</p>
      )}

      {isEditing && (
        <>
          <div className="my-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g 'Full-Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-md p-2 "
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader className="h-4 w-6 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGenerator}>
                  <Lightbulb className="h-4 w-6 " />
                </Button>
              </>
            )}
          </div>

          <p className="my-2 text-right text-xs text-neutral-500">
            Note: Profession name alone enough to genereate the tags
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitted}
                        placeholder="Short Discription for your job"
                        {...field}
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
        </>
      )}
    </div>
  );
};
