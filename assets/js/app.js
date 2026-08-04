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
    path:    { title:"学习路径",             label:"学习路径" },
    hospital:{ title:"上海医大医院神经外科",  label:"医院学科" },
    diseases:{ title:"病种知识库",           label:"病种知识库" },
    anatomy: { title:"解剖图谱",             label:"解剖图谱" },
    surgery: { title:"手术方式详解",          label:"手术方式" },
    videos:  { title:"视频资源导航",          label:"视频资源" }
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
        <p>依托上海医大医院神经外科学科体系打造——覆盖六大亚专科（脑肿瘤、脑血管病、脊柱脊髓、功能神经外科、颅脑创伤、神经重症）的系统学习平台，从病种基础知识到手术入路，面向医学生、规培医师与住院医师的分层学习体系。</p>
        <div class="tags">
          <span>🏥 六大亚专科</span><span>📖 ${nDis} 个病种</span><span>🧩 ${nAnat} 张解剖图谱</span><span>🔬 ${nSx} 类手术详解</span><span>🎬 ${nVid} 个资源入口</span>
        </div>
      </div>
      <div class="grid4">
        <div class="sect-card" onclick="NS.go('hospital')"><div class="big">🏥</div><b>医院学科</b><p>科室定位、六大亚专科、院内与国际服务、核心病种与特色技术、转诊规范、培训计划——新入科必读。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('diseases')"><div class="big">📖</div><b>病种知识库</b><p>颅脑损伤 · 脑血管病 · 颅内肿瘤 · 脊柱脊髓 · 功能神外 · 先天与感染，按“基础/进阶”分层精读，🏥 标记医大重点病种。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('anatomy')"><div class="big">🧩</div><b>解剖图谱</b><p>颅骨、脑膜、脑叶功能区、脑室系统、Willis 环、脑干颅神经、脊髓——手绘示意图+学习要点。</p><span class="go">进入 →</span></div>
        <div class="sect-card" onclick="NS.go('surgery')"><div class="big">🔬</div><b>手术方式详解</b><p>经典入路（翼点、乙状窦后、经蝶…）、颅脑损伤、脑血管、肿瘤、脊柱、功能手术的关键步骤与要点。</p><span class="go">进入 →</span></div>
      </div>
      <div class="card" style="margin-top:24px">
        <h3>🗺️ 推荐学习路径</h3>
        <p style="font-size:13.5px;color:var(--ink-2)">新入科建议先看 <b>🏥 医院学科</b> 了解科室架构与核心病种 → <b>解剖图谱</b> 打底 → <b>病种知识（基础）</b> → 进阶：<b>病种知识（进阶）→ 手术入路 → 手术步骤</b> → <b>视频资源</b> 观摩真实手术。也可在右上角搜索框直达任意内容。</p>
      </div>
      <div class="foot-note">
        <b>⚠️ 医学声明：</b>本站内容依据公开教材与指南整理，用于医学学习交流。图谱为教学简化示意图，不替代专业解剖图谱；诊疗决策请以最新指南、上级医师意见及患者具体情况为准。
      </div>`;
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
    else if(current==="path") renderPath();
    else if(current==="hospital") renderHospital();
    else if(current==="diseases") renderDiseases();
    else if(current==="anatomy") renderAnatomy();
    else if(current==="surgery") renderSurgery();
    else if(current==="videos") renderVideos();
  }

  /* ---------- 搜索 ---------- */
  function buildIndex(){
    const idx = [];
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
          <span>${h.page==='hospital'?'医院学科':h.page==='diseases'?'病种知识库':h.page==='surgery'?'手术方式':h.page==='anatomy'?'解剖图谱':'视频资源'}</span>
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
