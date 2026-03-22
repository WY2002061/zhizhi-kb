const KEYWORDS_MAP: Record<string, string[]> = {
  '机器学习': ['AI', '机器学习', '深度学习'],
  '神经网络': ['AI', '深度学习', '神经网络'],
  'React': ['React', '前端', 'JavaScript'],
  'TypeScript': ['TypeScript', '前端', '编程语言'],
  '产品': ['产品设计', '用户体验'],
  '设计': ['设计', '用户体验', 'UI'],
  '算法': ['算法', '数据结构', '编程'],
  '推荐系统': ['推荐系统', 'AI', '算法'],
  '架构': ['系统架构', '技术', '后端'],
  '管理': ['项目管理', '团队', '职业发展'],
  '阅读': ['阅读', '学习', '成长'],
  'API': ['API', '后端', '技术'],
  '数据库': ['数据库', '后端', 'SQL'],
  'Python': ['Python', '编程语言', '后端'],
  '用户': ['用户研究', '产品设计', '用户体验'],
};

export function generateSummary(content: string): string {
  const sentences = content
    .replace(/\n+/g, '。')
    .split(/[。！？.!?]/)
    .filter((s) => s.trim().length > 10);

  if (sentences.length === 0) return content.slice(0, 100) + '...';

  const picked = sentences.slice(0, 2).map((s) => s.trim());
  return picked.join('。') + '。';
}

export function generateTags(content: string): string[] {
  const tags = new Set<string>();

  for (const [keyword, relatedTags] of Object.entries(KEYWORDS_MAP)) {
    if (content.includes(keyword)) {
      relatedTags.forEach((t) => tags.add(t));
    }
  }

  if (tags.size === 0) {
    tags.add('未分类');
    tags.add('待整理');
  }

  return Array.from(tags).slice(0, 5);
}

export function suggestCollection(tags: string[], collections: { id: string; name: string }[]): string | null {
  const tagStr = tags.join(' ');

  for (const col of collections) {
    const nameChars = col.name.split('');
    const matchCount = nameChars.filter((c) => tagStr.includes(c)).length;
    if (matchCount >= 2) return col.id;
  }

  return collections.length > 0 ? collections[0].id : null;
}

export function generateTitle(content: string): string {
  const firstLine = content.split('\n').find((l) => l.trim().length > 0) || '';
  const clean = firstLine.replace(/^#+\s*/, '').trim();
  if (clean.length > 0 && clean.length <= 50) return clean;
  return clean.slice(0, 40) + '...';
}

