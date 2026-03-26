import { prisma } from "@/lib/prisma";
import { MenuEditor } from "@/components/admin/MenuEditor";

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const [rawItems, categories] = await Promise.all([
    prisma.menuItem.findMany() as Promise<any[]>,
    (prisma as any).category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  const items = rawItems.sort((a, b) => {
    const catA = String(a["categoryName"] || "");
    const catB = String(b["categoryName"] || "");
    return catA.localeCompare(catB);
  });

  return (
    <div className="h-full bg-transparent">
      <MenuEditor initialItems={JSON.parse(JSON.stringify(items))} initialCategories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
