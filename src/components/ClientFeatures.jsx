"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const ProgressBar = dynamic(() => import("@/components/ProgressBar"), { ssr: false });
const WhatsAppBtn = dynamic(() => import("@/components/WhatsAppBtn"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function ClientFeatures() {
  return (
    <>
      <CustomCursor />
      <ProgressBar />
      <WhatsAppBtn />
      <Chatbot />
    </>
  );
}