/**
 * Application Configuration
 * 
 * Feature flags for enabling/disabling jenis tagihan and transaksi types.
 * To re-enable SPP, simply add "SPP" back to the arrays below.
 */

import { JenisTagihan, JenisTransaksi } from "@/lib/generated/prisma";

/**
 * Active jenis tagihan types that appear in UI (generate dialog, create dialog, etc.)
 * Remove a type from this array to hide it from the UI without affecting the database.
 */
export const ACTIVE_JENIS_TAGIHAN: JenisTagihan[] = [
  // "SPP", // Dinonaktifkan sementara
  "SYAHRIAH",
  "UANG_SAKU",
  "LAUNDRY",
  "UJIAN",
  "PKL",
  "LKS",
  "BUKU_PENDAMPING",
  "TKA",
];

/**
 * Active jenis transaksi types that appear in UI (tabs, sidebar menus, etc.)
 * Remove a type from this array to hide it from the UI without affecting the database.
 */
export const ACTIVE_JENIS_TRANSAKSI: JenisTransaksi[] = [
  // "SPP", // Dinonaktifkan sementara
  "SYAHRIAH",
  "UANG_SAKU",
  "LAUNDRY",
  "UJIAN",
  "PKL",
  "LKS",
  "BUKU_PENDAMPING",
  "TKA",
];

/**
 * Check if a jenis tagihan is currently active
 */
export function isJenisTagihanActive(jenis: string): boolean {
  return ACTIVE_JENIS_TAGIHAN.includes(jenis as JenisTagihan);
}

/**
 * Check if a jenis transaksi is currently active
 */
export function isJenisTransaksiActive(jenis: string): boolean {
  return ACTIVE_JENIS_TRANSAKSI.includes(jenis as JenisTransaksi);
}
