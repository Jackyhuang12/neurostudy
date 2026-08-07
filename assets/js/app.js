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
  function renderAnatomy(){
    $app.innerHTML = `
      <div class="anatomy-mission"><div><div class="section-kicker">LOCATION → FUNCTION → DEFICIT</div><h2>解剖不是认名字，而是解释症状</h2><p>每看一个结构都回答：它在哪里？与谁相邻？损伤后会发生什么？手术或穿刺时为什么要避开它？</p></div><button onclick="NS.go('imaging')">进入三维断层定位 →</button></div>
      <div class="card">
        <h3>🧩 新版读图方法</h3>
        <p style="font-size:13.5px;color:var(--ink-2)"><b>标准教材图</b>用于建立真实比例和空间关系；<b>中文速记图</b>只帮助记忆，不代表真实比例。先看方向，再找三个标志，最后把结构与症状、影像和手术风险连接起来。</p>
      </div>
      ${ANATOMY.map(a=>{
        const g = ANATOMY_GUIDES[a.id] || {image:null,orientation:"教学示意",landmarks:[],labels:[]};
        const mode = anatomyModes[a.id] || (g.image ? "reference" : "memory");
        return `<div class="anat-card anatomy-v2" id="anat-${a.id}">
        <div class="anat-head">
          <span class="chip chip-cat">${a.cat}</span>
          ${chip(a.level)}
          <b>${esc(a.name)}</b>
          <span class="anatomy-orientation">🧭 ${g.orientation}</span>
        </div>
        <div class="anat-desc">${esc(a.desc)}</div>
        <div class="anatomy-modebar">
          ${g.image?`<button class="${mode==='reference'?'active':''}" onclick="NS.setAnatomyMode('${a.id}','reference')">标准教材图</button>`:""}
          <button class="${mode==='memory'?'active':''}" onclick="NS.setAnatomyMode('${a.id}','memory')">中文速记图</button>
          ${g.image&&mode==='reference'?`<button class="zoom-action" onclick="NS.openAnatomyZoom('${g.image}','${esc(a.name)}')">放大查看 ⛶</button>`:""}
        </div>
        <div class="anatomy-study-grid">
          <div class="anat-body ${mode}">${mode==='reference'&&g.image?`<img src="${g.image}" alt="${esc(a.name)}标准教材解剖图" loading="lazy" onclick="NS.openAnatomyZoom('${g.image}','${esc(a.name)}')"><div class="reference-hint">点击图片可放大 · 英文标注见右侧中英对照</div>`:a.svg}</div>
          <aside class="anatomy-coach">
            <div class="anatomy-coach-block"><h4>① 先找这三个标志</h4><ol>${g.landmarks.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
            <div class="anatomy-coach-block"><h4>② 图中英文对照</h4><div class="label-pairs">${g.labels.map(x=>`<div><span>${esc(x[0])}</span><b>${esc(x[1])}</b></div>`).join("")}</div></div>
            <div class="anatomy-coach-block clinical"><h4>③ 为什么临床要认识</h4><ul>${a.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>
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
