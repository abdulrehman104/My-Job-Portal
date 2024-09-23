"use client";

import Image from "next/image";
import Link from "next/link";
import { File } from "lucide-react";
import { useState } from "react";

import {
  AppliedJob,
  Attachments,
  Company,
  Job,
  Resumes,
  UserProfile,
} from "@prisma/client";
import { Box } from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { Button } from "@/components/ui/button";
import Preview from "@/components/preview";
import AppliedModel from "@/components/applied-model";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Banner } from "@/components/banner";

interface JobDetailPageProps {
  job: Job & { company: Company | null; attachments: Attachments[] };
  jobId: string;
  userProfile:
    | (UserProfile & { resumes: Resumes[]; appliedJobs: AppliedJob[] })
    | null;
}

export const JobDetailPage = ({
  job,
  jobId,
  userProfile,
}: JobDetailPageProps) => {
  const [open, setopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onApplied = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/user/${userProfile?.userId}/appliedJob`, jobId);

      // Send mail the user
      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: userProfile?.email,
      });

      toast.success("Job Applied");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    } finally {
      setopen(false);
      setLoading(false);
      router.refresh();
    }
  };
  return (
    <>
      <AppliedModel
        isOpen={open}
        loading={loading}
        onClose={() => setopen(false)}
        onConform={onApplied}
        userProfile={userProfile}
      />

      {userProfile &&
        userProfile.appliedJobs.some(
          (appliedJob) => appliedJob.jobId === jobId,
        ) && (
          <Banner
            variant="success"
            label="Thank you for applying! Your application has been recieved, and we're reviewing it carefully. we'll ne in touch soon with an update"
          />
        )}

      {/* Bread Crumbss */}
      <Box className="mt-4">
        <CustomBreadCrumb
          BreadCrumbItems={[{ href: "/search", label: "Search" }]}
          BreadCrumbPage={job.title ? job.title : ""}
        />
      </Box>

      {/* Job Cover Image  */}
      <Box className="mt-4">
        <div className="relative flex h-72 w-full items-center overflow-hidden rounded-md">
          {job.imageUrl ? (
            <Image
              src={job.imageUrl}
              alt={job.title}
              fill
              className="size-full object-cover"
            />
          ) : (
            <div className="flex h-72 w-full items-center justify-center bg-purple-200 text-7xl font-semibold text-purple-700 ">
              {job.title}
            </div>
          )}
        </div>
      </Box>

      {/* CompanyDetail and Action Button*/}
      <Box className="mt-4">
        {/* Job title and company detail */}
        <div className="flex-col space-y-2 ">
          <h2 className="text-muted-foreground text-2xl font-semibold">
            {job.title}
          </h2>
          <Link href={`/company/${job.categoryId}`}>
            <div className="mt-1 flex items-center gap-x-2">
              {job.company?.logo && (
                <Image
                  src={job.company?.logo}
                  alt={job.company.logo}
                  width={34}
                  height={34}
                />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job.company?.name}
              </p>
            </div>
          </Link>
        </div>

        {/* Action Button  */}
        {userProfile ? (
          <>
            {!userProfile.appliedJobs.some(
              (appliedjob) => appliedjob.jobId === jobId,
            ) ? (
              <Button
                variant="ghost"
                onClick={() => setopen(true)}
                className="bg-purple-700 text-sm text-white shadow-md hover:bg-purple-900 hover:text-white"
              >
                Apply
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-purple-700 text-sm text-purple-700 shadow-md hover:bg-purple-900 hover:text-white"
              >
                Already Applied
              </Button>
            )}
          </>
        ) : (
          <Link href={"/user"}>
            <Button
              variant="outline"
              className="bg-purple-700 px-8 text-sm text-white"
            >
              Update Profile
            </Button>
          </Link>
        )}
      </Box>

      {/* Job Description */}
      <Box className="my-4 flex-col items-start justify-start gap-2 px-4">
        <h2 className="text-lg font-semibold">Description :</h2>
        {job.short_description && (
          <p className="font-sans">{job.short_description}</p>
        )}
      </Box>

      {job.description && (
        <Box>
          <Preview value={job.description} />
        </Box>
      )}

      {/* Job Attachments */}
      {job.attachments && job.attachments.length > 0 && (
        <Box className="my-4 flex-col items-start justify-start px-4">
          <h2 className="text-lg font-semibold">Attachments :</h2>
          <p className="font-sans text-sm">
            Download the attachments to know more about the job
          </p>
          {job.attachments.map((attachment) => (
            <div key={attachment.id} className="my-1 space-y-3">
              <Link
                href={attachment.url}
                target="_blank"
                download
                className="flex items-center gap-2 text-sm text-purple-700"
              >
                <File className="size-3" />
                <p>{attachment.name}</p>
              </Link>
            </div>
          ))}
        </Box>
      )}
    </>
  );
};
