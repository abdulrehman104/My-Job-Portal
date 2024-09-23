"use client";

import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Box } from "@/components/box";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const menuOne = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Employer home" },
  { href: "#", label: "Sitemap" },
  { href: "#", label: "Credits" },
];

export const Footer = () => {
  return (
    <Box className="h-auto flex-col items-start bg-gray-100 p-6">
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {/* Logo and Social Media Section */}
        <Box className="flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <h2 className="text-muted-foreground text-2xl font-semibold">
              WorkNow
            </h2>
          </div>
          <p className="mt-4 text-base font-semibold">Connect with us</p>
          <div className="flex w-full items-center gap-6">
            <Link href={"https://www.facebook.com"}>
              <Facebook className="text-muted-foreground size-5 transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://www.twitter.com"}>
              <Twitter className="text-muted-foreground size-5 transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://www.linkedin.com"}>
              <Linkedin className="text-muted-foreground size-5 transition-all hover:scale-125 hover:text-purple-500" />
            </Link>

            <Link href={"https://www.youtube.com"}>
              <Youtube className="text-muted-foreground size-5 transition-all hover:scale-125 hover:text-purple-500" />
            </Link>
          </div>
        </Box>

        {/* Menu Sections */}
        <Box className="flex-col items-start justify-between gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="font-sans text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        <Box className="flex-col items-start justify-between gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="font-sans text-sm text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        {/* App Section */}
        <Card className="col-span-2 p-6">
          <CardTitle className="text-base">Apply on the go</CardTitle>
          <CardDescription>
            Get real-time job updates on our App
          </CardDescription>
          <Link href={"#"}>
            <div className="flex gap-4">
              <div className="relative h-12 w-36 overflow-hidden">
                <Image
                  src={"/play-store.png"}
                  fill
                  className="size-full object-contain"
                  alt="Google Play Store"
                />
              </div>
              <div className="relative h-12 w-36 overflow-hidden">
                <Image
                  src={"/apple-store.png"}
                  fill
                  className="size-full object-contain"
                  alt="Apple Store"
                />
              </div>
            </div>
          </Link>
        </Card>
      </div>

      <Separator className="mt-6" />
      <Box className="text-muted-foreground justify-center p-4 text-center text-sm">
        All rights reserved &copy; 2024
      </Box>
    </Box>
  );
};
