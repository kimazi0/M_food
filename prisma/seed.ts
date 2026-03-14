import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.menuItem.deleteMany();

  const items = [
    {
      name: "Spicy Volcano Burger",
      description: "Double beef patty with ghost pepper jack cheese, jalapeños, and our signature spicy lava sauce.",
      price: 14.99,
      category: "MAIN",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    },
    {
      name: "Classic Cheeseburger",
      description: "Single beef patty, cheddar cheese, lettuce, tomato, and house burger sauce.",
      price: 10.99,
      category: "MAIN",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    },
    {
      name: "Truffle Fries",
      description: "Crispy shoestring fries tossed in white truffle oil and parmesan.",
      price: 6.99,
      category: "SIDE",
      image: "https://images.unsplash.com/photo-1576107232684-1279f39085cb?w=800&q=80",
    },
    {
      name: "Sunset Lemonade",
      description: "Freshly squeezed lemon with strawberry puree and mint.",
      price: 4.99,
      category: "DRINK",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
    },
    {
      name: "Molten Lava Cake",
      description: "Warm chocolate cake with a gooey center, served with vanilla bean ice cream.",
      price: 8.99,
      category: "DESSERT",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
    }
  ];

  for (const item of items) {
    await prisma.menuItem.create({
      data: item
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
