import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

async function login(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // `CredentialsSignin` = credenciales inválidas (authorize devolvió null);
      // cualquier otro AuthError (authorize lanzó, p. ej. sin conexión a BD) se
      // trata como fallo de conexión para no decir "credenciales mal" cuando no lo son.
      const code = error.type === "CredentialsSignin" ? "credenciales" : "conexion";
      redirect(`/login?error=${code}`);
    }

    throw error;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  const params = await searchParams;
  const errorMessage =
    params?.error === "conexion"
      ? "No se puede conectar con el servidor. Inténtalo de nuevo más tarde."
      : params?.error
        ? "Credenciales no válidas."
        : null;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede con tu email y contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
