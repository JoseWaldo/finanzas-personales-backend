import { prisma } from "../src/db";

const expenseCategories = [
  { name: "Alimentación", icon: "utensils" },
  { name: "Transporte", icon: "car" },
  { name: "Vivienda", icon: "home" },
  { name: "Salud", icon: "heart-pulse" },
  { name: "Ocio", icon: "gamepad-2" },
  { name: "Educación", icon: "graduation-cap" },
  { name: "Ropa", icon: "shirt" },
  { name: "Tecnología", icon: "laptop" },
  { name: "Servicios", icon: "wrench" },
  { name: "Mascotas", icon: "paw-print" },
  { name: "Regalos", icon: "gift" },
  { name: "Suscripciones", icon: "repeat" },
  { name: "Impuestos", icon: "landmark" },
  { name: "Seguros", icon: "shield" },
  { name: "Otros Gastos", icon: "ellipsis" },
] as const;

const incomeCategories = [
  { name: "Salario", icon: "briefcase" },
  { name: "Freelance", icon: "pen-line" },
  { name: "Inversiones", icon: "trending-up" },
  { name: "Negocio", icon: "store" },
  { name: "Alquiler", icon: "building-2" },
  { name: "Reembolsos", icon: "undo-2" },
  { name: "Otros Ingresos", icon: "ellipsis" },
] as const;

async function main() {
  console.log("🌱 Sembrando/actualizando categorías predefinidas...");

  const allCategories = [...expenseCategories, ...incomeCategories];

  for (const cat of allCategories) {
    const type = expenseCategories.includes(cat as typeof expenseCategories[number]) ? "EXPENSE" : "INCOME";

    const existing = await prisma.category.findFirst({
      where: { name: cat.name, userId: null },
    });

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { icon: cat.icon },
      });
    } else {
      await prisma.category.create({
        data: {
          name: cat.name,
          type,
          icon: cat.icon,
          userId: null,
        },
      });
    }
  }

  console.log("✅ Categorías actualizadas correctamente.");
  console.log("🏁 Seed completado.");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
