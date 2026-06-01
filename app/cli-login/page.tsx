import { CliLoginForm } from "@/components/CliLoginForm";

type CliLoginPageProps = {
  searchParams: Promise<{
    state?: string;
    api_base?: string;
  }>;
};

export const metadata = {
  title: "Crayon CLI Login",
};

export default async function CliLoginPage({ searchParams }: CliLoginPageProps) {
  const params = await searchParams;
  const stateValue = typeof params.state === "string" ? params.state : "";
  const apiBase = typeof params.api_base === "string" ? params.api_base : "";

  return (
    <main className="main-root flex min-h-screen items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,98,87,0.16),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(120,119,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="relative z-10 flex w-full justify-center">
        <CliLoginForm stateValue={stateValue} apiBase={apiBase} />
      </div>
    </main>
  );
}
