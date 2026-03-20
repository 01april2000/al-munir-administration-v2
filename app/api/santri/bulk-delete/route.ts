import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// POST - Bulk delete santri (cascade will delete related users)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA_SMK" && session.user.role !== "BENDAHARA_SMP" && session.user.role !== "BENDAHARA_PONDOK")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Get all santri with their userIds
    const santriList = await prisma.santri.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    const userIds = santriList
      .map((s) => s.userId)
      .filter((id): id is string => id !== null);

    const santriIdsWithoutUser = santriList
      .filter((s) => s.userId === null)
      .map((s) => s.id);

    // Delete users - cascade will automatically delete related santri
    if (userIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: { in: userIds },
        },
      });
    }

    // Delete santri without users directly
    let orphanCount = 0;
    if (santriIdsWithoutUser.length > 0) {
      const result = await prisma.santri.deleteMany({
        where: {
          id: { in: santriIdsWithoutUser },
        },
      });
      orphanCount = result.count;
    }

    return NextResponse.json({
      success: true,
      deletedCount: userIds.length + orphanCount,
    });
  } catch (error) {
    console.error("Error bulk deleting santri:", error);
    return NextResponse.json(
      { error: "Failed to delete santri" },
      { status: 500 }
    );
  }
}