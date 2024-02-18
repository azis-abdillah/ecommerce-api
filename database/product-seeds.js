[
  {
    name: "Laptop",
    description: "Powerful laptop with high-performance specifications.",
    price: 999.99,
    category: "Electronics",
    inStock: true,
  },
  {
    name: "Wireless Headphones",
    description:
      "Noise-canceling wireless headphones for an immersive audio experience.",
    price: 129.99,
    category: "Electronics",
    inStock: true,
  },
  {
    name: "Smartwatch",
    description:
      "Feature-rich smartwatch with health and fitness tracking capabilities.",
    price: 199.99,
    category: "Wearables",
    inStock: true,
  },
  {
    name: "Leather Wallet",
    description:
      "Elegant leather wallet with multiple compartments for cards and cash.",
    price: 49.99,
    category: "Fashion",
    inStock: true,
  },
  {
    name: "Fitness Tracker",
    description:
      "Compact fitness tracker to monitor your daily activities and workouts.",
    price: 79.99,
    category: "Wearables",
    inStock: true,
  },
  {
    name: "Coffee Maker",
    description:
      "High-quality coffee maker for brewing delicious coffee at home.",
    price: 89.99,
    category: "Appliances",
    inStock: true,
  },
  {
    name: "Running Shoes",
    description: "Comfortable and durable running shoes for your daily runs.",
    price: 79.99,
    category: "Footwear",
    inStock: true,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Compact and portable Bluetooth speaker for on-the-go music enjoyment.",
    price: 59.99,
    category: "Electronics",
    inStock: true,
  },
  {
    name: "Backpack",
    description:
      "Spacious backpack with multiple compartments for your daily essentials.",
    price: 39.99,
    category: "Fashion",
    inStock: true,
  },
  {
    name: "Digital Camera",
    description:
      "High-resolution digital camera for capturing stunning photos and videos.",
    price: 549.99,
    category: "Electronics",
    inStock: true,
  },
];

async function main() {
  await prisma.user.deleteMany();

  const roles = await prisma.role.findMany();
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        name: faker.person.fullName(),
        password: bcrypt.hashSync("password", bcryptRound),
        role_id: roles[Math.floor(Math.random() * roles.length)].id,
      },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
