"use client";

import { NewAccountSheet } from "../features/accounts/components/new-account-sheet";
import { useState,useEffect } from "react";
import { EditAccountSheet } from "../features/accounts/components/edit-account-sheet";
export const SheetProvider=()=>{
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) return null;
    return (
        <>
        <NewAccountSheet/>
        <EditAccountSheet/>

        </>
    );
}