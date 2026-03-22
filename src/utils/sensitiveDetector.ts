import type { SensitiveMatch } from '../types';

interface PatternDef {
  type: string;
  label: string;
  patterns: RegExp[];
}

const SENSITIVE_PATTERNS: PatternDef[] = [
  {
    type: 'password',
    label: '密码/密钥',
    patterns: [
      /密码\s*[:：]\s*\S+/g,
      /password\s*[:=]\s*\S+/gi,
      /token\s*[:=]\s*\S+/gi,
      /api[_-]?key\s*[:=]\s*\S+/gi,
      /secret\s*[:=]\s*\S+/gi,
      /秘钥\s*[:：]\s*\S+/g,
    ],
  },
  {
    type: 'id_card',
    label: '身份证件',
    patterns: [
      /\b\d{17}[\dXx]\b/g,
      /身份证\s*[:：]\s*\S+/g,
      /护照\s*[:：]\s*\S+/g,
    ],
  },
  {
    type: 'bank_card',
    label: '金融账户',
    patterns: [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      /银行卡\s*[:：]\s*\S+/g,
      /信用卡\s*[:：]\s*\S+/g,
      /CVV\s*[:：]\s*\d{3,4}/gi,
    ],
  },
  {
    type: 'phone',
    label: '个人联系方式',
    patterns: [
      /\b1[3-9]\d{9}\b/g,
      /手机\s*[:：]\s*\S+/g,
      /电话\s*[:：]\s*\S+/g,
    ],
  },
  {
    type: 'email',
    label: '邮箱地址',
    patterns: [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    ],
  },
  {
    type: 'health',
    label: '健康医疗',
    patterns: [
      /病历\s*[:：]/g,
      /诊断\s*[:：]/g,
      /处方\s*[:：]/g,
      /用药\s*[:：]/g,
    ],
  },
];

export function detectSensitiveInfo(text: string): SensitiveMatch[] {
  const results: SensitiveMatch[] = [];

  for (const def of SENSITIVE_PATTERNS) {
    const allMatches: string[] = [];
    const allIndices: [number, number][] = [];

    for (const pattern of def.patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        allMatches.push(match[0]);
        allIndices.push([match.index, match.index + match[0].length]);
      }
    }

    if (allMatches.length > 0) {
      results.push({
        type: def.type,
        label: def.label,
        matches: allMatches,
        indices: allIndices,
      });
    }
  }

  return results;
}

export function maskSensitiveText(text: string, matches: SensitiveMatch[]): string {
  let masked = text;
  const allIndices: [number, number][] = matches.flatMap((m) => m.indices);
  allIndices.sort((a, b) => b[0] - a[0]);

  for (const [start, end] of allIndices) {
    const original = masked.slice(start, end);
    const visible = original.slice(0, 2);
    const stars = '*'.repeat(Math.max(original.length - 2, 4));
    masked = masked.slice(0, start) + visible + stars + masked.slice(end);
  }

  return masked;
}
