import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SharedCardView from "@/components/SharedCardView";
import { getSharedCardServer } from "@/lib/supabase/shared-cards";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getSharedCardServer(id);
  if (!card) return { title: "Builder Card Not Found · HH Goa 2026" };
  const title = `${card.name} · HH Goa Builder Pass`;
  const description = `${card.title || card.stack || "Builder"} · ${card.idNumber || "HH Goa 2026"} · #FrameInGoa`;
  return {
    title,
    description,
    alternates: { canonical: `/card/${card.id}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: card.cardUrl, alt: `${card.name} HH Goa Builder Pass` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.cardUrl],
    },
  };
}

export default async function SharedCardPage({ params }: PageProps) {
  const { id } = await params;
  const card = await getSharedCardServer(id);
  if (!card) notFound();
  return <SharedCardView card={card} />;
}
