import type { Metadata } from "next";
import ResumeViewer from "./ResumeViewer";

export const metadata: Metadata = {
  title: "Resume — Akash Gogate",
  description: "Akash Gogate — Software Engineer & Researcher",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return <ResumeViewer />;
}
