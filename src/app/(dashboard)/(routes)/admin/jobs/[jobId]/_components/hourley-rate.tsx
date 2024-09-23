"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Job } from "@prisma/client";
import { Combobox } from "@/components/ComboBox";
import { cn } from "@/lib/utils";

interface HourleyRateFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  hourlyRate: z.string().min(1),
});

export const HourleyRateForm = ({
  initialData,
  jobId,
}: HourleyRateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: initialData?.hourlyRate || "",
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

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Job Hourley Rate
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
        <p className={cn("mt-2 text-sm ")}>
          {initialData.hourlyRate
            ? `$ ${initialData.hourlyRate}/hrs`
            : "$ 0/hrs"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Type the hourley rate" {...field} />
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
