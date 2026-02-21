import { NextRequest } from 'next/server'
import { client, TOOLS, buildSystemPrompt } from '@/lib/claude'
import { PROPERTIES, TENANTS, tickets } from '@/lib/store'
import { getMockVendors } from '@/lib/vendors'
import { IssueType, Urgency } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { messages, propertySlug, tenantId } = await req.json()

  const property = PROPERTIES.find((p) => p.slug === propertySlug)
  const tenant = TENANTS.find((t) => t.id === tenantId)

  if (!property || !tenant) {
    return new Response(
      JSON.stringify({ error: 'Property or tenant not found' }),
      { status: 404 }
    )
  }

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  function send(data: Record<string, unknown>) {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  // Convert frontend messages to Anthropic format
  const anthropicMessages = messages.map(
    (m: { role: string; content: string }) => ({
      role: m.role === 'tenant' ? 'user' : ('assistant' as const),
      content: m.content,
    })
  )

  ;(async () => {
    try {
      let conversationMessages = anthropicMessages
      let continueLoop = true
      let ticketCreated = false
      let iterations = 0
      const MAX_ITERATIONS = 6 // Safety cap — triage is 2-4 turns max

      while (continueLoop && !ticketCreated && iterations < MAX_ITERATIONS) {
        iterations++
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: buildSystemPrompt(property, tenant),
          tools: TOOLS,
          messages: conversationMessages,
        })

        // Send text blocks to client
        for (const block of response.content) {
          if (block.type === 'text' && block.text) {
            send({ type: 'text', content: block.text })
          }
        }

        if (response.stop_reason === 'tool_use') {
          const toolUseBlock = response.content.find(
            (b) => b.type === 'tool_use'
          )
          if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
            continueLoop = false
            break
          }

          let toolResultContent = ''

          console.log(
            `[tool_call] ${toolUseBlock.name}`,
            JSON.stringify(toolUseBlock.input)
          )
          send({
            type: 'tool_call',
            tool: toolUseBlock.name,
            input: toolUseBlock.input,
          })

          // --- classify_issue ---
          if (toolUseBlock.name === 'classify_issue') {
            const input = toolUseBlock.input as {
              issue_type: string
              urgency: string
              summary: string
              needs_more_info: boolean
              follow_up_question?: string
            }

            if (input.needs_more_info) {
              toolResultContent =
                'Follow-up question asked. Waiting for tenant response.'
              send({ type: 'status', status: 'gathering_info' })
              // Don't break — let model generate the follow-up text
            } else {
              toolResultContent = JSON.stringify({
                classified: true,
                issue_type: input.issue_type,
                urgency: input.urgency,
              })
              send({
                type: 'status',
                status: 'triaged',
                data: input,
              })
              // Loop continues → model will call create_ticket
            }
          }

          // --- create_ticket ---
          if (toolUseBlock.name === 'create_ticket') {
            const input = toolUseBlock.input as {
              issue_type: string
              urgency: string
              summary: string
              raw_message: string
              property_id: string
              tenant_id: string
              tenant_name: string
              unit: string
            }

            const ticketId = `ticket-${Date.now()}`
            const vendors = getMockVendors(input.issue_type, property.zip)

            // Capture conversation history for the ticket
            const ticketMessages = messages.map(
              (m: { role: string; content: string }) => ({
                role: m.role as 'tenant' | 'ai',
                content: m.content,
                timestamp: new Date(),
              })
            )

            const newTicket = {
              id: ticketId,
              propertyId: input.property_id || property.id,
              tenantId: input.tenant_id || tenant.id,
              tenantName: input.tenant_name || tenant.name,
              unit: input.unit || tenant.unit,
              issueType: input.issue_type as IssueType,
              urgency: input.urgency as Urgency,
              summary: input.summary,
              rawMessage: input.raw_message,
              status: 'awaiting_approval' as const,
              messages: ticketMessages,
              vendors,
              createdAt: new Date(),
              updatedAt: new Date(),
            }

            tickets.set(ticketId, newTicket)

            // Verify independently — never trust self-report
            const verified = tickets.get(ticketId)
            if (!verified) {
              toolResultContent = JSON.stringify({
                error: 'Ticket creation failed — store write failed',
              })
            } else {
              toolResultContent = JSON.stringify({
                ticket_id: ticketId,
                created: true,
                status: 'awaiting_approval',
              })
              ticketCreated = true
              send({
                type: 'ticket_created',
                ticketId,
                ticket: newTicket,
              })
            }
          }

          // Feed tool result back for next iteration
          conversationMessages = [
            ...conversationMessages,
            { role: 'assistant' as const, content: response.content },
            {
              role: 'user' as const,
              content: [
                {
                  type: 'tool_result' as const,
                  tool_use_id: toolUseBlock.id,
                  content: toolResultContent,
                },
              ],
            },
          ]

          // If needs_more_info, we still want the model to produce the follow-up text
          // so let the loop continue one more time
          if (
            toolUseBlock.name === 'classify_issue' &&
            (toolUseBlock.input as { needs_more_info: boolean }).needs_more_info
          ) {
            // One more iteration to get the follow-up question text, then stop
            const followUpResponse = await client.messages.create({
              model: 'claude-sonnet-4-6',
              max_tokens: 1024,
              system: buildSystemPrompt(property, tenant),
              tools: TOOLS,
              messages: conversationMessages,
            })

            for (const block of followUpResponse.content) {
              if (block.type === 'text' && block.text) {
                send({ type: 'text', content: block.text })
              }
            }
            continueLoop = false
          }
        } else {
          // stop_reason === 'end_turn' — model finished without tool use
          continueLoop = false
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error'
      console.error('[chat error]', message)
      writer.write(
        encoder.encode(
          `data: ${JSON.stringify({ type: 'error', message })}\n\n`
        )
      )
    } finally {
      writer.write(encoder.encode('data: [DONE]\n\n'))
      writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
