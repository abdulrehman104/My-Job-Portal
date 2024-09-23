import { auth } from "@clerk/nextjs/server";

import {
  getPeiGraphCompanyCreatedByUser,
  getPeiGraphJobCreatedByUser,
  getTotalCompaniesOnPortal,
  getTotalCompaniesOnPortalByUserId,
  getTotalJobOnPortal,
  getTotalJobOnPortalByUserId,
} from "@/actions/get-overview-analytics";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { OverviewPieCharts } from "@/components/overview-pie-charts";

export default async function AnalyticsPage() {
  const { userId } = auth();

  const totalJobsOnPortal = getTotalJobOnPortal();
  const totalJobsOnPortalByUser = getTotalJobOnPortalByUserId(userId);
  const totalCompaniesOnPortal = getTotalCompaniesOnPortal();
  const totalCompaniesOnPortalByUser =
    getTotalCompaniesOnPortalByUserId(userId);

  const graphJobTotal = await getPeiGraphJobCreatedByUser(userId);
  const graphCompanyTotal = await getPeiGraphCompanyCreatedByUser(userId);

  return (
    <div className="flex-col items-start p-4">
      {/* Main Heading */}
      <div className="flex flex-col items-start">
        <h2 className="font-sans text-4xl font-bold tracking-wide">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">
          Overview of your account
        </p>
      </div>

      <Separator className="my-4" />

      {/* All Cards */}
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Total Jobs</CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Jobs Created By User
            </CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Total Companies
            </CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalCompaniesOnPortal}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Companies Created By User
            </CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>

        {/* Jobs and Company Charts */}

        {/* Month wise job count */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Month wise job count
            </CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            <OverviewPieCharts data={graphJobTotal} />
          </CardContent>
        </Card>

        {/* Month wise Company count */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Month wise Company count
            </CardTitle>
            <Briefcase className="size-4" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            <OverviewPieCharts data={graphCompanyTotal} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
