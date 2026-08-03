/* ============================================================
   神经外科学习网 · 解剖图谱数据（内联 SVG 示意图）
   均为教学简化示意，供学习参考，不替代解剖图谱/教材
   ============================================================ */

const ANATOMY = [
  {
    id: "skull-front", name: "颅骨正面观", level: "基础", cat: "颅骨",
    desc: "颅骨由 23 块骨组成（不含听小骨），分为脑颅（8 块）与面颅（15 块）。正面观可见额骨、眶腔与面颅诸骨。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">颅骨正面观</text>
  <!-- 颅盖 -->
  <path d="M220 120 Q225 52 320 48 Q415 52 420 120 L400 160 Q350 130 320 132 Q290 130 240 160 Z" fill="#bcd4f5" stroke="#3b6ea8" stroke-width="2"/>
  <!-- 额骨区域 -->
  <path d="M240 160 Q320 130 400 160 Q415 190 410 225 Q400 215 390 225 L250 225 Q240 215 230 225 Q225 190 240 160 Z" fill="#d3e3f7" stroke="#3b6ea8" stroke-width="2"/>
  <text x="320" y="196" text-anchor="middle" font-size="13" fill="#17456e" font-weight="bold">额骨</text>
  <!-- 眶腔 -->
  <ellipse cx="255" cy="262" rx="52" ry="38" fill="#ffffff" stroke="#3b6ea8" stroke-width="2.5"/>
  <ellipse cx="385" cy="262" rx="52" ry="38" fill="#ffffff" stroke="#3b6ea8" stroke-width="2.5"/>
  <text x="255" y="268" text-anchor="middle" font-size="12" fill="#7a8aa0">眶腔</text>
  <text x="385" y="268" text-anchor="middle" font-size="12" fill="#7a8aa0">眶腔</text>
  <!-- 鼻骨 -->
  <path d="M305 250 Q320 258 335 250 L335 268 Q320 276 305 268 Z" fill="#e8c99a" stroke="#b08040" stroke-width="1.5"/>
  <text x="320" y="286" text-anchor="middle" font-size="11" fill="#7a5c2e">鼻骨</text>
  <!-- 颧骨 -->
  <path d="M196 258 Q182 292 200 316 L240 322 Q246 296 232 282 Q228 262 224 250 Z" fill="#e8e2f0" stroke="#8a7bb0" stroke-width="1.5"/>
  <path d="M444 258 Q458 292 440 316 L400 322 Q394 296 408 282 Q412 262 416 250 Z" fill="#e8e2f0" stroke="#8a7bb0" stroke-width="1.5"/>
  <text x="200" y="306" text-anchor="middle" font-size="11" fill="#5b4a85">颧骨</text>
  <text x="440" y="306" text-anchor="middle" font-size="11" fill="#5b4a85">颧骨</text>
  <!-- 颧弓 -->
  <path d="M196 258 Q150 272 128 300 Q118 316 128 320 L168 318 Q178 296 200 292" fill="none" stroke="#8a7bb0" stroke-width="3"/>
  <path d="M444 258 Q490 272 512 300 Q522 316 512 320 L472 318 Q462 296 440 292" fill="none" stroke="#8a7bb0" stroke-width="3"/>
  <text x="146" y="330" text-anchor="middle" font-size="11" fill="#5b4a85">颧弓</text>
  <!-- 上颌骨 -->
  <path d="M236 326 Q250 350 320 356 Q390 350 404 326 L396 372 Q360 392 320 392 Q280 392 244 372 Z" fill="#f0e4cc" stroke="#a08050" stroke-width="1.5"/>
  <text x="320" y="378" text-anchor="middle" font-size="12" fill="#7a5c2e" font-weight="bold">上颌骨</text>
  <!-- 下颌骨 -->
  <path d="M220 330 Q200 380 210 408 Q240 418 320 416 Q400 418 430 408 Q440 380 420 330" fill="none" stroke="#8f6f3f" stroke-width="4"/>
  <text x="320" y="414" text-anchor="middle" font-size="12" fill="#5c471f" font-weight="bold">下颌骨</text>
  <!-- 顶骨标注 -->
  <path d="M260 108 L250 84" stroke="#7a8aa0" stroke-width="1" fill="none"/>
  <text x="196" y="80" text-anchor="middle" font-size="12" fill="#17456e">顶骨</text>
  <!-- 颞骨标注 -->
  <path d="M232 168 L206 176" stroke="#7a8aa0" stroke-width="1" fill="none"/>
  <text x="186" y="188" text-anchor="middle" font-size="12" fill="#17456e">颞骨</text>
</svg>`,
    points: ["脑颅 8 块：额骨、顶骨（2）、颞骨（2）、枕骨、蝶骨、筛骨", "面颅 15 块：上颌骨、下颌骨、颧骨、鼻骨等", "眶腔由额骨、颧骨、上颌骨、蝶骨围成", "颧弓由颧骨颞突与颞骨颧突构成，是翼点入路重要体表标志"]
  },
  {
    id: "skull-side", name: "颅骨侧面观与骨缝", level: "基础", cat: "颅骨",
    desc: "侧面观可见冠状缝、人字缝、鳞状缝三条主要骨缝，以及神外重要的薄弱点——翼点（pterion）。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">颅骨侧面观与骨缝</text>
  <!-- 颅盖轮廓 -->
  <path d="M180 120 Q185 60 260 48 Q330 40 400 52 Q470 66 480 120 Q490 180 470 230 Q520 240 530 290 Q532 320 510 330 L470 322 Q430 340 420 380 L420 410 L240 410 L240 380 Q230 340 190 322 L150 330 Q128 320 130 290 Q140 240 190 230 Q170 180 180 120 Z" fill="#bcd4f5" stroke="#3b6ea8" stroke-width="2"/>
  <!-- 冠状缝 -->
  <path d="M262 52 Q280 100 272 160 Q266 210 262 252" stroke="#d17a22" stroke-width="3.5" fill="none" stroke-dasharray="7,4"/>
  <!-- 人字缝 -->
  <path d="M398 58 Q420 100 442 150 Q458 190 478 220" stroke="#d17a22" stroke-width="3.5" fill="none" stroke-dasharray="7,4"/>
  <!-- 鳞状缝 -->
  <path d="M272 252 Q310 268 360 272 Q420 278 470 240" stroke="#d17a22" stroke-width="3.5" fill="none" stroke-dasharray="7,4"/>
  <!-- 翼点 -->
  <circle cx="262" cy="252" r="9" fill="#e74c3c" stroke="#a93226" stroke-width="2"/>
  <text x="262" y="258" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">翼点</text>
  <!-- 外耳门 -->
  <ellipse cx="430" cy="330" rx="16" ry="22" fill="#f5e6d3" stroke="#8f6f3f" stroke-width="2"/>
  <text x="452" y="326" text-anchor="start" font-size="11" fill="#5c471f">外耳门</text>
  <!-- 乳突 -->
  <path d="M468 340 Q478 368 468 384 Q460 392 448 384" fill="#d3a6a6" stroke="#8f5f5f" stroke-width="1.5"/>
  <text x="486" y="378" text-anchor="start" font-size="11" fill="#8f5f5f">乳突</text>
  <!-- 颧弓 -->
  <path d="M210 296 Q170 306 148 322 Q136 334 148 342 L178 340" stroke="#8a7bb0" stroke-width="4" fill="none"/>
  <!-- 区域标注 -->
  <text x="240" y="120" text-anchor="middle" font-size="13" fill="#17456e" font-weight="bold">额骨</text>
  <text x="330" y="120" text-anchor="middle" font-size="13" fill="#17456e" font-weight="bold">顶骨</text>
  <text x="470" y="120" text-anchor="middle" font-size="13" fill="#17456e" font-weight="bold">枕骨</text>
  <text x="205" y="300" text-anchor="middle" font-size="12" fill="#17456e">蝶骨</text>
  <text x="352" y="300" text-anchor="middle" font-size="12" fill="#17456e">颞骨鳞部</text>
  <!-- 图例 -->
  <line x1="70" y1="398" x2="98" y2="398" stroke="#d17a22" stroke-width="3.5" stroke-dasharray="7,4"/>
  <text x="104" y="402" font-size="11" fill="#7a8aa0">骨缝</text>
  <circle cx="190" cy="395" r="6" fill="#e74c3c"/>
  <text x="202" y="399" font-size="11" fill="#7a8aa0">翼点（四骨交界薄弱区）</text>
</svg>`,
    points: ["翼点：额、顶、颞、蝶四骨交界处，颅骨最薄弱，其深面为脑膜中动脉前支", "冠状缝（额-顶）、人字缝（顶-枕）、鳞状缝（顶-颞）", "儿童骨缝未闭，外伤可致生长性骨折", "乳突深面为乙状窦，是枕下入路重要标志"]
  },
  {
    id: "meninges", name: "脑膜三层与静脉窦", level: "基础", cat: "脑膜",
    desc: "自外向内：硬脑膜（含静脉窦）、蛛网膜（含蛛网膜颗粒）、软脑膜。硬膜外/下腔出血即按层次命名。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脑膜三层与静脉窦（冠状位示意）</text>
  <!-- 颅骨 -->
  <path d="M150 70 L150 350 Q150 370 170 372 L470 372 Q490 370 490 350 L490 70 Q400 40 320 42 Q240 40 150 70 Z" fill="#e9eef5" stroke="#9fb2c8" stroke-width="2"/>
  <text x="60" y="215" text-anchor="middle" font-size="12" fill="#7a8aa0" transform="rotate(-90 60 215)">颅骨</text>
  <!-- 上矢状窦 -->
  <path d="M200 78 L200 150 Q320 120 440 150 L440 78 Q320 60 200 78 Z" fill="#e74c3c" opacity="0.75"/>
  <text x="320" y="112" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">上矢状窦</text>
  <!-- 大脑镰 -->
  <line x1="320" y1="78" x2="320" y2="360" stroke="#c0392b" stroke-width="4" stroke-dasharray="2,3"/>
  <text x="330" y="330" font-size="11" fill="#a93226">大脑镰</text>
  <!-- 硬脑膜（外层） -->
  <path d="M150 70 L150 350 Q150 366 168 366 L472 366 Q490 366 490 350 L490 70" fill="none" stroke="#8e44ad" stroke-width="5"/>
  <!-- 蛛网膜 -->
  <path d="M172 92 L172 332 Q172 344 190 344 L450 344 Q468 344 468 332 L468 92" fill="none" stroke="#16a085" stroke-width="3.5"/>
  <!-- 蛛网膜颗粒 -->
  <circle cx="240" cy="120" r="7" fill="#16a085"/>
  <circle cx="262" cy="112" r="6" fill="#16a085"/>
  <circle cx="382" cy="114" r="6" fill="#16a085"/>
  <path d="M252 124 Q290 140 320 142 Q350 140 388 124" fill="none" stroke="#16a085" stroke-width="2" opacity="0.6"/>
  <text x="240" y="150" text-anchor="middle" font-size="11" fill="#0e6655">蛛网膜颗粒</text>
  <!-- 软脑膜 -->
  <path d="M182 120 L182 320 Q210 330 320 330 Q430 330 458 320 L458 120 Q390 96 320 96 Q250 96 182 120 Z" fill="none" stroke="#2d7dd2" stroke-width="3.5"/>
  <!-- 脑表面沟回示意 -->
  <path d="M198 150 Q230 162 262 150 Q294 138 326 150 Q358 162 390 150 Q422 138 440 146" fill="none" stroke="#bcd4f5" stroke-width="3"/>
  <path d="M198 210 Q230 222 262 210 Q294 198 326 210 Q358 222 390 210 Q422 198 440 206" fill="none" stroke="#bcd4f5" stroke-width="3"/>
  <path d="M198 270 Q230 282 262 270 Q294 258 326 270 Q358 282 390 270 Q422 258 440 266" fill="none" stroke="#bcd4f5" stroke-width="3"/>
  <text x="500" y="110" font-size="12" fill="#8e44ad" font-weight="bold">硬脑膜</text>
  <text x="500" y="180" font-size="12" fill="#16a085" font-weight="bold">蛛网膜</text>
  <text x="500" y="250" font-size="12" fill="#2d7dd2" font-weight="bold">软脑膜</text>
  <text x="500" y="320" font-size="11" fill="#7a8aa0">（紧贴脑表面）</text>
  <text x="60" y="120" font-size="11" fill="#a93226">硬膜外隙</text>
  <text x="60" y="200" font-size="11" fill="#0e6655">蛛网膜下隙（含脑脊液）</text>
</svg>`,
    points: ["硬膜外血肿：颅骨内板与硬脑膜之间；硬膜下血肿：硬膜与蛛网膜之间", "蛛网膜下腔含脑脊液与血管（Willis 环、桥静脉）", "静脉窦：上/下矢状窦、横窦、乙状窦、海绵窦，损伤出血凶险", "硬脑膜内层反折形成大脑镰、小脑幕，小脑幕切迹是钩回疝发生处"]
  },
  {
    id: "lobes", name: "大脑外侧面：脑叶与功能区", level: "基础", cat: "大脑",
    desc: "四个脑叶以中央沟、外侧裂、顶枕沟为界。功能定位是定位诊断与手术入路设计的基础。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">大脑外侧面：脑叶与功能区</text>
  <!-- 大脑轮廓 -->
  <path d="M170 110 Q190 60 300 54 Q420 54 470 96 Q520 140 500 210 Q490 260 450 300 Q400 340 330 344 Q260 340 210 300 Q165 260 160 200 Q158 150 170 110 Z" fill="#eef3fb" stroke="#3b6ea8" stroke-width="2.5"/>
  <!-- 额叶 -->
  <path d="M170 110 Q190 60 300 54 Q330 54 352 62 L352 176 Q300 150 240 170 Q200 180 176 200 Q168 160 170 110 Z" fill="#c8e0f7" stroke="#3b6ea8" stroke-width="1.5"/>
  <!-- 顶叶 -->
  <path d="M352 62 Q420 54 470 96 Q500 130 492 180 L460 176 L392 200 L352 176 Z" fill="#d5ecf2" stroke="#3b6ea8" stroke-width="1.5"/>
  <!-- 颞叶 -->
  <path d="M176 200 Q240 170 300 150 Q340 142 352 176 L352 300 Q330 342 320 344 Q260 340 214 302 Q176 262 176 200 Z" fill="#e8d9f5" stroke="#3b6ea8" stroke-width="1.5"/>
  <!-- 枕叶 -->
  <path d="M455 170 Q500 200 498 240 Q480 300 450 300 Q440 300 448 250 Q452 205 455 170 Z" fill="#f5e6c8" stroke="#3b6ea8" stroke-width="1.5"/>
  <!-- 中央沟 -->
  <path d="M352 62 Q330 140 336 210 Q340 280 330 342" stroke="#e74c3c" stroke-width="3" fill="none"/>
  <!-- 外侧裂 -->
  <path d="M320 150 Q280 170 260 190 Q240 210 220 230 Q204 246 196 258" stroke="#8e44ad" stroke-width="3" fill="none"/>
  <!-- 功能区色块 -->
  <rect x="330" y="92" width="20" height="52" rx="4" fill="#e74c3c" opacity="0.82"/>
  <text x="350" y="104" font-size="9" fill="#fff" font-weight="bold">M1</text>
  <rect x="352" y="88" width="20" height="48" rx="4" fill="#16a085" opacity="0.82"/>
  <text x="372" y="100" font-size="9" fill="#fff" font-weight="bold">S1</text>
  <ellipse cx="252" cy="216" rx="22" ry="13" fill="#c0392b" opacity="0.8"/>
  <text x="252" y="221" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">Broca</text>
  <ellipse cx="330" cy="292" rx="24" ry="13" fill="#8e44ad" opacity="0.8"/>
  <text x="330" y="297" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">Wernicke</text>
  <ellipse cx="472" cy="238" rx="18" ry="26" fill="#d68910" opacity="0.8"/>
  <text x="472" y="242" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">视</text>
  <!-- 标注 -->
  <text x="258" y="112" text-anchor="middle" font-size="14" fill="#17456e" font-weight="bold">额叶</text>
  <text x="418" y="126" text-anchor="middle" font-size="14" fill="#17456e" font-weight="bold">顶叶</text>
  <text x="262" y="300" text-anchor="middle" font-size="14" fill="#17456e" font-weight="bold">颞叶</text>
  <text x="432" y="290" text-anchor="middle" font-size="13" fill="#17456e" font-weight="bold">枕叶</text>
  <text x="326" y="84" font-size="10" fill="#a93226">中央沟</text>
  <text x="196" y="248" font-size="10" fill="#6c3483">外侧裂</text>
  <text x="352" y="330" text-anchor="middle" font-size="10" fill="#8e44ad">Sylvian裂</text>
  <!-- 图例 -->
  <rect x="62" y="380" width="14" height="10" fill="#e74c3c"/>
  <text x="82" y="390" font-size="11" fill="#7a8aa0">M1 初级运动皮质</text>
  <rect x="210" y="380" width="14" height="10" fill="#16a085"/>
  <text x="230" y="390" font-size="11" fill="#7a8aa0">S1 初级体感皮质</text>
  <rect x="370" y="380" width="14" height="10" fill="#c0392b"/>
  <text x="390" y="390" font-size="11" fill="#7a8aa0">Broca（运动性语言）</text>
  <rect x="532" y="380" width="14" height="10" fill="#8e44ad"/>
  <text x="552" y="390" font-size="11" fill="#7a8aa0">Wernicke</text>
</svg>`,
    points: ["额叶：运动、语言表达（Broca）、人格与执行功能", "顶叶：体感、空间定向；颞叶：听觉、语言理解（Wernicke）、记忆", "枕叶：视觉；内侧距状沟上下为 V1/V2", "中央沟前方 M1 损伤→对侧偏瘫；优势半球外侧裂区损伤→失语"]
  },
  {
    id: "medial", name: "大脑内侧面与胼胝体", level: "基础", cat: "大脑",
    desc: "内侧可见胼胝体、扣带回、楔前叶、距状沟等。胼胝体是癫痫胼胝体切开术与胶质瘤跨越处。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">大脑内侧面（矢状位）</text>
  <!-- 大脑轮廓 -->
  <path d="M160 120 Q170 60 300 50 Q420 50 480 100 Q520 150 500 220 Q480 280 420 320 Q360 350 300 350 Q240 350 190 320 Q150 290 148 220 Q146 160 160 120 Z" fill="#eef3fb" stroke="#3b6ea8" stroke-width="2.5"/>
  <!-- 胼胝体 -->
  <path d="M230 170 Q270 140 330 142 Q380 144 410 158 Q430 172 428 190 Q424 210 400 218 Q360 226 300 224 Q250 220 226 208 Q214 194 218 180 Q220 172 230 170 Z" fill="#f0c8c8" stroke="#a94a4a" stroke-width="2"/>
  <text x="322" y="200" text-anchor="middle" font-size="12" fill="#a94a4a" font-weight="bold">胼胝体</text>
  <!-- 扣带回 -->
  <path d="M218 168 Q230 128 300 116 Q360 108 400 132 Q420 148 420 168" fill="none" stroke="#2d7dd2" stroke-width="4"/>
  <text x="308" y="108" text-anchor="middle" font-size="11" fill="#17456e">扣带回</text>
  <!-- 距状沟 -->
  <path d="M420 210 Q450 230 478 230 Q496 230 500 224" stroke="#e67e22" stroke-width="4" fill="none"/>
  <text x="472" y="212" text-anchor="start" font-size="10" fill="#c05f10">距状沟（视皮质）</text>
  <!-- 楔前叶 / 楔叶 -->
  <text x="400" y="180" font-size="11" fill="#7a8aa0">楔前叶</text>
  <text x="462" y="246" font-size="11" fill="#7a8aa0">楔叶</text>
  <!-- 海马旁回 -->
  <text x="228" y="300" font-size="11" fill="#7a8aa0">海马旁回</text>
  <path d="M190 290 Q200 310 220 318 Q240 322 250 312" fill="none" stroke="#8e44ad" stroke-width="2.5"/>
  <!-- 脑干与丘脑 -->
  <path d="M300 226 Q300 250 310 270 L340 300 L350 330" fill="none" stroke="#b39ddb" stroke-width="10" stroke-linecap="round"/>
  <text x="366" y="300" font-size="11" fill="#6c3483">脑干</text>
  <ellipse cx="296" cy="238" rx="16" ry="10" fill="#9fa8da" stroke="#5c6bc0" stroke-width="1.5"/>
  <text x="296" y="242" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">丘脑</text>
  <!-- 中央沟内侧端 -->
  <line x1="340" y1="70" x2="340" y2="96" stroke="#e74c3c" stroke-width="2.5" stroke-dasharray="5,3"/>
  <text x="348" y="86" font-size="10" fill="#a93226">中央沟</text>
</svg>`,
    points: ["胼胝体：连接两半球的巨大白质束，膝/体/压部", "扣带回与胼胝体构成边缘叶内环，参与情感记忆", "距状沟上下为视皮质（V1），损伤致对侧同向偏盲", "丘脑：感觉/意识中继站，出血可致对侧感觉障碍"]
  },
  {
    id: "ventricles", name: "脑室系统与脑脊液循环", level: "基础", cat: "脑室",
    desc: "双侧侧脑室→室间孔→第三脑室→中脑导水管→第四脑室→正中孔/外侧孔→蛛网膜下腔。梗阻点在哪个环节决定脑积水类型。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脑室系统与脑脊液循环</text>
  <!-- 侧脑室（左右） -->
  <path d="M120 90 Q180 70 250 84 Q280 92 290 108 L290 150 Q280 168 250 172 Q200 176 150 166 Q112 152 106 128 Q104 104 120 90 Z" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="2"/>
  <path d="M520 90 Q460 70 390 84 Q360 92 350 108 L350 150 Q360 168 390 172 Q440 176 490 166 Q528 152 534 128 Q536 104 520 90 Z" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="2"/>
  <!-- 侧脑室下角（颞角） -->
  <path d="M230 172 Q200 210 180 240 Q170 256 180 260 Q192 262 202 246 Q220 214 240 190" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="1.5"/>
  <path d="M410 172 Q440 210 460 240 Q470 256 460 260 Q448 262 438 246 Q420 214 400 190" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="1.5"/>
  <!-- 后角 -->
  <path d="M250 110 Q290 120 300 130 Q296 140 272 142 Q250 142 240 134" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="1.5"/>
  <path d="M390 110 Q350 120 340 130 Q344 140 368 142 Q390 142 400 134" fill="#7fb3e8" stroke="#2d5f9e" stroke-width="1.5"/>
  <!-- 室间孔 -->
  <path d="M290 128 Q305 120 320 122 Q335 120 350 128" fill="none" stroke="#17456e" stroke-width="3"/>
  <text x="320" y="112" text-anchor="middle" font-size="10" fill="#17456e">室间孔</text>
  <!-- 三脑室 -->
  <path d="M300 128 Q310 118 320 120 Q330 118 340 128 L344 236 Q338 250 320 252 Q302 250 296 236 Z" fill="#4d95dd" stroke="#2d5f9e" stroke-width="2"/>
  <text x="320" y="200" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">三脑室</text>
  <!-- 中脑导水管 -->
  <path d="M312 252 L320 290 Q320 300 328 302" fill="#3d7fc4" stroke="#2d5f9e" stroke-width="2.5"/>
  <text x="332" y="280" font-size="10" fill="#17456e">中脑导水管</text>
  <!-- 四脑室 -->
  <path d="M300 300 Q300 330 320 340 Q340 330 340 300 L336 300 Q328 322 320 322 Q312 322 304 300 Z" fill="#2d7dd2" stroke="#1d5f9e" stroke-width="2"/>
  <text x="320" y="326" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">四脑室</text>
  <!-- 正中孔 -->
  <path d="M320 340 L320 356" stroke="#17456e" stroke-width="2.5"/>
  <text x="330" y="356" font-size="10" fill="#17456e">正中孔</text>
  <!-- 循环箭头 -->
  <path d="M130 100 Q170 86 240 92" stroke="#16a085" stroke-width="2" fill="none" marker-end="url(#arr)"/>
  <path d="M470 100 Q430 86 360 92" stroke="#16a085" stroke-width="2" fill="none" marker-end="url(#arr)"/>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#16a085"/></marker></defs>
  <text x="190" y="66" text-anchor="middle" font-size="11" fill="#16a085">脉络丛分泌 CSF → 侧脑室</text>
  <text x="180" y="410" text-anchor="middle" font-size="11" fill="#16a085">CSF：侧脑室→室间孔→三脑室→导水管→四脑室→正中/外侧孔→蛛网膜下腔→蛛网膜颗粒吸收</text>
  <!-- 标注 -->
  <text x="130" y="140" text-anchor="middle" font-size="11" fill="#17456e">侧脑室</text>
  <text x="510" y="140" text-anchor="middle" font-size="11" fill="#17456e">侧脑室</text>
  <text x="330" y="246" font-size="10" fill="#17456e">导水管狭窄→梗阻性脑积水</text>
</svg>`,
    points: ["侧脑室额角穿刺点：Kocher 点（中线旁 2.5~3cm、瞳孔前 1cm）", "梗阻性脑积水：肿瘤/导水管狭窄/四脑室出口阻塞", "交通性脑积水：蛛网膜颗粒吸收障碍（如 SAH 后）", "Evans 指数（额角宽度/颅腔最大径）>0.3 提示脑积水"]
  },
  {
    id: "willis", name: "脑底动脉环（Willis 环）", level: "进阶", cat: "脑血管",
    desc: "颈内动脉与椎基底动脉两大系统在脑底吻合成环，是动脉瘤好发部位（分叉处），也是侧支代偿的解剖基础。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脑底动脉环（Willis 环）</text>
  <!-- 脑底轮廓 -->
  <ellipse cx="320" cy="225" rx="255" ry="170" fill="#eef3fb" stroke="#3b6ea8" stroke-width="2.5"/>
  <ellipse cx="320" cy="225" rx="200" ry="130" fill="none" stroke="#d7e3f2" stroke-width="1.5"/>
  <!-- 前交通动脉 -->
  <path d="M280 150 L360 150" stroke="#c0392b" stroke-width="6" stroke-linecap="round"/>
  <text x="320" y="142" text-anchor="middle" font-size="11" fill="#a93226" font-weight="bold">前交通动脉 AComA</text>
  <!-- 大脑前动脉 A1 -->
  <path d="M236 172 L280 150 L300 152" stroke="#e74c3c" stroke-width="7" stroke-linecap="round"/>
  <path d="M404 172 L360 150 L340 152" stroke="#e74c3c" stroke-width="7" stroke-linecap="round"/>
  <text x="236" y="164" font-size="11" fill="#c0392b">ACA(A1)</text>
  <!-- 颈内动脉 -->
  <path d="M210 300 L232 240 L236 172" stroke="#8e44ad" stroke-width="8" stroke-linecap="round"/>
  <path d="M430 300 L408 240 L404 172" stroke="#8e44ad" stroke-width="8" stroke-linecap="round"/>
  <text x="196" y="268" font-size="11" fill="#6c3483">ICA</text>
  <text x="428" y="268" font-size="11" fill="#6c3483">ICA</text>
  <!-- 后交通动脉 -->
  <path d="M238 236 Q270 232 300 250" stroke="#d68910" stroke-width="5" stroke-linecap="round"/>
  <path d="M402 236 Q370 232 340 250" stroke="#d68910" stroke-width="5" stroke-linecap="round"/>
  <text x="252" y="252" font-size="10" fill="#b9770e">PComA</text>
  <text x="366" y="252" font-size="10" fill="#b9770e">PComA</text>
  <!-- 大脑后动脉 -->
  <path d="M300 252 Q280 280 258 292" stroke="#2d7dd2" stroke-width="6" stroke-linecap="round"/>
  <path d="M340 252 Q360 280 382 292" stroke="#2d7dd2" stroke-width="6" stroke-linecap="round"/>
  <text x="252" y="300" font-size="10" fill="#17456e">PCA</text>
  <text x="368" y="300" font-size="10" fill="#17456e">PCA</text>
  <!-- 基底动脉 -->
  <path d="M320 250 L320 300 Q318 320 320 340" stroke="#16a085" stroke-width="9" stroke-linecap="round"/>
  <text x="336" y="316" font-size="11" fill="#0e6655">基底动脉 BA</text>
  <!-- 椎动脉 -->
  <path d="M280 380 L296 348 Q304 334 320 340" stroke="#0e6655" stroke-width="7" stroke-linecap="round"/>
  <path d="M360 380 L344 348 Q336 334 320 340" stroke="#0e6655" stroke-width="7" stroke-linecap="round"/>
  <text x="268" y="392" font-size="11" fill="#0e6655">椎动脉 VA</text>
  <!-- 大脑中动脉 -->
  <path d="M232 240 Q210 226 190 240 Q170 252 160 250" stroke="#c0392b" stroke-width="6" stroke-linecap="round"/>
  <path d="M408 240 Q430 226 450 240 Q470 252 480 250" stroke="#c0392b" stroke-width="6" stroke-linecap="round"/>
  <text x="150" y="246" font-size="10" fill="#a93226">MCA</text>
  <text x="480" y="246" font-size="10" fill="#a93226">MCA</text>
  <!-- 标注动脉瘤好发部位 -->
  <circle cx="320" cy="150" r="8" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <circle cx="236" cy="172" r="8" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <circle cx="404" cy="172" r="8" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <circle cx="320" cy="340" r="8" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <text x="320" y="400" text-anchor="middle" font-size="12" fill="#a93226" font-weight="bold">▲ 动脉瘤好发部位：AComA、PComA、MCA 分叉、基底动脉尖</text>
</svg>`,
    points: ["前循环：ICA→ACA/MCA；后循环：VA→BA→PCA", "Willis 环不完整（缺如/纤细）常见，影响侧支代偿", "后交通动脉瘤压迫动眼神经→同侧瞳孔散大", "AComA 动脉瘤破裂→鞍上池出血+额叶内侧血肿"]
  },
  {
    id: "brainstem", name: "脑干腹侧面与颅神经", level: "进阶", cat: "脑干",
    desc: "中脑、桥脑、延髓自上而下排列，12 对颅神经中 3~12 对附着于脑干。颅神经损伤定位是神经查体基本功。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脑干腹侧面与颅神经（3~12）</text>
  <!-- 间脑/丘脑 -->
  <path d="M230 60 L410 60 L420 110 Q320 130 220 110 Z" fill="#e8d9f5" stroke="#8a5fc0" stroke-width="2"/>
  <text x="320" y="92" text-anchor="middle" font-size="12" fill="#6c3483">间脑（丘脑）</text>
  <!-- 中脑 -->
  <path d="M250 118 L390 118 L398 180 Q320 196 242 180 Z" fill="#f2d7d5" stroke="#c0392b" stroke-width="2"/>
  <text x="320" y="156" text-anchor="middle" font-size="12" fill="#a93226" font-weight="bold">中脑</text>
  <text x="432" y="150" font-size="11" fill="#a93226">Ⅲ 动眼神经</text>
  <text x="432" y="166" font-size="11" fill="#a93226">Ⅳ 滑车神经</text>
  <!-- 桥脑 -->
  <path d="M240 190 L400 190 L404 268 Q320 288 236 268 Z" fill="#d5ecf2" stroke="#2d7dd2" stroke-width="2"/>
  <text x="320" y="238" text-anchor="middle" font-size="12" fill="#17456e" font-weight="bold">桥脑</text>
  <text x="436" y="224" font-size="11" fill="#17456e">Ⅴ 三叉神经</text>
  <text x="436" y="240" font-size="11" fill="#17456e">Ⅵ 外展神经</text>
  <text x="436" y="256" font-size="11" fill="#17456e">Ⅶ 面神经</text>
  <text x="436" y="272" font-size="11" fill="#17456e">Ⅷ 前庭蜗神经</text>
  <!-- 延髓 -->
  <path d="M262 276 L378 276 L384 360 Q320 376 256 360 Z" fill="#f5e6c8" stroke="#b8860b" stroke-width="2"/>
  <text x="320" y="330" text-anchor="middle" font-size="12" fill="#7a5c2e" font-weight="bold">延髓</text>
  <text x="436" y="300" font-size="11" fill="#7a5c2e">Ⅸ 舌咽神经</text>
  <text x="436" y="316" font-size="11" fill="#7a5c2e">Ⅹ 迷走神经</text>
  <text x="436" y="332" font-size="11" fill="#7a5c2e">Ⅺ 副神经</text>
  <text x="436" y="348" font-size="11" fill="#7a5c2e">Ⅻ 舌下神经</text>
  <!-- 椎体交叉 -->
  <text x="320" y="368" text-anchor="middle" font-size="10" fill="#7a5c2e">锥体交叉</text>
  <!-- 连线 -->
  <line x1="300" y1="150" x2="424" y2="150" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="310" y1="230" x2="428" y2="230" stroke="#2d7dd2" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="318" y1="318" x2="428" y2="318" stroke="#b8860b" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- 记忆口诀 -->
  <text x="320" y="408" text-anchor="middle" font-size="12" fill="#7a8aa0">记忆线索：“一嗅二视三动眼，四滑五叉六外展，七面八听九舌咽，十迷一副舌下全”</text>
</svg>`,
    points: ["中脑：Ⅲ 动眼（瞳孔、上睑、眼外肌）、Ⅳ 滑车", "桥脑：Ⅴ 三叉（面感觉咀嚼）、Ⅵ 外展（外直肌）、Ⅶ 面、Ⅷ 前庭蜗", "延髓：Ⅸ 舌咽、Ⅹ 迷走、Ⅺ 副、Ⅻ 舌下（后组颅神经，肿瘤压迫可致吞咽困难）", "动眼神经麻痹（瞳孔散大+上睑下垂）是钩回疝早期信号"]
  },
  {
    id: "scalp", name: "头皮五层", level: "基础", cat: "头皮",
    desc: "头皮五层中前三层（皮肤-皮下-帽状腱膜）紧密相连。腱膜下疏松层是“危险层”，感染可沿其广泛蔓延。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">头皮五层结构</text>
  <!-- 颅骨 -->
  <path d="M120 330 L120 370 Q120 388 140 388 L500 388 Q520 388 520 370 L520 330 Z" fill="#e9eef5" stroke="#9fb2c8" stroke-width="2"/>
  <text x="545" y="364" font-size="11" fill="#7a8aa0">颅骨</text>
  <!-- 骨膜层 -->
  <path d="M120 318 L120 332 L520 332 L520 318 Z" fill="#c8d8ea" stroke="#7a9cc0" stroke-width="2"/>
  <text x="545" y="330" font-size="11" fill="#5b7fa5">骨膜（第5层）</text>
  <!-- 腱膜下疏松层（危险层） -->
  <path d="M120 292 L120 318 L520 318 L520 292 Z" fill="#f9e79f" stroke="#d4ac0d" stroke-width="2.5"/>
  <text x="320" y="310" text-anchor="middle" font-size="12" fill="#7d6608" font-weight="bold">腱膜下疏松结缔组织（危险层）</text>
  <!-- 帽状腱膜 -->
  <path d="M120 260 L120 292 L520 292 L520 260 Z" fill="#f0b8b8" stroke="#c0392b" stroke-width="2"/>
  <text x="545" y="280" font-size="11" fill="#a93226">帽状腱膜（第3层）</text>
  <!-- 皮下层 -->
  <path d="M120 232 L120 260 L520 260 L520 232 Z" fill="#f5d3a8" stroke="#d68910" stroke-width="2"/>
  <text x="545" y="250" font-size="11" fill="#a05c00">皮下组织（第2层，血管神经层）</text>
  <!-- 皮肤层 -->
  <path d="M120 200 L120 232 L520 232 L520 200 Q400 180 320 180 Q240 180 120 200 Z" fill="#e8b08f" stroke="#c07a4a" stroke-width="2"/>
  <text x="545" y="216" font-size="11" fill="#a05c00">皮肤（第1层，含毛囊）</text>
  <!-- 层次线 -->
  <text x="60" y="224" font-size="11" fill="#7a8aa0">表皮</text>
  <text x="60" y="312" font-size="11" fill="#7d6608">⚠ 危险层</text>
  <!-- 底部注 -->
  <text x="320" y="408" text-anchor="middle" font-size="12" fill="#7a8aa0">头皮裂伤出血多源于皮下血管层，帽状腱膜断裂使伤口裂开 → 清创须分层缝合帽状腱膜</text>
</svg>`,
    points: ["五层口诀：“皮肤、皮下、腱膜、疏松、骨膜”", "前三层（S-G-A）紧密相连呈“头皮”，撕脱常发生在此", "危险层：腱膜下疏松结缔组织，感染/血肿可沿整个颅顶蔓延", "头皮血供丰富，愈合快，但出血也凶（撕脱伤可休克）"]
  },
  {
    id: "spinal", name: "脊髓横断面", level: "进阶", cat: "脊髓",
    desc: "中央灰质（蝶形）与周围白质（传导束）。感觉与运动传导束的空间排列决定脊髓损伤综合征的类型。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脊髓横断面</text>
  <!-- 白质 -->
  <ellipse cx="320" cy="225" rx="150" ry="120" fill="#fdf6e3" stroke="#b8860b" stroke-width="2.5"/>
  <!-- 灰质 -->
  <path d="M320 158 Q290 190 268 228 Q258 252 246 262 Q238 268 232 260 Q228 252 236 244 Q248 232 252 214 Q256 196 268 186 Q280 178 292 182 L320 210 L348 182 Q360 178 372 186 Q384 196 388 214 Q392 232 404 244 Q412 252 408 260 Q402 268 394 262 Q382 252 372 228 Q350 190 320 158 Z" fill="#c8a2c8" stroke="#8e5a8e" stroke-width="2"/>
  <text x="320" y="238" text-anchor="middle" font-size="11" fill="#5b2f5b" font-weight="bold">灰质</text>
  <!-- 中央管 -->
  <circle cx="320" cy="232" r="7" fill="#2d7dd2" stroke="#1d5f9e" stroke-width="1.5"/>
  <text x="342" y="236" font-size="10" fill="#17456e">中央管</text>
  <!-- 前正中裂 -->
  <line x1="320" y1="238" x2="320" y2="348" stroke="#2d7dd2" stroke-width="3"/>
  <text x="332" y="360" font-size="10" fill="#17456e">前正中裂</text>
  <!-- 后正中沟 -->
  <line x1="320" y1="226" x2="320" y2="105" stroke="#2d7dd2" stroke-width="3"/>
  <text x="332" y="118" font-size="10" fill="#17456e">后正中沟</text>
  <!-- 前角/后角/侧角 -->
  <text x="282" y="300" font-size="10" fill="#5b2f5b">前角（运动）</text>
  <text x="300" y="172" font-size="10" fill="#5b2f5b">后角（感觉）</text>
  <text x="352" y="196" font-size="10" fill="#5b2f5b">侧角</text>
  <!-- 传导束 -->
  <text x="240" y="150" text-anchor="end" font-size="10" fill="#7a5c2e">薄束/楔束（本体觉）</text>
  <text x="400" y="150" text-anchor="start" font-size="10" fill="#7a5c2e">皮质脊髓侧束（运动）</text>
  <text x="240" y="330" text-anchor="end" font-size="10" fill="#7a5c2e">脊髓丘脑束（痛温觉）</text>
  <!-- 神经根 -->
  <line x1="320" y1="330" x2="196" y2="330" stroke="#16a085" stroke-width="4"/>
  <line x1="196" y1="330" x2="196" y2="360" stroke="#16a085" stroke-width="4"/>
  <text x="196" y="378" text-anchor="middle" font-size="10" fill="#0e6655">前根（运动）</text>
  <line x1="320" y1="150" x2="444" y2="150" stroke="#c0392b" stroke-width="4"/>
  <line x1="444" y1="150" x2="444" y2="180" stroke="#c0392b" stroke-width="4"/>
  <text x="444" y="198" text-anchor="middle" font-size="10" fill="#a93226">后根（感觉）</text>
  <circle cx="444" cy="138" r="9" fill="#e74c3c"/>
  <text x="444" y="142" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold">脊神经节</text>
  <!-- 脊膜 -->
  <path d="M170 225 Q170 105 320 105 Q470 105 470 225 Q470 345 320 345 Q170 345 170 225 Z" fill="none" stroke="#8e44ad" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="500" y="320" font-size="10" fill="#8e44ad">脊膜</text>
</svg>`,
    points: ["脊髓丘脑束：交叉后上行（痛温觉）——一侧损伤对侧痛温觉消失", "皮质脊髓侧束：锥体交叉后下行（运动）——一侧损伤同侧瘫痪", "后索（薄/楔束）：本体觉、精细触觉——深感觉障碍", "脊髓半切（Brown-Séquard）：同侧深感觉+运动障碍、对侧痛温觉障碍"]
  },
  {
    id: "spine-side", name: "脊柱与椎间盘（侧面）", level: "基础", cat: "脊柱",
    desc: "椎体经椎间盘连接，后方椎弓围成椎管容纳脊髓。椎间盘突出向后压迫神经根/脊髓。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">脊柱与椎间盘（侧面）</text>
  <!-- 椎体1 -->
  <path d="M150 70 L390 70 L400 118 Q275 128 140 118 Z" fill="#d5ecf2" stroke="#2d7dd2" stroke-width="2"/>
  <text x="268" y="102" text-anchor="middle" font-size="12" fill="#17456e">椎体</text>
  <!-- 椎间盘1 -->
  <path d="M140 118 Q275 128 400 118 L398 140 Q275 150 142 140 Z" fill="#f0c8c8" stroke="#c0392b" stroke-width="2"/>
  <text x="268" y="136" text-anchor="middle" font-size="11" fill="#a93226">椎间盘</text>
  <!-- 椎体2 -->
  <path d="M142 140 Q275 150 398 140 L396 190 Q275 200 144 190 Z" fill="#d5ecf2" stroke="#2d7dd2" stroke-width="2"/>
  <!-- 椎弓根与椎板 -->
  <path d="M396 100 L430 96 L446 112 L444 132" stroke="#2d7dd2" stroke-width="6" fill="none"/>
  <path d="M444 132 L430 140 L420 150 L436 158 L450 150 L466 158 L472 150 L452 136" fill="#bcd4f5" stroke="#2d7dd2" stroke-width="2"/>
  <text x="458" y="140" font-size="10" fill="#17456e">棘突</text>
  <!-- 椎管 -->
  <path d="M436 96 L452 96 L470 190 L454 190 Z" fill="#fdf6e3" stroke="#b8860b" stroke-width="1.5"/>
  <!-- 脊髓 -->
  <path d="M452 70 L452 210" stroke="#8e44ad" stroke-width="14" stroke-linecap="round"/>
  <text x="470" y="120" font-size="10" fill="#6c3483">脊髓</text>
  <!-- 神经根出椎间孔 -->
  <path d="M446 132 Q486 138 520 150" stroke="#16a085" stroke-width="4"/>
  <text x="520" y="164" text-anchor="middle" font-size="10" fill="#0e6655">神经根</text>
  <text x="520" y="180" text-anchor="middle" font-size="9" fill="#0e6655">（椎间孔）</text>
  <!-- 椎间盘突出示意 -->
  <path d="M270 136 Q278 150 288 156 Q276 154 268 148 Z" fill="#c0392b"/>
  <path d="M268 148 Q266 160 276 166 Q284 168 290 164" fill="#c0392b"/>
  <text x="268" y="196" text-anchor="middle" font-size="11" fill="#a93226" font-weight="bold">向后突出压迫</text>
  <text x="268" y="212" text-anchor="middle" font-size="10" fill="#a93226">神经根/硬膜</text>
  <!-- 脊髓圆锥 -->
  <text x="400" y="240" font-size="10" fill="#7a8aa0">脊髓圆锥：成人约止于 L1~L2</text>
  <!-- 标注 -->
  <text x="120" y="96" text-anchor="middle" font-size="10" fill="#7a8aa0">前</text>
  <text x="580" y="96" text-anchor="middle" font-size="10" fill="#7a8aa0">后</text>
</svg>`,
    points: ["椎间盘：纤维环+髓核，退变致纤维环破裂→髓核突出", "腰椎间盘突出好发 L4/5、L5/S1，压迫对应神经根（L5→小腿外侧、S1→足底）", "椎管内容：脊髓（至 L1~L2 圆锥）、马尾、脑脊液", "颈椎间盘突出压迫脊髓→脊髓型颈椎病（踩棉花感）"]
  },
  {
    id: "dural-layers", name: "小脑幕与颅底孔道", level: "进阶", cat: "脑膜",
    desc: "硬脑膜内层反折形成小脑幕、大脑镰。小脑幕切迹是脑疝关键结构，颅底孔道是颅神经与血管出入门户。",
    svg: `
<svg viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
  <rect width="640" height="430" fill="#f8fafc"/>
  <text x="320" y="28" text-anchor="middle" font-size="17" font-weight="bold" fill="#1e293b">小脑幕与颅底重要孔道</text>
  <!-- 颅底俯视图 -->
  <ellipse cx="320" cy="240" rx="250" ry="170" fill="#f2ecdf" stroke="#b8860b" stroke-width="2.5"/>
  <!-- 小脑幕（前方切迹） -->
  <path d="M120 210 Q320 150 520 210 Q500 300 320 340 Q140 300 120 210 Z" fill="#c8d8ea" stroke="#5b7fa5" stroke-width="2.5"/>
  <text x="180" y="280" font-size="11" fill="#5b7fa5">小脑幕（右侧）</text>
  <!-- 小脑幕切迹 -->
  <path d="M250 200 Q320 176 390 200" fill="none" stroke="#e74c3c" stroke-width="3.5"/>
  <text x="320" y="168" text-anchor="middle" font-size="11" fill="#a93226" font-weight="bold">小脑幕切迹（钩回疝发生处）</text>
  <!-- 枕骨大孔 -->
  <ellipse cx="320" cy="352" rx="70" ry="24" fill="#fdf6e3" stroke="#b8860b" stroke-width="2"/>
  <text x="320" y="357" text-anchor="middle" font-size="10" fill="#7a5c2e">枕骨大孔</text>
  <!-- 蝶骨嵴 -->
  <path d="M150 180 L320 120 L490 180" stroke="#9fb2c8" stroke-width="4" fill="none"/>
  <text x="320" y="110" text-anchor="middle" font-size="10" fill="#7a8aa0">蝶骨嵴</text>
  <!-- 重要孔道标注 -->
  <circle cx="250" cy="210" r="7" fill="#16a085"/>
  <text x="250" y="244" text-anchor="middle" font-size="10" fill="#0e6655">视神经管（Ⅱ）</text>
  <circle cx="205" cy="226" r="6" fill="#16a085"/>
  <text x="205" y="256" text-anchor="middle" font-size="10" fill="#0e6655">眶上裂（ⅢⅣⅥ）</text>
  <circle cx="165" cy="248" r="6" fill="#16a085"/>
  <text x="163" y="276" text-anchor="middle" font-size="10" fill="#0e6655">圆孔（Ⅴ₂）</text>
  <circle cx="400" cy="196" r="6" fill="#16a085"/>
  <text x="412" y="206" font-size="10" fill="#0e6655">卵圆孔（Ⅴ₃）</text>
  <circle cx="435" cy="240" r="7" fill="#e74c3c"/>
  <text x="448" y="254" font-size="10" fill="#a93226">内耳门（ⅦⅧ）</text>
  <circle cx="452" cy="300" r="7" fill="#e74c3c"/>
  <text x="462" y="314" font-size="10" fill="#a93226">颈静脉孔（ⅨⅩⅪ）</text>
  <!-- 大脑镰示意 -->
  <line x1="320" y1="60" x2="320" y2="130" stroke="#c0392b" stroke-width="4" stroke-dasharray="3,3"/>
  <text x="330" y="72" font-size="10" fill="#a93226">大脑镰（前部）</text>
  <text x="320" y="408" text-anchor="middle" font-size="12" fill="#7a8aa0">颅底孔道与穿行结构对应关系是颅底外科与颅底骨折定位的关键</text>
</svg>`,
    points: ["小脑幕切迹：幕上占位致海马钩回疝入切迹，压迫动眼神经与大脑脚", "枕骨大孔：延髓与椎动脉穿行，小脑扁桃体疝可致呼吸骤停", "颅底骨折定位：前窝→嗅/视；中窝→面听、颈静脉孔结构", "内耳门（ⅦⅧ）、颈静脉孔（ⅨⅩⅪ）是 CPA 区手术与肿瘤评估核心"]
  }
];
