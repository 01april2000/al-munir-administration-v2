"use client"

import * as React from "react"
import type { TransactionData, PaginatedProcessedData, SantriRole } from "@/lib/types/santri"

interface UseInfiniteScrollOptions {
  role: SantriRole
  initialData?: TransactionData[]
  initialCursor?: string | null
  initialHasMore?: boolean
  fetchMore: (cursor?: string) => Promise<PaginatedProcessedData>
  threshold?: number // Distance from bottom to trigger fetch (in pixels)
  dataType?: "tagihan" | "aktivitas" // Which data type to use from result
}

interface UseInfiniteScrollResult {
  data: TransactionData[]
  isLoading: boolean
  hasMore: boolean
  cursor: string | null
  loadMore: () => Promise<void>
  sentinelRef: React.RefObject<HTMLDivElement | null>
}

export function useInfiniteScroll({
  initialData = [],
  initialCursor = null,
  initialHasMore = false,
  fetchMore,
  threshold = 200,
  dataType = "tagihan",
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const [data, setData] = React.useState<TransactionData[]>(initialData)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(initialHasMore)
  const [cursor, setCursor] = React.useState<string | null>(initialCursor)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  const loadMore = React.useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await fetchMore(cursor ?? undefined)
      
      // Merge new data with existing data
      setData(prevData => {
        const mergedData = [...prevData]
        const newData = dataType === "tagihan" ? result.tagihanOnly : result.aktivitasOnly
        
        newData.forEach(newItem => {
          const existingIndex = mergedData.findIndex(d => d.type === newItem.type)
          if (existingIndex >= 0) {
            // Merge items within the same type
            mergedData[existingIndex] = {
              ...mergedData[existingIndex],
              items: [...mergedData[existingIndex].items, ...newItem.items]
            }
          } else {
            // Add new type
            mergedData.push(newItem)
          }
        })
        
        return mergedData
      })
      
      // Update cursor based on data type
      const nextCursor = dataType === "tagihan" ? result.nextCursorTagihan : result.nextCursorTransaksi
      const moreAvailable = dataType === "tagihan" ? result.hasMoreTagihan : result.hasMoreTransaksi
      
      setCursor(nextCursor)
      setHasMore(moreAvailable)
    } catch (error) {
      console.error("Error loading more data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, cursor, fetchMore, dataType])

  // Intersection Observer for infinite scroll
  React.useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, loadMore, threshold])

  return {
    data,
    isLoading,
    hasMore,
    cursor,
    loadMore,
    sentinelRef,
  }
}

// Hook specifically for tagihan (bills)
interface UseInfiniteTagihanOptions {
  role: SantriRole
  initialData?: TransactionData[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export function useInfiniteTagihan({
  role,
  initialData = [],
  initialCursor = null,
  initialHasMore = false,
}: UseInfiniteTagihanOptions): UseInfiniteScrollResult {
  const fetchMore = React.useCallback(async (cursor?: string) => {
    const { getSmkDataPaginated, getSmpDataPaginated, getPondokDataPaginated } = await import("@/app/actions/santri")
    
    switch (role) {
      case "smk":
        return getSmkDataPaginated(cursor)
      case "smp":
        return getSmpDataPaginated(cursor)
      case "pondok":
        return getPondokDataPaginated(cursor)
      default:
        throw new Error(`Unknown role: ${role}`)
    }
  }, [role])

  return useInfiniteScroll({
    role,
    initialData,
    initialCursor,
    initialHasMore,
    fetchMore,
    dataType: "tagihan",
  })
}

// Hook specifically for aktivitas (activity history)
interface UseInfiniteAktivitasOptions {
  role: SantriRole
  initialData?: TransactionData[]
  initialCursor?: string | null
  initialHasMore?: boolean
}

export function useInfiniteAktivitas({
  role,
  initialData = [],
  initialCursor = null,
  initialHasMore = false,
}: UseInfiniteAktivitasOptions): UseInfiniteScrollResult {
  const fetchMore = React.useCallback(async (cursor?: string) => {
    const { getSmkDataPaginated, getSmpDataPaginated, getPondokDataPaginated } = await import("@/app/actions/santri")
    
    switch (role) {
      case "smk":
        return getSmkDataPaginated(undefined, cursor) // Only transaksi cursor
      case "smp":
        return getSmpDataPaginated(undefined, cursor)
      case "pondok":
        return getPondokDataPaginated(undefined, cursor)
      default:
        throw new Error(`Unknown role: ${role}`)
    }
  }, [role])

  return useInfiniteScroll({
    role,
    initialData,
    initialCursor,
    initialHasMore,
    fetchMore,
    dataType: "aktivitas",
  })
}