import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SubmitForm } from "@/components/SubmitForm";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/submit");
  const app = await prisma.app.findUnique({ where: { userId: session.user.id } });
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Self-reported flex</p>
      <h1 className="display text-5xl">{app ? "Update your rank" : "Claim your rank"}</h1>
      <p className="mt-2 text-sm text-muted">
        Nobody is checking… until someone Calls BS. Then you have 48 hours to Stripe-verify or you go Homeless.
      </p>
      <SubmitForm
        initial={
          app
            ? {
                name: app.name,
                tagline: app.tagline,
                websiteUrl: app.websiteUrl,
                pitchVideoUrl: app.pitchVideoUrl ?? "",
                screenshotUrl: app.screenshotUrl ?? "",
                techStack: app.techStack.join(", "),
                mrrAmount: Number(app.mrrAmount),
              }
            : null
        }
      />
    </div>
  );
}
