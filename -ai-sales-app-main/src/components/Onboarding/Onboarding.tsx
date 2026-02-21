import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Search,
  Sparkles,
  Zap,
  ArrowDown,
  Layers,
  MousePointer2,
  FileText,
  CreditCard,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (nextTab?: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'ようこそ！',
      subtitle: '口コミ応援アプリ\n「まなびー」へ',
      description: '現場で使えるノウハウを、短時間で分かりやすく学べます。',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    },
    {
      id: 2,
      title: '情報をひとつに',
      subtitle: '情報をまとめ、探す時間を向き合う時間へ',
      description: '必要な情報を素早く確認して、接客に集中できる状態をつくります。',
      bgColor: 'bg-gradient-to-br from-white to-sky-50',
    },
    {
      id: 3,
      title: '伝わるコツを、順番で学ぶ',
      subtitle: '「口コミの構造」を実践に落とし込む',
      description: 'フック・引き込み・カード説明の流れを理解して、再現性のある接客へ。',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    },
    {
      id: 4,
      title: '準備は完了！',
      subtitle: 'さっそく始めましょう',
      description: 'ノウハウ集で実例を見ながら、明日から使える接客を身につけましょう。',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 font-sans text-slate-900">
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 ${currentSlideData.bgColor} border-4 border-white`}
      >
        <div className="relative min-h-[600px] flex flex-col">
          <div className="absolute top-6 left-12 right-12 h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>

          <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
            {currentSlide === 0 && (
              <div className="text-center space-y-6">
                <img
                  src={`${import.meta.env.BASE_URL}app-icon.png?v=3`}
                  alt="まなびー アイコン"
                  className="w-24 h-24 rounded-[1.5rem] mx-auto shadow-xl object-cover"
                />
                <h1 className="text-5xl font-black tracking-tight whitespace-pre-line">{currentSlideData.title}</h1>
                <h2 className="text-2xl font-bold text-blue-600 whitespace-pre-line">{currentSlideData.subtitle}</h2>
                <p className="text-lg text-slate-500 max-w-md mx-auto">{currentSlideData.description}</p>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="text-center relative">
                <h1 className="text-4xl font-black mb-2 whitespace-pre-line">{currentSlideData.title}</h1>
                <p className="text-slate-500 mb-12">{currentSlideData.description}</p>

                <div className="relative h-64 w-64 mx-auto flex items-center justify-center">
                  {[Search, MessageCircle, Zap, FileText, CreditCard, Calendar].map((Icon, i) => (
                    <div
                      key={i}
                      className="absolute animate-pulse"
                      style={{
                        animation: `converge 2s infinite ease-in-out ${i * 0.2}s`,
                        opacity: 0,
                      }}
                    >
                      <div className="p-3 bg-white rounded-full shadow-md text-blue-400">
                        <Icon size={24} />
                      </div>
                    </div>
                  ))}

                  <div className="z-10 w-24 h-24 rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden bg-white">
                    <img
                      src={`${import.meta.env.BASE_URL}app-icon.png?v=3`}
                      alt="まなびー アイコン"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute w-40 h-40 bg-blue-400/20 rounded-full animate-ping" />
                </div>

                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes converge {
                      0% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1.2); opacity: 0; }
                      20% { opacity: 1; }
                      80% { transform: translate(0, 0) scale(0.5); opacity: 0.5; }
                      100% { transform: translate(0, 0) scale(0.2); opacity: 0; }
                    }
                    .absolute:nth-child(1) { --tw-translate-x: -120px; --tw-translate-y: -100px; }
                    .absolute:nth-child(2) { --tw-translate-x: 120px; --tw-translate-y: -80px; }
                    .absolute:nth-child(3) { --tw-translate-x: -140px; --tw-translate-y: 60px; }
                    .absolute:nth-child(4) { --tw-translate-x: 140px; --tw-translate-y: 80px; }
                    .absolute:nth-child(5) { --tw-translate-x: 0px; --tw-translate-y: -150px; }
                    .absolute:nth-child(6) { --tw-translate-x: 0px; --tw-translate-y: 150px; }
                  `,
                  }}
                />
              </div>
            )}

            {currentSlide === 2 && (
              <div className="text-center flex flex-col items-center">
                <h1 className="text-3xl font-black mb-2 whitespace-pre-line">{currentSlideData.title}</h1>
                <h2 className="text-lg font-bold text-orange-600 mb-8">{currentSlideData.subtitle}</h2>

                <div className="w-full max-w-md space-y-4">
                  <div className="relative mx-auto w-fit py-4">
                    <div className="absolute -left-2 top-2 h-4 w-4 rounded-full bg-white shadow-sm animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="absolute -right-1 top-4 h-3 w-3 rounded-full bg-white shadow-sm animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute left-1/2 -top-2 h-3 w-3 rounded-full bg-white shadow-sm animate-bounce" style={{ animationDelay: '0.5s' }} />

                    <div className="relative flex items-center justify-center">
                      <svg className="absolute w-[200px] h-[100px] text-white drop-shadow-md" viewBox="0 0 200 100" fill="currentColor">
                        <path d="M158.4,45.9c0-12.7-10.3-23-23-23c-1.8,0-3.6,0.2-5.3,0.6c-4.4-8.8-13.4-14.8-23.9-14.8c-10.3,0-19.1,5.8-23.6,14.3c-2.4-1.2-5.1-1.9-8-1.9c-8.9,0-16.3,6.5-17.7,15c-1.2-0.2-2.5-0.3-3.8-0.3c-10,0-18.1,8.1-18.1,18.1c0,10,8.1,18.1,18.1,18.1c1.2,0,2.3-0.1,3.4-0.3c3.6,8,11.7,13.6,21.1,13.6c2.8,0,5.4-0.5,7.8-1.4c4.6,7.5,13,12.5,22.5,12.5c10.3,0,19.3-5.8,23.8-14.5c1.8,0.5,3.7,0.8,5.7,0.8c12.7,0,23-10.3,23-23C161.7,55.3,160.4,50.2,158.4,45.9z" />
                      </svg>

                      <div className="relative z-10 px-8 py-6">
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">口コミの</span>
                        <span className="text-xl font-black text-orange-600 tracking-tighter">構造</span>
                      </div>
                    </div>
                  </div>

                  <ArrowDown className="text-orange-400 animate-bounce mx-auto" />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-blue-500">
                      <Layers className="mx-auto mb-2 text-blue-500" size={20} />
                      <div className="text-xs font-bold">興味を<br />引く</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-green-500">
                      <MousePointer2 className="mx-auto mb-2 text-green-500" size={20} />
                      <div className="text-xs font-bold">理解を<br />深める</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-red-500">
                      <Sparkles className="mx-auto mb-2 text-red-500" size={20} />
                      <div className="text-xs font-bold">行動に<br />つなげる</div>
                    </div>
                  </div>

                  <ArrowDown className="text-orange-400 mx-auto" />

                  <div className="bg-orange-500 p-4 rounded-2xl shadow-lg transform scale-105">
                    <div className="text-white font-bold flex items-center justify-center gap-2">
                      <ShieldCheck /> 実践で使えるノウハウに
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="text-center space-y-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 bg-yellow-400 text-xs font-black px-3 py-1 rounded-full shadow-md animate-bounce">
                    GO!
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-black leading-tight whitespace-pre-line">{currentSlideData.title}</h1>
                  <p className="text-lg text-slate-500">{currentSlideData.description}</p>
                </div>

                <button
                  onClick={() => onComplete('cases')}
                  className="group relative inline-flex items-center gap-3 px-12 py-5 bg-red-500 text-white text-xl font-black rounded-2xl hover:bg-red-600 transition-all shadow-[0_10px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_30px_rgba(239,68,68,0.4)] active:scale-95"
                >
                  ノウハウを見る
                  <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </div>

          <div className="px-12 py-10 flex items-center justify-between">
            <button
              onClick={prevSlide}
              className={`flex items-center gap-1 font-bold transition-all ${
                currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <ChevronLeft size={24} />
              <span>戻る</span>
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={nextSlide}
                className="flex items-center gap-1 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:-translate-y-0.5"
              >
                <span>次へ</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <div className="w-24" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
