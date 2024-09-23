"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Lightbulb, Loader, Pencil } from "lucide-react";
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
import Editor from "@/components/editor";
import Preview from "@/components/preview";

import { getGenerativeAiResponse } from "@/scripts/ai-studio";
import { cn } from "@/lib/utils";

interface JobDescriptionFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const JobDescriptionForm = ({
  initialData,
  jobId,
}: JobDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollName, setRollName] = useState("");
  const [skills, setSkills] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
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
      const customPrompt = `Could you please draft a job requirements document for the position of ${rollName}? The job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to the job. Thanks!`;
      await getGenerativeAiResponse(customPrompt).then((data) => {
        data = data.replace(/^'|'$/g, "");
        let cleanText = data.replace(/[\\\*#\[\]]/g, "");
        setAiValue(cleanText);
        setIsPrompting(false);
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const oncopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copy Description To Clipboard");
  };

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Job Description
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
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.description && "italic text-neutral-500",
          )}
        >
          {!initialData.description && "No Description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}

      {isEditing && (
        <>
          <div className="my-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Job Roll Name'"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              className="w-full rounded-md p-2 "
            />
            <input
              type="text"
              placeholder="Required Fields"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
            Note: Profession name and fields determine by comma
          </p>

          {aiValue && (
            <div className="text-muted-foreground relative mt-4 h-96 max-h-96 w-full overflow-y-scroll rounded-md bg-white p-3">
              {aiValue}

              <Button
                className="absolute right-3 top-3 z-10"
                size="icon"
                onClick={oncopy}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor onchange={field.onChange} {...field} />
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
