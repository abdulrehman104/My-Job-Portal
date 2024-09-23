import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/prismadb";
import { IconBadge } from "../../jobs/[jobId]/_components/icon-badge";
import { NameForm } from "./_components/company-name";
import { CompanyDescriptionForm } from "./_components/company-description";
import { CompanyLogo } from "./_components/company-logo";
import { CoverImageForm } from "./_components/company-cover-image";
import { CompanyOverviewForm } from "./_components/company-overview";
import { CompanyWhyJoinUsForm } from "./_components/company-why-join-us";
import { CompanyDetailsForm } from "./_components/company-details";

interface JProps {
  params: { companyId: string };
}

export default async function EditJob({ params }: JProps) {
  const validUuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!validUuidRegex.test(params.companyId)) {
    console.log("Invalid Job ID. Redirecting...");
    return redirect("/admin/jobs");
  }

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const company = await prisma.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/admin/create");
  }

  const requiredField = [
    company.name,
    company.description,
    company.logo,
    company.converImage,
    company.email,
    company.website,
    company.linkedIn,
    company.adress_line1,
    company.city,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalField = requiredField.length;
  const isComplectedField = requiredField.filter(Boolean).length;
  const completionText = `${isComplectedField}/${totalField}`;

  const isCompleted = requiredField.every(Boolean);

  return (
    <div className="p-6">
      {/* Go Back Button */}
      <Link href="/admin/companies">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" />
          Back
        </div>
      </Link>

      {/* Title Button */}
      <div className="flex items-center justify-between pt-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Company setup</h1>
          <p className="text-sm text-neutral-700">
            Complete all fields {completionText}
          </p>
        </div>
      </div>

      {/* Container Layout */}
      <div className="mt-10 md:grid md:grid-cols-2 md:gap-2 ">
        {/* Left Container */}
        <div className="space-y-8">
          {/* Customize Job title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl font-semibold text-neutral-700">
              Customize Your Company
            </h2>
          </div>

          {/* Company title */}
          <NameForm initialData={company} companyId={company.id} />

          {/* Company Description */}
          <CompanyDescriptionForm
            initialData={company}
            companyId={company.id}
          />

          {/* Company Logo */}
          <CompanyLogo initialData={company} companyId={company.id} />
        </div>

        {/* Right Container */}
        <div className="mt-8 space-y-8 md:mt-0">
          {/* Company Social Contact */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Network} />
            <h2 className="text-xl font-semibold text-neutral-700">
              Company Social Contact
            </h2>
          </div>

          {/* Company Contect Details */}
          <CompanyDetailsForm initialData={company} companyId={company.id} />

          {/* Company Cover Image */}
          <CoverImageForm initialData={company} companyId={company.id} />
        </div>

        {/* Company Overview */}
        <div className="col-span-2 my-8">
          <CompanyOverviewForm initialData={company} companyId={company.id} />
        </div>

        {/* Why Join Us*/}
        <div className="col-span-2 my-8">
          <CompanyWhyJoinUsForm initialData={company} companyId={company.id} />
        </div>
      </div>
    </div>
  );
}
