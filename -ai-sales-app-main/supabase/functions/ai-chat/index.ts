const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ChatRequest {
  message: string;
  mode: 'customer' | 'staff';
  scenario: string;
  context?: string[];
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, mode, scenario, context = [] }: ChatRequest = await req.json();

    // Use the provided API key
    const apiKey = "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";

    // Create system prompt - AI always plays the customer role
    const systemPrompt = `あなたはアニメイベント会場でグッズを購入し、レジでお会計をしているお客様です。店員のクレジットカード口コミに対して、お客様として自然に反応してください：

【お客様プロフィール】
- 20代男性
- アニメファン、イベント参加者
- アニメグッズを購入中
- クレジットカードは未所持
- ポイントや特典に興味がある
- お得な情報には敏感

【会話スタイル】
- 丁寧で親しみやすい口調
- 店員のカード口コミに対して適切に反応する
- 興味を示したり、疑問を投げかけたりする
- 時には迷いや不安を表現
- 1-2文程度の自然な長さで応答

【店員のカード口コミに対する応答例】
- カード説明に対して：「なるほど、ポイントが貯まるんですね。年会費はかかりますか？」
- 特典説明に対して：「アニメグッズでもポイント付くんですか？それはお得ですね！」
- 申込み案内に対して：「今日申し込むと何か特典ありますか？」
- 迷いを表現：「クレジットカード作ったことないので、ちょっと不安で...」

重要：あなたは常にお客様です。店員のカード口コミに対してお客様として自然に応答してください。店員になってはいけません。`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://bolt.new",
          "X-Title": "AI Sales Skill Teacher"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...context.slice(-8).map((msg, index) => ({
              role: index % 2 === 0 ? "user" : "assistant",
              content: msg
            })),
            {
              role: "user", 
              content: message
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error: ${response.status} - ${errorText}`);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenRouter response:', data);
      
      const aiResponseText = data.choices?.[0]?.message?.content;

      if (!aiResponseText) {
        console.error('No content in API response:', data);
        throw new Error("No response content from AI");
      }

      // Clean up the response
      let cleanResponse = aiResponseText.trim();
      
      // Remove any markdown formatting or quotes
      cleanResponse = cleanResponse.replace(/^["'`]|["'`]$/g, '');
      cleanResponse = cleanResponse.replace(/^\*\*|\*\*$/g, '');
      
      // Ensure response is appropriate length
      if (cleanResponse.length > 200) {
        cleanResponse = cleanResponse.substring(0, 200) + '...';
      }

      return new Response(
        JSON.stringify({ response: cleanResponse }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("OpenRouter API Error:", error);
      
      // Provide varied fallback responses based on context
      const fallbackResponses = [
        "そうですね、とても参考になります。価格はどのくらいでしょうか？",
        "なるほど、それは魅力的ですね。実際に触ってみることはできますか？",
        "使いやすそうですね。カメラの性能はどうですか？",
        "興味深いですね。データ移行は簡単にできますか？",
        "安心しました。保証期間はどのくらいですか？",
        "分かりました。他にもおすすめの機種はありますか？",
        "ありがとうございます。もう少し検討してみます。"
      ];
      
      const contextBasedIndex = (context.length + message.length) % fallbackResponses.length;
      const selectedFallback = fallbackResponses[contextBasedIndex];
      
      return new Response(
        JSON.stringify({ 
          response: selectedFallback,
          fallback: true
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Edge Function Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "システムエラーが発生しました",
        response: "申し訳ございません、システムエラーが発生しました。もう一度お試しください。"
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});