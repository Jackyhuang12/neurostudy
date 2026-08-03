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
    home:   { title:"神经外科学习网",      label:"首页总览" },
    path:   { title:"学习路径",            label:"学习路径" },
    diseases:{ title:"病种知识库",          label:"病种知识库" },
    anatomy:{ title:"解剖图谱",            label:"解剖图谱" },
    surgery:{ title:"手术方式详解",         label:"手术方式" },
    videos: { title:"视频资源导航",         label:"视频资源" }
  };

  let current = "home";
  let diseaseFilter = "all";
  let sxFilter = "all";

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
        <h2>神经外科系统学习平台</h2>
        <p>从病种基础知识到手术入路，从解剖图谱到手术视频——面向医学生、规培医师与住院医师的分层学习体系，一站式沉淀神经外科核心知识。</p>
        <div class="tags">
          <span>📖 ${nDis} 个病种</span><span>🧩 ${nAnat} 张解剖图谱</span><span>🔬 ${nSx} 类手术详解</span><span>🎬 ${nVid} 个资源入口</span><span>🎯 基础 · 进阶分层</span>
        </div>
      </div>
      <div class="grid4">
        <div class="sect-card" onclick="NS.go('diseases')"><div class="big">📖</div><b>病种知识库</b><p>颅脑损伤 · 脑血管病 · 颅内肿瘤 · 脊柱脊髓 · 功能神外 · 先天与感染，按“基础/进阶”分层精读。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('anatomy')"><div class="big">🧩</div><b>解剖图谱</b><p>颅骨、脑膜、脑叶功能区、脑室系统、Willis 环、脑干颅神经、脊髓——手绘示意图+学习要点。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('surgery')"><div class="big">🔬</div><b>手术方式详解</b><p>经典入路（翼点、乙状窦后、经蝶…）、颅脑损伤、脑血管、肿瘤、脊柱、功能手术的关键步骤与要点。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('videos')"><div class="big">🎬</div><b>视频资源导航</b><p>国内外权威教学平台与手术视频库精选入口：The Neurosurgical Atlas、B站、NEJM、CNS/AANS…</p><span class="go">进入 →</span></div>
      </div>
      <div class="card" style="margin-top:24px">
        <h3>🗺️ 推荐学习路径</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">基础篇：<b>解剖图谱 → 病种知识（基础）→ 影像识别</b>；进阶篇：<b>病种知识（进阶）→ 手术入路 → 手术步骤</b>；最后通过<b>视频资源</b>观摩真实手术、加深理解。也可在右上角搜索框直达任意病种。</p>
      </div>
      <div class="foot-note">
        <b>⚠️ 医学声明：</b>本站内容依据公开教材与指南整理，用于医学学习交流。图谱为教学简化示意图，不替代专业解剖图谱；诊疗决策请以最新指南、上级医师意见及患者具体情况为准。
      </div>`;
  }

  /* ---------- 病种知识库 ---------- */
  function diseaseCardHTML(d){
    return `
    <div class="disease-card" id="dis-${d.id}">
      <div class="dc-head" onclick="NS.toggleDisease('${d.id}')">
        <span>${chip(d.level)}</span>
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
      $app.innerHTML = filterBar + cats.map(c=>`
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
      <div class="card">
        <h3>🧩 解剖图谱说明</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">以下为教学简化示意图，突出神经外科常用解剖标志与临床相关结构。建议配合 <b>The Neurosurgical Atlas</b>、Neuroanatomy Online 等 3D/实物资源对照学习（见“视频资源”页）。</p>
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
      <div class="foot-note">⚠️ 示意图仅供学习参考：SVG 图形为简化绘制，解剖比例与细节以专业图谱（如 Netter 神经解剖、Gray's Anatomy）与真实标本为准。</div>`;
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
      $app.innerHTML = filterBar + cats.map(c=>`
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

  /* ---------- 渲染入口 ---------- */
  function render(){
    if(current==="home") renderHome();
    else if(current==="path") renderPath();
    else if(current==="diseases") renderDiseases();
    else if(current==="anatomy") renderAnatomy();
    else if(current==="surgery") renderSurgery();
    else if(current==="videos") renderVideos();
  }

  /* ---------- 搜索 ---------- */
  function buildIndex(){
    const idx = [];
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
          <span>${h.page==='diseases'?'病种知识库':h.page==='surgery'?'手术方式':h.page==='anatomy'?'解剖图谱':'视频资源'}</span>
        </div>`).join("");
    }
    $drop.classList.add("open");
  }

  /* ---------- 对外 API ---------- */
  window.NS = {
    go,
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

  function init(){
    const h = location.hash.replace("#","");
    if(PAGES[h]) current = h;
    navItems.forEach(n => n.classList.toggle("active", n.dataset.page === current));
    $title.textContent = PAGES[current].title;
    render();
  }
  init();
})();
