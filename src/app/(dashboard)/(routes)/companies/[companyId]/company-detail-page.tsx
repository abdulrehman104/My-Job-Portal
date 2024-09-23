"use client";

import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Company, Job } from "@prisma/client";
import { cn } from "@/lib/utils";
import { BodyContentSection } from "./_components/body-content-section";

interface CompanyDetailPageProps {
  userId: string;
  company: Company;
  jobs: Job[];
}

export const CompanyDetailPage = ({
  userId,
  jobs,
  company,
}: CompanyDetailPageProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isFollower = userId && company.followers.includes(userId);

  const onClickAddRemove = async () => {
    try {
      setIsLoading(true);
      if (isFollower) {
        await axios.patch(`/api/companies/${company.id}/removeFollower`);
        toast.success("Un-Follow");
      } else {
        await axios.patch(`/api/companies/${company.id}/addFollower`);
        toast.success("Following");
      }
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.log("Error", error);
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="z-50 -mt-8 w-full rounded-2xl bg-white p-4">
      <div className="w-full flex-col px-4">
        {/* Header Content */}
        <div className="-mt-12 flex w-full flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          {/* Image and Content */}
          <div className="my-2 flex flex-col items-center justify-center space-x-4 sm:flex-row sm:items-end sm:justify-end">
            {company.logo && (
              <div className="relative flex aspect-square h-32 w-auto items-center justify-center overflow-hidden rounded-2xl border bg-white p-3 sm:h-32 md:h-40 lg:h-48">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-col space-y-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <h2 className="text-4xl font-semibold text-neutral-700">
                  {company.name}
                </h2>
                <p className="text-muted-foreground text-center text-sm font-semibold sm:text-left">
                  {`(${company.followers.length}) Following`}
                </p>
              </div>
              <p className="text-muted-foreground text-center text-sm font-semibold sm:text-left">
                Leveraging Technology to provide better services
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1 pt-1 sm:justify-start">
                <p className="text-muted-foreground rounded-lg border px-2 py-1 text-sm font-semibold">
                  Services
                </p>
                <p className="text-muted-foreground rounded-lg border px-2 py-1 text-sm font-semibold">
                  Consulting
                </p>
                <p className="text-muted-foreground rounded-lg border px-2 py-1 text-sm font-semibold">
                  Private
                </p>
                <p className="text-muted-foreground rounded-lg border px-2 py-1 text-sm font-semibold">
                  Corporate
                </p>
                <p className="text-muted-foreground rounded-lg border px-2 py-1 text-sm font-semibold">
                  B2B
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <Button
            onClick={onClickAddRemove}
            className={cn(
              "flex w-full items-center justify-center rounded-full border border-purple-500 text-purple-500 hover:shadow-md sm:w-24",
              !isFollower && "bg-purple-600 text-white hover:bg-purple-700",
            )}
            variant={isFollower ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {isFollower ? (
                  "Un-Follow"
                ) : (
                  <>
                    <Plus className="mr-2 size-4" /> Follow
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Body Content */}
        <BodyContentSection userId={userId} company={company} jobs={jobs} />
      </div>
    </div>
  );
};

// "use client";

// import axios from "axios";
// import toast from "react-hot-toast";
// import Image from "next/image";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2, Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Company, Job } from "@prisma/client";
// import { cn } from "@/lib/utils";
// import { BodyContentSection } from "./_components/body-content-section";

// interface CompanyDetailPageProps {
//   userId: string;
//   company: Company;
//   jobs: Job[];
// }

// export const CompanyDetailPage = ({
//   userId,
//   jobs,
//   company,
// }: CompanyDetailPageProps) => {

//   return (
//     <div className="w-full rounded-2xl bg-white p-4 z-50 -mt-8">
//       <div className="flex-col w-full px-4">
//         {/* Header Content */}
//         <div className="w-full flex items-center justify-between -mt-12 ">
//           {/* Image and Content */}
//           <div className="flex items-end justify-end space-x-4 my-2">
//             {company.logo && (
//               <div className="aspect-square w-auto h-32 rounded-2xl border bg-white flex items-center justify-center relative overflow-hidden p-3">
//                 <Image
//                   src={company.logo}
//                   alt={company.name}
//                   width={124}
//                   height={124}
//                   className="object-contain"
//                 />
//               </div>
//             )}
//             <div className="flex-col space-y-1">
//               <div className="flex items-center gap-2">
//                 <h2 className="text-2xl text-neutral-700 font-semibold">
//                   {company.name}
//                 </h2>
//                 <p className="text-sm text-muted-foreground font-semibold">{`(${company.followers.length}) Following`}</p>
//               </div>
//               <p className="text-sm text-muted-foreground font-semibold">
//                 Leveraging Technology to provide better services
//               </p>
//               <div className="flex items-center gap-1 pt-1 flex-wrap">
//                 <p className="text-sm text-muted-foreground font-semibold border px-2 py-1 rounded-lg">
//                   Services
//                 </p>
//                 <p className="text-sm text-muted-foreground font-semibold border px-2 py-1 rounded-lg">
//                   Consulting
//                 </p>
//                 <p className="text-sm text-muted-foreground font-semibold border px-2 py-1 rounded-lg">
//                   Private
//                 </p>
//                 <p className="text-sm text-muted-foreground font-semibold border px-2 py-1 rounded-lg">
//                   Corporate
//                 </p>
//                 <p className="text-sm text-muted-foreground font-semibold border px-2 py-1 rounded-lg">
//                   B2B
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Button */}
//           <Button
//             onClick={onClickAddRemove}
//             className={cn(
//               "w-24 rounded-full hover:shadow-md flex items-center justify-center border border-purple-500 text-purple-500",
//               !isFollower && "bg-purple-600 hover:bg-purple-700 text-white"
//             )}
//             variant={isFollower ? "outline" : "default"}
//           >
//             {isLoading ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <>
//                 {isFollower ? (
//                   "unFollow"
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4 mr-2" /> Follow
//                   </>
//                 )}
//               </>
//             )}
//           </Button>
//         </div>

//         {/* Body Content */}
//         <BodyContentSection userId={userId} company={company} jobs={jobs} />
//       </div>
//     </div>
//   );
// };
