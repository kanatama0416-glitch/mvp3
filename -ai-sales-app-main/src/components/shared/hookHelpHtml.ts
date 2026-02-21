export const HOOK_HELP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>口コミの構造</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    body {
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
      word-break: break-all;
    }

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

  <div class="bg-white px-6 pt-10 pb-8 rounded-b-[3rem] shadow-sm mb-6 fade-in" style="animation-delay: 0.1s;">
    <p class="text-blue-600 font-bold text-xs tracking-widest mb-1 text-center">EPOS CARD SALES GUIDE</p>
    <h1 class="text-3xl font-black text-gray-800 text-center leading-tight">
      伝わる！<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">口コミの構造</span>
    </h1>
    <div class="mt-4 bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
      <div class="bg-white p-2 rounded-xl shadow-sm">
        <i class="fa-solid fa-route text-orange-500 text-xl"></i>
      </div>
      <p class="text-sm font-bold text-gray-600 leading-snug">
        「興味を持つ → 気になる → 納得する」<br>この順番で話してみましょう！
      </p>
    </div>
  </div>

  <div class="px-5 max-w-md mx-auto space-y-10">
    
    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.2s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-hook rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
        <span class="text-xl font-black">1</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-orange-600 font-black text-lg flex items-center gap-2">
          フック
          <span class="text-[10px] bg-orange-100 px-2 py-0.5 rounded-md">きっかけ作り</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          まずは相手に足を止めてもらう一言。<br>
          <span class="text-orange-600">興味をもってもらうことが重要</span>です。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.3s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-lead rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
        <span class="text-xl font-black">2</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-green-600 font-black text-lg flex items-center gap-2">
          引き込み
          <span class="text-[10px] bg-green-100 px-2 py-0.5 rounded-md">自分事にしてもらう</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          相手のメリット（割引・限定特典）を提示。<br>
          <span class="text-green-600">「私に関係ある！」</span>と思ってもらいます。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.4s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-info rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
        <span class="text-xl font-black">3</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-blue-600 font-black text-lg flex items-center gap-2">
          カード説明
          <span class="text-[10px] bg-blue-100 px-2 py-0.5 rounded-md">安心・クロージング</span>
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          最後にしっかりとカードのご説明をします。<br>
          <span class="text-blue-600">「じゃあ作ろうかな」</span>を後押しします。
        </p>
      </div>
    </div>

    <div class="mt-12 bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl fade-in" style="animation-delay: 0.5s;">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-2 h-6 bg-yellow-400 rounded-full"></div>
        <h3 class="text-white font-black text-lg italic">Talk Example <span class="text-xs font-normal opacity-60">MGAの場合</span></h3>
      </div>

      <div class="space-y-6">
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-orange-500/50 flex items-center justify-center text-[10px] font-bold text-orange-400 mt-1">1</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 italic">「MGAのファンクラブ、入ってますか？」</p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-green-500/50 flex items-center justify-center text-[10px] font-bold text-green-400 mt-1">2</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 leading-relaxed">
              「このカードで<span class="text-red-500 border-b-2 border-red-200">会費500円オフ</span>になるんです！さらに今日のお会計も<span class="text-red-500 font-black">2,000円引き</span>ですよ！」
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center text-[10px] font-bold text-blue-400 mt-1">3</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800">「入会・年会費はずっと無料です。<br>よろしかったらお作りしましょうか？」</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl fade-in" style="animation-delay: 0.6s;">
      <h4 class="font-black text-sm flex items-center gap-2 mb-3">
        <i class="fa-solid fa-wand-magic-sparkles text-yellow-300"></i>
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
