import { prisma } from "@/lib/prisma";
import { KitchenDisplay } from "@/components/admin/KitchenDisplay";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PENDING", "PREPARING", "READY"]
      }
    },
    include: {
      items: {
        include: {
          menuItem: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  return (
    <div className="h-full bg-transparent relative">
      <div className="fixed inset-0 bg-band-pattern opacity-10 pointer-events-none" />
      <KitchenDisplay initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
