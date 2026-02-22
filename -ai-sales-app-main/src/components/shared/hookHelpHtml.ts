export const HOOK_HELP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>口コミの構造</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
      word-break: break-all;
      margin: 0;
    }

    /* Tailwind utility classes */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .flex-1 { flex: 1 1 0%; }
    .shrink-0 { flex-shrink: 0; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .space-y-3 > * + * { margin-top: 0.75rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-10 > * + * { margin-top: 2.5rem; }
    .w-2 { width: 0.5rem; }
    .w-8 { width: 2rem; }
    .w-12 { width: 3rem; }
    .w-full { width: 100%; }
    .h-6 { height: 1.5rem; }
    .h-8 { height: 2rem; }
    .h-12 { height: 3rem; }
    .max-w-md { max-width: 28rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-12 { margin-top: 3rem; }
    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-05 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
    .pt-1 { padding-top: 0.25rem; }
    .pt-10 { padding-top: 2.5rem; }
    .pb-8 { padding-bottom: 2rem; }
    .text-white { color: #ffffff; }
    .text-blue-400 { color: #60a5fa; }
    .text-blue-600 { color: #2563eb; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-800 { color: #1f2937; }
    .text-green-400 { color: #4ade80; }
    .text-green-600 { color: #16a34a; }
    .text-orange-400 { color: #fb923c; }
    .text-orange-500 { color: #f97316; }
    .text-orange-600 { color: #ea580c; }
    .text-red-500 { color: #ef4444; }
    .text-transparent { color: transparent; }
    .text-yellow-300 { color: #fde047; }
    .bg-white { background-color: #ffffff; }
    .bg-blue-100 { background-color: #dbeafe; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-green-100 { background-color: #dcfce7; }
    .bg-orange-100 { background-color: #ffedd5; }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-yellow-400 { background-color: #facc15; }
    .text-10px { font-size: 10px; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .font-normal { font-weight: 400; }
    .italic { font-style: italic; }
    .text-center { text-align: center; }
    .tracking-widest { letter-spacing: 0.1em; }
    .leading-tight { line-height: 1.25; }
    .leading-snug { line-height: 1.375; }
    .leading-relaxed { line-height: 1.625; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-2xl { border-radius: 1rem; }
    .rounded-3xl { border-radius: 1.5rem; }
    .rounded-full { border-radius: 9999px; }
    .rounded-b-hero { border-bottom-left-radius: 3rem; border-bottom-right-radius: 3rem; }
    .rounded-25rem { border-radius: 2.5rem; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); }
    .shadow-orange-lg { box-shadow: 0 10px 15px -3px rgba(254,215,170,0.5), 0 4px 6px -4px rgba(254,215,170,0.5); }
    .shadow-green-lg { box-shadow: 0 10px 15px -3px rgba(187,247,208,0.5), 0 4px 6px -4px rgba(187,247,208,0.5); }
    .shadow-blue-lg { box-shadow: 0 10px 15px -3px rgba(191,219,254,0.5), 0 4px 6px -4px rgba(191,219,254,0.5); }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .border { border-width: 1px; border-style: solid; }
    .border-b-2 { border-bottom-width: 2px; border-bottom-style: solid; }
    .border-gray-100 { border-color: #f3f4f6; }
    .border-red-200 { border-color: #fecaca; }
    .border-orange-fade { border-color: rgba(249,115,22,0.5); }
    .border-green-fade { border-color: rgba(34,197,94,0.5); }
    .border-blue-fade { border-color: rgba(59,130,246,0.5); }
    .opacity-60 { opacity: 0.6; }
    .opacity-90 { opacity: 0.9; }
    .z-10 { z-index: 10; }
    .relative { position: relative; }
    .bg-gradient-indigo-purple { background-image: linear-gradient(to bottom right, #4f46e5, #7e22ce); }
    .text-gradient-orange-red {
      background-image: linear-gradient(to right, #f97316, #dc2626);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    /* Icon inline svg sizing */
    .icon-sm { display: inline-block; width: 1.25em; height: 1.25em; vertical-align: -0.125em; }

    .fade-in {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .step-line {
      position: relative;
    }
    .step-line::after {
      content: '';
      position: absolute;
      left: 24px;
      top: 48px;
      bottom: -24px;
      width: 2px;
      border-left: 2px dashed #cbd5e1;
      z-index: 0;
    }
    .step-line:last-child::after { display: none; }

    .bubble {
      position: relative;
      background: white;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .bubble::before {
      content: "";
      position: absolute;
      top: 12px;
      left: -8px;
      border-style: solid;
      border-width: 8px 10px 8px 0;
      border-color: transparent white transparent transparent;
    }

    .bg-hook { background: linear-gradient(135deg, #ff9d6c 0%, #ff6200 100%); }
    .bg-lead { background: linear-gradient(135deg, #56d364 0%, #2ea44f 100%); }
    .bg-info { background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%); }
  </style>
</head>

<body class="pb-8">

  <div class="bg-white px-6 pt-10 pb-8 rounded-b-hero shadow-sm mb-6 fade-in" style="animation-delay: 0.1s;">
    <p class="text-blue-600 font-bold text-xs tracking-widest mb-1 text-center">EPOS CARD SALES GUIDE</p>
    <h1 class="text-3xl font-black text-gray-800 text-center leading-tight">
      伝わる！<br><span class="text-gradient-orange-red">口コミの構造</span>
    </h1>
    <div class="mt-4 bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
      <div class="bg-white p-2 rounded-xl shadow-sm">
        <svg class="icon-sm text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121 4.82v12.485c0 .426-.24.815-.622 1.006l-4.875 2.437a1.875 1.875 0 01-1.006.154 1.875 1.875 0 01-.672-.154l-4.993-2.497a.375.375 0 00-.336 0l-3.869 1.935A1.875 1.875 0 013 19.18V6.695c0-.426.24-.816.622-1.006L8.16 2.58zm.234 4.914a.75.75 0 10-1.5 0v8.25a.75.75 0 001.5 0v-8.25zm5.25 1.5a.75.75 0 10-1.5 0v8.25a.75.75 0 001.5 0v-8.25z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-sm font-bold text-gray-600 leading-snug">
        「興味を持つ → 気になる → 納得する」<br>この順番で話してみましょう！
      </p>
    </div>
  </div>

  <div class="px-5 max-w-md mx-auto space-y-10">
    
    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.2s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-hook rounded-2xl flex items-center justify-center text-white shadow-orange-lg">
        <span class="text-xl font-black">1</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-orange-600 font-black text-lg flex items-center gap-2">
          フック
          <span class="text-10px bg-orange-100 px-2 py-05 rounded-md">きっかけ作り</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          まずは相手に足を止めてもらう一言。<br>
          <span class="text-orange-600">興味をもってもらうことが重要</span>です。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.3s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-lead rounded-2xl flex items-center justify-center text-white shadow-green-lg">
        <span class="text-xl font-black">2</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-green-600 font-black text-lg flex items-center gap-2">
          引き込み
          <span class="text-10px bg-green-100 px-2 py-05 rounded-md">自分事にしてもらう</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          相手のメリット（割引・限定特典）を提示。<br>
          <span class="text-green-600">「私に関係ある！」</span>と思ってもらいます。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.4s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-info rounded-2xl flex items-center justify-center text-white shadow-blue-lg">
        <span class="text-xl font-black">3</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-blue-600 font-black text-lg flex items-center gap-2">
          カード説明
          <span class="text-10px bg-blue-100 px-2 py-05 rounded-md">安心・クロージング</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          最後にしっかりとカードのご説明をします。<br>
          <span class="text-blue-600">「じゃあ作ろうかな」</span>を後押しします。
        </p>
      </div>
    </div>

    <div class="mt-12 bg-slate-900 rounded-25rem p-6 shadow-2xl fade-in" style="animation-delay: 0.5s;">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-2 h-6 bg-yellow-400 rounded-full"></div>
        <h3 class="text-white font-black text-lg italic">Talk Example <span class="text-xs font-normal opacity-60">MGAの場合</span></h3>
      </div>

      <div class="space-y-6">
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-orange-fade flex items-center justify-center text-10px font-bold text-orange-400 mt-1">1</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 italic">「MGAのファンクラブ、入ってますか？」</p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-green-fade flex items-center justify-center text-10px font-bold text-green-400 mt-1">2</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 leading-relaxed">
              「このカードで<span class="text-red-500 border-b-2 border-red-200">会費500円オフ</span>になるんです！さらに今日のお会計も<span class="text-red-500 font-black">2,000円引き</span>ですよ！」
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-blue-fade flex items-center justify-center text-10px font-bold text-blue-400 mt-1">3</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800">「入会・年会費はずっと無料です。<br>よろしかったらお作りしましょうか？」</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-indigo-purple rounded-3xl p-6 text-white shadow-xl fade-in" style="animation-delay: 0.6s;">
      <h4 class="font-black text-sm flex items-center gap-2 mb-3">
        <svg class="icon-sm text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clip-rule="evenodd"/>
        </svg>
        接客のコツ
      </h4>
      <ul class="text-xs space-y-3 font-medium opacity-90 leading-relaxed">
        <li class="flex gap-2"><span>●</span> <strong>順番は変えない！</strong> この順番でやってみてください</li>
        <li class="flex gap-2"><span>●</span> <strong>単語を覚える</strong> 自分の言いやすい言い方にアレンジ！</li>
        <li class="flex gap-2"><span>●</span> <strong>接客を楽しむ</strong> お客様との会話を楽しみましょう</li>
      </ul>
    </div>
  </div>

</body>
</html>`;
