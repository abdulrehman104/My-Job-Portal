import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prismadb";
import { JobPublishAction } from "./_components/JobPublishAction";
import { Banner } from "@/components/banner";
import { IconBadge } from "./_components/icon-badge";
import { TitleForm } from "./_components/job-title";
import { CategoryForm } from "./_components/job-category ";
import { ImageForm } from "./_components/image-form";
import { ShortDescriptionForm } from "./_components/short-description";
import { JobModeForm } from "./_components/job-mode";
import { JobShiftTimeForm } from "./_components/job-shift-time";
import { HourleyRateForm } from "./_components/hourley-rate";
import { ExperienceForm } from "./_components/work-experience";
import { JobDescriptionForm } from "./_components/job-description";
import { TagsForm } from "./_components/job-tags";
import { categoriesSeeds } from "@/scripts/seeds";
import { CompanyDetailsForm } from "./_components/company-details";
import { JobAttachmentsForm } from "./_components/job-attachments";

interface JProps {
  params: { jobId: string };
}

export default async function EditJob({ params }: JProps) {
  const validUuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!validUuidRegex.test(params.jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!job) {
    return redirect("/admin/create");
  }

  const companies = await prisma.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!companies) {
    return redirect("/admin/companies/create");
  }

  const requiredField = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalField = requiredField.length;
  const isComplectedField = requiredField.filter(Boolean).length;
  const completionText = `${isComplectedField}/${totalField}`;

  const isCompleted = requiredField.every(Boolean);

  await categoriesSeeds();

  return (
    <div className="p-6">
      {/* Go Back Button */}
      <Link href="/admin/jobs">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" />
          Back
        </div>
      </Link>

      {/* Title Button */}
      <div className="flex items-center justify-between pt-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Job setup</h1>
          <p className="text-sm text-neutral-700">
            Complete all fields {completionText}
          </p>
        </div>

        {/* Action Buton */}
        <JobPublishAction
          isPublished={job.isPublished}
          disabled={!isCompleted}
          jobId={params.jobId}
        />
      </div>

      {/* Warning before unpublish the post */}
      {!job.isPublished && (
        <Banner
          label="This job is unpublished, It will not be visible in the jobs lists."
          variant="warning"
        />
      )}

      {/* Container Layout */}
      <div className="mt-10 md:grid md:grid-cols-2 md:gap-5 ">
        {/* Left Container */}
        <div className="space-y-8">
          {/* Customize Job title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-semibold text-neutral-700  ">
              Custom Your Job
            </h2>
          </div>

          {/* Job title */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* Job category */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((option) => ({
              label: option.name,
              value: option.id,
            }))}
          />

          {/* Job Cover Image */}
          <ImageForm initialData={job} jobId={job.id} />

          {/* Job Short Description */}
          <ShortDescriptionForm initialData={job} jobId={job.id} />

          {/* Job Shift Time Form */}
          <JobShiftTimeForm initialData={job} jobId={job.id} />

          {/* Job Hourley Rate */}
          <HourleyRateForm initialData={job} jobId={job.id} />

          {/* Job Mode */}
          <JobModeForm initialData={job} jobId={job.id} />

          {/* Job Experience */}
          <ExperienceForm initialData={job} jobId={job.id} />
        </div>

        {/* Right Container */}
        <div className="mt-8 space-y-8 md:mt-0">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListCheck} />
            <h2 className="text-xl font-semibold text-neutral-700">
              Job Requirments
            </h2>
          </div>

          {/* Tags Form */}
          <TagsForm initialData={job} jobId={job.id} />

          {/* Company Details */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Building2} />
            <h2 className="text-xl font-semibold text-neutral-700">
              Company Details
            </h2>
          </div>

          {/* Company Details Form */}
          <CompanyDetailsForm
            initialData={job}
            jobId={job.id}
            options={companies.map((company) => ({
              label: company.name,
              value: company.id,
            }))}
          />

          {/*   Resource & Attachments */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={File} />
            <h2 className="text-xl font-semibold text-neutral-700">
              Resource & Attachments
            </h2>
          </div>

          {/* Resources Form */}
          <JobAttachmentsForm initialData={job} jobId={job.id} />
        </div>

        {/* Job Description */}
        <div className="col-span-2 my-8">
          <JobDescriptionForm initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
}
