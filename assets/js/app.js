/* ============================================================
   神经外科学习网 · 渲染与交互逻辑
   ============================================================ */
(function(){
  "use strict";

  const $app = document.getElementById("app");
  const $title = document.getElementById("page-title");
  const $input = document.getElementById("search-input");
  const $drop = document.getElementById("search-drop");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));

  const PAGES = {
    home:    { title:"神经外科学习网",       label:"首页总览" },
    visual:  { title:"一图看懂大脑",         label:"一图看懂" },
    path:    { title:"学习路径",             label:"学习路径" },
    hospital:{ title:"上海医大医院神经外科",  label:"医院学科" },
    diseases:{ title:"病种知识库",           label:"病种知识库" },
    anatomy: { title:"解剖图谱",             label:"解剖图谱" },
    imaging: { title:"脑影像学入门",         label:"影像学入门" },
    surgery: { title:"手术方式详解",          label:"手术方式" },
    videos:  { title:"视频资源导航",          label:"视频资源" }
  };

  let current = "home";
  let diseaseFilter = "all";
  let sxFilter = "all";
  let brainRegion = "frontal";
  let sequenceId = "t1";
  let imagingCaseId = "normal-t1";
  let imagingRevealed = false;
  let clinicCaseId = "stroke";
  let clinicStage = 1;
  const anatomyModes = {};
  let anatomyFocus = "overview";
  const anatomySpotFocus = {};

  /* ---------- 工具 ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const chip = (level) => level === "进阶"
    ? '<span class="chip chip-adv">进阶</span>'
    : '<span class="chip chip-basic">基础</span>';

  function go(page){
    current = page;
    location.hash = page;
    $title.textContent = PAGES[page].title;
    navItems.forEach(n => n.classList.toggle("active", n.dataset.page === page));
    render();
    window.scrollTo({top:0});
  }

  /* ---------- 首页 ---------- */
  function renderHome(){
    const nDis = DISEASE_FLAT.length, nAnat = ANATOMY.length, nSx = SURGERY_FLAT.length, nVid = VIDEOS.reduce((a,c)=>a+c.items.length,0);
    $app.innerHTML = `
      <div class="hero">
        <h2>先看懂，再学深</h2>
        <p>面向没有医学背景的学习者：先用图建立大脑、症状与影像的直觉，再进入病种、解剖和手术。每个专业概念都尽量回答三个问题——它是什么、为什么重要、下一步看什么。</p>
        <div class="tags">
          <span>🧠 图解式入门</span><span>🧲 MRI / MRA 专题</span><span>📖 ${nDis} 个病种</span><span>🧩 ${nAnat} 张解剖图谱</span><span>🔬 ${nSx} 类手术详解</span><span>🎬 ${nVid} 个资源入口</span>
        </div>
      </div>
      <div class="grid4">
        <div class="sect-card" onclick="NS.go('visual')"><div class="big">🧠</div><b>一图看懂大脑</b><p>点脑区看功能、常见受损表现与检查思路。先建立“位置—功能—症状”的地图。</p><span class="go">开始 →</span></div>
        <div class="sect-card" onclick="NS.go('imaging')"><div class="big">🧲</div><b>影像学入门</b><p>CT、MRI、MRA、CTA、DSA 怎么选；T1/T2/FLAIR/DWI/SWI 怎么看。</p><span class="go">开始 →</span></div>
        <div class="sect-card" onclick="NS.go('hospital')"><div class="big">🏥</div><b>医院学科</b><p>科室定位、六大亚专科、院内与国际服务、核心病种与特色技术、转诊规范、培训计划——新入科必读。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('diseases')"><div class="big">📖</div><b>病种知识库</b><p>颅脑损伤 · 脑血管病 · 颅内肿瘤 · 脊柱脊髓 · 功能神外 · 先天与感染，按“基础/进阶”分层精读，🏥 标记医大重点病种。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('anatomy')"><div class="big">🧩</div><b>解剖图谱</b><p>颅骨、脑膜、脑叶功能区、脑室系统、Willis 环、脑干颅神经、脊髓——手绘示意图+学习要点。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('surgery')"><div class="big">🔬</div><b>手术方式详解</b><p>经典入路（翼点、乙状窦后、经蝶…）、颅脑损伤、脑血管、肿瘤、脊柱、功能手术的关键步骤与要点。</p><span class="go">进入 →</span></div>
      </div>
      <div class="card" style="margin-top:24px">
        <h3>🗺️ 推荐学习路径</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">非医学背景建议：<b>一图看懂</b> → <b>影像学入门</b> → <b>解剖图谱</b> → <b>病种知识（基础）</b>。已有医学基础者可从影像精读、手术入路与病例资源进入。右上角可直接搜索“MRA”“DWI”“动脉瘤”等关键词。</p>
      </div>
      <div class="foot-note">
        <b>⚠️ 医学声明：</b>本站内容依据公开教材与指南整理，用于医学学习交流。图谱为教学简化示意图，不替代专业解剖图谱；诊疗决策请以最新指南、上级医师意见及患者具体情况为准。
      </div>`;
  }

  /* ---------- 一图看懂 ---------- */
  const BRAIN_REGIONS = {
    frontal: { name:"额叶", color:"#f5b7b1", function:"计划、抑制、判断、主动运动与语言表达等高级功能。", symptom:"受影响时可能出现性格或执行力改变、对侧无力；优势半球额下回附近受损可出现表达性语言障碍。", clue:"查体关注行为、语言流利度和肢体力量；影像先定位是否靠近中央沟前方。" },
    parietal: { name:"顶叶", color:"#f9e79f", function:"整合触觉、本体感觉与空间注意，帮助大脑回答“身体和外界在哪里”。", symptom:"可出现对侧感觉异常、失用或空间忽略；表现受左右优势与具体部位影响。", clue:"查体关注感觉、空间注意和复杂动作；影像看中央沟后方及顶叶深部通路。" },
    temporal: { name:"颞叶", color:"#aed6f1", function:"参与听觉、记忆、情绪和语言理解，内侧结构包含海马。", symptom:"可出现记忆变化、局灶性癫痫发作；优势半球后颞区受损可影响语言理解。", clue:"结合发作形式、记忆和语言检查；MRI 对海马和颞叶细节更有帮助。" },
    occipital: { name:"枕叶", color:"#d7bde2", function:"视觉信息的主要皮层处理区域。", symptom:"可出现对侧视野缺损、视觉识别异常；眼睛本身可能没有问题。", clue:"做视野检查并沿视觉通路定位；DWI 对急性枕叶缺血很关键。" },
    cerebellum: { name:"小脑", color:"#a9dfbf", function:"校准动作、平衡、步态和眼球协调，让运动更准确流畅。", symptom:"可出现走路不稳、辨距不良、眼震或言语含糊，通常不是简单的“没力气”。", clue:"查协调与步态；后颅窝 CT 易受骨性伪影影响，MRI 常能显示更多细节。" },
    brainstem: { name:"脑干", color:"#f5cba7", function:"连接大脑、小脑与脊髓，容纳多条重要通路和多数颅神经核，也参与呼吸与意识维持。", symptom:"小病灶也可能造成复视、吞咽困难、交叉性体征、意识或呼吸问题。", clue:"出现急性脑干体征需紧急专业评估；MRI/DWI 与血管成像常具有重要价值。" }
  };

  function brainMapSVG(){
    const active = id => brainRegion===id ? " active" : "";
    return `<svg viewBox="0 0 680 470" role="img" aria-label="可点击的大脑外侧面功能分区示意图">
      <defs><filter id="soft"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".12"/></filter></defs>
      <text x="340" y="31" text-anchor="middle" font-size="18" font-weight="700" fill="#1e293b">点击一个脑区，建立“位置—功能—症状”联系</text>
      <path d="M123 165 Q132 83 239 62 Q363 31 484 81 Q568 116 574 205 Q580 281 519 331 Q461 375 355 369 Q250 365 180 319 Q118 278 114 215Z" fill="#f8fafc" stroke="#355b7d" stroke-width="4" filter="url(#soft)"/>
      <path class="brain-region${active('frontal')}" onclick="NS.selectBrain('frontal')" d="M123 165 Q132 83 239 62 Q276 53 316 55 L324 189 Q267 189 229 225 Q185 264 180 319 Q118 278 114 215Z" fill="#f5b7b1" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('parietal')}" onclick="NS.selectBrain('parietal')" d="M316 55 Q404 50 475 78 Q510 93 536 121 L487 225 Q409 190 324 189Z" fill="#f9e79f" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('temporal')}" onclick="NS.selectBrain('temporal')" d="M229 225 Q322 184 414 225 Q473 248 519 331 Q461 375 355 369 Q250 365 180 319 Q185 264 229 225Z" fill="#aed6f1" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('occipital')}" onclick="NS.selectBrain('occipital')" d="M536 121 Q571 157 574 205 Q580 281 519 331 Q493 270 487 225Z" fill="#d7bde2" stroke="#fff" stroke-width="3"/>
      <path class="brain-region${active('cerebellum')}" onclick="NS.selectBrain('cerebellum')" d="M428 320 Q493 298 541 330 Q550 375 503 402 Q448 422 401 382Z" fill="#a9dfbf" stroke="#355b7d" stroke-width="3"/>
      <path class="brain-region${active('brainstem')}" onclick="NS.selectBrain('brainstem')" d="M375 340 Q405 330 430 348 L441 445 L384 445Z" fill="#f5cba7" stroke="#355b7d" stroke-width="3"/>
      <text class="brain-label" x="205" y="142">额叶</text><text class="brain-label" x="395" y="126">顶叶</text>
      <text class="brain-label" x="315" y="295">颞叶</text><text class="brain-label" x="520" y="220">枕叶</text>
      <text class="brain-label" x="462" y="371">小脑</text><text class="brain-label" x="392" y="417">脑干</text>
      <path d="M323 73 Q309 125 324 189" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="286" y="92" text-anchor="end" font-size="11" fill="#c0392b">中央沟附近</text>
      <text x="24" y="445" font-size="11" fill="#64748b">教学简图 · 功能是网络，不是互不相干的彩色小格</text>
    </svg>`;
  }

  function renderVisual(){
    const r = BRAIN_REGIONS[brainRegion];
    $app.innerHTML = `
      <div class="plain-banner"><b>先记住一句：</b>症状能帮助定位，但一个功能通常由多个脑区和连接通路共同完成。左右半球、病变大小、起病速度都会改变表现。</div>
      <div class="visual-hero">
        <div class="brain-map">${brainMapSVG()}</div>
        <div class="visual-panel">
          <div class="eyebrow">VISUAL NEUROANATOMY</div><h2>一张图，先建立大脑地图</h2>
          <p>点选脑区。先看它“主要做什么”，再把症状和影像定位连起来。</p>
          <div class="brain-buttons">${Object.entries(BRAIN_REGIONS).map(([id,x])=>`<button class="${brainRegion===id?'active':''}" onclick="NS.selectBrain('${id}')">${x.name}</button>`).join("")}</div>
          <div class="brain-detail">
            <b style="color:${r.color}">${r.name} · 主要角色</b><div>${r.function}</div>
            <small><b style="font-size:12px;color:#fff">可能出现：</b>${r.symptom}</small>
            <small><b style="font-size:12px;color:#fff">下一步怎么想：</b>${r.clue}</small>
          </div>
        </div>
      </div>
      <div class="grid2">
        <div class="card"><h3>🧭 从症状反推位置</h3><p style="font-size:13px;color:var(--ink-2)"><b>先问起病速度：</b>几秒到几分钟更警惕血管事件；数小时到数天可见炎症、感染或演变中的出血；数周到数月更常进入占位、退变等鉴别。这里只是思路，不是诊断规则。</p></div>
        <div class="card"><h3>🧲 从位置选择影像</h3><p style="font-size:13px;color:var(--ink-2)">急性出血/创伤常先 CT；缺血、脑干、小脑、肿瘤与脊髓细节常依赖 MRI；怀疑血管问题再按情境选择 MRA、CTA 或 DSA。进入“影像学入门”看完整对照。</p><p style="margin-top:10px"><a href="#imaging" onclick="NS.go('imaging')">继续：MRI / MRA 一图入门 →</a></p></div>
      </div>
      <div class="warn-box">🚑 若出现突发口角歪斜或单侧无力、语言困难、意识改变、首次抽搐，或“突然发生的最剧烈头痛”，不要用本站自测，应立即寻求急诊专业评估。</div>`;
  }

  /* ---------- 影像学入门 ---------- */
  function renderImaging(){
    const s = IMAGING.sequences.find(x=>x.id===sequenceId) || IMAGING.sequences[0];
    const c = LEARNING_CASES.imaging.find(x=>x.id===imagingCaseId) || LEARNING_CASES.imaging[0];
    $app.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#10263d,#205d83 62%,#2d7dd2)">
        <div class="imaging-eyebrow">NEUROIMAGING, IN PLAIN LANGUAGE</div>
        <h2>脑影像不是猜图：先知道每种检查在回答什么</h2>
        <p>CT 擅长快速排急症，MRI 用多个序列描述组织，MRA/CTA/DSA 聚焦血管。读片的核心不是背“亮暗”，而是定位、跨序列验证，再回到临床问题。</p>
        <div class="tags"><span>CT / CTA</span><span>MRI 六大序列</span><span>MRA / DSA</span><span>七步读片法</span></div>
      </div>
      <section class="viewer-lab">
        <div class="viewer-head"><div><div class="section-kicker">INTERACTIVE READING ROOM</div><h2>真实体数据阅片室</h2><p>这里不是图片轮播。把鼠标放在影像上滚动切片，拖动十字线定位，切换三个正交方向；先自己找，再打开标注核对。</p></div><span class="live-badge">● 可交互 NIfTI</span></div>
        <div class="case-tabs">${LEARNING_CASES.imaging.map(x=>`<button class="${x.id===imagingCaseId?'active':''}" onclick="NS.selectImagingCase('${x.id}')"><small>${x.badge}</small>${x.label}</button>`).join("")}</div>
        <div class="viewer-grid">
          <div class="viewer-stage">
            <div class="viewer-toolbar">
              <div class="plane-buttons"><button data-plane="axial" onclick="MedicalViewer.setPlane('axial')">轴位</button><button data-plane="coronal" onclick="MedicalViewer.setPlane('coronal')">冠状位</button><button data-plane="sagittal" onclick="MedicalViewer.setPlane('sagittal')">矢状位</button><button data-plane="multiplanar" class="active" onclick="MedicalViewer.setPlane('multiplanar')">三平面</button></div>
              ${c.volumes.length>1?'<label class="overlay-toggle"><input type="checkbox" onchange="MedicalViewer.toggleOverlay(this.checked)"> 显示病灶标注</label>':''}
            </div>
            <div class="canvas-wrap"><canvas id="niivue-canvas" aria-label="可滚动的三维医学影像阅片器"></canvas><div class="viewer-help">滚轮：逐层切片　拖动：移动十字线　右键拖动：调窗</div></div>
            <div id="viewer-status" class="viewer-status">正在准备阅片器…</div>
          </div>
          <aside class="case-coach"><div class="case-tag">病例任务</div><h3>${c.title}</h3><div class="coach-question"><b>先观察</b><p>${c.question}</p></div><ol>${c.notes.map(n=>`<li>${n}</li>`).join("")}</ol>
            <button class="reveal-btn" onclick="NS.toggleImagingAnswer()">${imagingRevealed?'收起答案':'完成观察，揭晓要点'}</button>
            ${imagingRevealed?`<div class="coach-answer"><b>核对思路</b><p>${c.answer}</p></div>`:''}
            <small class="data-source">数据说明：${c.source}</small>
          </aside>
        </div>
      </section>
      <div class="card"><h3>① 五种检查，分别擅长什么？</h3><div class="modality-grid">${IMAGING.modalities.map(m=>`
        <div class="modality-card" style="--accent:${m.color}"><div class="mi">${m.icon}</div><h4>${m.name}</h4><div class="short">${m.short}</div><p>${m.plain}</p>
        <ul>${m.best.map(x=>`<li>${x}</li>`).join("")}</ul><p class="limit"><b>边界：</b>${m.limits}</p></div>`).join("")}</div></div>
      <div class="card"><h3>② MRI 像换滤镜：同一块脑，用六种方式看</h3>
        <div class="sequence-layout"><div class="sequence-tabs">${IMAGING.sequences.map(x=>`<button class="${x.id===sequenceId?'active':''}" onclick="NS.selectSequence('${x.id}')">${x.name} · ${x.cue}</button>`).join("")}</div>
        <div class="sequence-screen"><div class="eyebrow">SELECTED SEQUENCE</div><h3>${s.name}</h3><p>${s.plain}</p>
          <div class="sequence-facts"><div class="sequence-fact"><b>水 / 脑脊液</b>${s.water}</div><div class="sequence-fact"><b>脂肪</b>${s.fat}</div><div class="sequence-fact"><b>主要用途</b>${s.use}</div><div class="sequence-fact"><b>最容易误解</b>${s.avoid}</div></div>
        </div></div></div>
      <div class="card"><h3>③ 常见模式：先学“组合”，不要用一个亮点下诊断</h3><div class="pattern-grid">${IMAGING.patterns.map(p=>`<div class="pattern-card"><h4>${p.icon} ${p.name}</h4><div class="pattern-line">${p.line}</div><p>${p.next}</p><p style="margin-top:7px;color:#a65d00"><b>别踩坑：</b>${p.warn}</p></div>`).join("")}</div></div>
      <div class="card"><h3>④ 七步读片法</h3><div class="checklist">${IMAGING.checklist.map(x=>`<div class="check-item"><div class="check-num">${x[0]}</div><div><b>${x[1]}</b><p>${x[2]}</p></div></div>`).join("")}</div></div>
      <div class="grid2"><div class="card"><h3>⑤ 报告里的词，翻译成人话</h3><table class="glossary-table">${IMAGING.glossary.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join("")}</table></div>
      <div class="card"><h3>⑥ 看完报告，正确的下一步</h3><p style="font-size:13px;color:var(--ink-2)">先看“印象/结论”，再回到“所见”找证据；把报告与症状、既往片和医生判断放在一起。不要只截取“异常信号”“强化”或“动脉瘤可能”等单词自行判断严重程度。</p>
        <div class="warn-box" style="margin-top:14px">本站不提供个体影像诊断。急性神经症状按急诊处理；非急症请携带完整 DICOM、正式报告和既往检查咨询放射科/神经科/神经外科专业人员。</div>
        <div class="source-list">${IMAGING.references.map(r=>`<a href="${r.url}" target="_blank" rel="noopener">${r.name} ↗</a>`).join("")}</div></div></div>`;
    if(window.MedicalViewer) setTimeout(()=>window.MedicalViewer.init(imagingCaseId),0);
  }

  function caseLabHTML(title){
    const c = LEARNING_CASES.clinic.find(x=>x.id===clinicCaseId) || LEARNING_CASES.clinic[0];
    const stages = [
      ["① 症状与时间轴", `${c.title} · 起病速度：${c.tempo}`],
      ["② 第一反应", c.first], ["③ 影像策略", c.image], ["④ 决策核心", c.decision]
    ];
    return `<section class="reasoning-lab"><div class="section-kicker">CASE-BASED LEARNING</div><h2>${title}</h2><p class="lab-intro">先看有限信息作出下一步选择，再逐层揭示检查与决策依据。病例用于训练思路，不用于个人诊断。</p>
      <div class="mini-case-tabs">${LEARNING_CASES.clinic.map(x=>`<button class="${x.id===clinicCaseId?'active':''}" onclick="NS.selectClinicCase('${x.id}')">${x.icon} ${x.title}</button>`).join("")}</div>
      <div class="timeline">${stages.map((x,i)=>`<button class="timeline-step ${i<clinicStage?'shown':''}" onclick="NS.setClinicStage(${i+1})"><span>${i+1}</span><div><b>${x[0]}</b><p>${i<clinicStage?x[1]:'点击后揭示'}</p></div></button>`).join("")}</div>
      ${clinicStage>=4?`<div class="case-trap"><b>容易踩的坑：</b>${c.trap}</div>`:''}</section>`;
  }

  /* ---------- 病种知识库 ---------- */
  function diseaseCardHTML(d){
    const isCore = typeof HOSPITAL_CORE_IDS !== "undefined" && HOSPITAL_CORE_IDS.includes(d.id);
    return `
    <div class="disease-card" id="dis-${d.id}">
      <div class="dc-head" onclick="NS.toggleDisease('${d.id}')">
        <span>${chip(d.level)}</span>
        ${isCore?'<span class="chip" style="background:#fdecea;color:#c0392b">🏥 医大重点</span>':''}
        <span class="t">${esc(d.name)}</span>
        <span class="arrow">▸</span>
      </div>
      <div class="dc-body">
        <div class="intro-box">📌 ${esc(d.intro)}</div>
        <div class="sub-block"><h4>临床表现</h4><ul>${d.clinical.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        <div class="sub-block"><h4>影像学要点</h4><ul>${d.imaging.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        <div class="sub-block"><h4>治疗原则</h4><ul>${d.treatment.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>
        ${d.advanced?`<div class="sub-block"><h4>进阶要点</h4><ul>${d.advanced.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>`:""}
        ${d.alert?`<div class="warn-box">⚠️ ${esc(d.alert)}</div>`:""}
      </div>
    </div>`;
  }

  function renderDiseases(){
    const cats = DISEASES.map(c=>c).filter(c=> c.items.length);
    const filterBar = `
      <div class="filter-bar">
        <button class="filter-btn ${diseaseFilter==='all'?'active':''}" onclick="NS.setDFilter('all')">全部（${DISEASE_FLAT.length}）</button>
        ${cats.map(c=>`<button class="filter-btn ${diseaseFilter===c.cat?'active':''}" onclick="NS.setDFilter('${c.cat}')">${c.icon} ${c.catName}（${c.items.length}）</button>`).join("")}
      </div>`;
    if(diseaseFilter === "all"){
      $app.innerHTML = caseLabHTML("从症状走到影像与决策") + filterBar + cats.map(c=>`
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:18px 20px 8px;display:flex;align-items:center;gap:10px">
            <span style="font-size:26px">${c.icon}</span>
            <div><b style="font-size:17px">${c.catName}</b>
            <span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 个病种</span></div>
          </div>
          <div style="padding:6px 20px 14px">
            <span class="chip chip-cat">概述</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span>
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

  /* ---------- 解剖图谱 ---------- */
  const LOBE_DETAILS = {
    overview:{ title:"大脑外侧面：先用沟裂定方向", role:"左侧为前、右侧为后。先找中央沟和外侧沟，再区分四个脑叶；功能是网络协作，不是互不相干的彩色格子。", includes:["中央沟前：中央前回（以初级运动皮质 M1 为主）","中央沟后：中央后回（以初级体感皮质 S1 为主）","外侧沟下方：颞叶；后端：枕叶"], symptom:"定位时先结合症状的起病速度、侧别和完整查体，不能只凭一个表现给病变命名。", imaging:"在 MRI 轴位、冠状位和矢状位上反复对照中央沟、外侧沟与脑室，才能把二维切片还原成这个外侧面。", surgery:"手术规划必须额外评估优势半球语言、运动功能区、血管和白质束，不能仅依据这张表面图。" },
    frontal:{ title:"额叶：计划、抑制、运动与语言表达", role:"额叶位于中央沟前方、外侧沟上方；中央前回是随意运动的重要皮层区。优势半球额下回附近常与语言表达有关。", includes:["中央前回：初级运动皮质（M1）","额前叶：执行功能、计划、抑制与社会行为","优势半球额下回：Broca 区附近，参与语言表达"], symptom:"可能出现对侧无力、动作笨拙、执行功能或人格行为改变；优势半球特定区域受损可有非流利性失语。表现取决于范围与优势半球。", imaging:"影像上先确认病灶是否位于中央沟前方，并沿相邻层面追踪到中央前回；急性缺血常需 DWI/ADC 与血管成像一起判断。", surgery:"靠近中央前回或优势半球额下回时，常需结合功能定位、神经导航和术中监测来定义安全边界。" },
    parietal:{ title:"顶叶：感觉整合与空间注意", role:"顶叶位于中央沟后方、外侧沟上方。中央后回是初级体感皮质（S1）的重要区域；更后方顶叶参与空间注意与复杂动作。", includes:["中央后回：触觉、本体觉等体感信息","优势半球顶叶：计算、书写、复杂动作组织","非优势半球顶叶：空间注意与身体/环境表征"], symptom:"可出现对侧感觉异常、空间忽略、失用等；左右半球和具体部位不同，表现并不完全一样。", imaging:"重点看中央沟后方及顶叶深部白质通路；对称性和是否累及皮层/皮层下结构都重要。", surgery:"顶叶手术除保护感觉运动区外，也要重视视放射、语言和空间认知等功能网络。" },
    temporal:{ title:"颞叶：听觉、记忆与语言理解网络", role:"颞叶位于外侧沟下方。上颞回与听觉相关，内侧颞叶包含海马等记忆结构；优势半球后部颞叶常与语言理解网络有关。", includes:["上颞回：听觉处理","内侧颞叶/海马：记忆网络的重要组成","优势半球后颞区：Wernicke 区附近，参与语言理解"], symptom:"可有记忆下降、局灶性癫痫发作、听觉/语言理解困难；不能把所有颞叶病变等同于同一种失语。", imaging:"MRI 对海马、颞角和颞叶皮层下病变更敏感；癫痫评估通常需要专门序列和多学科解读。", surgery:"颞叶尤其内侧结构与语言、记忆、视野有关；切除范围必须与病灶性质和功能评估一起决定。" },
    occipital:{ title:"枕叶：视觉皮层与视觉通路终点", role:"枕叶位于大脑最后方。主要视觉皮层位于内侧面的距状沟周围，因此外侧面只显示枕叶的大致位置。", includes:["距状沟周围：主要视觉皮层（V1）","枕叶与顶叶、颞叶共同参与更复杂的视觉处理","外侧面没有清晰天然沟把枕叶完全切开"], symptom:"可能出现对侧视野缺损、视觉识别异常；眼球和视神经检查正常并不排除后部视觉通路病变。", imaging:"怀疑急性后循环缺血时，DWI 和血管成像很关键；需把病灶与视放射、枕叶内侧皮层的关系一起看。", surgery:"后部病变手术要把视野保护纳入风险告知与规划，不能只根据肉眼看到的外侧表面判断。" },
    central:{ title:"中央沟附近：运动区与感觉区的分界线", role:"中央沟不是一道“功能墙”，但它是非常重要的表面定位标志：前方中央前回以运动功能为主，后方中央后回以感觉功能为主。", includes:["中央前回：M1，控制对侧随意运动","中央后回：S1，处理对侧体感信息","手、面和下肢在皮层上有不同的体表定位"], symptom:"靠近这里的病变可产生对侧力量或感觉改变；面、手、下肢的受累分布可为定位提供线索。", imaging:"不要只在一张轴位片上找中央沟；应在三平面连续追踪，并结合脑沟形态和中央前/后回特征判断。", surgery:"中央沟周围是功能外科和肿瘤手术的高风险区域，通常需使用个体化功能成像、皮层刺激或神经电生理监测。" }
  };

  const ANATOMY_HOTSPOTS = {
    "skull-front": [
      { x:48, y:27, label:"额骨", title:"额骨：前额与前颅窝的屋顶", role:"正面观最上方的大块骨，构成前额、眶上缘和部分前颅窝底。", find:"先找两侧眼眶，再向上看整片前额区域；眉弓上方就是额骨。", clinical:"额窦、眶顶和前颅窝底骨折会影响手术入路、脑脊液漏风险和眼眶相关症状。" },
      { x:50, y:47, label:"眼眶", title:"眼眶：眼球、视神经与眶内容物的骨性通道", role:"由多块骨共同围成，容纳眼球、眼外肌、血管和视神经。", find:"两侧对称的大空腔就是眼眶，先认眶上缘、眶下缘和眶内侧壁。", clinical:"颅底、眶尖和海绵窦附近病变常会牵涉视力、眼球运动和复视。" },
      { x:30, y:57, label:"颧骨", title:"颧骨：面中部外侧支架", role:"形成颧弓前部和眼眶外下壁，是面部轮廓的重要骨性支撑。", find:"从眼眶外下缘向外下方追踪，突出的颊部骨性结构就是颧骨。", clinical:"颧骨、眶壁和上颌骨骨折会改变面中部稳定性，也影响眶内容物和咬合。" },
      { x:47, y:66, label:"上颌骨", title:"上颌骨：上牙列与鼻腔、眼眶相邻", role:"构成上牙槽、鼻腔外侧壁和部分眶底。", find:"鼻腔两侧、上牙列上方的大块骨就是上颌骨。", clinical:"上颌窦、眶底和鼻腔关系密切；颌面创伤或颅底入路需要理解这个空间。" },
      { x:51, y:84, label:"下颌骨", title:"下颌骨：唯一可活动的颅面骨", role:"承载下牙列，通过颞下颌关节与颅骨相连。", find:"正面最下方 U 形骨性结构，围绕下牙列。", clinical:"气道管理、面部外伤和颞下颌关节问题都离不开下颌骨定位。" }
    ],
    "skull-side": [
      { x:34, y:26, label:"冠状缝", title:"冠状缝：额骨与顶骨的边界", role:"把前方额骨和后方顶骨分开，是侧面颅骨定位的第一条大缝。", find:"从颅顶向下走，位于额骨和顶骨交界的锯齿状线。", clinical:"儿童骨缝过早闭合会影响颅形；外伤读片时骨缝和骨折线要区分。" },
      { x:66, y:38, label:"人字缝", title:"人字缝：顶骨与枕骨的交界", role:"位于后上方，连接两侧顶骨与枕骨。", find:"先找到后方枕骨，再向上看 V 形或锯齿状交界。", clinical:"后部颅骨骨折、儿童颅缝发育和后颅窝入路都需要辨认它。" },
      { x:34, y:55, label:"翼点", title:"翼点：四骨交界的薄弱区", role:"额、顶、颞、蝶四骨交界处，是神经外科很重要的体表定位点。", find:"位于颧弓上方、额骨后下方、颞窝前上部。", clinical:"深面邻近脑膜中动脉前支；翼点入路、硬膜外血肿定位都常提到它。" },
      { x:25, y:62, label:"鳞状缝", title:"鳞状缝：顶骨与颞骨之间", role:"位于颞窝上方，把顶骨和颞骨鳞部区分开。", find:"从外耳门上方往前上方看，弧形骨缝附近就是鳞状缝。", clinical:"颞部外伤、颞肌剥离和侧方入路时容易遇到这一层次。" },
      { x:37, y:73, label:"外耳门", title:"外耳门：侧颅底定位锚点", role:"外耳道入口，是侧面颅骨图上很稳定的定位点。", find:"颧弓后下方的圆形开口。", clinical:"乳突、乙状窦后入路和颞骨手术常以外耳门、乳突等标志定方向。" }
    ],
    meninges: [
      { x:48, y:18, label:"上矢状窦", title:"上矢状窦：硬膜静脉回流主干", role:"位于大脑镰上缘，收集浅表静脉血并接收蛛网膜颗粒回吸的脑脊液。", find:"冠状切面最上方、正中硬膜内的静脉窦。", clinical:"旁矢状窦肿瘤、静脉窦血栓和手术止血都需要保护它。" },
      { x:31, y:35, label:"硬脑膜", title:"硬脑膜：最外层、最坚韧", role:"贴近颅骨内板，内层反折形成大脑镰、小脑幕等结构。", find:"从颅骨内面向内看，最外侧厚实的一层。", clinical:"硬膜外血肿在颅骨和硬膜之间，硬膜下血肿在硬膜与蛛网膜之间。" },
      { x:39, y:49, label:"蛛网膜", title:"蛛网膜：跨过脑沟的一层薄膜", role:"位于硬脑膜内侧，不深入脑沟，下面是含脑脊液的蛛网膜下腔。", find:"看它像桥一样跨过脑沟，而不是贴进沟底。", clinical:"蛛网膜下腔出血、脑脊液循环和脑池都与这一层有关。" },
      { x:43, y:61, label:"软脑膜", title:"软脑膜：紧贴脑表面", role:"贴着脑回脑沟起伏进入沟底，最靠近脑组织。", find:"在脑表面最内侧，沿脑沟脑回走行。", clinical:"感染、炎症和血管进入脑表面的关系常要从软脑膜层次理解。" },
      { x:50, y:46, label:"蛛网膜下腔", title:"蛛网膜下腔：脑脊液与血管所在空间", role:"位于蛛网膜与软脑膜之间，含脑脊液和脑表面血管。", find:"在跨沟的蛛网膜下方、贴脑表面的软脑膜上方。", clinical:"动脉瘤破裂常表现为蛛网膜下腔出血，CT 或腰穿会围绕这个空间判断。" }
    ],
    medial: [
      { x:44, y:37, label:"胼胝体", title:"胼胝体：连接左右半球的白质桥", role:"巨大的 C 形白质束，负责两半球之间的信息传递。", find:"正中矢状面中央偏上、弯曲的白色弓形结构。", clinical:"胼胝体受侵可提示跨半球病变；部分癫痫手术会涉及胼胝体切开。" },
      { x:49, y:51, label:"丘脑", title:"丘脑：感觉与意识通路中继站", role:"多数感觉信息通往皮层前会经过丘脑整合。", find:"胼胝体下方、第三脑室两侧的深部灰质团块。", clinical:"丘脑出血或梗死可出现感觉障碍、意识改变或复杂神经症状。" },
      { x:50, y:61, label:"垂体", title:"垂体：鞍区内分泌核心", role:"位于蝶鞍内，通过垂体柄与下丘脑相连。", find:"在脑底正中、视交叉和下丘脑下方的小腺体。", clinical:"垂体瘤可造成内分泌异常、视交叉受压和头痛。" },
      { x:63, y:72, label:"脑干", title:"脑干：中脑、桥脑、延髓连续体", role:"连接大脑、小脑和脊髓，包含重要传导束与颅神经核。", find:"从丘脑下方往后下方追踪，依次到中脑、桥脑、延髓。", clinical:"小病灶也可造成复视、吞咽困难、交叉性体征或意识障碍。" },
      { x:73, y:43, label:"距状沟", title:"距状沟：初级视觉皮层周围", role:"枕叶内侧面的关键沟裂，周围是主要视觉皮层。", find:"在内侧面后部，沿枕叶内侧横向走行。", clinical:"距状沟周围病变常与对侧视野缺损相关。" }
    ],
    ventricles: [
      { x:35, y:26, label:"侧脑室", title:"侧脑室：脑脊液循环起点之一", role:"左右各一，含额角、体部、枕角和颞角。", find:"先找两侧对称、最大的一对脑室腔。", clinical:"侧脑室扩大常提示脑积水、脑萎缩或占位压迫后的形态改变。" },
      { x:50, y:35, label:"室间孔", title:"室间孔：侧脑室通向第三脑室", role:"连接侧脑室与第三脑室，是脑脊液流动的狭窄通道。", find:"位于侧脑室向中线汇入第三脑室的入口处。", clinical:"这里阻塞可导致一侧或双侧侧脑室扩大。" },
      { x:50, y:47, label:"第三脑室", title:"第三脑室：中线深部腔隙", role:"位于两侧丘脑之间，向下接中脑导水管。", find:"在中线、侧脑室下方的细长腔隙。", clinical:"第三脑室区病变可引起梗阻性脑积水或下丘脑相关表现。" },
      { x:50, y:61, label:"中脑导水管", title:"中脑导水管：最容易狭窄的细通道", role:"连接第三脑室和第四脑室。", find:"第三脑室向下到第四脑室之间最细的一段。", clinical:"导水管狭窄是梗阻性脑积水的经典原因之一。" },
      { x:50, y:74, label:"第四脑室", title:"第四脑室：后颅窝脑脊液腔", role:"位于脑干背侧、小脑腹侧，向蛛网膜下腔开放。", find:"后颅窝中线、桥脑延髓背后的菱形腔。", clinical:"后颅窝肿瘤或出血可压迫第四脑室，引起急性脑积水。" }
    ],
    willis: [
      { x:50, y:27, label:"前交通", title:"前交通动脉：前循环闭环关键点", role:"连接左右大脑前动脉。", find:"脑底前方、中线处连接两侧 ACA 的短桥。", clinical:"前交通动脉瘤常见，破裂可导致蛛网膜下腔出血。" },
      { x:34, y:42, label:"颈内动脉", title:"颈内动脉：前循环入口", role:"向颅内供应 ACA、MCA 等前循环分支。", find:"从两侧进入脑底，向上分出大脑前、中动脉。", clinical:"狭窄、闭塞或动脉瘤会影响前循环供血和治疗策略。" },
      { x:31, y:33, label:"大脑中动脉", title:"大脑中动脉：外侧裂方向的大分支", role:"供应大脑外侧面大量皮层和深穿支区域。", find:"从颈内动脉分叉后向外侧裂方向走。", clinical:"MCA 卒中常见，可影响运动、感觉、语言或空间注意。" },
      { x:63, y:52, label:"后交通", title:"后交通动脉：前后循环连接", role:"连接颈内动脉系统与大脑后动脉。", find:"位于 ICA 后方，斜向后连接 PCA。", clinical:"后交通动脉瘤可压迫动眼神经，出现眼睑下垂、复视等表现。" },
      { x:50, y:72, label:"基底动脉", title:"基底动脉：椎基底系统主干", role:"由双侧椎动脉汇合形成，沿脑桥腹侧上行。", find:"脑底后方正中、从下往上的粗大动脉。", clinical:"基底动脉闭塞是高危卒中，需要紧急专业处理。" }
    ],
    brainstem: [
      { x:47, y:24, label:"中脑", title:"中脑：上接间脑、下接桥脑", role:"含动眼神经相关核团和重要上下行传导束。", find:"脑干最上段，位于桥脑上方。", clinical:"中脑病变可出现眼球运动异常、瞳孔改变、运动或意识问题。" },
      { x:49, y:45, label:"桥脑", title:"桥脑：腹侧膨隆的脑干中段", role:"连接大脑、小脑和延髓，含多条颅神经相关结构。", find:"脑干中部最膨隆的一段，前方常见基底动脉关系。", clinical:"桥脑病变可出现面瘫、眼球运动异常、肢体无力或意识障碍。" },
      { x:51, y:67, label:"延髓", title:"延髓：脑干下段与脊髓连接", role:"含生命维持相关中枢和吞咽、声音等相关颅神经核团。", find:"桥脑下方逐渐变窄，向下连续脊髓。", clinical:"延髓病变可影响吞咽、声音、呼吸和交叉性感觉运动体征。" },
      { x:70, y:48, label:"小脑", title:"小脑：平衡与协调调校器", role:"参与平衡、步态、眼动和精细运动协调。", find:"脑干后方的大块叶状结构。", clinical:"小脑病变常表现为共济失调、眼震、走路不稳，不一定是单纯无力。" },
      { x:50, y:84, label:"脊髓", title:"脊髓：脑干向下的连续通路", role:"承接上下行运动、感觉和自主神经通路。", find:"延髓下方继续向椎管内延伸。", clinical:"延髓和上颈髓交界病变风险高，症状可快速严重。" }
    ],
    spinal: [
      { x:50, y:35, label:"后角", title:"后角：感觉信息入口附近", role:"主要与感觉传入信息处理有关。", find:"脊髓横断面后方较细长的灰质角。", clinical:"后根、后角和后索问题常与感觉异常、疼痛或本体觉改变相关。" },
      { x:50, y:62, label:"前角", title:"前角：下运动神经元所在区域", role:"含支配骨骼肌的运动神经元。", find:"横断面前方较宽大的灰质角。", clinical:"前角细胞受损可出现肌无力、萎缩和腱反射改变。" },
      { x:50, y:49, label:"中央管", title:"中央管：脊髓中央小腔", role:"位于灰质中央，内含少量脑脊液。", find:"H 形灰质正中央的小点或小管腔。", clinical:"脊髓空洞症常围绕中央区域扩展，影响交叉痛温觉纤维。" },
      { x:68, y:43, label:"后根神经节", title:"后根神经节：感觉神经元胞体聚集", role:"后根上膨大的结构，含感觉神经元胞体。", find:"脊髓外侧、后根路径上的膨大结节。", clinical:"神经根痛、带状疱疹相关神经痛等常会提到这一结构。" },
      { x:35, y:50, label:"白质", title:"白质：上下行传导束所在", role:"包绕灰质，包含运动、感觉等长传导通路。", find:"H 形灰质外围较浅色区域。", clinical:"不同传导束受损组合决定脊髓损伤综合征的表现。" }
    ],
    "spine-side": [
      { x:37, y:33, label:"椎体", title:"椎体：脊柱前方承重结构", role:"承担主要轴向负重，通过椎间盘上下相连。", find:"侧面观最前方一列方块样骨性结构。", clinical:"压缩骨折、肿瘤破坏和退变稳定性评估都要看椎体。" },
      { x:39, y:47, label:"椎间盘", title:"椎间盘：椎体之间的缓冲垫", role:"由外层纤维环和中央髓核组成，帮助承重和活动。", find:"相邻椎体之间的间隙结构。", clinical:"突出或膨出可压迫神经根或脊髓，症状取决于节段和方向。" },
      { x:76, y:44, label:"纤维环", title:"纤维环：椎间盘外层", role:"环形纤维结构包绕髓核，维持椎间盘形态。", find:"横断面中围绕中央髓核的外圈。", clinical:"纤维环破裂后，髓核可向后外侧突出刺激神经根。" },
      { x:79, y:52, label:"髓核", title:"髓核：椎间盘中央胶冻样核心", role:"负责分散压力，是突出物的重要来源。", find:"横断面椎间盘中央区域。", clinical:"髓核突出方向决定压迫硬膜囊、神经根还是脊髓。" },
      { x:62, y:39, label:"神经根", title:"神经根：从椎间孔离开椎管", role:"连接脊髓与外周神经，支配相应节段感觉和运动。", find:"侧面观从椎间孔向外走出的细长结构。", clinical:"根性痛、麻木和肌力下降常按神经根节段定位。" }
    ],
    "dural-layers": [
      { x:27, y:28, label:"前颅窝", title:"前颅窝：额叶底面与嗅神经区域", role:"承托额叶底面，包含筛板等结构。", find:"颅底内面最前、最浅的一窝。", clinical:"前颅窝底骨折可出现脑脊液鼻漏和嗅觉问题。" },
      { x:50, y:41, label:"中颅窝", title:"中颅窝：颞叶、海绵窦与蝶鞍区域", role:"位于前后颅窝之间，容纳颞叶和鞍区结构。", find:"蝶骨小翼后方、岩骨嵴前方的区域。", clinical:"垂体、海绵窦、三叉神经和颞叶底面病变常关联这里。" },
      { x:69, y:57, label:"后颅窝", title:"后颅窝：小脑与脑干所在", role:"容纳小脑、脑干和第四脑室。", find:"颅底内面最后、最深的窝。", clinical:"后颅窝空间小，出血或肿瘤可快速压迫脑干和第四脑室。" },
      { x:59, y:68, label:"枕骨大孔", title:"枕骨大孔：延髓到脊髓的门户", role:"脑干下端和脊髓在这里连续，椎动脉也经附近进入颅内。", find:"后颅窝中央的大孔。", clinical:"小脑扁桃体下疝、颅颈交界畸形和后颅窝减压都围绕它判断。" },
      { x:58, y:45, label:"岩骨嵴", title:"岩骨嵴：中后颅窝分界", role:"颞骨岩部上缘，是中颅窝和后颅窝的骨性分界。", find:"在颅底侧后方斜行的坚硬骨嵴。", clinical:"岩斜区、桥小脑角和乙状窦后入路会反复用到这个方向感。" }
    ]
  };

  function anatomySpotsFor(a,g){
    const configured = ANATOMY_HOTSPOTS[a.id];
    if(configured && configured.length) return configured;
    return (g.labels || []).map((x,i)=>({ x:20 + (i%2)*45, y:22 + i*12, label:x[1], title:`${x[1]}：${x[0]}`, role:`图中英文标注为 ${x[0]}，中文为${x[1]}。`, find:(g.landmarks || [])[i % Math.max((g.landmarks || []).length,1)] || "先按方向和相邻结构定位。", clinical:(a.points || [])[i % Math.max((a.points || []).length,1)] || "结合症状、影像和相邻结构理解临床意义。" }));
  }

  function anatomySpotDetail(a,g){
    const spots = anatomySpotsFor(a,g);
    const idx = Math.min(anatomySpotFocus[a.id] || 0, Math.max(spots.length - 1, 0));
    const s = spots[idx] || {title:a.name,role:a.desc,find:"先看方向，再找稳定标志。",clinical:(a.points||[])[0]||""};
    return `<div class="lobe-focus-panel anatomy-spot-panel"><div class="lobe-focus-title"><span>点击图中中文标签可切换</span><h3>${esc(s.title)}</h3></div><div class="lobe-focus-section"><b>它是什么</b><p>${esc(s.role)}</p></div><div class="lobe-focus-section"><b>图上怎么找</b><p>${esc(s.find)}</p></div><div class="lobe-focus-section surgery"><b>为什么临床要认识</b><p>${esc(s.clinical)}</p></div><div class="anatomy-coach-block"><h4>快速复盘</h4><ol>${(g.landmarks||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div></div>`;
  }

  function anatomyInteractiveFigure(a,g){
    const spots = anatomySpotsFor(a,g);
    const active = Math.min(anatomySpotFocus[a.id] || 0, Math.max(spots.length - 1, 0));
    return `<div class="anatomy-hotspot-wrap"><img src="${g.image}" alt="${esc(a.name)}中文互动解剖图" loading="lazy">${spots.map((s,i)=>`<button class="anat-hotspot ${i===active?'active':''}" style="left:${s.x}%;top:${s.y}%" onclick="NS.selectAnatomySpot('${a.id}',${i})" title="${esc(s.title)}"><i></i><span>${esc(s.label)}</span></button>`).join("")}<div class="reference-hint">点击中文标签查看解释 · 原始英文图可切到“原始教材图”</div></div>`;
  }

  function lobeInteractiveSVG(){
    const focus = anatomyFocus;
    const hit = id => `lobe-hit ${focus===id?'selected':''}`;
    return `<div class="lobe-interactive-wrap"><svg class="lobe-interactive" viewBox="0 0 545 500" role="img" aria-label="可点击的大脑外侧面中文互动图">
      <defs><clipPath id="brain-crop"><path d="M15 112 Q30 40 142 14 Q262 -4 380 38 Q490 72 520 166 Q542 234 505 292 Q478 337 446 356 Q464 395 426 425 Q386 443 350 408 L343 500 L302 500 L306 421 Q230 430 145 392 Q62 356 22 288 Q0 230 5 168 Z"/></clipPath></defs>
      <image href="assets/anatomy-reference/lobes.jpg" x="-40" y="-86" width="733" height="621" clip-path="url(#brain-crop)" opacity=".98"/>
      <path class="${hit('frontal')}" onclick="NS.selectLobe('frontal')" d="M12 90 Q42 25 160 15 Q245 10 300 70 L303 205 Q265 270 205 324 Q120 356 48 320 Q8 275 8 185Z"/>
      <path class="${hit('parietal')}" onclick="NS.selectLobe('parietal')" d="M294 38 Q388 20 482 88 Q530 135 510 224 L414 246 L303 196Z"/>
      <path class="${hit('temporal')}" onclick="NS.selectLobe('temporal')" d="M110 232 Q230 178 340 205 Q415 232 461 314 Q400 402 265 417 Q150 400 94 322Z"/>
      <path class="${hit('occipital')}" onclick="NS.selectLobe('occipital')" d="M472 104 Q540 142 528 240 Q514 314 446 352 Q431 320 442 256 Q450 178 472 104Z"/>
      <path class="${hit('central')}" onclick="NS.selectLobe('central')" d="M303 42 Q278 115 286 184 Q294 250 276 322" fill="none" stroke="transparent" stroke-width="32"/>
      <g class="cn-label" pointer-events="none"><text x="150" y="150">额叶</text><text x="370" y="145">顶叶</text><text x="260" y="330">颞叶</text><text x="466" y="260">枕叶</text></g>
      <g class="functional-tag" pointer-events="none"><rect x="270" y="89" width="38" height="54" rx="8"/><text x="289" y="121">M1</text><rect x="310" y="89" width="38" height="54" rx="8"/><text x="329" y="121">S1</text></g>
      <g class="cn-callout" pointer-events="none"><path d="M286 64 L360 28"/><text x="367" y="32">中央沟</text><path d="M248 218 L64 254"/><text x="17" y="268">外侧沟</text></g>
    </svg><div class="lobe-interaction-tip">点击彩色脑区或中央沟附近，查看中文功能说明</div></div>`;
  }

  function lobeFocusPanel(){
    const d = LOBE_DETAILS[anatomyFocus] || LOBE_DETAILS.overview;
    return `<div class="lobe-focus-panel"><div class="lobe-focus-title"><span>已选区域</span><h3>${d.title}</h3></div><div class="lobe-focus-section"><b>主要作用</b><p>${d.role}</p></div><div class="lobe-focus-section"><b>包括哪些重要结构</b><ul>${d.includes.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="lobe-focus-section warn"><b>受影响时可能出现</b><p>${d.symptom}</p></div><div class="lobe-focus-section"><b>影像上怎么找</b><p>${d.imaging}</p></div><div class="lobe-focus-section surgery"><b>手术/临床意义</b><p>${d.surgery}</p></div></div>`;
  }

  function renderAnatomy(){
    $app.innerHTML = `
      <div class="anatomy-mission"><div><div class="section-kicker">LOCATION → FUNCTION → DEFICIT</div><h2>解剖不是认名字，而是解释症状</h2><p>每看一个结构都回答：它在哪里？与谁相邻？损伤后会发生什么？手术或穿刺时为什么要避开它？</p></div><button onclick="NS.go('imaging')">进入三维断层定位 →</button></div>
      <div class="card">
        <h3>🧩 新版读图方法</h3>
        <p style="font-size:13.5px;color:var(--ink-2)"><b>标准教材图</b>用于建立真实比例和空间关系；<b>中文速记图</b>只帮助记忆，不代表真实比例。先看方向，再找三个标志，最后把结构与症状、影像和手术风险连接起来。</p>
      </div>
      ${ANATOMY.map(a=>{
        const g = ANATOMY_GUIDES[a.id] || {image:null,orientation:"教学示意",landmarks:[],labels:[]};
        const mode = anatomyModes[a.id] || (g.image ? "interactive" : "memory");
        const interactive = a.id==="lobes" && mode==="interactive";
        const hotspotInteractive = a.id!=="lobes" && g.image && mode==="interactive";
        return `<div class="anat-card anatomy-v2" id="anat-${a.id}">
        <div class="anat-head">
          <span class="chip chip-cat">${a.cat}</span>
          ${chip(a.level)}
          <b>${esc(a.name)}</b>
          <span class="anatomy-orientation">🧭 ${g.orientation}</span>
        </div>
        <div class="anat-desc">${esc(a.desc)}</div>
        <div class="anatomy-modebar">
          ${g.image?`<button class="${mode==='interactive'?'active':''}" onclick="NS.setAnatomyMode('${a.id}','interactive')">中文互动图</button>`:""}
          ${g.image?`<button class="${mode==='reference'?'active':''}" onclick="NS.setAnatomyMode('${a.id}','reference')">原始教材图</button>`:""}
          <button class="${mode==='memory'?'active':''}" onclick="NS.setAnatomyMode('${a.id}','memory')">中文速记图</button>
          ${g.image&&mode==='reference'?`<button class="zoom-action" onclick="NS.openAnatomyZoom('${g.image}','${esc(a.name)}')">放大查看 ⛶</button>`:""}
        </div>
        <div class="anatomy-study-grid">
          <div class="anat-body ${mode}">${interactive?lobeInteractiveSVG():hotspotInteractive?anatomyInteractiveFigure(a,g):mode==='reference'&&g.image?`<img src="${g.image}" alt="${esc(a.name)}标准教材解剖图" loading="lazy" onclick="NS.openAnatomyZoom('${g.image}','${esc(a.name)}')"><div class="reference-hint">点击图片可放大 · 这是原始英文教材图</div>`:a.svg}</div>
          <aside class="anatomy-coach">
            ${interactive?lobeFocusPanel():hotspotInteractive?anatomySpotDetail(a,g):`<div class="anatomy-coach-block"><h4>① 先找这三个标志</h4><ol>${g.landmarks.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div><div class="anatomy-coach-block"><h4>② 图中英文对照</h4><div class="label-pairs">${g.labels.map(x=>`<div><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join("")}</div></div><div class="anatomy-coach-block clinical"><h4>③ 为什么临床要认识</h4><ul>${a.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`}
          </aside>
        </div>
        ${g.image?`<div class="anatomy-source">标准图来源：OpenStax, Anatomy & Physiology 2e · CC BY 4.0；中文解释为本站教学整理。</div>`:""}
      </div>`;}).join("")}
      <div class="foot-note">⚠️ 标准教材图用于学习解剖关系，中文速记图是非比例示意。具体变异、手术定位与个体诊疗必须结合真实影像、专业图谱及临床团队判断。</div>
      <div id="anatomy-lightbox" class="anatomy-lightbox" onclick="if(event.target===this) NS.closeAnatomyZoom()"><button onclick="NS.closeAnatomyZoom()" aria-label="关闭">×</button><div><h3 id="anatomy-lightbox-title"></h3><img id="anatomy-lightbox-img" alt="放大的解剖图"></div></div>`;
  }

  /* ---------- 手术方式 ---------- */
  function surgeryCardHTML(d){
    return `
    <div class="sx-card" id="sx-${d.id}">
      <div class="sx-head" onclick="NS.toggleSx('${d.id}')">
        <span>${chip(d.level)}</span>
        <span class="t">${esc(d.name)}</span>
        <span class="arrow" style="margin-left:auto;color:var(--ink-3)">▸</span>
      </div>
      <div class="sx-body">
        <div class="intro-box">📌 ${esc(d.intro)}</div>
        <div class="sub-block"><h4>适应证</h4><ul><li>${esc(d.indication)}</li></ul></div>
        <div class="sub-block"><h4>关键步骤</h4><div class="step-list">${d.steps.map(s=>`<div class="step-item">${esc(s)}</div>`).join("")}</div></div>
        <div class="kp-grid">
          <div class="kp-box"><b>⚠️ 操作要点</b><ul>${d.keypoints.map(k=>`<li>${esc(k)}</li>`).join("")}</ul></div>
          <div class="kp-box"><b>📈 进阶延伸</b><ul><li>${esc(d.advanced)}</li></ul></div>
        </div>
      </div>
    </div>`;
  }

  function renderSurgery(){
    const cats = SURGERIES;
    const filterBar = `
      <div class="filter-bar">
        <button class="filter-btn ${sxFilter==='all'?'active':''}" onclick="NS.setSxFilter('all')">全部（${SURGERY_FLAT.length}）</button>
        ${cats.map(c=>`<button class="filter-btn ${sxFilter===c.cat?'active':''}" onclick="NS.setSxFilter('${c.cat}')">${c.icon} ${c.catName}（${c.items.length}）</button>`).join("")}
      </div>`;
    if(sxFilter === "all"){
      $app.innerHTML = `<section class="planning-lab"><div class="section-kicker">PREOPERATIVE THINKING</div><h2>手术从读片和风险地图开始</h2><div class="planning-grid"><div><b>1 · 定位目标</b><p>病变在脑内还是脑外？与功能区、血管、脑室和颅底的关系是什么？</p></div><div><b>2 · 设计走廊</b><p>不是“离得最近”就最好，而是比较牵拉、静脉、穿支和神经损伤代价。</p></div><div><b>3 · 设定边界</b><p>最大安全切除、取样或减压的目标不同；先定义何时应该停手。</p></div><div><b>4 · 预演风险</b><p>把出血、缺血、功能缺损、脑脊液漏等风险与应对方案写进术前计划。</p></div></div></section>` + filterBar + cats.map(c=>`
        <div class="card" style="padding:0;overflow:hidden">
          <div style="padding:18px 20px 6px;display:flex;align-items:center;gap:10px">
            <span style="font-size:26px">${c.icon}</span>
            <div><b style="font-size:17px">${c.catName}</b><span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 个术式</span></div>
          </div>
          <div style="padding:4px 20px 14px"><span class="chip chip-cat">概述</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span></div>
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

  /* ---------- 视频资源 ---------- */
  function renderVideos(){
    $app.innerHTML = VIDEOS.map(c=>`
      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:18px 22px 6px;display:flex;align-items:center;gap:10px">
          <span style="font-size:26px">${c.icon}</span>
          <div><b style="font-size:17px">${c.catName}</b><span style="font-size:12px;color:var(--ink-3);margin-left:8px">${c.items.length} 个资源</span></div>
        </div>
        <div style="padding:4px 22px 14px"><span class="chip chip-cat">说明</span><span style="font-size:13px;color:var(--ink-2)">${esc(c.desc)}</span></div>
        <div style="padding:0 22px 22px" class="vid-grid">
          ${c.items.map(v=>`
          <div class="vid-card">
            <b>${esc(v.name)}</b>
            <p>${esc(v.desc)}</p>
            <div class="tags">${v.tags.map(t=>`<span>${esc(t)}</span>`).join("")}</div>
            <a href="${esc(v.url)}" target="_blank" rel="noopener">访问资源 ↗</a>
          </div>`).join("")}
        </div>
      </div>`).join("") + `
      <div class="foot-note">💡 <b>使用建议：</b>英文资源建议配合浏览器翻译或中文字幕观看；手术视频请在带教老师指导下结合解剖与术前影像学习；付费/注册资源请遵守平台条款，尊重版权。</div>`;
  }

  /* ---------- 学习路径 ---------- */
  function renderPath(){
    const steps = [
      { n:1, color:"#2d7dd2", title:"基础篇 · 解剖打底", desc:"先建立三维解剖观，再学病种。解剖是神经外科的“地图”，不懂解剖一切手术与定位都无从谈起。", chips:["解剖图谱（颅骨→脑膜→脑叶→脑室→血管→脑干）","配合 3D 解剖工具对照","标记关键标志：翼点、中央沟、Willis 环、脑室系统"] },
      { n:2, color:"#16a085", title:"基础篇 · 病种入门", desc:"按大类逐个学习病种：先记“临床表现→影像→治疗原则”三板斧，再理解机制。", chips:["颅脑损伤（脑疝识别、GCS 评分）","高血压脑出血与 SAH","常见肿瘤：胶质瘤/脑膜瘤/垂体瘤","腰椎间盘突出与颈椎病"] },
      { n:3, color:"#e67e22", title:"进阶篇 · 影像精读", desc:"神经外科是“影像驱动”的学科。学会在 CT/MRI 上定位病变、判断占位效应与手术指征。", chips:["CT 读片：出血、骨折、脑疝征象","MRI 序列：T1/T2/FLAIR/DWI/增强","血管成像：CTA/MRA/DSA 适应证","Radiopaedia 病例练习"] },
      { n:4, color:"#8e44ad", title:"进阶篇 · 手术入路与术式", desc:"结合解剖学入路，按“适应证→步骤→要点”学习手术。先理解“为什么这么切”，再看“怎么切”。", chips:["经典入路：翼点/乙状窦后/经蝶/枕下后正中","损伤与脑血管手术：EVD、去骨瓣、夹闭、取栓","肿瘤手术：显微切除与功能保护","脊柱手术：减压与固定"] },
      { n:5, color:"#c0392b", title:"实战篇 · 视频观摩与病例", desc:"用真实手术视频与病例讨论检验所学。注意：手术观摩一定要对照术前影像与解剖图，带着问题看。", chips:["The Neurosurgical Atlas 手术视频","B站/丁香园中文手术录像","NEJM 规范操作视频","跟随查房：把“书本病”变成“床旁病”"] },
      { n:6, color:"#00a86b", title:"持续精进 · 指南与前沿", desc:"建立阅读习惯：指南更新、核心期刊、年会进展。推荐从中文综述与指南读起，再过渡英文文献。", chips:["中华医学会神外指南","Journal of Neurosurgery / Neurosurgery","The Neurosurgical Atlas 每周更新","建立个人知识库与错题本"] }
    ];
    $app.innerHTML = `
      <div class="card">
        <h3>🗺️ 六步学习路径</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">面向“兼顾各层次”设计的渐进路线：医学生/规培走 1→3 步打基础，住院医师可直接从第 3 步起步并重点深入 4→6 步。每步均可在本网站对应板块完成。</p>
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

  /* ---------- 医院学科 ---------- */
  function renderHospital(){
    const H = HOSPITAL;
    $app.innerHTML = `
      <div class="hero" style="background:linear-gradient(135deg,#0f3d5c 0%,#1a6ba8 55%,#2d8fd0 100%)">
        <h2>${H.dept.name}</h2>
        <p>${H.dept.positioning} · ${H.dept.subDesc}</p>
        <div class="tags">
          <span>🏥 ${H.dept.beds}</span><span>🛏️ ${H.dept.wards.length} 个病区</span><span>🚨 24小时急诊</span><span>🌐 中/英/日/韩/俄</span>
        </div>
      </div>

      <div class="card">
        <h3>🗂️ 六大亚专科</h3>
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
        <h3>🏛️ 病区配置与核心团队</h3>
        <div class="grid2">
          <div>
            <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:10px">病区配置</h4>
            ${H.dept.wards.map(w=>`
            <div style="background:var(--primary-light);border-radius:10px;padding:10px 14px;margin-bottom:8px;font-size:13px">
              <b>${w.name}</b> <span style="color:var(--ink-3)">· ${w.loc}</span>
              <div style="color:var(--ink-2);margin-top:2px">${w.desc}</div>
            </div>`).join("")}
          </div>
          <div>
            <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:10px">核心团队</h4>
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
          <h3>🏥 院内服务</h3>
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
          <h3>🌐 国际服务</h3>
          ${H.international.items.map(s=>`
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed var(--line)">
            <span style="font-size:22px">${s.icon}</span>
            <div>
              <b style="font-size:14px">${s.name}</b>
              <div style="font-size:12.5px;color:var(--ink-2)">${s.desc}</div>
            </div>
          </div>`).join("")}
          <div class="warn-box" style="margin-top:12px">${H.international.advantage.map(a=>`✓ ${a}`).join("<br>")}</div>
        </div>
      </div>

      <div class="card">
        <h3>🎯 核心病种（诊疗要点）</h3>
        ${H.coreDiseases.map(c=>`
        <div style="margin-bottom:16px">
          <h4 style="font-size:15px;color:${c.color};margin-bottom:8px">${c.icon} ${c.cat}</h4>
          <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12.5px">
            <tr style="background:var(--primary-light);color:var(--primary-dark)">
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">病种</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">临床症状</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">影像诊断</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid var(--line)">治疗原则</th>
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
        <h3>🔬 擅长手术与技术</h3>
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
        <h3>📋 转诊规范</h3>
        <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:8px">${H.referral.materialTitle}</h4>
        <div class="grid2">
          ${H.referral.materials.map(m=>`
          <div>
            <h5 style="font-size:13px;color:var(--primary);margin-bottom:6px">${m.cat}</h5>
            <ul style="list-style:none;padding:0">
              ${m.items.map(i=>`<li style="font-size:12.5px;color:var(--ink-2);padding-left:16px;position:relative;margin-bottom:3px"><span style="position:absolute;left:0;color:var(--primary)">•</span>${i}</li>`).join("")}
            </ul>
          </div>`).join("")}
        </div>
        <h4 style="font-size:14px;color:var(--primary-dark);margin:16px 0 8px">${H.referral.examTitle}</h4>
        <div class="grid2">
          ${H.referral.exams.map(e=>`
          <div style="background:var(--primary-light);border-radius:10px;padding:10px 14px;font-size:12.5px;margin-bottom:8px">
            <b>${e.name}</b> <span style="color:var(--ink-2)">：${e.desc}</span>
          </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>📚 ${H.training.title}</h3>
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
        <h4 style="font-size:14px;color:var(--primary-dark);margin-bottom:8px">核心技术清单（含术语）</h4>
        <div class="kp-grid">
          <div class="kp-box"><b>🛠️ 核心技术</b><ul>${H.training.techItems.map(t=>`<li>${t.name} — ${t.kw}</li>`).join("")}</ul></div>
          <div class="kp-box"><b>📖 核心病种</b><ul>${H.training.diseaseItems.map(t=>`<li>${t.name} — ${t.kw}</li>`).join("")}</ul></div>
        </div>
      </div>`;
  }

  /* ---------- 渲染入口 ---------- */
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

  /* ---------- 搜索 ---------- */
  function buildIndex(){
    const idx = [];
    Object.values(BRAIN_REGIONS).forEach(r=>idx.push({ type:"图解", cat:"脑功能定位", name:r.name, key:["脑区","功能","症状",r.name,r.function,r.symptom].join(" ").toLowerCase(), page:"visual" }));
    IMAGING.modalities.forEach(m=>idx.push({ type:"影像", cat:"检查方法", name:m.name, key:[m.name,m.short,m.plain,m.best.join(" ")].join(" ").toLowerCase(), page:"imaging" }));
    IMAGING.sequences.forEach(s=>idx.push({ type:"影像", cat:"MRI 序列", name:s.name+" · "+s.cue, key:["MRI","序列",s.name,s.cue,s.plain,s.use].join(" ").toLowerCase(), page:"imaging" }));
    idx.push({ type:"学科", cat:"医院学科", name:"上海医大医院神经外科", key:["学科","医大","神经外科","亚专科","转诊"].join(" "), page:"hospital" });
    HOSPITAL.specialties.forEach(s=>idx.push({ type:"学科", cat:"六大亚专科", name:s.name, key:["亚专科","医院",s.name,s.desc].join(" ").toLowerCase(), page:"hospital" }));
    HOSPITAL.coreDiseases.forEach(c=>c.items.forEach(d=>idx.push({ type:"学科", cat:"核心病种", name:d.name, key:["核心病种","医院",d.name,d.sx,d.tx].join(" ").toLowerCase(), page:"hospital" })));
    DISEASE_FLAT.forEach(d=>idx.push({ type:"病种", cat:d.catName, name:d.name, key:["病种",d.catName,d.name,d.intro].join(" ").toLowerCase(), id:"dis-"+d.id, page:"diseases" }));
    ANATOMY.forEach(a=>idx.push({ type:"解剖", cat:a.cat, name:a.name, key:["解剖",a.cat,a.name,a.desc].join(" ").toLowerCase(), page:"anatomy" }));
    SURGERY_FLAT.forEach(s=>idx.push({ type:"手术", cat:s.catName, name:s.name, key:["手术",s.catName,s.name,s.intro].join(" ").toLowerCase(), id:"sx-"+s.id, page:"surgery" }));
    VIDEOS.forEach(c=>c.items.forEach(v=>idx.push({ type:"资源", cat:c.catName, name:v.name, key:["视频",c.catName,v.name,v.desc].join(" ").toLowerCase(), page:"videos" })));
    return idx;
  }
  const INDEX = buildIndex();

  function doSearch(q){
    q = (q||"").trim().toLowerCase();
    if(!q){ $drop.classList.remove("open"); return; }
    const hits = INDEX.filter(x=>x.key.includes(q)).slice(0,12);
    if(!hits.length){
      $drop.innerHTML = `<div class="sd-empty">未找到相关条目，换个关键词试试（如“动脉瘤”“翼点”“Willis”）</div>`;
    } else {
      $drop.innerHTML = hits.map(h=>`
        <div class="sd-item" onclick="NS.jumpSearch('${h.page}','${esc(h.id||"")}','${esc(h.name)}')">
          <b>${h.name} <span class="chip chip-cat" style="margin-left:6px">${h.type} · ${h.cat}</span></b>
          <span>${h.page==='hospital'?'医院学科':h.page==='diseases'?'病种知识库':h.page==='surgery'?'手术方式':h.page==='anatomy'?'解剖图谱':h.page==='imaging'?'影像学入门':h.page==='visual'?'一图看懂':'视频资源'}</span>
        </div>`).join("");
    }
    $drop.classList.add("open");
  }

  /* ---------- 对外 API ---------- */
  window.NS = {
    go,
    selectBrain(id){
      if(BRAIN_REGIONS[id]){ brainRegion=id; renderVisual(); }
    },
    selectSequence(id){
      if(IMAGING.sequences.some(x=>x.id===id)){ sequenceId=id; renderImaging(); }
    },
    selectImagingCase(id){
      if(LEARNING_CASES.imaging.some(x=>x.id===id)){ imagingCaseId=id; imagingRevealed=false; renderImaging(); }
    },
    toggleImagingAnswer(){ imagingRevealed=!imagingRevealed; renderImaging(); },
    selectClinicCase(id){
      if(LEARNING_CASES.clinic.some(x=>x.id===id)){ clinicCaseId=id; clinicStage=1; renderDiseases(); }
    },
    setClinicStage(stage){ clinicStage=Math.max(clinicStage,stage); renderDiseases(); },
    setAnatomyMode(id,mode){
      anatomyModes[id]=mode; renderAnatomy();
      setTimeout(()=>document.getElementById("anat-"+id)?.scrollIntoView({block:"start"}),0);
    },
    selectLobe(id){
      if(LOBE_DETAILS[id]){ anatomyFocus=id; anatomyModes.lobes="interactive"; renderAnatomy(); setTimeout(()=>document.getElementById("anat-lobes")?.scrollIntoView({block:"start"}),0); }
    },
    selectAnatomySpot(id,index){
      anatomySpotFocus[id]=index;
      anatomyModes[id]="interactive";
      renderAnatomy();
      setTimeout(()=>document.getElementById("anat-"+id)?.scrollIntoView({block:"start"}),0);
    },
    openAnatomyZoom(src,title){
      const box=document.getElementById("anatomy-lightbox"), img=document.getElementById("anatomy-lightbox-img"), h=document.getElementById("anatomy-lightbox-title");
      if(box&&img&&h){ img.src=src; h.textContent=title; box.classList.add("open"); document.body.style.overflow="hidden"; }
    },
    closeAnatomyZoom(){
      document.getElementById("anatomy-lightbox")?.classList.remove("open"); document.body.style.overflow="";
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

  /* ---------- 事件 ---------- */
  navItems.forEach(n => n.addEventListener("click", ()=>go(n.dataset.page)));
  $input.addEventListener("input", ()=>doSearch($input.value));
  $input.addEventListener("focus", ()=>doSearch($input.value));
  document.addEventListener("click", e=>{
    if(!e.target.closest(".search-wrap")) $drop.classList.remove("open");
  });
  window.addEventListener("medical-viewer-ready", ()=>{
    if(current==="imaging" && window.MedicalViewer) window.MedicalViewer.init(imagingCaseId);
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
