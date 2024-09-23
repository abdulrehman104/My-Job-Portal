"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, MapPin, Pencil } from "lucide-react";
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
import { Company } from "@prisma/client";
import Link from "next/link";

interface CompanyDetailsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  email: z.string().min(1, { message: "email must be at least 1 characters." }),
  website: z
    .string()
    .min(1, { message: "website must be at least 1 characters." }),
  linkedIn: z
    .string()
    .min(1, { message: "linkedIn must be at least 1 characters." }),
  adress_line1: z
    .string()
    .min(1, { message: "adress_line1 must be at least 1 characters." }),
  adress_line2: z
    .string()
    .min(1, { message: "adress_line2 must be at least 1 characters." }),
  city: z.string().min(1, { message: "city must be at least 1 characters." }),
  state: z.string().min(1, { message: "state must be at least 1 characters." }),
  zipcode: z
    .string()
    .min(1, { message: "zipcode must be at least 1 characters." }),
});

export const CompanyDetailsForm = ({
  initialData,
  companyId,
}: CompanyDetailsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toogledEditing = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData.email || "",
      website: initialData.website || "",
      linkedIn: initialData.linkedIn || "",
      adress_line1: initialData.adress_line1 || "",
      adress_line2: initialData.adress_line2 || "",
      city: initialData.city || "",
      state: initialData.state || "",
      zipcode: initialData.zipcode || "",
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
        Company Details
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
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 space-y-1">
              {initialData.email && (
                <div className="text-muted-foreground flex w-full items-center truncate text-sm">
                  <Mail className="mr-2 size-3" />
                  {initialData.email}
                </div>
              )}

              {initialData.linkedIn && (
                <Link
                  href={initialData.linkedIn}
                  className="text-muted-foreground flex w-full items-center truncate text-sm"
                >
                  <Mail className="mr-2 size-3" />
                  {initialData.linkedIn}
                </Link>
              )}

              {initialData.website && (
                <Link
                  href={initialData.website}
                  className="text-muted-foreground flex w-full items-center truncate text-sm"
                >
                  <Mail className="mr-2 size-3" />
                  {initialData.website}
                </Link>
              )}
            </div>
            <div className="col-span-3">
              {initialData.adress_line1 && (
                <div className="flex items-start justify-start gap-2">
                  <MapPin className="size-3" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {initialData.adress_line1},{initialData.adress_line2},
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {initialData.city},{initialData.state}-{""}
                      {initialData.zipcode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email:'sample@gmail.com'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Website:'Company.live.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Linkedin:'www.linkedIn.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adress_line1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Adress_line1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adress_line2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Adress_line2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-x-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Zipcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={!isValid || isSubmitted} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
