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

const NavBreadcrumb = () => {
  const pathName = usePathname();
  const path = pathName
    .split("/")[2]
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex items-center px-4 h-12 gap-x-4 py-4">
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
        <UserButton showName={true} />
      </div>
    </div>
  );
};

export default NavBreadcrumb;
