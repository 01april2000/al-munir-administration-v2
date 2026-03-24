import { NextRequest, NextResponse } from "next/server";
import { JenisSantri, StatusSantri, JenisBeasiswa } from "@/lib/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

interface SantriImportData {
  nis: string;
  nama: string;
  kelas: string;
  asrama: string;
  wali: string;
  status: string;
  beasiswa: boolean;
  jenisBeasiswa: string | null;
  jenisSantri: string;
  email: string;
  password: string;
}

// POST - Bulk import santri from Excel data
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data }: { data: SantriImportData[] } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Data tidak valid atau kosong" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as { row: number; message: string }[],
    };

    // Validate and process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Excel row number (1-based + header row)

      try {
        // Validate required fields
        if (!row.nis || !row.nama || !row.asrama || !row.wali || !row.email || !row.password) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: "NIS, Nama, Asrama, Wali, Email, dan Password wajib diisi",
          });
          continue;
        }

        // Validate jenisSantri
        const validJenisSantri = ["SMK", "SMP", "PONDOK"];
        if (row.jenisSantri && !validJenisSantri.includes(row.jenisSantri.toUpperCase())) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: `Jenis Santri tidak valid. Gunakan: ${validJenisSantri.join(", ")}`,
          });
          continue;
        }

        // Validate status
        const validStatus = ["AKTIF", "NON_AKTIF", "LULUS", "KELUAR"];
        if (row.status && !validStatus.includes(row.status.toUpperCase())) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: `Status tidak valid. Gunakan: ${validStatus.join(", ")}`,
          });
          continue;
        }

        // Validate jenisBeasiswa if beasiswa is true
        const validJenisBeasiswa = ["FULL", "SYAHRIAH", "SPP", "UANG_SAKU"];
        if (row.beasiswa && row.jenisBeasiswa && !validJenisBeasiswa.includes(row.jenisBeasiswa.toUpperCase())) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: `Jenis Beasiswa tidak valid. Gunakan: ${validJenisBeasiswa.join(", ")}`,
          });
          continue;
        }

        // Check if santri with NIS already exists
        const existingSantri = await prisma.santri.findUnique({
          where: { nis: row.nis },
        });

        if (existingSantri) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: `Santri dengan NIS ${row.nis} sudah ada`,
          });
          continue;
        }

        // Check if user with email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: row.email },
        });

        if (existingUser) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: `User dengan email ${row.email} sudah ada`,
          });
          continue;
        }

        // Create user using better-auth
        const result = await auth.api.createUser({
          body: {
            email: row.email,
            password: row.password,
            name: row.nama,
          },
        });

        const userId = (result as { user: { id: string } }).user.id;

        if (!userId) {
          results.failed++;
          results.errors.push({
            row: rowNum,
            message: "Gagal membuat user",
          });
          continue;
        }

        // Create santri linked to user
        const jenisSantriValue = (row.jenisSantri?.toUpperCase() as JenisSantri) || "PONDOK";
        await prisma.santri.create({
          data: {
            nis: row.nis,
            nama: row.nama,
            kelas: row.kelas || "",
            asrama: row.asrama,
            wali: row.wali,
            status: (row.status?.toUpperCase() as StatusSantri) || "AKTIF",
            beasiswa: row.beasiswa || false,
            jenisBeasiswa: row.beasiswa && row.jenisBeasiswa
              ? (row.jenisBeasiswa.toUpperCase() as JenisBeasiswa)
              : null,
            jenisSantri: jenisSantriValue,
            userId: userId,
          },
        });

        // Update user with jenisSantri from santri
        await prisma.user.update({
          where: { id: userId },
          data: { jenisSantri: jenisSantriValue },
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: rowNum,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: `Import selesai. Berhasil: ${results.success}, Gagal: ${results.failed}`,
      results,
    });
  } catch (error) {
    console.error("Error importing santri:", error);
    return NextResponse.json(
      { error: "Failed to import santri" },
      { status: 500 }
    );
  }
}
