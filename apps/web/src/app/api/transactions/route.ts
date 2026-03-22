import { z } from "zod";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuth } from "../../../lib/auth";
 
// 1. Input validation schema
const TransactionSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().positive().max(10000),
});
 
// Simple in-memory rate limiter (use Redis in production)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
 
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(identifier);
 
  if (!limit || now > limit.resetAt) {
    requestCounts.set(identifier, { count: 1, resetAt: now + 60000 });
    return false;
  }
 
  if (limit.count >= 10) {
    return true; // Rate limited
  }
 
  limit.count++;
  return false;
}
 
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const user = await verifyAuth(request)
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // 2. Rate limiting (by IP for demo)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
 
    // 3. Input validation
    const body = await request.json();
    const result = TransactionSchema.safeParse(body);
 
    if (!result.success) {
      console.error("[transaction] Validation failed:", result.error);
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
 
    const { userId, amount } = result.data;
 
    // 4. Process transaction (mock)
    const transaction = {
      id: crypto.randomUUID(),
      userId,
      amount,
      timestamp: Date.now(),
    };
 
    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    // 5. Safe error handling
    console.error("[transaction] Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
 
export function GET() {
  return NextResponse.json({
    transactions: [
      { id: "1", amount: 100, status: "completed" },
      { id: "2", amount: 250, status: "pending" },
    ],
  });
}