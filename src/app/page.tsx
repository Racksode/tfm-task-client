import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isStaff } from "@/lib/permissions";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  redirect(isStaff(session.user.role) ? "/dashboard" : "/portal");
}
