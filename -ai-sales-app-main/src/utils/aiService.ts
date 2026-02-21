interface ChatResponse {
  response: string;
  error?: string;
  fallback?: string;
}

export class AIService {
  private static baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  
  static async generateResponse(
    message: string, 
    mode: 'customer' | 'staff',
    scenario: string,
    context: string[] = []
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode,
          scenario,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      if (data.error) {
        console.error('AI Service Error:', data.error);
        // If there's an error but we have a fallback response, use it
        if (data.response) {
          return data.response;
        }
        return data.fallback || this.getFallbackResponse(mode);
      }
      
      return data.response;
    } catch (error) {
      console.error('AI Service Request Failed:', error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return this.getFallbackResponse(mode);
    }
  }

  private static getFallbackResponse(mode: 'customer' | 'staff'): string {
    const fallbacks = {
      customer: [
        'そうですね、もう少し詳しく教えていただけますか？',
        'なるほど、年会費はどのくらいでしょうか？',
        'ポイント還元率はどのくらいですか？',
        'ありがとうございます。検討してみます。'
      ],
      staff: [
        'ありがとうございます。カードの詳細をご説明させていただきますね。',
        'かしこまりました。お客様に最適なカードをご案内いたします。',
        'そうですね、その点について詳しくお話しします。',
        'お客様のライフスタイルに合った最適なカードをご案内いたします。'
      ]
    };
    
    const modeResponses = fallbacks[mode];
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  }
}