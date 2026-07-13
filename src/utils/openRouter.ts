const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string,
  model: string = 'openai/gpt-4o-mini',
  onChunk?: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const systemPrompt: ChatMessage = {
    role: 'system',
    content: `You are an expert physics tutor specializing in Wave Optics. 
You explain concepts clearly with examples, formulas, and real-world applications.
When asked about physics topics, provide detailed explanations with relevant formulas.
You can also help generate study notes on any optics topic.
Keep responses focused on optics but you can answer general physics questions too.
Use LaTeX-style formatting for formulas with $...$ for inline and $$...$$ for display math.

Important guidelines:
- Be encouraging and patient with students
- Break down complex topics step by step
- Use analogies to make concepts relatable
- Suggest practice problems when appropriate
- If the student seems confused, offer alternative explanations`,
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Physics Lab v2',
    },
    body: JSON.stringify({
      model,
      messages: [systemPrompt, ...messages],
      stream: !!onChunk,
      max_tokens: 4096,
    }),
    signal,
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${err}`)
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk
        .split('\n')
        .filter((l) => l.startsWith('data: '))
        .map((l) => l.slice(6))

      for (const line of lines) {
        if (line === '[DONE]') continue
        try {
          const parsed = JSON.parse(line)
          const delta = parsed.choices?.[0]?.delta?.content
          if (delta) {
            fullContent += delta
            onChunk(delta)
          }
        } catch {
          // skip parse errors on partial chunks
        }
      }
    }

    return fullContent
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function generateNotes(
  topic: string,
  apiKey: string
): Promise<string> {
  const prompt = `Generate comprehensive study notes on "${topic}" from Wave Optics. Include:
1. Key concepts and definitions
2. Important formulas with explanations
3. Real-world applications
4. Common misconceptions
5. Practice questions with answers

Format the notes with clear headings and bullet points. Use $$...$$ for formulas.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Physics Lab v2',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter API error (${response.status}): ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
