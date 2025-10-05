import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { applyRateLimit } from "@/utils/rateLimiter";

export const POST = async (req) => {
  try {
    // Apply rate limiting for registration (3 attempts per hour per IP)
    await applyRateLimit(req, "register");

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Wszystkie pola są wymagane" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "Użytkownik o tym emailu już istnieje" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with "user" role by default
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", // Default role for new registrations
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return new NextResponse(
      JSON.stringify({
        message: "Konto zostało utworzone pomyślnie",
        user: userWithoutPassword,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Błąd podczas tworzenia konta" }),
      { status: 500 }
    );
  }
};
