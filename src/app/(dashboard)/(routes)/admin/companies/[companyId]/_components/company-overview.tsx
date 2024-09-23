"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Lightbulb, Loader, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Company, Job } from "@prisma/client";

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

interface CompanyOverviewFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  overview: z.string().min(1),
});

export const CompanyOverviewForm = ({
  initialData,
  companyId,
}: CompanyOverviewFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overview: initialData.overview || "",
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Updated");
      toogledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const handlePromptGenerator = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an overview content about ${companyName}, Including information about its history, purpose, features, user base and impact on industry.`;
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
    toast.success("Copy overview To Clipboard");
  };

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Company overview
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
            !initialData.overview && "italic text-neutral-500",
          )}
        >
          {!initialData.overview && "No overview"}
          {initialData.overview && <Preview value={initialData.overview} />}
        </div>
      )}

      {isEditing && (
        <>
          <div className="my-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Company Name'"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
            Note: Type the Company name here to genereate the overview content.
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
                name="overview"
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
