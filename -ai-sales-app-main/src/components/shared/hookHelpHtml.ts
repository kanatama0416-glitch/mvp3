export const HOOK_HELP_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>口コミの構造ガイド</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
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
    .step-line { position: relative; }
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
    .bg-ice { background: linear-gradient(135deg, #fce38a 0%, #f38181 100%); }
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
        <i class="fa-solid fa-wand-magic-sparkles text-orange-500 text-xl"></i>
      </div>
      <p class="text-sm font-bold text-gray-600 leading-snug">
        「心の壁を溶かす → 興味を持つ → 納得する」<br>この流れが「達人」のパターン！
      </p>
    </div>
  </div>

  <div class="px-5 max-w-md mx-auto space-y-10">
    
    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.2s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-100">
        <span class="text-xl font-black">0</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-pink-600 font-black text-lg flex items-center gap-2">
          アイスブレイク
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          いきなり本題に入らず、<span class="text-pink-600">まずは何気ない雑談</span>から。<br>お客様との会話を楽しむ土台を整えましょう。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.3s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-hook rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
        <span class="text-xl font-black">1</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-orange-600 font-black text-lg flex items-center gap-2">
          フック
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          会話の流れで、自然にカードの話題へ。<span class="text-orange-600"><br>相手の関心をこちらに向ける</span>きっかけ作り。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.4s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-lead rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
        <span class="text-xl font-black">2</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-green-600 font-black text-lg flex items-center gap-2">
          引き込み
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          相手のメリットを提示。<span class="text-green-600"><br>「私にとってお得！」</span>と自分事にしてもらいます。
        </p>
      </div>
    </div>

    <div class="step-line flex gap-4 fade-in" style="animation-delay: 0.5s;">
      <div class="z-10 shrink-0 w-12 h-12 bg-info rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
        <span class="text-xl font-black">3</span>
      </div>
      <div class="flex-1 pt-1">
        <h2 class="text-blue-600 font-black text-lg flex items-center gap-2">
          カード説明
        </h2>
        <p class="mt-2 text-sm font-bold text-gray-700 leading-relaxed">
          最後に、ずっと無料などの安心材料を説明。<span class="text-blue-600"><br>「じゃあ作ろうかな」</span>を後押しします。
        </p>
      </div>
    </div>

    <div class="mt-12 bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl fade-in" style="animation-delay: 0.6s;">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-2 h-6 bg-yellow-400 rounded-full"></div>
        <h3 class="text-white font-black text-lg italic">Talk Example <span class="text-xs font-normal opacity-60">MGAの場合</span></h3>
      </div>

      <div class="space-y-6">
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-pink-500/50 flex items-center justify-center text-[10px] font-bold text-pink-400 mt-1">0</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800">「今日ライブですか？楽しみですね！グッズ、たくさん買われるんですか？」</p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-orange-500/50 flex items-center justify-center text-[10px] font-bold text-orange-400 mt-1">1</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 italic">「それなら、ファンクラブも入ってます？」</p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-green-500/50 flex items-center justify-center text-[10px] font-bold text-green-400 mt-1">2</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800 leading-relaxed">
              「このカード、<span class="text-red-500 border-b-2 border-red-200">会費500円オフ</span>になるんです！今日のお会計も<span class="text-red-500 font-black">2,000円引き</span>になりますよ！」
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="shrink-0 w-8 h-8 rounded-full border border-blue-500/50 flex items-center justify-center text-[10px] font-bold text-blue-400 mt-1">3</div>
          <div class="bubble">
            <p class="text-sm font-bold text-gray-800">「入会・年会費はずっと無料です。<br>20分で作れますが、お作りしましょうか？」</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl fade-in" style="animation-delay: 0.7s;">
      <h4 class="font-black text-sm flex items-center gap-2 mb-5">
        <i class="fa-solid fa-lightbulb text-yellow-300"></i>
        達人のコツ
      </h4>
      <div class="space-y-5">
        <div>
          <p class="text-sm font-black mb-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            まずは笑顔で！
          </p>
          <p class="text-xs font-medium opacity-80 leading-relaxed ml-3.5">
            雑談でお客さまとの距離を縮めるのが成功の近道。
          </p>
        </div>
        <div>
          <p class="text-sm font-black mb-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            「売る」より「教える」
          </p>
          <p class="text-xs font-medium opacity-80 leading-relaxed ml-3.5">
            お得な情報を教えてあげる感覚で話すと◎
          </p>
        </div>
        <div>
          <p class="text-sm font-black mb-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
            共感する
          </p>
          <p class="text-xs font-medium opacity-80 leading-relaxed ml-3.5">
            お客さまの気持ちに寄り添いながら、「楽しみですね！」「可愛いですよね！」を大切に。
          </p>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;
