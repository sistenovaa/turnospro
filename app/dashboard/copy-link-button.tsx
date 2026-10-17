'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/b/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <Button size="sm" onClick={handleCopy} className="flex-1 sm:flex-initial">
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copiar link
        </>
      )}
    </Button>
  )
}