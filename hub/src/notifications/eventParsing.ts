import { isObject } from '@hapi/protocol'
import type { SyncEvent } from '../sync/syncEngine'

type EventEnvelope = {
    type?: unknown
    data?: unknown
}

function extractEventEnvelope(message: unknown): EventEnvelope | null {
    if (!isObject(message)) {
        return null
    }

    if (message.type === 'event') {
        return message as EventEnvelope
    }

    const content = message.content
    if (!isObject(content) || content.type !== 'event') {
        return null
    }

    return content as EventEnvelope
}

export function extractMessageEventType(event: SyncEvent): string | null {
    if (event.type !== 'message-received') {
        return null
    }

    const message = event.message?.content
    const envelope = extractEventEnvelope(message)
    if (!envelope) {
        return null
    }

    const data = isObject(envelope.data) ? envelope.data : null
    const eventType = data?.type
    return typeof eventType === 'string' ? eventType : null
}

/**
 * Extract text content from assistant message
 */
export function extractAssistantMessageText(event: SyncEvent): string | null {
    if (event.type !== 'message-received') {
        return null
    }

    const content = event.message?.content
    console.log('[extractAssistantMessageText] Content:', JSON.stringify(content).substring(0, 200))

    if (!isObject(content)) {
        console.log('[extractAssistantMessageText] Content is not an object')
        return null
    }

    // Check if this is an assistant message
    const role = content.role
    console.log(`[extractAssistantMessageText] Role: ${role}`)

    if (role !== 'assistant' && role !== 'agent') {
        console.log(`[extractAssistantMessageText] Not an assistant/agent message`)
        return null
    }

    // Extract text from content
    const messageContent = content.content
    if (!isObject(messageContent)) {
        console.log('[extractAssistantMessageText] messageContent is not an object')
        return null
    }

    // Handle text content (from external sources like telegram-bot)
    if (messageContent.type === 'text' && typeof messageContent.text === 'string') {
        console.log('[extractAssistantMessageText] Found text content')
        return messageContent.text
    }

    // Handle output content (from CLI/agent)
    if (messageContent.type === 'output') {
        console.log('[extractAssistantMessageText] Found output content')
        const outputData = messageContent.data
        console.log('[extractAssistantMessageText] outputData:', JSON.stringify(outputData).substring(0, 300))
        if (isObject(outputData)) {
            console.log('[extractAssistantMessageText] outputData keys:', Object.keys(outputData))
            // Try to extract text from various output formats
            // Format 1: { type: 'text', text: '...' }
            if (outputData.type === 'text' && typeof outputData.text === 'string') {
                console.log('[extractAssistantMessageText] Found format 1')
                return outputData.text
            }
            // Format 2: { message: { content: [...] } }
            const message = outputData.message
            if (isObject(message) && Array.isArray(message.content)) {
                console.log('[extractAssistantMessageText] Found format 2')
                const texts: string[] = []
                for (const block of message.content) {
                    if (isObject(block) && block.type === 'text' && typeof block.text === 'string') {
                        texts.push(block.text)
                    }
                }
                if (texts.length > 0) {
                    return texts.join('\n')
                }
            }
            // Format 3: Direct text in data
            if (typeof outputData.text === 'string') {
                console.log('[extractAssistantMessageText] Found format 3')
                return outputData.text
            }
            // Format 4: Look for content array directly in outputData
            if (Array.isArray(outputData.content)) {
                console.log('[extractAssistantMessageText] Found format 4')
                const texts: string[] = []
                for (const block of outputData.content) {
                    if (isObject(block) && block.type === 'text' && typeof block.text === 'string') {
                        texts.push(block.text)
                    }
                }
                if (texts.length > 0) {
                    return texts.join('\n')
                }
            }
        }
    }

    // Handle content array (Claude format)
    if (Array.isArray(messageContent.content)) {
        console.log('[extractAssistantMessageText] Found content array')
        const texts: string[] = []
        for (const block of messageContent.content) {
            if (isObject(block) && block.type === 'text' && typeof block.text === 'string') {
                texts.push(block.text)
            }
        }
        if (texts.length > 0) {
            return texts.join('\n')
        }
    }

    console.log('[extractAssistantMessageText] Could not extract text')
    return null
}
