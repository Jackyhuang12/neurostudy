/* ============================================================
   神经外科学习网 · 视频资源导航数据
   链接为平台官方/公开入口，版权归原作者所有，仅供学习
   ============================================================ */

const VIDEOS = [
  {
    cat: "cn", catName: "国内学习平台", icon: "🇨🇳", color: "#c0392b",
    desc: "中文教学与继续教育资源，覆盖解剖、查体、手术演示与学术会议。",
    items: [
      { name: "Bilibili 神经外科专区", desc: "大量中文字幕教学视频：解剖、颅脑损伤、显微技术、手术录像分享，搜索关键词可直达（如“神经外科 手术入路”“脑出血 手术”）。", url: "https://search.bilibili.com/all?keyword=%E7%A5%9E%E7%BB%8F%E5%A4%96%E7%A7%91", tags: ["视频", "入门", "免费"] },
      { name: "丁香园（神经外科）", desc: "国内最大医学社区，神外版块有病例讨论、手术录像、经验分享与继续教育。", url: "https://www.dxy.cn", tags: ["病例", "社区", "论坛"] },
      { name: "CCMTV 临床频道", desc: "国内临床医学视频平台，含手术演示、专家讲座、指南解读。", url: "https://www.ccmtv.cn", tags: ["讲座", "手术演示"] },
      { name: "医学界（医生站）", desc: "医生教育平台，神外相关直播课与文献解读，移动端友好。", url: "https://www.yxj.org.cn", tags: ["直播", "继续教育"] },
      { name: "中华医学会神经外科学分会", desc: "官方学术组织，年会与继续教育项目、指南发布入口。", url: "https://www.cns.org.cn", tags: ["学术", "指南"] },
      { name: "MedSci 梅斯医学", desc: "科研与临床教育平台，含手术视频与前沿进展翻译解读。", url: "https://www.medsci.cn", tags: ["进展", "科研"] }
    ]
  },
  {
    cat: "intl", catName: "国际权威教学资源", icon: "🌍", color: "#2d7dd2",
    desc: "世界顶级医疗机构的公开课程与手术录像，质量极高，建议配合中文字幕学习。",
    items: [
      { name: "The Neurosurgical Atlas", desc: "神外手术图谱网站（Aaron Cohen-Gadol 教授创建）：每一例手术都有详细图解、手术视频与入路解剖，是手术入路学习首选。", url: "https://www.neurosurgicalatlas.com", tags: ["手术视频", "入路解剖", "权威"] },
      { name: "NEJM Videos in Clinical Medicine", desc: "《新英格兰医学杂志》经典操作视频，含腰椎穿刺、气管切开、脑室外引流等规范操作。", url: "https://www.nejm.org/medical-videos", tags: ["操作规范", "英文"] },
      { name: "Congress of Neurological Surgeons (CNS)", desc: "美国神经外科医师大会，官方教育视频与手术数据库（部分免费）。", url: "https://www.cns.org", tags: ["学术", "手术"] },
      { name: "AANS（美国神经外科医师协会）", desc: "美国神经外科医师协会，教育资源与年度会议视频。", url: "https://www.aans.org", tags: ["学术", "会议"] },
      { name: "Barrow Neurological Institute", desc: "国际顶尖神经专科中心（Barrow 脑动脉瘤/显微外科培训闻名），官网有公开教育内容。", url: "https://www.barrowneuro.org", tags: ["显微", "脑血管"] },
      { name: "UCSF Neurosurgery", desc: "加州大学旧金山分校神外，公开讲座与病例讨论（YouTube 同步）。", url: "https://neurosurgery.ucsf.edu", tags: ["讲座", "英文"] },
      { name: "Mayfield / Ohio 神外教育", desc: "Mayfield Clinic 提供脑血管病与脊柱疾病动画与教学资源。", url: "https://www.mayfieldclinic.com", tags: ["动画", "患者教育"] }
    ]
  },
  {
    cat: "surgery", catName: "手术视频专项", icon: "🎬", color: "#8e44ad",
    desc: "高质量手术录像与显微技术训练资源（部分需注册/付费，注意版权）。",
    items: [
      { name: "Neurosurgical Atlas（手术视频库）", desc: "按病种与入路分类的手术全程视频，含术前规划与解剖要点解说，强烈推荐。", url: "https://www.neurosurgicalatlas.com/videos", tags: ["手术", "入路", "权威"] },
      { name: "AEINeuro（内镜神经外科）", desc: "The Atlas of Endoscopic Neurosurgery：内镜经蝶、内镜颅底手术视频。", url: "https://aeineuro.com", tags: ["内镜", "颅底"] },
      { name: "Surgery Theater", desc: "公开手术视频平台，含神经外科分类（动脉瘤、肿瘤、脊柱）。", url: "https://www.surgerytheater.com", tags: ["手术", "免费"] },
      { name: "JOVE 视频实验期刊", desc: "Journal of Visualized Experiments：以视频呈现手术与技术操作，神外相关文章高质量（部分订阅）。", url: "https://www.jove.com", tags: ["技术", "科研"] },
      { name: "YouTube 神外频道（Neurosurgical TV 等）", desc: "搜索 \"neurosurgery animation\"、\"aneurysm clipping\"、\"transsphenoidal\" 可获取大量 3D 动画与手术实录。", url: "https://www.youtube.com/results?search_query=neurosurgery+animation", tags: ["动画", "英文"] },
      { name: "UPMC Neurosurgery", desc: "匹兹堡大学医学中心神外，公开教学视频与病例。", url: "https://www.neurosurgery.pitt.edu", tags: ["教学", "英文"] }
    ]
  },
  {
    cat: "anatomy", catName: "解剖与影像资源", icon: "🧩", color: "#00a86b",
    desc: "数字解剖与影像重建工具，配合图谱理解三维结构。",
    items: [
      { name: "Neuroanatomy Online（UBC）", desc: "加拿大 UBC 大学免费神经解剖在线课程，含脑切片、通道路径动画。", url: "https://neuroanatomy.ca", tags: ["解剖", "免费"] },
      { name: "Visible Body（人体解剖）", desc: "3D 交互解剖软件，含脑与颅神经精细模型（订阅制，支持中英）。", url: "https://www.visiblebody.com", tags: ["3D", "交互"] },
      { name: "Anatomy Atlases", desc: "免费解剖图谱集，含中枢神经系统分册。", url: "https://www.anatomyatlases.org", tags: ["图谱", "免费"] },
      { name: "Radiopaedia", desc: "放射学免费学习社区：中枢神经系统影像病例丰富，神外术前读片必备。", url: "https://radiopaedia.org", tags: ["影像", "病例", "免费"] },
      { name: "e-Anatomy（IMAIOS）", desc: "专业影像解剖图谱，含脑 MRI 各序列结构标注（订阅制）。", url: "https://www.imaios.com", tags: ["影像解剖", "MRI"] },
      { name: "Skull Viewer（3D 颅骨）", desc: "在线 3D 颅骨模型，可旋转观察骨缝与孔道。", url: "https://skullviewer.com", tags: ["3D", "颅骨"] }
    ]
  },
  {
    cat: "journal", catName: "期刊与继续教育", icon: "📚", color: "#e67e22",
    desc: "神外核心期刊与继续教育资源，跟踪前沿与指南更新。",
    items: [
      { name: "中华神经外科杂志", desc: "国内神外核心期刊，指南与临床研究。", url: "https://www.cjns.org.cn", tags: ["期刊", "中文"] },
      { name: "Journal of Neurosurgery", desc: "神外顶级期刊（AANS 出版），免费开放部分手术技术文章与视频。", url: "https://thejns.org", tags: ["期刊", "英文"] },
      { name: "Neurosurgery（杂志）", desc: "CNS 官方期刊，含手术技术专栏（Operative Neurosurgery 子刊专发手术视频）。", url: "https://journals.lww.com/neurosurgery", tags: ["期刊", "手术"] },
      { name: "World Neurosurgery", desc: "全球神外期刊，开放获取论文多，适合文献起步。", url: "https://www.worldneurosurgery.org", tags: ["期刊", "开放获取"] },
      { name: "China Neurosurgery（中文资讯站）", desc: "神外专业中文资讯与继续教育平台，含病例与视频。", url: "https://www.chinaneurosurgery.com", tags: ["资讯", "中文"] },
      { name: "Medscape Neurosurgery", desc: "免费医学教育平台，神经外科继续教育课件与会议报道（注册免费）。", url: "https://www.medscape.com/neurology/neurosurgery", tags: ["继续教育", "免费"] }
    ]
  }
];
