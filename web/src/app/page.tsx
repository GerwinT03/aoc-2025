import { redirect } from "next/navigation";
import { defaultYear } from "@/lib/config";

export default function Home() {
  redirect(`/${defaultYear}`);
}
