import { redirect } from "next/navigation";

// Old route: /suggest — redirect to dashboard
export default function OldSuggestPage() {
  redirect("/");
}
