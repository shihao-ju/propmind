'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send } from 'lucide-react'

interface ChatMessage {
  role: 'tenant' | 'ai'
  content: string
}

interface TenantChatProps {
  propertySlug: string
  tenantId: string
  propertyName: string
  propertyAddress: string
  tenantName: string
  unit: string
}

export default function TenantChat({
  propertySlug,
  tenantId,
  propertyName,
  propertyAddress,
  tenantName,
  unit,
}: TenantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'tenant', content: text },
    ]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Add empty AI message that we'll stream into
    setMessages((prev) => [...prev, { role: 'ai', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          propertySlug,
          tenantId,
        }),
      })

      if (!res.ok) {
        throw new Error(`Chat failed: ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const event = JSON.parse(data)
            if (event.type === 'text') {
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last && last.role === 'ai') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + event.content,
                  }
                }
                return updated
              })
            } else if (event.type === 'ticket_created') {
              setTicketId(event.ticketId)
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last && last.role === 'ai' && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: 'Sorry, something went wrong. Please try again.',
          }
        }
        return updated
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Property header */}
      <div className="border-b px-6 py-4 bg-white">
        <h1 className="text-lg font-semibold">{propertyName}</h1>
        <p className="text-sm text-muted-foreground">{propertyAddress}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {tenantName} &middot; Unit {unit}
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-sm">
                Hi {tenantName.split(' ')[0]}! Describe your maintenance issue
                and we&apos;ll get it handled.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'tenant' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] px-4 py-2.5 ${
                  msg.role === 'tenant'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {msg.content}
                  {msg.role === 'ai' && !msg.content && isLoading && (
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce [animation-delay:0.2s]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:0.4s]">
                        .
                      </span>
                    </span>
                  )}
                </p>
              </Card>
            </div>
          ))}
          {ticketId && (
            <div className="text-center">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                Ticket created — your landlord is reviewing vendor options now
              </span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-6 py-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your maintenance issue..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
