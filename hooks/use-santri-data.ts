"use client"

import useSWR from "swr"

type SantriRole = "smk" | "smp" | "pondok"

interface SantriData {
  tagihan: any[]
  transaksi: any[]
  santri: {
    id: string
    nama: string
    nis: string
    kelas?: string
    jurusan?: string
    foto?: string
    email?: string
    telepon?: string
    alamat?: string
  } | null
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `Failed to fetch data (${response.status})`)
  }
  return response.json()
}

export function useSantriData(role: SantriRole) {
  const { data, error, isLoading, mutate } = useSWR<SantriData>(
    `/api/santri/${role}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false, // Disable to prevent race condition with RealtimeTagihan's own fetching
      dedupingInterval: 30000, // Cache 30 detik
      refreshInterval: 0, // Disable auto refresh - let RealtimeTagihan handle polling
      revalidateIfStale: false, // Don't revalidate when window regains focus
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate, // Untuk manual refresh
  }
}

export type { SantriData, SantriRole }
