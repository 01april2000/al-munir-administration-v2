import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - Fetch current santri saldo
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the santri record with saldo
    const santri = await prisma.santri.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        nis: true,
        nama: true,
        saldoTagihan: true,
        saldoUangSaku: true,
      },
    });

    if (!santri) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: santri.id,
      nis: santri.nis,
      nama: santri.nama,
      saldo: santri.saldoUangSaku,
      saldoTagihan: santri.saldoTagihan,
      saldoUangSaku: santri.saldoUangSaku,
    });
  } catch (error) {
    console.error("Error fetching saldo:", error);
    return NextResponse.json(
      { error: "Failed to fetch saldo" },
      { status: 500 }
    );
  }
}
