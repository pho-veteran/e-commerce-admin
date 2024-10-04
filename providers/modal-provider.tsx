"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    );
};
