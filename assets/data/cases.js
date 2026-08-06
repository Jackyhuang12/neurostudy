/* 交互病例：只使用去标识化开放教学数据；病例文字用于训练观察路径，不作诊断。 */
const LEARNING_CASES = {
  imaging: [
    {
      id: "normal-t1", label: "正常 T1 地图", badge: "先学正常",
      title: "正常脑 T1：建立三维方向感",
      question: "先不看答案：脑室、皮层和小脑分别在哪里？左右是否大致对称？",
      answer: "T1 像一张解剖底图：脑脊液较暗，白质通常较灰质亮。先确认方向和对称，再谈异常。",
      volumes: [{ url:"assets/cases/normal-t1.nii.gz", name:"normal-t1.nii.gz", colormap:"gray" }],
      notes: ["滚轮逐层浏览，不要只盯一张代表图。", "切到冠状位观察双侧半球和脑室是否对称。", "切到矢状位寻找胼胝体、脑干与小脑的连续关系。"],
      source: "NiiVue 开放演示数据；群体模板，不是单个患者。"
    },
    {
      id: "flair-lesion", label: "FLAIR + 标注", badge: "找病灶",
      title: "FLAIR 白质异常信号：先找，再开标注核对",
      question: "关闭红色标注，滚动全部层面：你能发现哪些不对称的高信号区域？",
      answer: "教学重点不是猜病名，而是完整描述：位置、侧别、数量、边界、占位效应，并与其他序列和临床信息交叉验证。",
      volumes: [
        { url:"assets/cases/flair-lesion.nii.gz", name:"flair-lesion.nii.gz", colormap:"gray" },
        { url:"assets/cases/flair-lesion-mask.nii.gz", name:"flair-lesion-mask.nii.gz", colormap:"red", opacity:0 }
      ],
      notes: ["先关标注通读一遍，避免答案先入为主。", "看到亮点后，用相邻层面确认它是真实结构还是单层伪影。", "打开标注核对遗漏；标注只是本数据集的教学分割，不等于完整诊断。"],
      source: "NiiVue FLAIR 与 lesion 开放演示数据。"
    },
    {
      id: "ct-volume", label: "CT 逐层定位", badge: "看窗与层面",
      title: "头颅 CT 体数据：从颅底滚到颅顶",
      question: "按固定顺序浏览：骨性结构 → 脑池 → 脑室 → 脑沟 → 中线。哪些层面最容易受部分容积影响？",
      answer: "CT 不能只看一层。连续层面能帮助区分真实结构、部分容积效应与伪影；正式阅片还需合适窗宽窗位和完整临床资料。",
      volumes: [{ url:"assets/cases/ct-perfusion.nii.gz", name:"ct-volume.nii.gz", colormap:"gray" }],
      notes: ["从下向上连续滚动，先建立颅底到颅顶的顺序。", "发现可疑高/低密度时，一定追踪它在相邻层是否连续。", "本示例只有有限层厚，不能替代原始 DICOM 阅片。"],
      source: "NiiVue 开放 CT 演示数据。"
    }
  ],
  clinic: [
    { id:"stroke", icon:"⚡", title:"突然一侧无力、说话不清", tempo:"数分钟", first:"先确认最后正常时间、生命体征和血糖，启动卒中急诊流程。", image:"先做无对比 CT 排出血；再按流程考虑 CTA/灌注或 MRI-DWI。", decision:"核心不是先背病名，而是争分夺秒地区分出血与缺血、判断大血管与可救脑组织。", trap:"不要等待症状自行缓解，也不要用网页做自测。" },
    { id:"sah", icon:"💥", title:"突发“最剧烈头痛”", tempo:"瞬间达到高峰", first:"按急症处理，关注意识、颈抵抗、呕吐及神经功能变化。", image:"急性期常先无对比 CT；高度怀疑时由专业团队决定 CTA、腰穿或 DSA。", decision:"确认是否出血只是第一步，还要寻找动脉瘤等病因并评估再出血、脑积水和血管痉挛风险。", trap:"一次阴性检查不应脱离发病时间和检查质量单独解释。" },
    { id:"tumor", icon:"🧩", title:"数周头痛加重并首次抽搐", tempo:"逐渐进展", first:"先判断是否存在颅压增高或持续发作等急迫问题，再做完整神经查体。", image:"MRI 多序列定位病变、周围水肿、强化与功能区关系；必要时加灌注、波谱或血管成像。", decision:"手术规划需同时回答：能否安全到达、取多少合适、如何保护功能、还需要什么病理与分子信息。", trap:"“强化”不等于恶性，“不强化”也不能排除重要病变。" }
  ]
};
