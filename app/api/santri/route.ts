import { NextRequest, NextResponse } from "next/server";
import { JenisSantri } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - List all santri
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA_SMK" && session.user.role !== "BENDAHARA_SMP" && session.user.role !== "BENDAHARA_PONDOK")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jenisSantri = searchParams.get("jenisSantri");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Build filter
    const where: {
      jenisSantri?: JenisSantri;
      OR?: Array<{
        nama?: { contains: string; mode: "insensitive" };
        nis?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (jenisSantri && Object.values(JenisSantri).includes(jenisSantri as JenisSantri)) {
      where.jenisSantri = jenisSantri as JenisSantri;
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { nis: { contains: search, mode: "insensitive" } },
      ];
    }

    const santri = await prisma.santri.findMany({
      where,
      select: {
        id: true,
        nis: true,
        nama: true,
        kelas: true,
        asrama: true,
        wali: true,
        status: true,
        beasiswa: true,
        jenisBeasiswa: true,
        jenisSantri: true,
        isSyalaf: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    // Calculate balance for all santri using aggregation (fixes N+1 query)
    const santriIds = santri.map((s) => s.id);

    // Query 1: Total DITAMBAH per santri
    const ditambahAgg = await prisma.transaksi.groupBy({
      by: ["santriId"],
      where: {
        santriId: { in: santriIds },
        jenis: "UANG_SAKU",
        statusUangSaku: "DITAMBAH",
      },
      _sum: {
        jumlah: true,
      },
    });

    // Query 2: Total DIAMBIL per santri
    const diambilAgg = await prisma.transaksi.groupBy({
      by: ["santriId"],
      where: {
        santriId: { in: santriIds },
        jenis: "UANG_SAKU",
        statusUangSaku: "DIAMBIL",
      },
      _sum: {
        jumlah: true,
      },
    });

    // Create balance maps for O(1) lookup
    const ditambahMap = new Map(
      ditambahAgg.map((item) => [item.santriId, item._sum.jumlah || 0])
    );
    const diambilMap = new Map(
      diambilAgg.map((item) => [item.santriId, item._sum.jumlah || 0])
    );

    // Calculate balance for each santri
    const santriWithBalance = santri.map((s) => {
      const ditambah = ditambahMap.get(s.id) || 0;
      const diambil = diambilMap.get(s.id) || 0;
      return {
        ...s,
        saldo: ditambah - diambil,
      };
    });

    return NextResponse.json({ santri: santriWithBalance });
  } catch (error) {
    console.error("Error fetching santri:", error);
    return NextResponse.json(
      { error: "Failed to fetch santri" },
      { status: 500 }
    );
  }
}

// POST - Create a new santri with user account
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "BENDAHARA_SMK" && session.user.role !== "BENDAHARA_SMP" && session.user.role !== "BENDAHARA_PONDOK")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      nis,
      nama,
      kelas,
      asrama,
      wali,
      status,
      beasiswa,
      jenisBeasiswa,
      jenisSantri,
      isSyalaf,
      email,
      password,
    } = body;

    // Kelas is not required for PONDOK santri
    const isPondok = jenisSantri === "PONDOK";
    if (!nis || !nama || !asrama || !wali || !email || !password) {
      return NextResponse.json(
        { error: "NIS, nama, asrama, wali, email, dan password wajib diisi" },
        { status: 400 }
      );
    }
    if (!isPondok && !kelas) {
      return NextResponse.json(
        { error: "Kelas wajib diisi untuk santri SMK dan SMP" },
        { status: 400 }
      );
    }

    // Check if santri with NIS already exists
    const existingSantri = await prisma.santri.findUnique({
      where: { nis },
    });

    if (existingSantri) {
      return NextResponse.json(
        { error: "Santri dengan NIS ini sudah ada" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User dengan email ini sudah ada" },
        { status: 400 }
      );
    }

    // Use better-auth admin.createUser API to properly hash the password
    // The defaultRole in admin plugin config will set role to "SANTRI"
    const result = await auth.api.createUser({
      body: {
        email: email,
        password: password,
        name: nama,
      },
    });

    // Extract user id from the response
    const userId = (result as { user: { id: string } }).user.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create santri linked to user
    // Kelas is optional for PONDOK santri, default to empty string
    const santri = await prisma.santri.create({
      data: {
        nis,
        nama,
        kelas: kelas || "",
        asrama,
        wali,
        status: status || "AKTIF",
        beasiswa: beasiswa || false,
        jenisBeasiswa: jenisBeasiswa || null,
        jenisSantri: jenisSantri || "PONDOK",
        isSyalaf: isSyalaf || false,
        userId: userId,
      },
      select: {
        id: true,
        nis: true,
        nama: true,
        kelas: true,
        asrama: true,
        wali: true,
        status: true,
        beasiswa: true,
        jenisBeasiswa: true,
        jenisSantri: true,
        isSyalaf: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Update user with jenisSantri from santri
    await prisma.user.update({
      where: { id: userId },
      data: { jenisSantri: santri.jenisSantri },
    });

    return NextResponse.json({ santri }, { status: 201 });
  } catch (error) {
    console.error("Error creating santri:", error);
    return NextResponse.json(
      { error: "Failed to create santri" },
      { status: 500 }
    );
  }
}