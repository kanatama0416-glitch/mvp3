export class AIService {
  static async generateResponse(
    message: string, 
    mode: 'customer' | 'staff',
    scenario: string,
    context: string[] = []
  ): Promise<string> {
    try {
      const apiKey = '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';

      const systemPrompt = this.getSystemPrompt(mode, scenario);

      const messages: { role: string; content: string }[] = [
        { role: 'system', content: systemPrompt },
      ];

      // Add conversation context (last 8 messages)
      const recentContext = context.slice(-8);
      for (let i = 0; i < recentContext.length; i++) {
        messages.push({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: recentContext[i],
        });
      }

      messages.push({ role: 'user', content: message });

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Sales Skill Teacher',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324',
          messages,
          max_tokens: 200,
          temperature: 0.8,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices?.[0]?.message?.content;

      if (!aiResponseText) {
        console.error('No content in API response:', data);
        throw new Error('No response content from AI');
      }

      let cleanResponse = aiResponseText.trim();
      cleanResponse = cleanResponse.replace(/^["'`]|["'`]$/g, '');
      cleanResponse = cleanResponse.replace(/^\*\*|\*\*$/g, '');

      if (cleanResponse.length > 300) {
        cleanResponse = cleanResponse.substring(0, 300) + '...';
      }

      return cleanResponse;
    } catch (error) {
      console.error('AI Service Request Failed:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return this.getFallbackResponse(mode);
    }
  }

  private static getSystemPrompt(mode: 'customer' | 'staff', scenario: string): string {
    if (mode === 'staff') {
      return `あなたは接客シミュレーションのお客様役です。シナリオ「${scenario}」に基づいて、お客様として自然に反応してください。

【お客様の特徴】
- 自然な日本語で話す
- シナリオに合った感情や要望を表現する
- 1-3文程度の自然な長さで応答する
- 適切なタイミングで質問や要望を出す

重要：あなたは常にお客様です。店員になってはいけません。`;
    } else {
      return `あなたは接客シミュレーションの店員役です。シナリオ「${scenario}」に基づいて、店員として自然に対応してください。

【店員の特徴】
- 丁寧で親しみやすい接客態度
- シナリオに合った適切な対応を行う
- 1-3文程度の自然な長さで応答する
- お客様の要望に的確に応える

重要：あなたは常に店員です。お客様になってはいけません。`;
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