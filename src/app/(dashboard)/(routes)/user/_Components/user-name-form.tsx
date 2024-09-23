"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { UserProfile } from "@prisma/client";

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
import { Box } from "@/components/box";

interface UserNameFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
});

export const UserNameForm = ({ initialData, userId }: UserNameFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggledEditing = () => setIsEditing((prev) => !prev);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
    },
  });

  const { isValid, isSubmitted } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.patch(`/api/user/${userId}`, values);
      toast.success("Profile Updated");
      toggledEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Box>
      {/* Display name when not editing */}
      {!isEditing && (
        <p
          className={cn(
            "mt-2 flex items-center gap-2 text-lg",
            !initialData?.fullName && "italic text-neutral-500",
          )}
        >
          <UserCircle className="mr-2 size-6" />
          {initialData?.fullName ? initialData.fullName : "No Name Added"}
        </p>
      )}

      {/* Form for editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center gap-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitted}
                      placeholder="e.g 'Abdul Rehman'"
                      {...field}
                      className="w-full" // Force Input to take full width
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitted}
              type="submit"
              className="ml-2"
            >
              Submit
            </Button>
          </form>
        </Form>
      )}

      {/* Button to toggle between editing and viewing */}
      <div className="mt-2 flex items-center gap-x-2">
        <Button variant="ghost" onClick={toggledEditing}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="mr-2 size-4" /> Edit
            </>
          )}
        </Button>
      </div>
    </Box>
  );
};
