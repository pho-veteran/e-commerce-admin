"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const theme = useTheme();

    if (!mounted) return null;

    return (
        <>
            <div className="flex items-center gap-x-4 py-2">
                <Image
                    src={theme.theme === "dark" ? "/icon-white.png" : "/icon-black.png"}
                    alt="VStore Logo"
                    width={33}
                    height={29}
                />
                <div>
                    <span className="font-bold text-black text-lg block dark:text-white">VStore Platform</span>
                    <p className="text-xs text-neutral-400">Admin Dashboard</p>
                </div>
            </div>
            <hr className="my-4" />
        </>
    );
}

export default Logo;