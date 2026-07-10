// src/components/LayoutClient.tsx
"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar"; // Reuse existing Navbar component

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = !pathname?.startsWith("/dashboard");

  return (
    <AuthProvider>
      {showNavbar && <Navbar />}
      {children}
    </AuthProvider>
  );
}
