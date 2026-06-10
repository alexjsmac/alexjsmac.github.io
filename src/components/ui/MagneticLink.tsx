import type { ReactNode } from 'react'
import { useMagnetic } from '@/lib/useMagnetic'

/** Inline wrapper that leans toward the pointer — for nav links and CTAs. */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useMagnetic<HTMLSpanElement>()
  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}
