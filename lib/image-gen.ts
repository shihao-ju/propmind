interface GenerateImageOptions {
  width?: number
  height?: number
  model?: string
}

interface MiniMaxImageResponse {
  base_resp?: {
    status_code: number
    status_msg: string
  }
  data?: {
    image_url: string
  }
}

export async function generateImage(
  prompt: string,
  options: GenerateImageOptions = {},
): Promise<string | null> {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) {
    console.error('MINIMAX_API_KEY is not set')
    return null
  }

  const { width = 1024, height = 1024, model = 'image-01' } = options

  try {
    const res = await fetch('https://api.minimaxi.chat/v1/image/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        width,
        height,
      }),
    })

    if (!res.ok) {
      console.error('MiniMax API error:', res.status, await res.text())
      return null
    }

    const data: MiniMaxImageResponse = await res.json()

    if (data.base_resp?.status_code !== 0) {
      console.error('MiniMax API error:', data.base_resp?.status_msg)
      return null
    }

    return data.data?.image_url ?? null
  } catch (error) {
    console.error('Failed to generate image:', error)
    return null
  }
}
