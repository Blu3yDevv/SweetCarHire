"use client"

import { useEffect } from "react"
import { APP_VERSION } from "@/lib/version"

export function VersionLogger() {
  useEffect(() => {
    console.log(`[v0] Sweet Car Hire v${APP_VERSION}`)
  }, [])

  return null
}
