import type { Metadata } from "next";
import ResumeViewer from "./ResumeViewer";

export const metadata: Metadata = {
  title: "Resume — Akash Gogate",
  description: "Akash Gogate — Software Engineer & Researcher",
};

export default function ResumePage() {
  return <ResumeViewer />;
}
