import React, { useMemo, useState } from 'react';
import { Bot, Leaf, Send, User } from 'lucide-react';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
}

export default function Consultation() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'こんにちは。接客やカード案内の悩みを気軽に相談してください。',
      time: '09:12'
    },
    {
      id: 'm2',
      role: 'user',
      text: '忙しい時間帯でも自然に声をかけるコツはありますか？',
      time: '09:13'
    },
    {
      id: 'm3',
      role: 'assistant',
      text: '短く「確認→共感→提案」の順に。例:「今お急ぎですよね。お会計後に30秒だけご案内いいですか？」',
      time: '09:13'
    }
  ]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMessage: ChatMessage = {
      id: `a-${Date.now() + 1}`,
      role: 'assistant',
      text: 'ありがとうございます。状況の一言だけ教えてもらえれば、使えるフレーズを提案します。',
      time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
  };

  const messageRows = useMemo(() => messages, [messages]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">相談コーナー</h1>
          <p className="text-gray-600 mt-1">チャット形式で気軽に相談できます</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-success-green bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          <Leaf className="w-4 h-4" />
          <span>オンライン</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
          <div className="w-10 h-10 rounded-full bg-success-green text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">AI相談アシスタント</p>
            <p className="font-semibold text-gray-900">リアルな接客の悩みを一緒に整理します</p>
          </div>
        </div>

        <div className="px-6 py-5 bg-gradient-to-b from-green-50/40 via-white to-white">
          <div className="space-y-4">
            {messageRows.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-full bg-green-100 text-success-green flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[72%] space-y-1 ${message.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-success-green text-white rounded-br-md'
                        : 'bg-white border border-green-100 text-gray-700 rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </div>
                  <p className={`text-xs text-gray-400 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.time}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-9 h-9 rounded-full bg-green-100 text-success-green flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">相談内容</label>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder="例: 断られた後の自然なフォローを教えてください"
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-success-green focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-5 py-3 bg-success-green text-white rounded-xl hover:bg-emerald-green transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm font-semibold">送信</span>
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
            <span>入力内容はローカルでのみ表示されます</span>
            <span className="text-success-green">ヒント: 具体的な場面を1文添える</span>
          </div>
        </div>
      </div>
    </div>
  );
}