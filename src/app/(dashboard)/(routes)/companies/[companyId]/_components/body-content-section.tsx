import { Company, Job } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Preview from "@/components/preview";
import { PageContent } from "@/components/page-content";

interface BodyContentSectionProps {
  userId: string;
  company: Company;
  jobs: Job[];
}

export const BodyContentSection = ({
  userId,
  jobs,
  company,
}: BodyContentSectionProps) => {
  return (
    <div className="my-4 w-full lg:my-12">
      <Tabs defaultValue="overview" className="w-full">
        {/* Tabs Navigation */}
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="rounded-none bg-transparent font-sans text-base tracking-wide data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="rounded-none bg-transparent font-sans text-base tracking-wide data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Join Us
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="rounded-none bg-transparent font-sans text-base tracking-wide data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
          >
            Jobs
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="overview">
          {company.overview ? <Preview value={company.overview} /> : ""}
        </TabsContent>

        <TabsContent value="joinus">
          {company.whyJoinUs ? <Preview value={company.whyJoinUs} /> : ""}
        </TabsContent>

        <TabsContent value="jobs">
          <PageContent userId={userId} jobs={jobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
