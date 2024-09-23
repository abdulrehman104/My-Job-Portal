"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lightbulb, Loader, Pencil, X } from "lucide-react";
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

interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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
      const customPrompt = `Generate an array of top 10 keywords related to the job profession ${prompt}. These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the profession. Return the array only.`;

      await getGenerativeAiResponse(customPrompt).then((data) => {
        console.log(JSON.parse(data));
        // Check the data responce in an Array or not
        if (Array.isArray(JSON.parse(data))) {
          setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
        }
        setIsPrompting(false);
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleTagRemove = (index: number) => {
    const udateTags = [...jobTags];
    udateTags.splice(index, 1);
    setJobTags(udateTags);
  };

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Job Tags
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

      {/* {!isEditing && <p className="text-sm mt-2">{initialData.tags}</p>} */}

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
          <p className="my-3 text-right text-xs text-neutral-500">
            Note: Profession name alone enough to genereate the tags
          </p>
        </>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {jobTags.length > 0 ? (
          jobTags.map((tags, index) => (
            <div
              key={index}
              className="flex items-center gap-2 whitespace-nowrap rounded-md bg-purple-100 px-2 py-1 text-sm  "
            >
              {tags}{" "}
              {isEditing && (
                <Button
                  variant="ghost"
                  className="h-auto p-0"
                  onClick={() => handleTagRemove(index)}
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          ))
        ) : (
          <p>No Tags Added</p>
        )}
      </div>

      {isEditing && (
        <div className="my-3 flex items-center justify-end gap-x-2 ">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setJobTags([]);
              onSubmit({ tags: [] });
            }}
            disabled={isSubmitted}
          >
            Clear All
          </Button>
          <Button type="submit" onClick={() => onSubmit({ tags: jobTags })}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
