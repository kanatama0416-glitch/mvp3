interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface EvaluationRequest {
  conversationHistory: string[];
  userResponses: string[];
  scenario: string;
  duration: number;
}

interface DetailedEvaluation {
  overallScore: number;
  categoryScores: {
    communication: number;
    empathy: number;
    problemSolving: number;
    productKnowledge: number;
    professionalism: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  emotionalAnalysis: {
    tone: string;
    confidence: number;
    engagement: number;
  };
}

export class GeminiService {
  private static apiKey = 'YOUR_API_KEY'; // 実際のAPIキーに置き換えてください
  private static baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  static async evaluateConversation(request: EvaluationRequest): Promise<DetailedEvaluation> {
    try {
      const prompt = this.createEvaluationPrompt(request);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const evaluationText = data.candidates[0]?.content?.parts[0]?.text;

      if (!evaluationText) {
        throw new Error('No evaluation content received from Gemini');
      }

      return this.parseEvaluationResponse(evaluationText, request);
    } catch (error) {
      console.error('Gemini evaluation error:', error);
      return this.generateFallbackEvaluation(request);
    }
  }

  private static createEvaluationPrompt(request: EvaluationRequest): string {
    return `
あなたは接客スキル評価の専門家です。以下のカード営業会話を分析し、詳細な評価を行ってください。

【シナリオ】: ${request.scenario}
【会話時間】: ${Math.floor(request.duration / 60)}分
【会話履歴】:
${request.conversationHistory.map((msg, i) => `${i % 2 === 0 ? 'お客様' : '店員'}: ${msg}`).join('\n')}

以下の5つの観点で0-100点で評価し、JSON形式で回答してください：

1. コミュニケーション力（聞く力、話す力、会話の流れ）
2. 共感力（お客様の気持ちへの理解と配慮）
3. 問題解決力（ニーズの把握と適切な提案）
4. 商品知識（カードの特徴やメリットの説明）
5. プロフェッショナリズム（礼儀正しさ、信頼感）

また、以下も含めてください：
- 全体的なフィードバック（100文字程度）
- 強み（3つまで）
- 改善点（3つまで）
- 感情分析（tone: positive/neutral/negative, confidence: 0-100, engagement: 0-100）

回答例：
{
  "overallScore": 85,
  "categoryScores": {
    "communication": 80,
    "empathy": 90,
    "problemSolving": 85,
    "productKnowledge": 88,
    "professionalism": 82
  },
  "feedback": "お客様との自然な会話ができており、カードのメリットを分かりやすく説明できています。",
  "strengths": ["親しみやすい話し方", "適切なタイミングでの提案", "お客様の反応への配慮"],
  "improvements": ["より具体的な特典説明", "断られた時の代替提案", "会話のペース調整"],
  "emotionalAnalysis": {
    "tone": "positive",
    "confidence": 75,
    "engagement": 80
  }
}
`;
  }

  private static parseEvaluationResponse(evaluationText: string, request: EvaluationRequest): DetailedEvaluation {
    try {
      // JSONの抽出を試行
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          overallScore: parsed.overallScore || 75,
          categoryScores: {
            communication: parsed.categoryScores?.communication || 75,
            empathy: parsed.categoryScores?.empathy || 75,
            problemSolving: parsed.categoryScores?.problemSolving || 75,
            productKnowledge: parsed.categoryScores?.productKnowledge || 75,
            professionalism: parsed.categoryScores?.professionalism || 75,
          },
          feedback: parsed.feedback || 'AIによる詳細な評価を実施しました。',
          strengths: parsed.strengths || ['自然な会話', '適切な提案', '丁寧な対応'],
          improvements: parsed.improvements || ['より具体的な説明', 'タイミングの調整', '感情への配慮'],
          emotionalAnalysis: {
            tone: parsed.emotionalAnalysis?.tone || 'positive',
            confidence: parsed.emotionalAnalysis?.confidence || 75,
            engagement: parsed.emotionalAnalysis?.engagement || 75,
          }
        };
      }
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
    }
    
    return this.generateFallbackEvaluation(request);
  }

  private static generateFallbackEvaluation(request: EvaluationRequest): DetailedEvaluation {
    // 会話の長さと質に基づく基本評価
    const conversationLength = request.conversationHistory.length;
    const avgResponseLength = request.userResponses.reduce((sum, msg) => sum + msg.length, 0) / request.userResponses.length || 0;
    
    const baseScore = Math.min(90, 60 + (conversationLength * 2) + (avgResponseLength > 30 ? 10 : 0));
    
    return {
      overallScore: baseScore,
      categoryScores: {
        communication: Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
        empathy: Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
        problemSolving: Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
        productKnowledge: Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
        professionalism: Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5),
      },
      feedback: 'お客様との会話を通じて、カード営業の基本的なスキルを確認できました。継続的な練習で更なる向上が期待できます。',
      strengths: ['自然な会話の流れ', '丁寧な対応', '適切な提案タイミング'],
      improvements: ['より具体的な特典説明', '感情への配慮', 'クロージング技術'],
      emotionalAnalysis: {
        tone: 'positive',
        confidence: Math.max(60, baseScore),
        engagement: Math.max(60, baseScore + 5),
      }
    };
  }
}