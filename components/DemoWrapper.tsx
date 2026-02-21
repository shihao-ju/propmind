'use client'

import { Suspense } from 'react'
import DemoControls from './DemoControls'

export default function DemoWrapper() {
  return (
    <Suspense fallback={null}>
      <DemoControls />
    </Suspense>
  )
}
