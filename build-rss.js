const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
});

const POSTS_DIR = path.join(__dirname, 'posts');
const SITE_URL = 'https://mdui.xmhai.cn';
const SITE_NAME = '星觅海的博客';
const SITE_DESC = 'A pure static blog powered by MDUI v2';

function parseFrontMatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontMatter: {}, content };
  const fm = {};
  m[1].split('\n').forEach(line => {
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
  return { frontMatter: fm, content: m[2].trim() };
}

function stripMarkdown(md) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '$1')
    .replace(/[#*`~>|\-]/g, ' ')
    .replace(/<.*?>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

function toRfc822(dateStr) {
  return new Date(dateStr).toUTCString();
}

async function build() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
  const posts = [];
  const rssItems = [];

  for (const file of files) {
    const slug = path.basename(file, '.md');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { frontMatter, content } = parseFrontMatter(raw);
    if (!frontMatter.title) continue;

    const htmlBody = marked.parse(content);
    const plain = stripMarkdown(content);

    posts.push({
      slug,
      title: frontMatter.title,
      date: frontMatter.date || new Date().toISOString(),
      tags: frontMatter.tags || [],
      description: frontMatter.description || '',
      content: plain,
    });

    let encoded = htmlBody;
    if (frontMatter.cover) {
      encoded = `<img src="${escapeXml(frontMatter.cover)}" alt="cover"/><br/>` + encoded;
    }
    encoded = encoded.replace(/<video[^>]*src="([^"]*)"[^>]*>[\s\S]*?<\/video>/g,
      '<p><a href="$1">▶ 观看视频</a></p>');

    rssItems.push(`
      <item>
        <title>${escapeXml(frontMatter.title)}</title>
        <link>${SITE_URL}/#/post/${slug}</link>
        <guid isPermaLink="false">${SITE_URL}/#/post/${slug}</guid>
        <pubDate>${toRfc822(frontMatter.date)}</pubDate>
        <description>${escapeXml(frontMatter.description || plain.slice(0, 200))}</description>
        <content:encoded><![CDATA[${encoded}]]></content:encoded>
        ${(frontMatter.tags || []).map(t => `<category>${escapeXml(t)}</category>`).join('\n        ')}
      </item>
    `);
  }

  fs.writeFileSync(path.join(__dirname, 'search.json'), JSON.stringify(posts, null, 2));
  console.log('✓ search.json');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems.join('\n    ')}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(__dirname, 'rss.xml'), rss);
  console.log('✓ rss.xml');
}

build().catch(console.error);