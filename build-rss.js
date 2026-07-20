const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_RSS = path.join(__dirname, 'rss.xml');
const OUTPUT_SEARCH = path.join(__dirname, 'search.json');

const SITE_NAME = '星觅海的博客';
const SITE_URL = 'https://mdui.xmhai.cn';
const SITE_DESC = '星觅海的个人博客，分享技术文章和生活随笔';

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontMatter: {}, content };

  const fm = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      try { val = JSON.parse(val.replace(/'/g, '"')); } catch(e) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
      }
    }
    fm[key] = val;
  });
  return { frontMatter: fm, content: match[2].trim() };
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function build() {
  // 读取所有文章
  const files = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
      const { frontMatter, content: body } = parseFrontMatter(content);
      const slug = f.replace(/\.md$/, '');
      return {
        slug,
        title: frontMatter.title || slug,
        date: frontMatter.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
        description: frontMatter.description || '',
        cover: frontMatter.cover || '',
        content: body,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // 生成 search.json
  const searchData = files.map(p => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    description: p.description,
    cover: p.cover,
    content: p.content.slice(0, 5000), // 限制长度
  }));
  fs.writeFileSync(OUTPUT_SEARCH, JSON.stringify(searchData, null, 2));
  console.log('✅ search.json 生成完成');

  // 生成 rss.xml
  const now = new Date().toUTCString();
  const items = files.map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/post/${p.slug}</link>
      <guid>${SITE_URL}/post/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
      ${p.tags.map(t => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>
  `).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  fs.writeFileSync(OUTPUT_RSS, rss.trim());
  console.log('✅ rss.xml 生成完成');
  console.log(`📄 共 ${files.length} 篇文章`);
}

build();
