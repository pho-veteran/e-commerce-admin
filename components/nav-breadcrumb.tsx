"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

const NavBreadcrumb = () => {
  const pathName = usePathname();
  const path = pathName
    .split("/")[2]
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex items-center px-4 h-16 gap-x-4 py-4">
      <SidebarTrigger size="icon" />
      <Separator orientation="vertical" />
      <Breadcrumb className=" ">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {path && (
            <BreadcrumbItem>
              <BreadcrumbLink href={pathName}>{path}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex gap-x-4">
        <div className="dark:bg-white rounded-lg flex justify-center items-center p-1">
          <UserButton showName={true} />
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default NavBreadcrumb;
