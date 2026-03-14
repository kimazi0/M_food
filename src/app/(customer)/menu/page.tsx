import { prisma } from "@/lib/prisma";
import { MenuGallery } from "@/components/menu/MenuGallery";

const SEED_ITEMS = [
  { name: "Spicy Volcano Burger", description: "Double beef patty with ghost pepper jack cheese, jalapeños, and our signature spicy lava sauce.", price: 14.99, category: "MAIN", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" },
  { name: "Classic Cheeseburger", description: "Single beef patty, cheddar cheese, lettuce, tomato, and house burger sauce on a brioche bun.", price: 10.99, category: "MAIN", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80" },
  { name: "Grilled Salmon", description: "Atlantic salmon fillet with lemon butter sauce, asparagus, and roasted potatoes.", price: 18.99, category: "MAIN", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80" },
  { name: "Truffle Fries", description: "Crispy shoestring fries tossed in white truffle oil and grated parmesan.", price: 6.99, category: "SIDE", image: "https://images.unsplash.com/photo-1576107232684-1279f39085cb?w=800&q=80" },
  { name: "Onion Rings", description: "Golden crispy onion rings served with our signature chipotle dipping sauce.", price: 5.49, category: "SIDE", image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80" },
  { name: "Sunset Lemonade", description: "Freshly squeezed lemon with strawberry puree, mint, and a hint of honey.", price: 4.99, category: "DRINK", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80" },
  { name: "Iced Matcha Latte", description: "Premium Japanese matcha with oat milk over ice. Refreshing and energising.", price: 5.49, category: "DRINK", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80" },
  { name: "Molten Lava Cake", description: "Warm chocolate cake with a gooey centre, served with vanilla bean ice cream.", price: 8.99, category: "DESSERT", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80" },
  { name: "Crème Brûlée", description: "Classic French custard with a perfectly caramelised golden sugar crust.", price: 7.99, category: "DESSERT", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80" },
];

async function ensureSeeded() {
  const count = await prisma.menuItem.count();
  if (count === 0) {
    for (const item of SEED_ITEMS) {
      await prisma.menuItem.create({ data: item });
    }
  }
}

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  await ensureSeeded();
  const items = await prisma.menuItem.findMany({
    where: { available: true },
    include: { modifications: true },
    orderBy: { category: "asc" },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-[#2a2a2a] bg-[#0a0a0a] py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-px bg-primary" /> Our Menu
          </p>
          <h1 className="text-6xl md:text-7xl font-heading font-black tracking-tighter uppercase mb-4 text-white">
            What's <span className="text-primary">Cooking</span>
          </h1>
          <p className="text-[#a1a1a1] text-lg max-w-xl font-medium">
            Fresh ingredients, bold flavours. Click any item to customise your order.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <MenuGallery items={items} />
      </div>
    </div>
  );
}
