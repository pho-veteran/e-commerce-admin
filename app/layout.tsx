import {
    ClerkProvider,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ModalProvider } from "@/providers/modal-provider";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "E-commerce Admin",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html
                lang="en"
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <body>
                    <ModalProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
