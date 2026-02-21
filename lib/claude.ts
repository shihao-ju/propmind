import Anthropic from '@anthropic-ai/sdk'
import { Property, Tenant } from './types'

export const TOOLS: Anthropic.Tool[] = [
  {
    name: 'classify_issue',
    description:
      'Classify the maintenance issue type and urgency. Call this once you understand the problem.',
    input_schema: {
      type: 'object' as const,
      properties: {
        issue_type: {
          type: 'string',
          enum: [
            'plumbing',
            'electrical',
            'hvac',
            'appliance',
            'structural',
            'pest',
            'other',
          ],
        },
        urgency: {
          type: 'string',
          enum: ['emergency', 'medium', 'low'],
          description:
            'emergency=flooding/no heat in winter/gas smell, medium=leaks/broken appliances/AC out, low=cosmetic/minor',
        },
        summary: {
          type: 'string',
          description:
            'One-sentence plain English summary of the issue for the landlord',
        },
        needs_more_info: {
          type: 'boolean',
          description:
            'Set true ONLY if you are missing critical info needed to classify. If you have enough to classify, set false.',
        },
        follow_up_question: {
          type: 'string',
          description:
            'If needs_more_info is true: the single most important question to ask. Must be one question only.',
        },
      },
      required: ['issue_type', 'urgency', 'summary', 'needs_more_info'],
    },
  },
  {
    name: 'create_ticket',
    description:
      'Create a maintenance ticket in the system. Call this after classify_issue when needs_more_info is false.',
    input_schema: {
      type: 'object' as const,
      properties: {
        issue_type: { type: 'string' },
        urgency: { type: 'string' },
        summary: { type: 'string' },
        raw_message: {
          type: 'string',
          description: "The tenant's original message verbatim",
        },
        property_id: { type: 'string' },
        tenant_id: { type: 'string' },
        tenant_name: { type: 'string' },
        unit: { type: 'string' },
      },
      required: [
        'issue_type',
        'urgency',
        'summary',
        'raw_message',
        'property_id',
        'tenant_id',
        'tenant_name',
        'unit',
      ],
    },
  },
]

export function buildSystemPrompt(property: Property, tenant: Tenant): string {
  return `You are PropMind, an AI property manager assistant helping tenants at ${property.name} in ${property.city}, ${property.state}.
You are speaking with: ${tenant.name}, Unit ${tenant.unit}.

YOUR WORKFLOW — follow this exactly:
1. Read the tenant's message
2. If you are missing critical info to classify the issue, call classify_issue with needs_more_info: true and follow_up_question set
3. If you have enough info, call classify_issue with needs_more_info: false, then immediately call create_ticket
4. After create_ticket succeeds, tell the tenant their request was received and a repair will be scheduled

COMPLETION REQUIREMENT: The job is NOT done until create_ticket has been called and returned a ticket_id.
Do NOT stop after classify_issue. Do NOT stop after asking a follow-up question without calling the tool.

URGENCY RULES:
- emergency: flooding, gas smell, no heat (winter), security breach → act immediately
- medium: active leaks, broken HVAC, broken appliance → within 48 hours
- low: cosmetic damage, minor issues → within 1 week

CONTEXT for create_ticket:
- property_id: ${property.id}
- tenant_id: ${tenant.id}
- tenant_name: ${tenant.name}
- unit: ${tenant.unit}

TONE: Warm, concise, professional. Max 2 sentences per response to the tenant.`
}
