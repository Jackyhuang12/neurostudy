/* ============================================================
   绁炵粡澶栫瀛︿範缃?路 娓叉煋涓庝氦浜掗€昏緫
   ============================================================ */
(function(){
  "use strict";

  const $app = document.getElementById("app");
  const $title = document.getElementById("page-title");
  const $input = document.getElementById("search-input");
  const $drop = document.getElementById("search-drop");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));

  const PAGES = {
    home:    { title:"绁炵粡澶栫瀛︿範缃?,       label:"棣栭〉鎬昏" },
    visual:  { title:"涓€鍥剧湅鎳傚ぇ鑴?,         label:"涓€鍥剧湅鎳? },
    path:    { title:"瀛︿範璺緞",             label:"瀛︿範璺緞" },
    hospital:{ title:"涓婃捣鍖诲ぇ鍖婚櫌绁炵粡澶栫",  label:"鍖婚櫌瀛︾" },
    diseases:{ title:"鐥呯鐭ヨ瘑搴?,           label:"鐥呯鐭ヨ瘑搴? },
    anatomy: { title:"瑙ｅ墫鍥捐氨",             label:"瑙ｅ墫鍥捐氨" },
    imaging: { title:"鑴戝奖鍍忓鍏ラ棬",         label:"褰卞儚瀛﹀叆闂? },
    surgery: { title:"鎵嬫湳鏂瑰紡璇﹁В",          label:"鎵嬫湳鏂瑰紡" },
    videos:  { title:"瑙嗛璧勬簮瀵艰埅",          label:"瑙嗛璧勬簮" }
  };

  let current = "home";
  let diseaseFilter = "all";
  let sxFilter = "all";
  let brainRegion = "frontal";
  let sequenceId = "t1";

  /* ---------- 宸ュ叿 ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const chip = (level) => level === "杩涢樁"
    ? '<span class="chip chip-adv">杩涢樁</span>'
    : '<span class="chip chip-basic">鍩虹</span>';

  function go(page){
    current = page;
    location.hash = page;
    $title.textContent = PAGES[page].title;
    navItems.forEach(n => n.classList.toggle("active", n.dataset.page === page));
    render();
    window.scrollTo({top:0});
  }

  /* ---------- 棣栭〉 ---------- */
  function renderHome(){
    const nDis = DISEASE_FLAT.length, nAnat = ANATOMY.length, nSx = SURGERY_FLAT.length, nVid = VIDEOS.reduce((a,c)=>a+c.items.length,0);
    $app.innerHTML = `
      <div class="hero">
        <h2>鍏堢湅鎳傦紝鍐嶅娣?/h2>
        <p>闈㈠悜娌℃湁鍖诲鑳屾櫙鐨勫涔犺€咃細鍏堢敤鍥惧缓绔嬪ぇ鑴戙€佺棁鐘朵笌褰卞儚鐨勭洿瑙夛紝鍐嶈繘鍏ョ梾绉嶃€佽В鍓栧拰鎵嬫湳銆傛瘡涓笓涓氭蹇甸兘灏介噺鍥炵瓟涓変釜闂鈥斺€斿畠鏄粈涔堛€佷负浠€涔堥噸瑕併€佷笅涓€姝ョ湅浠€涔堛€?/p>
        <div class="tags">
          <span>馃 鍥捐В寮忓叆闂?/span><span>馃Р MRI / MRA 涓撻</span><span>馃摉 ${nDis} 涓梾绉?/span><span>馃З ${nAnat} 寮犺В鍓栧浘璋?/span><span>馃敩 ${nSx} 绫绘墜鏈瑙?/span><span>馃幀 ${nVid} 涓祫婧愬叆鍙?/span>
        </div>
      </div>
      <div class="grid4">
        <div class="sect-card" onclick="NS.go('visual')"><div class="big">馃</div><b>涓€鍥剧湅鎳傚ぇ鑴?/b><p>鐐硅剳鍖虹湅鍔熻兘銆佸父瑙佸彈鎹熻〃鐜颁笌妫€鏌ユ€濊矾銆傚厛寤虹珛鈥滀綅缃€斿姛鑳解€旂棁鐘垛€濈殑鍦板浘銆?/p><span class="go">寮€濮?鈫?/span></div>
        <div class="sect-card" onclick="NS.go('imaging')"><div class="big">馃Р</div><b>褰卞儚瀛﹀叆闂?/b><p>CT銆丮RI銆丮RA銆丆TA銆丏SA 鎬庝箞閫夛紱T1/T2/FLAIR/DWI/SWI 鎬庝箞鐪嬨€?/p><span class="go">寮€濮?鈫?/span></div>
        <div class="sect-card" onclick="NS.go('hospital')"><div class="big">馃彞</div><b>鍖婚櫌瀛︾</b><p>绉戝瀹氫綅銆佸叚澶т簹涓撶銆侀櫌鍐呬笌鍥介檯鏈嶅姟銆佹牳蹇冪梾绉嶄笌鐗硅壊鎶€鏈€佽浆璇婅鑼冦€佸煿璁鍒掆€斺€旀柊鍏ョ蹇呰銆?/p><span class="go">杩涘叆 鈫?/span></div>
        <div class="sect-card" onclick="NS.go('diseases')"><div class="big">馃摉</div><b>鐥呯鐭ヨ瘑搴?/b><p>棰呰剳鎹熶激 路 鑴戣绠＄梾 路 棰呭唴鑲跨槫 路 鑴婃煴鑴婇珦 路 鍔熻兘绁炲 路 鍏堝ぉ涓庢劅鏌擄紝鎸夆€滃熀纭€/杩涢樁鈥濆垎灞傜簿璇伙紝馃彞 鏍囪鍖诲ぇ閲嶇偣鐥呯銆?/p><span class="go">杩涘叆 鈫?/span></div>
        <div class="sect-card" onclick="NS.go('anatomy')"><div class="big">馃З</div><b>瑙ｅ墫鍥捐氨</b><p>棰呴銆佽剳鑶溿€佽剳鍙跺姛鑳藉尯銆佽剳瀹ょ郴缁熴€乄illis 鐜€佽剳骞查绁炵粡銆佽剨楂撯€斺€旀墜缁樼ず鎰忓浘+瀛︿範瑕佺偣銆?/p><span class="go">杩涘叆 鈫?/span></div>
        <div class="sect-card" onclick="NS.go('surgery')"><div class="big">馃敩</div><b>鎵嬫湳鏂瑰紡璇﹁В</b><p>缁忓吀鍏ヨ矾锛堢考鐐广€佷箼鐘剁鍚庛€佺粡铦垛€︼級銆侀鑴戞崯浼ゃ€佽剳琛€绠°€佽偪鐦ゃ€佽剨鏌便€佸姛鑳芥墜鏈殑鍏抽敭姝ラ涓庤鐐广€?/p><span class="go">杩涘叆 鈫?/span></div>
      </div>
      <div class="card" style="margin-top:24px">
        <h3>馃椇锔?鎺ㄨ崘瀛︿範璺緞</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">闈炲尰瀛﹁儗鏅缓璁細<b>涓€鍥剧湅鎳?/b> 鈫?<b>褰卞儚瀛﹀叆闂?/b> 鈫?<b>瑙ｅ墫鍥捐氨</b> 鈫?<b>鐥呯鐭ヨ瘑锛堝熀纭€锛?/b>銆傚凡鏈夊尰瀛﹀熀纭€鑰呭彲浠庡奖鍍忕簿璇汇€佹墜鏈叆璺笌鐥呬緥璧勬簮杩涘叆銆傚彸涓婅鍙洿鎺ユ悳绱⑩€淢RA鈥濃€淒WI鈥濃€滃姩鑴夌槫鈥濈瓑鍏抽敭璇嶃€?/p>
      </div>
      <div class="foot-note">
        <b>鈿狅笍 鍖诲澹版槑锛?/b>鏈珯鍐呭渚濇嵁鍏紑鏁欐潗涓庢寚鍗楁暣鐞嗭紝鐢ㄤ簬鍖诲瀛︿範浜ゆ祦銆傚浘璋变负鏁欏绠€鍖栫ず鎰忓浘锛屼笉鏇夸唬涓撲笟瑙ｅ墫鍥捐氨锛涜瘖鐤楀喅绛栬浠ユ渶鏂版寚鍗椼€佷笂绾у尰甯堟剰瑙佸強鎮ｈ€呭叿浣撴儏鍐典负鍑嗐€?      </div>`;
  }

  /* ---------- 涓€鍥剧湅鎳?---------- */
  const BRAIN_REGIONS = {
    frontal: { name:"棰濆彾", color:"#f5b7b1", function:"璁″垝銆佹姂鍒躲€佸垽鏂€佷富鍔ㄨ繍鍔ㄤ笌璇█琛ㄨ揪绛夐珮绾у姛鑳姐€?, symptom:"鍙楀奖鍝嶆椂鍙兘鍑虹幇鎬ф牸鎴栨墽琛屽姏鏀瑰彉銆佸渚ф棤鍔涳紱浼樺娍鍗婄悆棰濅笅鍥為檮杩戝彈鎹熷彲鍑虹幇琛ㄨ揪鎬ц瑷€闅滅銆?, clue:"鏌ヤ綋鍏虫敞琛屼负銆佽瑷€娴佸埄搴﹀拰鑲綋鍔涢噺锛涘奖鍍忓厛瀹氫綅鏄惁闈犺繎涓ぎ娌熷墠鏂广€? },
    parietal: { name:"椤跺彾", color:"#f9e79f", function:"鏁村悎瑙﹁銆佹湰浣撴劅瑙変笌绌洪棿娉ㄦ剰锛屽府鍔╁ぇ鑴戝洖绛斺€滆韩浣撳拰澶栫晫鍦ㄥ摢閲屸€濄€?, symptom:"鍙嚭鐜板渚ф劅瑙夊紓甯搞€佸け鐢ㄦ垨绌洪棿蹇界暐锛涜〃鐜板彈宸﹀彸浼樺娍涓庡叿浣撻儴浣嶅奖鍝嶃€?, clue:"鏌ヤ綋鍏虫敞鎰熻銆佺┖闂存敞鎰忓拰澶嶆潅鍔ㄤ綔锛涘奖鍍忕湅涓ぎ娌熷悗鏂瑰強椤跺彾娣遍儴閫氳矾銆? },
    temporal: { name:"棰炲彾", color:"#aed6f1", function:"鍙備笌鍚銆佽蹇嗐€佹儏缁拰璇█鐞嗚В锛屽唴渚х粨鏋勫寘鍚捣椹€?, symptom:"鍙嚭鐜拌蹇嗗彉鍖栥€佸眬鐏舵€х櫕鐥彂浣滐紱浼樺娍鍗婄悆鍚庨鍖哄彈鎹熷彲褰卞搷璇█鐞嗚В銆?, clue:"缁撳悎鍙戜綔褰㈠紡銆佽蹇嗗拰璇█妫€鏌ワ紱MRI 瀵规捣椹拰棰炲彾缁嗚妭鏇存湁甯姪銆? },
    occipital: { name:"鏋曞彾", color:"#d7bde2", function:"瑙嗚淇℃伅鐨勪富瑕佺毊灞傚鐞嗗尯鍩熴€?, symptom:"鍙嚭鐜板渚ц閲庣己鎹熴€佽瑙夎瘑鍒紓甯革紱鐪肩潧鏈韩鍙兘娌℃湁闂銆?, clue:"鍋氳閲庢鏌ュ苟娌胯瑙夐€氳矾瀹氫綅锛汥WI 瀵规€ユ€ф灂鍙剁己琛€寰堝叧閿€? },
    cerebellum: { name:"灏忚剳", color:"#a9dfbf", function:"鏍″噯鍔ㄤ綔銆佸钩琛°€佹鎬佸拰鐪肩悆鍗忚皟锛岃杩愬姩鏇村噯纭祦鐣呫€?, symptom:"鍙嚭鐜拌蛋璺笉绋炽€佽鲸璺濅笉鑹€佺溂闇囨垨瑷€璇惈绯婏紝閫氬父涓嶆槸绠€鍗曠殑鈥滄病鍔涙皵鈥濄€?, clue:"鏌ュ崗璋冧笌姝ユ€侊紱鍚庨绐?CT 鏄撳彈楠ㄦ€т吉褰卞奖鍝嶏紝MRI 甯歌兘鏄剧ず鏇村缁嗚妭銆? },
    brainstem: { name:"鑴戝共", color:"#f5cba7", function:"杩炴帴澶ц剳銆佸皬鑴戜笌鑴婇珦锛屽绾冲鏉￠噸瑕侀€氳矾鍜屽鏁伴绁炵粡鏍革紝涔熷弬涓庡懠鍚镐笌鎰忚瘑缁存寔銆?, symptom:"灏忕梾鐏朵篃鍙兘閫犳垚澶嶈銆佸悶鍜藉洶闅俱€佷氦鍙夋€т綋寰併€佹剰璇嗘垨鍛煎惛闂銆?, clue:"鍑虹幇鎬ユ€ц剳骞蹭綋寰侀渶绱ф€ヤ笓涓氳瘎浼帮紱MRI/DWI 涓庤绠℃垚鍍忓父鍏锋湁閲嶈浠峰€笺€? }
  };

  function brainMapSVG(){
    const active = id => brainRegion===id ? " active" : "";
    return `<svg viewBox="0 0 680 470" role="img" aria-label="鍙偣鍑荤殑澶ц剳澶栦晶闈㈠姛鑳藉垎鍖虹ず鎰忓浘">
      <defs><filter id="soft"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".12"/></filter></defs>
      <text x="340" y="31" text-anchor="middle" font-size="18" font-weight="700" fill="#1e293b">鐐瑰嚮涓€涓剳鍖猴紝寤虹珛鈥滀綅缃€斿姛鑳解€旂棁鐘垛€濊仈绯?/text>
      <path d="M123 165 Q132 83 239 62 Q363 31 484 81 Q568 116 574 205 Q580 281 519 331 Q461 375 355 369 Q250 365 180 319 Q118 278 114 215Z" fill="#f8fafc" stroke="#355b7d" stroke-width="4" filter="url(#soft)"/>
      <path class="brain-region${active('frontal')}" onclick="NS.selectBrain('frontal')" d="M123 165 Q132 83 239 62 Q276 53 316 55 L324 189 Q267 189 229 225 Q185 264 180 319 Q118 278 114 215Z" fill="#f5b7b1" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('parietal')}" onclick="NS.selectBrain('parietal')" d="M316 55 Q404 50 475 78 Q510 93 536 121 L487 225 Q409 190 324 189Z" fill="#f9e79f" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('temporal')}" onclick="NS.selectBrain('temporal')" d="M229 225 Q322 184 414 225 Q473 248 519 331 Q461 375 355 369 Q250 365 180 319 Q185 264 229 225Z" fill="#aed6f1" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('occipital')}" onclick="NS.selectBrain('occipital')" d="M536 121 Q571 157 574 205 Q580 281 519 331 Q493 270 487 225Z" fill="#d7bde2" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('cerebellum')}" onclick="NS.selectBrain('cerebellum')" d="M428 320 Q493 298 541 330 Q550 375 503 402 Q448 422 401 382Z" fill="#a9dfbf" stroke="#355b7d" stroke-width="3"/>
      <path class="brain-region${active('brainstem')}" onclick="NS.selectBrain('brainstem')" d="M375 340 Q405 330 430 348 L441 445 L384 445Z" fill="#f5cba7" stroke="#355b7d" stroke-width="3"/>
      <text class="brain-label" x="205" y="142">棰濆彾</text><text class="brain-label" x="395" y="126">椤跺彾</text>
      <text class="brain-label" x="315" y="295">棰炲彾</text><text class="brain-label" x="520" y="220">鏋曞彾</text>
      <text class="brain-label" x="462" y="371">灏忚剳</text><text class="brain-label" x="392" y="417">鑴戝共</text>
      <path d="M323 73 Q309 125 324 189" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="286" y="92" text-anchor="end" font-size="11" fill="#c0392b">涓ぎ娌熼檮杩?/text>
      <text x="24" y="445" font-size="11" fill="#64748b">鏁欏绠€鍥?路 鍔熻兘鏄綉缁滐紝涓嶆槸浜掍笉鐩稿共鐨勫僵鑹插皬鏍?/text>
    </svg>`;
  }

  function renderVisual(){
    const r = BRAIN_REGIONS[brainRegion];
    $app.innerHTML = `
      <div class="plain-banner"><b>鍏堣浣忎竴鍙ワ細</b>鐥囩姸鑳藉府鍔╁畾浣嶏紝浣嗕竴涓姛鑳介€氬父鐢卞涓剳鍖哄拰杩炴帴閫氳矾鍏卞悓瀹屾垚銆傚乏鍙冲崐鐞冦€佺梾鍙樺ぇ灏忋€佽捣鐥呴€熷害閮戒細鏀瑰彉琛ㄧ幇銆?/div>
      <div class="visual-hero">
        <div class="brain-map">${brainMapSVG()}</div>
        <div class="visual-panel">
          <div class="eyebrow">VISUAL NEUROANATOMY</div><h2>涓€寮犲浘锛屽厛寤虹珛澶ц剳鍦板浘</h2>
          <p>鐐归€夎剳鍖恒€傚厛鐪嬪畠鈥滀富瑕佸仛浠€涔堚€濓紝鍐嶆妸鐥囩姸鍜屽奖鍍忓畾浣嶈繛璧锋潵銆?/p>
          <div class="brain-buttons">${Object.entries(BRAIN_REGIONS).map(([id,x])=>`<button class="${brainRegion===id?'active':''}" onclick="NS.selectBrain('${id}')">${x.name}</button>`).join("")}</div>
          <div class="brain-detail">
            <b style="color:${r.color}">${r.name} 路 涓昏瑙掕壊</b><div>${r.function}</div>
            <small><b style="font-size:12px;color:#fff">鍙兘鍑虹幇锛?/b>${r.symptom}</small>
            <small><b style="font-size:12px;color:#fff">涓嬩竴姝ユ€庝箞鎯筹細</b>${r.clue}</small>
          </div>
        </div>
      </div>
      <div class="grid2">
        <div class="card"><h3>馃Л 浠庣棁鐘跺弽鎺ㄤ綅缃?/h3><p style="font-size:13px;color:var(--ink-2)"><b>鍏堥棶璧风梾閫熷害锛?/b>鍑犵鍒板嚑鍒嗛挓鏇磋鎯曡绠′簨浠讹紱鏁板皬鏃跺埌鏁板ぉ鍙鐐庣棁銆佹劅鏌撴垨婕斿彉涓殑鍑鸿锛涙暟鍛ㄥ埌鏁版湀鏇村父杩涘叆鍗犱綅銆侀€€鍙樼瓑閴村埆銆傝繖閲屽彧鏄€濊矾锛屼笉鏄瘖鏂鍒欍€?/p></div>
        <div class="card"><h3>馃Р 浠庝綅缃€夋嫨褰卞儚</h3><p style="font-size:13px;color:var(--ink-2)">鎬ユ€у嚭琛€/鍒涗激甯稿厛 CT锛涚己琛€銆佽剳骞层€佸皬鑴戙€佽偪鐦や笌鑴婇珦缁嗚妭甯镐緷璧?MRI锛涙€€鐤戣绠￠棶棰樺啀鎸夋儏澧冮€夋嫨 MRA銆丆TA 鎴?DSA銆傝繘鍏モ€滃奖鍍忓鍏ラ棬鈥濈湅瀹屾暣瀵圭収銆?/p><p style="margin-top:10px"><a href="#imaging" onclick="NS.go('imaging')">缁х画锛歁RI / MRA 涓€鍥惧叆闂?鈫?/a></p></div>
      </div>
      <div class="warn-box">馃殤 鑻ュ嚭鐜扮獊鍙戝彛瑙掓鏂滄垨鍗曚晶鏃犲姏銆佽瑷€鍥伴毦銆佹剰璇嗘敼鍙樸€侀娆℃娊鎼愶紝鎴栤€滅獊鐒跺彂鐢熺殑鏈€鍓х儓澶寸棝鈥濓紝涓嶈鐢ㄦ湰绔欒嚜娴嬶紝搴旂珛鍗冲姹傛€ヨ瘖涓撲笟璇勪及銆?/div>`;
  }

  /* ---------- 褰卞儚瀛﹀叆闂?---------- */
  function renderImaging(){
    const s = IMAGING.sequences.find(x=>x.id===sequenceId) || IMAGING.sequences[0];
    $app.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#10263d,#205d83 62%,#2d7dd2)">
        <div class="imaging-eyebrow">NEUROIMAGING, IN PLAIN LANGUAGE</div>
        <h2>鑴戝奖鍍忎笉鏄寽鍥撅細鍏堢煡閬撴瘡绉嶆鏌ュ湪鍥炵瓟浠€涔?/h2>
        <p>CT 鎿呴暱蹇€熸帓鎬ョ棁锛孧RI 鐢ㄥ涓簭鍒楁弿杩扮粍缁囷紝MRA/CTA/DSA 鑱氱劍琛€绠°€傝鐗囩殑鏍稿績涓嶆槸鑳屸€滀寒鏆椻€濓紝鑰屾槸瀹氫綅銆佽法搴忓垪楠岃瘉锛屽啀鍥炲埌涓村簥闂銆?/p>
        <div class="tags"><span>CT / CTA</span><span>MRI 鍏ぇ搴忓垪</span><span>MRA / DSA</span><span>涓冩璇荤墖娉?/span></div>
      </div>
      <div class="card"><h3>鈶?浜旂妫€鏌ワ紝鍒嗗埆鎿呴暱浠€涔堬紵</h3><div class="modality-grid">${IMAGING.modalities.map(m=>`
        <div class="modality-card" style="--accent:${m.color}"><div class="mi">${m.icon}</div><h4>${m.name}</h4><div class="short">${m.short}</div><p>${m.plain}</p>
        <ul>${m.best.map(x=>`<li>${x}</li>`).join("")}</ul><p class="limit"><b>杈圭晫锛?/b>${m.limits}</p></div>`).join("")}</div></div>
      <div class="card"><h3>鈶?MRI 鍍忔崲婊ら暅锛氬悓涓€鍧楄剳锛岀敤鍏鏂瑰紡鐪?/h3>
        <div class="sequence-layout"><div class="sequence-tabs">${IMAGING.sequences.map(x=>`<button class="${x.id===sequenceId?'active':''}" onclick="NS.selectSequence('${x.id}')">${x.name} 路 ${x.cue}</button>`).join("")}</div>
        <div class="sequence-screen"><div class="eyebrow">SELECTED SEQUENCE</div><h3>${s.name}</h3><p>${s.plain}</p>
          <div class="sequence-facts"><div class="sequence-fact"><b>姘?/ 鑴戣剨娑?/b>${s.water}</div><div class="sequence-fact"><b>鑴傝偑</b>${s.fat}</div><div class="sequence-fact"><b>涓昏鐢ㄩ€?/b>${s.use}</div><div class="sequence-fact"><b>鏈€瀹规槗璇В</b>${s.avoid}</div></div>
        </div></div></div>
      <div class="card"><h3>鈶?甯歌妯″紡锛氬厛瀛︹€滅粍鍚堚€濓紝涓嶈鐢ㄤ竴涓寒鐐逛笅璇婃柇</h3><div class="pattern-grid">${IMAGING.patterns.map(p=>`<div class="pattern-card"><h4>${p.icon} ${p.name}</h4><div class="pattern-line">${p.line}</div><p>${p.next}</p><p style="margin-top:7px;color:#a65d00"><b>鍒俯鍧戯細</b>${p.warn}</p></div>`).join("")}</div></div>
      <div class="card"><h3>鈶?涓冩璇荤墖娉?/h3><div class="checklist">${IMAGING.checklist.map(x=>`<div class="check-item"><div class="check-num">${x[0]}</div><div><b>${x[1]}</b><p>${x[2]}</p></div></div>`).join("")}</div></div>
      <div class="grid2"><div class="card"><h3>鈶?鎶ュ憡閲岀殑璇嶏紝缈昏瘧鎴愪汉璇?/h3><table class="glossary-table">${IMAGING.glossary.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join("")}</table></div>
      <div class="card"><h3>鈶?鐪嬪畬鎶ュ憡锛屾纭殑涓嬩竴姝?/h3><p style="font-size:13px;color:var(--ink-2)">鍏堢湅鈥滃嵃璞?缁撹鈥濓紝鍐嶅洖鍒扳€滄墍瑙佲€濇壘璇佹嵁锛涙妸鎶ュ憡涓庣棁鐘躲€佹棦寰€鐗囧拰鍖荤敓鍒ゆ柇鏀惧湪涓€璧枫€備笉瑕佸彧鎴彇鈥滃紓甯镐俊鍙封€濃€滃己鍖栤€濇垨鈥滃姩鑴夌槫鍙兘鈥濈瓑鍗曡瘝鑷鍒ゆ柇涓ラ噸绋嬪害銆?/p>
        <div class="warn-box" style="margin-top:14px">鏈珯涓嶆彁渚涗釜浣撳奖鍍忚瘖鏂€傛€ユ€х缁忕棁鐘舵寜鎬ヨ瘖澶勭悊锛涢潪鎬ョ棁璇锋惡甯﹀畬鏁?DICOM銆佹寮忔姤鍛婂拰鏃㈠線妫€鏌ュ挩璇㈡斁灏勭/绁炵粡绉?绁炵粡澶栫涓撲笟浜哄憳銆?/div>
        <div class="source-list">${IMAGING.references.map(r=>`<a href="${r.url}" target="_blank" rel="noopener">${r.name} 鈫?/a>`).join("")}</div></div></div>`;
  }

  /* ---------- 鐥呯鐭ヨ瘑搴?---------- */
  function diseaseCardHTML(d){
    const isCore = typeof HOSPITAL_CORE_IDS !== "undefined" && HOSPITAL_CORE_IDS.includes(d.id);
    return `
    <div class="disease-card" id="dis-${d.id}">
      <div class="dc-head" onclick="NS.toggleDisease('${d.id}')">
        <span>${chip(d.level)}</span>
        ${isCore?'<span class="chip" style="background:#fdecea;color:#c0392b">馃彞 鍖诲ぇ閲嶇偣</span>':''}
        <span class="t">${esc(d.name)}</span>
        <span class="arrow">鈻?/span>
      </div>
      <div class="dc-body">
        <div class="intro-box">馃搶 ${esc(d.intro)}</div>
        <div class="sub-block"><h4>涓村簥琛ㄧ幇</h4><ul>${d.clinical.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        <div class="sub-block"><h4>褰卞儚瀛﹁鐐?/h4><ul>${d.imaging.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        <div class="sub-block"><h4>娌荤枟鍘熷垯</h4><ul>${d.treatment.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        ${d.advanced?`<div class="sub-block"><h4>杩涢樁瑕佺偣</h4><ul>${d.advanced.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>`:""}
        ${d.alert?`<div class="warn-box">鈿狅笍 ${esc(d.alert)}</div>`:""}
      </div>
    </div>`;
  }

  function renderDiseases(){
    const cats = DISEASES.map(c=>c).filter(c=> c.items.length);
    const filterBar = `
      <div class="filter-bar">
        <button class="filter-btn ${diseaseFilter==='all'?'active':''}" onclick="NS.setDFilter('all')">鍏ㄩ儴锛?{DISEASE_FLAT.length}锛?/button>
        ${cats.map(c=>`<button class="filter-btn ${diseaseFilter===c.cat?'active':''}" onclick="NS.setDFilter('${c.cat}')">${c.icon} ${c.catName}锛?{c.items.length}锛?/button>`).join("")}
      </div>`;
    if(diseaseFilter === "all"){
      $app.innerHTML = filterBar + cats.map(c=>`
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:18px 20px 8px;display:flex;align-items:center;gap:10px">
            <span style="font-size:26px">${c.icon}</span>
            <div><b style="font-size:17px">${c.catName}</b>
            <span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 涓梾绉?/span></div>
          </div>
          <div style="padding:6px 20px 14px">
            <span class="chip chip-cat">姒傝堪</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span>
          </div>
          <div style="padding:0 20px 18px">
            ${c.items.map(diseaseCardHTML).join("")}
          </div>
        </div>`).join("");
    } else {
      const c = cats.find(x=>x.cat===diseaseFilter);
      $app.innerHTML = filterBar + `
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:20px 22px">
            <span style="font-size:30px">${c.icon}</span>
            <h3 style="display:inline-block;vertical-align:middle;margin-left:10px">${c.catName}</h3>
            <p style="font-size:13.5px;color:var(--ink-2);margin-top:6px">${esc(c.desc)}</p>
          </div>
          <div style="padding:0 22px 22px">${c.items.map(diseaseCardHTML).join("")}</div>
        </div>`;
    }
  }

  /* ---------- 瑙ｅ墫鍥捐氨 ---------- */
  function renderAnatomy(){
    $app.innerHTML = `
      <div class="card">
        <h3>馃З 瑙ｅ墫鍥捐氨璇存槑</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">浠ヤ笅涓烘暀瀛︾畝鍖栫ず鎰忓浘锛岀獊鍑虹缁忓绉戝父鐢ㄨВ鍓栨爣蹇椾笌涓村簥鐩稿叧缁撴瀯銆傚缓璁厤鍚?<b>The Neurosurgical Atlas</b>銆丯euroanatomy Online 绛?3D/瀹炵墿璧勬簮瀵圭収瀛︿範锛堣鈥滆棰戣祫婧愨€濋〉锛夈€?/p>
      </div>
      ${ANATOMY.map(a=>`
      <div class="anat-card">
        <div class="anat-head">
          <span class="chip chip-cat">${a.cat}</span>
          ${chip(a.level)}
          <b>${esc(a.name)}</b>
        </div>
        <div class="anat-desc">${esc(a.desc)}</div>
        <div class="anat-body">${a.svg}</div>
        <div class="anat-points">
          <ul>${a.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>
        </div>
      </div>`).join("")}
      <div class="foot-note">鈿狅笍 绀烘剰鍥句粎渚涘涔犲弬鑰冿細SVG 鍥惧舰涓虹畝鍖栫粯鍒讹紝瑙ｅ墫姣斾緥涓庣粏鑺備互涓撲笟鍥捐氨锛堝 Netter 绁炵粡瑙ｅ墫銆丟ray's Anatomy锛変笌鐪熷疄鏍囨湰涓哄噯銆?/div>`;
  }

  /* ---------- 鎵嬫湳鏂瑰紡 ---------- */
  function surgeryCardHTML(d){
    return `
    <div class="sx-card" id="sx-${d.id}">
      <div class="sx-head" onclick="NS.toggleSx('${d.id}')">
        <span>${chip(d.level)}</span>
        <span class="t">${esc(d.name)}</span>
        <span class="arrow" style="margin-left:auto;color:var(--ink-3)">鈻?/span>
      </div>
      <div class="sx-body">
        <div class="intro-box">馃搶 ${esc(d.intro)}</div>
        <div class="sub-block"><h4>閫傚簲璇?/h4><ul><li>${esc(d.indication)}</li></ul></div>
        <div class="sub-block"><h4>鍏抽敭姝ラ</h4><div class="step-list">${d.steps.map(s=>`<div class="step-item">${esc(s)}</div>`).join("")}</div></div>
        <div class="kp-grid">
          <div class="kp-box"><b>鈿狅笍 鎿嶄綔瑕佺偣</b><ul>${d.keypoints.map(k=>`<li>${esc(k)}</li>`).join("")}</ul></div>
          <div class="kp-box"><b>馃搱 杩涢樁寤朵几</b><ul><li>${esc(d.advanced)}</li></ul></div>
        </div>
      </div>
    </div>`;
  }

  function renderSurgery(){
    const cats = SURGERIES;
    const filterBar = `
      <div class="filter-bar">
        <button class="filter-btn ${sxFilter==='all'?'active':''}" onclick="NS.setSxFilter('all')">鍏ㄩ儴锛?{SURGERY_FLAT.length}锛?/button>
        ${cats.map(c=>`<button class="filter-btn ${sxFilter===c.cat?'active':''}" onclick="NS.setSxFilter('${c.cat}')">${c.icon} ${c.catName}锛?{c.items.length}锛?/button>`).join("")}
      </div>`;
    if(sxFilter === "all"){
      $app.innerHTML = filterBar + cats.map(c=>`
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:18px 20px 6px;display:flex;align-items:center;gap:10px">
            <span style="font-size:26px">${c.icon}</span>
            <div><b style="font-size:17px">${c.catName}</b><span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 涓湳寮?/span></div>
          </div>
          <div style="padding:4px 20px 14px"><span class="chip chip-cat">姒傝堪</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span></div>
          <div style="padding:0 20px 18px">${c.items.map(surgeryCardHTML).join("")}</div>
        </div>`).join("");
    } else {
      const c = cats.find(x=>x.cat===sxFilter);
      $app.innerHTML = filterBar + `
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:20px 22px">
            <span style="font-size:30px">${c.icon}</span>
            <h3 style="display:inline-block;vertical-align:middle;margin-left:10px">${c.catName}</h3>
            <p style="font-size:13.5px;color:var(--ink-2);margin-top:6px">${esc(c.desc)}</p>
          </div>
          <div style="padding:0 22px 22px">${c.items.map(surgeryCardHTML).join("")}</div>
        </div>`;
    }
  }

  /* ---------- 瑙嗛璧勬簮 ---------- */
  function renderVideos(){
    $app.innerHTML = VIDEOS.map(c=>`
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:18px 22px 6px;display:flex;align-items:center;gap:10px">
          <span style="font-size:26px">${c.icon}</span>
          <div><b style="font-size:17px">${c.catName}</b><span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 涓祫婧?/span></div>
        </div>
        <div style="padding:4px 22px 14px"><span class="chip chip-cat">璇存槑</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span></div>
        <div style="padding:0 22px 22px" class="vid-grid">
          ${c.items.map(v=>`
          <div class="vid-card">
            <b>${esc(v.name)}</b>
            <p>${esc(v.desc)}</p>
            <div class="tags">${v.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
            <a href="${esc(v.url)}" target="_blank" rel="noopener">璁块棶璧勬簮 鈫?/a>
          </div>`).join("")}
        </div>
      </div>`).join("") + `
      <div class="foot-note">馃挕 <b>浣跨敤寤鸿锛?/b>鑻辨枃璧勬簮寤鸿閰嶅悎娴忚鍣ㄧ炕璇戞垨涓枃瀛楀箷瑙傜湅锛涙墜鏈棰戣鍦ㄥ甫鏁欒€佸笀鎸囧涓嬬粨鍚堣В鍓栦笌鏈墠褰卞儚瀛︿範锛涗粯璐?娉ㄥ唽璧勬簮璇烽伒瀹堝钩鍙版潯娆撅紝灏婇噸鐗堟潈銆?/div>`;
  }

  /* ---------- 瀛︿範璺緞 ---------- */
  function renderPath(){
    const steps = [
      { n:1, color:"#2d7dd2", title:"鍩虹绡?路 瑙ｅ墫鎵撳簳", desc:"鍏堝缓绔嬩笁缁磋В鍓栬锛屽啀瀛︾梾绉嶃€傝В鍓栨槸绁炵粡澶栫鐨勨€滃湴鍥锯€濓紝涓嶆噦瑙ｅ墫涓€鍒囨墜鏈笌瀹氫綅閮芥棤浠庤皥璧枫€?, chips:["瑙ｅ墫鍥捐氨锛堥楠ㄢ啋鑴戣啘鈫掕剳鍙垛啋鑴戝鈫掕绠♀啋鑴戝共锛?,"閰嶅悎 3D 瑙ｅ墫宸ュ叿瀵圭収","鏍囪鍏抽敭鏍囧織锛氱考鐐广€佷腑澶矡銆乄illis 鐜€佽剳瀹ょ郴缁?] },
      { n:2, color:"#16a085", title:"鍩虹绡?路 鐥呯鍏ラ棬", desc:"鎸夊ぇ绫婚€愪釜瀛︿範鐥呯锛氬厛璁扳€滀复搴婅〃鐜扳啋褰卞儚鈫掓不鐤楀師鍒欌€濅笁鏉挎枾锛屽啀鐞嗚В鏈哄埗銆?, chips:["棰呰剳鎹熶激锛堣剳鐤濊瘑鍒€丟CS 璇勫垎锛?,"楂樿鍘嬭剳鍑鸿涓?SAH","甯歌鑲跨槫锛氳兌璐ㄧ槫/鑴戣啘鐦?鍨備綋鐦?,"鑵版闂寸洏绐佸嚭涓庨妞庣梾"] },
      { n:3, color:"#e67e22", title:"杩涢樁绡?路 褰卞儚绮捐", desc:"绁炵粡澶栫鏄€滃奖鍍忛┍鍔ㄢ€濈殑瀛︾銆傚浼氬湪 CT/MRI 涓婂畾浣嶇梾鍙樸€佸垽鏂崰浣嶆晥搴斾笌鎵嬫湳鎸囧緛銆?, chips:["CT 璇荤墖锛氬嚭琛€銆侀鎶樸€佽剳鐤濆緛璞?,"MRI 搴忓垪锛歍1/T2/FLAIR/DWI/澧炲己","琛€绠℃垚鍍忥細CTA/MRA/DSA 閫傚簲璇?,"Radiopaedia 鐥呬緥缁冧範"] },
      { n:4, color:"#8e44ad", title:"杩涢樁绡?路 鎵嬫湳鍏ヨ矾涓庢湳寮?, desc:"缁撳悎瑙ｅ墫瀛﹀叆璺紝鎸夆€滈€傚簲璇佲啋姝ラ鈫掕鐐光€濆涔犳墜鏈€傚厛鐞嗚В鈥滀负浠€涔堣繖涔堝垏鈥濓紝鍐嶇湅鈥滄€庝箞鍒団€濄€?, chips:["缁忓吀鍏ヨ矾锛氱考鐐?涔欑姸绐﹀悗/缁忚澏/鏋曚笅鍚庢涓?,"鎹熶激涓庤剳琛€绠℃墜鏈細EVD銆佸幓楠ㄧ摚銆佸す闂€佸彇鏍?,"鑲跨槫鎵嬫湳锛氭樉寰垏闄や笌鍔熻兘淇濇姢","鑴婃煴鎵嬫湳锛氬噺鍘嬩笌鍥哄畾"] },
      { n:5, color:"#c0392b", title:"瀹炴垬绡?路 瑙嗛瑙傛懇涓庣梾渚?, desc:"鐢ㄧ湡瀹炴墜鏈棰戜笌鐥呬緥璁ㄨ妫€楠屾墍瀛︺€傛敞鎰忥細鎵嬫湳瑙傛懇涓€瀹氳瀵圭収鏈墠褰卞儚涓庤В鍓栧浘锛屽甫鐫€闂鐪嬨€?, chips:["The Neurosurgical Atlas 鎵嬫湳瑙嗛","B绔?涓侀鍥腑鏂囨墜鏈綍鍍?,"NEJM 瑙勮寖鎿嶄綔瑙嗛","璺熼殢鏌ユ埧锛氭妸鈥滀功鏈梾鈥濆彉鎴愨€滃簥鏃佺梾鈥?] },
      { n:6, color:"#00a86b", title:"鎸佺画绮捐繘 路 鎸囧崡涓庡墠娌?, desc:"寤虹珛闃呰涔犳儻锛氭寚鍗楁洿鏂般€佹牳蹇冩湡鍒娿€佸勾浼氳繘灞曘€傛帹鑽愪粠涓枃缁艰堪涓庢寚鍗楄璧凤紝鍐嶈繃娓¤嫳鏂囨枃鐚€?, chips:["涓崕鍖诲浼氱澶栨寚鍗?,"Journal of Neurosurgery / Neurosurgery","The Neurosurgical Atlas 姣忓懆鏇存柊","寤虹珛涓汉鐭ヨ瘑搴撲笌閿欓鏈?] }
    ];
    $app.innerHTML = `
      <div class="card">
        <h3>馃椇锔?鍏瀛︿範璺緞</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">闈㈠悜鈥滃吋椤惧悇灞傛鈥濊璁＄殑娓愯繘璺嚎锛氬尰瀛︾敓/瑙勫煿璧?1鈫? 姝ユ墦鍩虹锛屼綇闄㈠尰甯堝彲鐩存帴浠庣 3 姝ヨ捣姝ュ苟閲嶇偣娣卞叆 4鈫? 姝ャ€傛瘡姝ュ潎鍙湪鏈綉绔欏搴旀澘鍧楀畬鎴愩€?/p>
      </div>
      <div style="margin-top:8px">
        ${steps.map(s=>`
        <div class="path-step">
          <div class="path-num" style="background:${s.color}">${s.n}</div>
          <div class="path-body">
            <b>${s.title}</b>
            <p>${s.desc}</p>
            <div class="pchips">${s.chips.map(c=>`<span>${c}</span>`).join("")}</div>
          </div>
        </div>`).join("")}
      </div>`;
  }

  /* ---------- 鍖婚櫌瀛︾ ---------- */
  function renderHospital(){
    const H = HOSPITAL;
    $app.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#0f3d5c 0%,#1a6ba8 55%,#2d8fd0 100%)">
        <h2>${H.dept.name}</h2>
        <p>${H.dept.positioning} 路 ${H.dept.subDesc}</p>
        <div class="tags">
          <span>馃彞 ${H.dept.beds}</span><span>馃洀锔?${H.dept.wards.length} 涓梾鍖?/span><span>馃毃 24灏忔椂鎬ヨ瘖</span><span>馃寪 涓?鑻?鏃?闊?淇?/span>
        </div>
      </div>

      <div class="card">
        <h3>馃梻锔?鍏ぇ浜氫笓绉?/h3>
        <div class="grid4">
          ${H.specialties.map(s=>`
          <div class="sect-card" style="cursor:default;padding:18px">
            <div class="big" style="font-size:28px">${s.icon}</div>
            <b>${s.name}</b>
            <p>${s.desc}</p>
          </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>馃彌锔?鐥呭尯閰嶇疆涓庢牳蹇冨洟闃?/h3>
        <div class="grid2">
          <div>
            <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:10px">鐥呭尯閰嶇疆</h4>
            ${H.dept.wards.map(w=>`
            <div style="background:var(--primary-light);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px">
              <b>${w.name}</b> <span style="color:var(--ink-3)">路 ${w.loc}</span>
              <div style="color:var(--ink-2);margin-top:2px">${w.desc}</div>
            </div>`).join("")}
          </div>
          <div>
            <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:10px">鏍稿績鍥㈤槦</h4>
            ${H.dept.team.map(t=>`
            <div style="background:var(--ok-bg);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px">
              <b>${t.t}</b>
              <div style="color:var(--ink-2);margin-top:2px">${t.d}</div>
            </div>`).join("")}
          </div>
        </div>
      </div>

      <div class="grid2">
        <div class="card">
          <h3>馃彞 闄㈠唴鏈嶅姟</h3>
          ${H.services.items.map(s=>`
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed var(--line)">
            <span style="font-size:22px">${s.icon}</span>
            <div>
              <b style="font-size:14px">${s.name}</b> <span style="font-size:12px;color:var(--primary)">${s.loc}</span>
              <div style="font-size:12.5px;color:var(--ink-2)">${s.desc}</div>
            </div>
          </div>`).join("")}
        </div>
        <div class="card">
          <h3>馃寪 鍥介檯鏈嶅姟</h3>
          ${H.international.items.map(s=>`
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed var(--line)">
            <span style="font-size:22px">${s.icon}</span>
            <div>
              <b style="font-size:14px">${s.name}</b>
              <div style="font-size:12.5px;color:var(--ink-2)">${s.desc}</div>
            </div>
          </div>`).join("")}
          <div class="warn-box" style="margin-top:12px">${H.international.advantage.map(a=>`鉁?${a}`).join("<br>")}</div>
        </div>
      </div>

      <div class="card">
        <h3>馃幆 鏍稿績鐥呯锛堣瘖鐤楄鐐癸級</h3>
        ${H.coreDiseases.map(c=>`
        <div style="margin-bottom:16px">
          <h4 style="font-size:15px;color:${c.color};margin-bottom:8px">${c.icon} ${c.cat}</h4>
          <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12.5px">
            <tr style="background:var(--primary-light);color:var(--primary-dark)">
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">鐥呯</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">涓村簥鐥囩姸</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">褰卞儚璇婃柇</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">娌荤枟鍘熷垯</th>
            </tr>
            ${c.items.map(d=>`
            <tr>
              <td style="padding:8px 10px;border:1px solid var(--line);font-weight:600">${d.name}</td>
              <td style="padding:8px 10px;border:1px solid var(--line);color:var(--ink-2)">${d.sx}</td>
              <td style="padding:8px 10px;border:1px solid var(--line);color:var(--ink-2)">${d.img}</td>
              <td style="padding:8px 10px;border:1px solid var(--line);color:var(--primary-dark)">${d.tx}</td>
            </tr>`).join("")}
          </table>
          </div>
        </div>`).join("")}
      </div>

      <div class="card">
        <h3>馃敩 鎿呴暱鎵嬫湳涓庢妧鏈?/h3>
        <div class="grid2">
          ${H.coreTech.map(c=>`
          <div>
            <h4 style="font-size:14px;color:${c.color};margin-bottom:8px">${c.icon} ${c.cat}</h4>
            ${c.items.map(t=>`
            <div style="background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px">
              <b>${t.name}</b>
              <div style="color:var(--ink-2);font-size:12.5px;margin-top:2px">${t.desc}</div>
            </div>`).join("")}
          </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>馃搵 杞瘖瑙勮寖</h3>
        <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:8px">${H.referral.materialTitle}</h4>
        <div class="grid2">
          ${H.referral.materials.map(m=>`
          <div>
            <h5 style="font-size:13px;color:var(--primary);margin-bottom:6px">${m.cat}</h5>
            <ul style="list-style:none;padding:0">
              ${m.items.map(i=>`<li style="font-size:12.5px;color:var(--ink-2);padding-left:16px;position:relative;margin-bottom:3px"><span style="position:absolute;left:0;color:var(--primary)">鈥?/span>${i}</li>`).join("")}
            </ul>
          </div>`).join("")}
        </div>
        <h4 style="font-size:14px;color:var(--primary-dark);margin:16px 0 8px">${H.referral.examTitle}</h4>
        <div class="grid2">
          ${H.referral.exams.map(e=>`
          <div style="background:var(--primary-light);border-radius:10px;padding:10px 14px;font-size:12.5px;margin-bottom:8px">
            <b>${e.name}</b> <span style="color:var(--ink-2)">锛?{e.desc}</span>
          </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>馃摎 ${H.training.title}</h3>
        <p style="font-size:13px;color:var(--ink-2);margin-bottom:14px">${H.training.desc}</p>
        <div style="margin:4px 0 16px">
          ${H.training.stages.map((s,i)=>`
          <div class="path-step" style="margin-bottom:0">
            <div class="path-num" style="background:${["#2d7dd2","#16a085","#e67e22","#8e44ad"][i]};width:38px;height:38px;font-size:14px">${i+1}</div>
            <div class="path-body" style="margin-bottom:10px">
              <b>${s.name} <span style="color:var(--primary);font-size:12px">${s.time}</span></b>
              <p style="margin-bottom:4px">${s.content}</p>
              <div class="pchips"><span>${s.tools}</span></div>
            </div>
          </div>`).join("")}
        </div>
        <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:8px">鏍稿績鎶€鏈竻鍗曪紙鍚湳璇級</h4>
        <div class="kp-grid">
          <div class="kp-box"><b>馃洜锔?鏍稿績鎶€鏈?/b><ul>${H.training.techItems.map(t=>`<li>${t.name} 鈥?${t.kw}</li>`).join("")}</ul></div>
          <div class="kp-box"><b>馃摉 鏍稿績鐥呯</b><ul>${H.training.diseaseItems.map(t=>`<li>${t.name} 鈥?${t.kw}</li>`).join("")}</ul></div>
        </div>
      </div>`;
  }

  /* ---------- 娓叉煋鍏ュ彛 ---------- */
  function render(){
    if(current==="home") renderHome();
    else if(current==="visual") renderVisual();
    else if(current==="path") renderPath();
    else if(current==="hospital") renderHospital();
    else if(current==="diseases") renderDiseases();
    else if(current==="anatomy") renderAnatomy();
    else if(current==="imaging") renderImaging();
    else if(current==="surgery") renderSurgery();
    else if(current==="videos") renderVideos();
  }

  /* ---------- 鎼滅储 ---------- */
  function buildIndex(){
    const idx = [];
    Object.values(BRAIN_REGIONS).forEach(r=>idx.push({ type:"鍥捐В", cat:"鑴戝姛鑳藉畾浣?, name:r.name, key:["鑴戝尯","鍔熻兘","鐥囩姸",r.name,r.function,r.symptom].join(" ").toLowerCase(), page:"visual" }));
    IMAGING.modalities.forEach(m=>idx.push({ type:"褰卞儚", cat:"妫€鏌ユ柟娉?, name:m.name, key:[m.name,m.short,m.plain,m.best.join(" ")].join(" ").toLowerCase(), page:"imaging" }));
    IMAGING.sequences.forEach(s=>idx.push({ type:"褰卞儚", cat:"MRI 搴忓垪", name:s.name+" 路 "+s.cue, key:["MRI","搴忓垪",s.name,s.cue,s.plain,s.use].join(" ").toLowerCase(), page:"imaging" }));
    idx.push({ type:"瀛︾", cat:"鍖婚櫌瀛︾", name:"涓婃捣鍖诲ぇ鍖婚櫌绁炵粡澶栫", key:["瀛︾","鍖诲ぇ","绁炵粡澶栫","浜氫笓绉?,"杞瘖"].join(" "), page:"hospital" });
    HOSPITAL.specialties.forEach(s=>idx.push({ type:"瀛︾", cat:"鍏ぇ浜氫笓绉?, name:s.name, key:["浜氫笓绉?,"鍖婚櫌",s.name,s.desc].join(" ").toLowerCase(), page:"hospital" }));
    HOSPITAL.coreDiseases.forEach(c=>c.items.forEach(d=>idx.push({ type:"瀛︾", cat:"鏍稿績鐥呯", name:d.name, key:["鏍稿績鐥呯","鍖婚櫌",d.name,d.sx,d.tx].join(" ").toLowerCase(), page:"hospital" })));
    DISEASE_FLAT.forEach(d=>idx.push({ type:"鐥呯", cat:d.catName, name:d.name, key:["鐥呯",d.catName,d.name,d.intro].join(" ").toLowerCase(), id:"dis-"+d.id, page:"diseases" }));
    ANATOMY.forEach(a=>idx.push({ type:"瑙ｅ墫", cat:a.cat, name:a.name, key:["瑙ｅ墫",a.cat,a.name,a.desc].join(" ").toLowerCase(), page:"anatomy" }));
    SURGERY_FLAT.forEach(s=>idx.push({ type:"鎵嬫湳", cat:s.catName, name:s.name, key:["鎵嬫湳",s.catName,s.name,s.intro].join(" ").toLowerCase(), id:"sx-"+s.id, page:"surgery" }));
    VIDEOS.forEach(c=>c.items.forEach(v=>idx.push({ type:"璧勬簮", cat:c.catName, name:v.name, key:["瑙嗛",c.catName,v.name,v.desc].join(" ").toLowerCase(), page:"videos" })));
    return idx;
  }
  const INDEX = buildIndex();

  function doSearch(q){
    q = (q||"").trim().toLowerCase();
    if(!q){ $drop.classList.remove("open"); return; }
    const hits = INDEX.filter(x=>x.key.includes(q)).slice(0,12);
    if(!hits.length){
      $drop.innerHTML = `<div class="sd-empty">鏈壘鍒扮浉鍏虫潯鐩紝鎹釜鍏抽敭璇嶈瘯璇曪紙濡傗€滃姩鑴夌槫鈥濃€滅考鐐光€濃€淲illis鈥濓級</div>`;
    } else {
      $drop.innerHTML = hits.map(h=>`
        <div class="sd-item" onclick="NS.jumpSearch('${h.page}','${esc(h.id||"")}','${esc(h.name)}')">
          <b>${h.name} <span class="chip chip-cat" style="margin-left:6px">${h.type} 路 ${h.cat}</span></b>
          <span>${h.page==='hospital'?'鍖婚櫌瀛︾':h.page==='diseases'?'鐥呯鐭ヨ瘑搴?:h.page==='surgery'?'鎵嬫湳鏂瑰紡':h.page==='anatomy'?'瑙ｅ墫鍥捐氨':h.page==='imaging'?'褰卞儚瀛﹀叆闂?:h.page==='visual'?'涓€鍥剧湅鎳?:'瑙嗛璧勬簮'}</span>
        </div>`).join("");
    }
    $drop.classList.add("open");
  }

  /* ---------- 瀵瑰 API ---------- */
  window.NS = {
    go,
    selectBrain(id){
      if(BRAIN_REGIONS[id]){ brainRegion=id; renderVisual(); }
    },
    selectSequence(id){
      if(IMAGING.sequences.some(x=>x.id===id)){ sequenceId=id; renderImaging(); }
    },
    toggleDisease(id){
      const el = document.getElementById("dis-"+id);
      if(el) el.classList.toggle("open");
    },
    toggleSx(id){
      const el = document.getElementById("sx-"+id);
      if(el) el.classList.toggle("open");
    },
    setDFilter(f){
      diseaseFilter = f; renderDiseases();
    },
    setSxFilter(f){
      sxFilter = f; renderSurgery();
    },
    jumpSearch(page, id, name){
      $drop.classList.remove("open");
      $input.value = "";
      go(page);
      setTimeout(()=>{
        if(id && document.getElementById(id)){
          const el = document.getElementById(id);
          el.classList.add("open");
          el.scrollIntoView({behavior:"smooth", block:"start"});
          el.style.transition="box-shadow .6s";
          el.style.boxShadow="0 0 0 3px rgba(45,125,210,.5)";
          setTimeout(()=>el.style.boxShadow="", 1600);
        }
      }, 60);
    }
  };

  /* ---------- 浜嬩欢 ---------- */
  navItems.forEach(n => n.addEventListener("click", ()=>go(n.dataset.page)));
  $input.addEventListener("input", ()=>doSearch($input.value));
  $input.addEventListener("focus", ()=>doSearch($input.value));
  document.addEventListener("click", e=>{
    if(!e.target.closest(".search-wrap")) $drop.classList.remove("open");
  });

  function init(){
    const h = location.hash.replace("#","");
    if(PAGES[h]) current = h;
    navItems.forEach(n => n.classList.toggle("active", n.dataset.page === current));
    $title.textContent = PAGES[current].title;
    render();
  }
  init();
})();

