import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import { cache } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { TRPCReactProvider } from "../trpc/react";


export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

const getHeaders = cache(() => Promise.resolve(headers()));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider>
      <TRPCReactProvider headersPromise={getHeaders()}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
