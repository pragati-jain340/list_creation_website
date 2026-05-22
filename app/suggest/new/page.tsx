import { redirect } from "next/navigation";

// Old route: /suggest/new — redirect to dashboard
export default function OldSuggestNewPage() {
  redirect("/");
}
