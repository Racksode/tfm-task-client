import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  redirect(session.user.role === UserRole.INTERNAL ? "/dashboard" : "/portal");
}
