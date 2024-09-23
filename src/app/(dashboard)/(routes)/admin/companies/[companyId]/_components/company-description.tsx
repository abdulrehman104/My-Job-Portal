"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Company } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompanyDescriptionFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description must be at least 1 characters.",
  }),
});

export const CompanyDescriptionForm = ({
  initialData,
  companyId,
}: CompanyDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Companies Updated");
      toogledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="rounded-md border bg-neutral-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Company Description
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
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.description && "italic text-neutral-500",
          )}
        >
          {initialData.description
            ? initialData.description
            : "No Description added"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g 'Short Description related to your company'"
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
      )}
    </div>
  );
};
