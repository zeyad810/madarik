import React from "react";
import { ChildReport } from "@/features/parent";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ChildReport childId={id} />;
};

export default Page;