"use client";

import { useState } from "react";
import { BadgeCheck, Ban, Loader, MoreHorizontal } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CellActionsProps {
  id: String;
  fullName: string;
  email: string;
}

export const CellActions = ({ id, fullName, email }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/sendSelected", { email, fullName });
      toast.success("Mail Sent");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const sendRejected = async () => {
    setIsRejection(true);
    try {
      await axios.post("/api/sendRejected", { email, fullName });
      toast.success("Mail Sent");
      setIsRejection(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="size-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendSelected}
            className="flex items-center"
          >
            <BadgeCheck className="mr-2 size-4" />
            Selected
          </DropdownMenuItem>
        )}
        {isRejection ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="size-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendRejected}
            className="flex items-center"
          >
            <Ban className="mr-2 size-4" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
