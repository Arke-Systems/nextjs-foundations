import { headers } from "next/headers";
import "server-only";
 
// Simulate a database call that uses server secrets
export async function getUserFromDB(userId: string) {
  // Access dynamic data to allow new Date()
  await headers();
  
  // In real code, this would use process.env.DATABASE_URL
  // The INTERNAL_CONFIG demonstrates server-only variable access
  const config = process.env.INTERNAL_CONFIG ?? "default";
 
  // Simulated database response with sensitive fields
  return {
    id: userId,
    email: "user@example.com",
    passwordHash: "bcrypt$2b$10$...", // NEVER expose this
    internalNotes: `VIP customer (config: ${config})`, // NEVER expose this
    name: "Jane Developer",
    createdAt: new Date().toISOString(),
  };
}

// Mock database types
type Product = {
  id: string;
  name: string;
  price: number;
  inventory: number;
  createdAt: Date;
  updatedAt: Date;
};

// In-memory store for products
const productsStore = new Map<string, Product>([
  [
    "1",
    {
      id: "1",
      name: "Wireless Mouse",
      price: 29.99,
      inventory: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [
    "2",
    {
      id: "2",
      name: "Mechanical Keyboard",
      price: 89.99,
      inventory: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [
    "3",
    {
      id: "3",
      name: "USB-C Hub",
      price: 49.99,
      inventory: 75,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
]);

// Mock database API (Prisma-like)
export const db = {
  products: {
    async findMany() {
      return Array.from(productsStore.values());
    },

    async findUnique({ where }: { where: { id: string } }) {
      return productsStore.get(where.id) ?? null;
    },

    async create({ data }: { data: Omit<Product, "id" | "createdAt" | "updatedAt"> }) {
      const id = (productsStore.size + 1).toString();
      const product: Product = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      productsStore.set(id, product);
      return product;
    },

    async update({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
    }) {
      const existing = productsStore.get(where.id);
      if (!existing) {
        throw new Error(`Product with id ${where.id} not found`);
      }

      const updated: Product = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      productsStore.set(where.id, updated);
      return updated;
    },

    async delete({ where }: { where: { id: string } }) {
      const existing = productsStore.get(where.id);
      if (!existing) {
        throw new Error(`Product with id ${where.id} not found`);
      }
      productsStore.delete(where.id);
      return existing;
    },
  },
};