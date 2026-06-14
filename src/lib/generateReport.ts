import type { UserProfile } from '../types/profile'
import { calcBmi, genderLabel } from '../types/profile'
import type { Metric, Report, ReportModule } from '../types/report'
import { countModuleAbnormal } from '../types/report'
import { DEVICE_NAME, INSTITUTION } from '../config/site'
import {
  createSeededRandom,
  hashString,
  pickOne,
  randomInRange,
} from './random'

const BRAIN_NOTES = [
  '认知水平与智力水平测评分值略低于同龄参考区间，其余神经认知分项未见明显异常。',
  '认知相关量表评分处于参考范围下限，建议结合日常表现综合判断，必要时复测。',
]

const PHYSICIANS = ['王建国 主任医师', '李晓明 副主任医师', '陈慧 主检医师']
const REVIEWERS = ['张丽华 审核医师', '刘洋 检验科主任']

function m(
  name: string,
  value: string,
  reference: string,
  status: Metric['status'],
  extras?: Partial<Metric>,
): Metric {
  return { name, value, reference, status, ...extras }
}

function withAbnormalCount(mod: ReportModule): ReportModule {
  return { ...mod, abnormalCount: countModuleAbnormal(mod) }
}

/** 小概率生成一项轻微异常（非脑功能） */
function pickMinorLabFlag(rand: () => number): {
  ldl?: Metric['status']
  tg?: Metric['status']
  vision?: Metric['status']
} {
  if (rand() > 0.18) return {}
  const pick = Math.floor(rand() * 3)
  if (pick === 0) return { ldl: 'attention' }
  if (pick === 1) return { tg: 'attention' }
  return { vision: 'attention' }
}

function buildModules(
  rand: () => number,
  profile: UserProfile,
): ReportModule[] {
  const bmi = calcBmi(profile.height, profile.weight)
  const systolic = Math.round(randomInRange(rand, 108, 122, 0))
  const diastolic = Math.round(randomInRange(rand, 68, 82, 0))
  const heartRate = Math.round(randomInRange(rand, 66, 82, 0))
  const cognitiveScore = Math.round(randomInRange(rand, 38, 45, 0))
  const intellectualScore = Math.round(randomInRange(rand, 35, 42, 0))
  const minor = pickMinorLabFlag(rand)

  const ldl = minor.ldl
    ? randomInRange(rand, 3.4, 3.7, 2)
    : randomInRange(rand, 2.0, 3.1, 2)
  const tg = minor.tg
    ? randomInRange(rand, 1.7, 2.0, 2)
    : randomInRange(rand, 0.7, 1.5, 2)

  const modules: ReportModule[] = [
    {
      id: 'general',
      sectionNo: '3.1',
      title: '一般检查',
      titleEn: 'General Examination',
      doctorNote: '发育正常，营养良好，神志清楚，自主体位。',
      metrics: [
        m('身高', String(profile.height), '—', 'normal', { unit: 'cm' }),
        m('体重', String(profile.weight), '—', 'normal', { unit: 'kg' }),
        m('体重指数 BMI', String(bmi), '18.5–23.9', 'normal', { unit: 'kg/m²' }),
        m('收缩压', String(systolic), '90–140', 'normal', { unit: 'mmHg' }),
        m('舒张压', String(diastolic), '60–90', 'normal', { unit: 'mmHg' }),
        m('脉搏', String(heartRate), '60–100', 'normal', { unit: '次/分' }),
        m('腰围', String(Math.round(randomInRange(rand, 72, 86, 0))), '男<90 女<85', 'normal', { unit: 'cm' }),
      ],
    },
    {
      id: 'internal',
      sectionNo: '3.2',
      title: '内科检查',
      titleEn: 'Internal Medicine',
      doctorNote: '心肺听诊未见明显异常，腹软，无压痛及反跳痛。',
      metrics: [
        m('发育营养', '良好', '—', 'normal'),
        m('肺部听诊', '呼吸音清晰', '—', 'normal'),
        m('心脏听诊', '心律齐，未闻及杂音', '—', 'normal'),
        m('腹部触诊', '腹软，无包块', '—', 'normal'),
        m('肝脾触诊', '肋下未触及', '—', 'normal'),
      ],
    },
    {
      id: 'surgery',
      sectionNo: '3.3',
      title: '外科检查',
      titleEn: 'Surgery',
      doctorNote: '皮肤黏膜无黄染，浅表淋巴结未触及肿大。',
      metrics: [
        m('皮肤黏膜', '未见黄染、皮疹', '—', 'normal'),
        m('浅表淋巴结', '未触及肿大', '—', 'normal'),
        m('甲状腺', '未触及肿大', '—', 'normal'),
        m('脊柱四肢', '无畸形，活动自如', '—', 'normal'),
        m('乳腺/前列腺', '未见异常', '—', 'normal'),
      ],
    },
    {
      id: 'ophthalmology',
      sectionNo: '3.4',
      title: '眼科检查',
      titleEn: 'Ophthalmology',
      metrics: [
        m(
          '裸眼视力（左）',
          randomInRange(rand, 0.9, 1.2, 1).toFixed(1),
          '≥1.0',
          minor.vision ? 'attention' : 'normal',
        ),
        m('裸眼视力（右）', randomInRange(rand, 0.9, 1.2, 1).toFixed(1), '≥1.0', 'normal'),
        m('矫正视力', '—', '—', 'normal'),
        m('色觉', '正常', '—', 'normal'),
        m('眼压', String(Math.round(randomInRange(rand, 12, 18, 0))), '10–21', 'normal', { unit: 'mmHg' }),
        m('屈光状态', '正常', '—', 'normal'),
      ],
    },
    {
      id: 'cbc',
      sectionNo: '3.5',
      title: '实验室检查 · 血常规',
      titleEn: 'Complete Blood Count',
      metrics: [
        m('白细胞 WBC', randomInRange(rand, 4.8, 7.0, 2).toFixed(2), '3.5–9.5', 'normal', { unit: '×10⁹/L' }),
        m('红细胞 RBC', randomInRange(rand, 4.3, 5.2, 2).toFixed(2), profile.gender === 'male' ? '4.3–5.8' : '3.8–5.1', 'normal', { unit: '×10¹²/L' }),
        m('血红蛋白 Hb', String(Math.round(randomInRange(rand, 135, 155, 0))), profile.gender === 'male' ? '130–175' : '115–150', 'normal', { unit: 'g/L' }),
        m('血小板 PLT', String(Math.round(randomInRange(rand, 160, 280, 0))), '125–350', 'normal', { unit: '×10⁹/L' }),
        m('中性粒细胞%', String(Math.round(randomInRange(rand, 52, 65, 0))), '40–75', 'normal', { unit: '%' }),
        m('淋巴细胞%', String(Math.round(randomInRange(rand, 25, 36, 0))), '20–50', 'normal', { unit: '%' }),
      ],
    },
    {
      id: 'biochemistry',
      sectionNo: '3.6',
      title: '实验室检查 · 生化',
      titleEn: 'Biochemistry',
      metrics: [
        m('空腹血糖 FPG', randomInRange(rand, 4.5, 5.2, 1).toFixed(1), '3.9–6.1', 'normal', { unit: 'mmol/L' }),
        m('总胆固醇 TC', randomInRange(rand, 3.8, 4.8, 2).toFixed(2), '<5.2', 'normal', { unit: 'mmol/L' }),
        m(
          '低密度脂蛋白 LDL-C',
          ldl.toFixed(2),
          '<3.4',
          minor.ldl ? 'attention' : 'normal',
          { unit: 'mmol/L', trend: minor.ldl ? 'high' : 'normal' },
        ),
        m(
          '甘油三酯 TG',
          tg.toFixed(2),
          '<1.7',
          minor.tg ? 'attention' : 'normal',
          { unit: 'mmol/L', trend: minor.tg ? 'high' : 'normal' },
        ),
        m('高密度脂蛋白 HDL-C', randomInRange(rand, 1.1, 1.6, 2).toFixed(2), '>1.0', 'normal', { unit: 'mmol/L' }),
        m('丙氨酸氨基转移酶 ALT', String(Math.round(randomInRange(rand, 12, 32, 0))), '7–40', 'normal', { unit: 'U/L' }),
        m('肌酐 Cr', randomInRange(rand, 65, 85, 0).toFixed(0), '57–111', 'normal', { unit: 'μmol/L' }),
        m(
          '尿酸 UA',
          String(Math.round(randomInRange(rand, 240, 380, 0))),
          profile.gender === 'male' ? '208–428' : '155–357',
          'normal',
          { unit: 'μmol/L' },
        ),
        m('促甲状腺激素 TSH', randomInRange(rand, 1.5, 3.5, 2).toFixed(2), '0.27–4.2', 'normal', { unit: 'mIU/L' }),
      ],
    },
    {
      id: 'urinalysis',
      sectionNo: '3.7',
      title: '实验室检查 · 尿常规',
      titleEn: 'Urinalysis',
      metrics: [
        m('尿蛋白 PRO', '阴性', '阴性', 'normal'),
        m('尿糖 GLU', '阴性', '阴性', 'normal'),
        m('尿潜血 BLD', '阴性', '阴性', 'normal'),
        m('尿酮体 KET', '阴性', '阴性', 'normal'),
        m('尿比重 SG', randomInRange(rand, 1.015, 1.022, 3).toFixed(3), '1.003–1.030', 'normal'),
        m('酸碱度 pH', randomInRange(rand, 5.8, 6.8, 1).toFixed(1), '5.0–8.0', 'normal'),
      ],
    },
    {
      id: 'auxiliary',
      sectionNo: '3.8',
      title: '辅助检查',
      titleEn: 'Auxiliary Examination',
      metrics: [
        m('心电图', '窦性心律，正常心电图', '—', 'normal'),
        m('胸部 DR', '双肺纹理清晰，心影大小形态正常', '—', 'normal'),
        m('腹部 B 超', '肝胆脾胰未见明显异常', '—', 'normal'),
        m('颈动脉超声', '未见明显斑块形成', '—', 'normal'),
      ],
    },
    {
      id: 'brain',
      sectionNo: '3.9',
      title: '脑功能 / 神经认知评估',
      titleEn: 'Neuro-Cognitive Assessment',
      summary: pickOne(rand, BRAIN_NOTES),
      doctorNote: '建议定期随访，必要时行神经心理量表复测。',
      metrics: [
        m(
          '认知水平',
          String(cognitiveScore),
          '≥70',
          'mild-impairment',
          { nameEn: 'Cognitive Level', score: cognitiveScore, unit: '分', trend: 'low' },
        ),
        m(
          '智力水平',
          String(intellectualScore),
          '≥70',
          'mild-impairment',
          { nameEn: 'Intellectual Level', score: intellectualScore, unit: '分', trend: 'low' },
        ),
        m(
          '简单反应时',
          String(Math.round(randomInRange(rand, 260, 320, 0))),
          '<350',
          'normal',
          { unit: 'ms' },
        ),
        m(
          '工作记忆指数',
          String(Math.round(randomInRange(rand, 72, 88, 0))),
          '≥65',
          'normal',
          { unit: '分' },
        ),
        m(
          '执行功能指数',
          String(Math.round(randomInRange(rand, 74, 90, 0))),
          '≥65',
          'normal',
          { unit: '分' },
        ),
        m(
          '注意力集中度',
          String(Math.round(randomInRange(rand, 76, 92, 0))),
          '≥70',
          'normal',
          { unit: '分' },
        ),
      ],
    },
  ]

  return modules.map(withAbnormalCount)
}

function buildPositiveFindings(modules: ReportModule[]): string[] {
  const findings: string[] = []
  for (const mod of modules) {
    for (const metric of mod.metrics) {
      if (metric.status === 'mild-impairment') {
        findings.push(`${metric.name} ${metric.value}${metric.unit ?? ''}（${STATUS_LABELS[metric.status]}）`)
      } else if (metric.status === 'attention') {
        const trend = metric.trend === 'high' ? '偏高' : metric.trend === 'low' ? '偏低' : '需关注'
        findings.push(`${metric.name} ${metric.value}${metric.unit ?? ''}（${trend}）`)
      }
    }
  }
  return findings.slice(0, 5)
}

const STATUS_LABELS = {
  normal: '正常',
  attention: '偏高',
  'mild-impairment': '轻度障碍',
} as const

export async function hashPhotoDataUrl(dataUrl: string): Promise<number> {
  const base64 = dataUrl.split(',')[1] ?? dataUrl
  const sample = base64.slice(0, 8000) + base64.slice(-2000)
  return hashString(sample)
}

function profileSeed(profile: UserProfile): number {
  return hashString(`${profile.gender}-${profile.age}-${profile.height}-${profile.weight}`)
}

export function generateReport(
  seed: number,
  photoDataUrl: string,
  profile: UserProfile,
): Report {
  const rand = createSeededRandom(seed ^ profileSeed(profile))
  const id = `${new Date().getFullYear()}${String(Math.floor(rand() * 900000) + 100000)}`
  const overallScore = Math.round(randomInRange(rand, 82, 92, 0))
  const now = new Date()
  const modules = buildModules(rand, profile)
  const positiveFindings = buildPositiveFindings(modules)
  const hasMinor = positiveFindings.some((f) => !f.includes('认知') && !f.includes('智力'))

  return {
    meta: {
      id,
      institution: INSTITUTION,
      timestamp: now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      reportDate: now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      device: DEVICE_NAME,
      photoDataUrl,
      profile: {
        gender: profile.gender,
        genderLabel: genderLabel(profile.gender),
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        bmi: calcBmi(profile.height, profile.weight),
      },
      overallScore,
      overallSummary:
        '本次体检各系统检查基本完成，总体健康状况良好。部分项目存在需随访指标，详见分项结果及总检意见。',
      chiefConclusion: hasMinor
        ? '综合各项检查结果，受检者大部分指标在正常范围内。认知水平与智力水平测评分值略低于参考区间，建议定期复查；其余轻度异常指标建议生活方式调整后随访。'
        : '综合各项检查结果，受检者大部分指标在正常范围内。认知水平与智力水平测评分值略低于参考区间，建议结合临床表现定期复查，必要时行神经心理专项评估。',
      positiveFindings,
      followUp: [
        '神经心理量表复测（建议 6–12 个月）',
        '常规年度健康体检',
      ],
      physician: pickOne(rand, PHYSICIANS),
      reviewer: pickOne(rand, REVIEWERS),
    },
    modules,
  }
}

export async function generateReportFromPhoto(
  photoDataUrl: string,
  profile: UserProfile,
): Promise<Report> {
  const seed = await hashPhotoDataUrl(photoDataUrl)
  return generateReport(seed, photoDataUrl, profile)
}
