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
import { Fragment } from "react";

const NavBreadcrumb = () => {
  const pathName = usePathname();
  const segments = pathName
    .split("/")
    .filter(Boolean)
    .filter((_, index) => index !== 0)
    .map((segment) =>
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );

  return (
    <div className="flex items-center px-4 h-16 gap-x-4 py-4">
      <SidebarTrigger size="icon" />
      <Separator orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => {
            const href = "/" + pathName
              .split("/")
              .filter(Boolean)
              .slice(0, index + 2)
              .join("/")
              .toLowerCase();

            return (
              <Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
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
