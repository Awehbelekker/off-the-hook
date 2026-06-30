import { notFound } from "next/navigation";
import type { Data } from "@measured/puck";
import { getPublishedPage, getTenantTheme } from "@/lib/vula-pages";
import PuckRender from "@/components/PuckRender";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  return {
    title: page?.seo?.title || page?.title || "Off the Hook",
    description: page?.seo?.description || undefined,
  };
}

export default async function VulaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, theme] = await Promise.all([getPublishedPage(slug), getTenantTheme()]);
  if (!page) notFound();
  return <PuckRender data={page.puck_data as unknown as Data} theme={theme} />;
}
