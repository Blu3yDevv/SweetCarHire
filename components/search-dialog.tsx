"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Focus the input when the dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        document.getElementById("search-input")?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/fleet?search=${encodeURIComponent(searchQuery)}`)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Search for vehicles, services, or information..."
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-full focus:border-[#e94d97] focus:ring-2 focus:ring-[#e94d97]/30 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Popular searches: SUV, Economy Car, Automatic, Free Delivery</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="bg-[#e94d97] hover:bg-[#d43884] text-white">
              Search
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
