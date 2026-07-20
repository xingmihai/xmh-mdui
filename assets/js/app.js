// ==================== 配置 ====================
const CONFIG = {
  siteName: 'My Blog',
  siteUrl: 'https://your-domain.com',
  walineServer: 'https://vercel-waline.xmhai.cn',
  postsDir: '/posts/',
};

// ==================== 状态 ====================
let postsCache = [];
let fuse = null;
let isMobile = window.innerWidth < 840;
let sidebarCollapsed = false;
let sidebarOpenMobile = false;
let currentTheme = localStorage.getItem('theme') || 'auto';

// ==================== 工具函数 ====================
const $ = id => document.getElementById(id);
const escapeHtml = str => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};
const formatDate = str => {
  const d = new Date(str);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// ==================== 主题系统 ====================
function initTheme() {
  const btn = $('theme-btn');
  const icon = btn.querySelector('mdui-icon');

  const apply = theme => {
    const html = document.documentElement;
    html.classList.remove('mdui-theme-light', 'mdui-theme-dark', 'mdui-theme-auto');
    html.classList.add(`mdui-theme-${theme}`);
    currentTheme = theme;
    localStorage.setItem('theme', theme);

    icon.name = theme === 'light' ? 'brightness_7'
              : theme === 'dark'  ? 'brightness_2'
              : 'brightness_auto';

    syncWalineTheme();
  };

  btn.addEventListener('click', () => {
    const order = ['auto', 'light', 'dark'];
    apply(order[(order.indexOf(currentTheme) + 1) % 3]);
  });

  apply(currentTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'auto') syncWalineTheme();
  });
}

function syncWalineTheme() {
  const waline = document.querySelector('.waline');
  if (!waline) return;
  const isDark = document.documentElement.classList.contains('mdui-theme-dark') ||
    (document.documentElement.classList.contains('mdui-theme-auto') &&
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  waline.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// ==================== 缩放拦截 ====================
function initZoomBlock() {
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && ['+','-','=','0'].includes(e.key)) {
      e.preventDefault();
    }
  });
  document.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  let lastTouch = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  }, { passive: false });
}

// ==================== 侧边栏控制 ====================
function initSidebar() {
  const sidebar = $('sidebar');
  const main = $('main-content');
  const btn = $('menu-btn');
  const overlay = $('sidebar-overlay');

  const checkMobile = () => {
    isMobile = window.innerWidth < 840;
    if (!isMobile) {
      overlay.classList.remove('active');
      sidebar.classList.remove('mobile-open');
      sidebarOpenMobile = false;
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  btn.addEventListener('click', () => {
    if (isMobile) {
      sidebarOpenMobile = !sidebarOpenMobile;
      sidebar.classList.toggle('mobile-open', sidebarOpenMobile);
      overlay.classList.toggle('active', sidebarOpenMobile);
    } else {
      sidebarCollapsed = !sidebarCollapsed;
      sidebar.classList.toggle('collapsed', sidebarCollapsed);
      main.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    }
  });

  overlay.addEventListener('click', () => {
    sidebarOpenMobile = false;
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

// ==================== 搜索系统（Fuse.js） ====================
async function initSearch() {
  try {
    const res = await fetch('/search.json');
    const data = await res.json();
    fuse = new Fuse(data, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'description', weight: 0.1 }
      ],
      threshold: 0.35,
      includeMatches: true,
    });

    const input = $('search-input');
    const dropdown = $('search-dropdown');
    const list = $('search-results');

    input.addEventListener('input', e => {
      const q = e.target.value.trim();
      if (!q) { dropdown.style.display = 'none'; return; }

      const results = fuse.search(q).slice(0, 8);
      list.innerHTML = '';

      if (results.length === 0) {
        list.innerHTML = '<mdui-list-item nonclickable>无匹配文章</mdui-list-item>';
      } else {
        results.forEach(r => {
          const item = document.createElement('mdui-list-item');
          item.setAttribute('rounded', '');
          item.innerHTML = `
            <div slot="headline">${escapeHtml(r.item.title)}</div>
            <div slot="description">${escapeHtml(r.item.description || r.item.date)}</div>
          `;
          item.addEventListener('click', () => {
            location.hash = `#/post/${r.item.slug}`;
            dropdown.style.display = 'none';
            input.value = '';
          });
          list.appendChild(item);
        });
      }
      dropdown.style.display = 'block';
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  } catch (err) {
    console.error('搜索初始化失败:', err);
  }
}

// ==================== 路由系统 ====================
const routes = {
  '/': renderHome,
  '/archive': renderArchive,
  '/about': renderAbout,
  '/friends': renderFriends,
  '/friend/:name': renderFriendDetail,
  '/post/:slug': renderPost,
};

function parseRoute(hash) {
  const path = hash.replace('#', '') || '/';
  for (const [pat, handler] of Object.entries(routes)) {
    if (pat.includes(':')) {
      const re = new RegExp('^' + pat.replace(/:\w+/g, '([^/]+)') + '$');
      const m = path.match(re);
      if (m) {
        const keys = pat.match(/:\w+/g) || [];
        const params = {};
        keys.forEach((k, i) => params[k.slice(1)] = m[i + 1]);
        return { handler, params };
      }
    } else if (path === pat) {
      return { handler, params: {} };
    }
  }
  return { handler: render404, params: {} };
}

async function handleRoute() {
  const { handler, params } = parseRoute(location.hash);
  const container = $('page-container');

  container.style.opacity = '0';
  container.style.transform = 'translateY(12px)';
  await new Promise(r => setTimeout(r, 150));

  await handler(container, params);

  document.querySelectorAll('mdui-list-item').forEach(n => n.active = false);
  const base = (location.hash.replace('#', '') || '/').split('/')[1];
  const navMap = { '': 'nav-home', 'archive': 'nav-archive', 'about': 'nav-about', 'friends': 'nav-friends' };
  const navId = navMap[base];
  if (navId) { const el = $(navId); if (el) el.active = true; }

  container.style.opacity = '1';
  container.style.transform = 'translateY(0)';

  if (isMobile) {
    $('sidebar').classList.remove('mobile-open');
    $('sidebar-overlay').classList.remove('active');
    sidebarOpenMobile = false;
  }
  window.scrollTo(0, 0);
}

// ==================== 数据加载 ====================
async function loadPosts() {
  if (postsCache.length) return postsCache;
  const res = await fetch('/search.json');
  postsCache = await res.json();
  postsCache.sort((a, b) => new Date(b.date) - new Date(a.date));
  return postsCache;
}

function parseFrontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontMatter: {}, content: md };
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

function countWords(md) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '$1')
    .replace(/[#*`~>|\-]/g, '')
    .replace(/\s+/g, '')
    .length;
}

// ==================== 页面渲染器 ====================
async function renderHome(container) {
  const posts = await loadPosts();
  let html = '<div class="mdui-typescale-headline-medium" style="margin-bottom:24px;">最新文章</div>';
  if (!posts.length) {
    html += '<mdui-card style="padding:24px;text-align:center;">暂无文章</mdui-card>';
  } else {
    html += '<div style="display:grid;gap:16px;">';
    posts.forEach(p => {
      html += `
        <mdui-card style="padding:16px;cursor:pointer;" onclick="location.hash='#/post/${p.slug}'">
          ${p.cover ? `<img src="${escapeHtml(p.cover)}" loading="lazy" style="width:100%;height:200px;object-fit:cover;border-radius:var(--mdui-shape-corner-medium);margin-bottom:12px;" alt="">` : ''}
          <div class="mdui-typescale-title-large" style="margin-bottom:8px;">${escapeHtml(p.title)}</div>
          <div class="mdui-typescale-body-small" style="opacity:0.7;margin-bottom:8px;">
            ${formatDate(p.date)} · ${(p.tags||[]).map(t => `<mdui-chip style="margin-right:4px;">${escapeHtml(t)}</mdui-chip>`).join('')}
          </div>
          <div class="mdui-typescale-body-medium" style="opacity:0.85;">${escapeHtml(p.description||'')}</div>
        </mdui-card>
      `;
    });
    html += '</div>';
  }
  container.innerHTML = html;
  updateMeta('首页', 'My Blog 首页');
}

async function renderPost(container, params) {
  const { slug } = params;
  try {
    const res = await fetch(`${CONFIG.postsDir}${slug}.md`);
    if (!res.ok) throw new Error('404');
    const md = await res.text();
    const { frontMatter, content } = parseFrontMatter(md);
    const htmlContent = marked.parse(content);
    const words = countWords(content);

    let html = '';
    if (frontMatter.cover) {
      html += `<img src="${escapeHtml(frontMatter.cover)}" style="width:100%;max-height:400px;object-fit:cover;border-radius:var(--mdui-shape-corner-large);margin-bottom:24px;" alt="">`;
    }
    html += `
      <div style="margin-bottom:24px;">
        <h1 class="mdui-typescale-headline-large" style="margin-bottom:12px;">${escapeHtml(frontMatter.title||slug)}</h1>
        <div class="mdui-typescale-body-small" style="opacity:0.7;">
          ${formatDate(frontMatter.date)} · ${words} 字 ·
          ${(frontMatter.tags||[]).map(t => `<mdui-chip style="margin-right:4px;">${escapeHtml(t)}</mdui-chip>`).join('')}
        </div>
      </div>
      <article class="mdui-prose post-content">${htmlContent}</article>
      <div style="margin-top:48px;"><div id="waline"></div></div>
    `;
    container.innerHTML = html;

    container.querySelectorAll('pre code').forEach(b => {
      if (window.hljs) hljs.highlightElement(b);
    });
    container.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    initWaline(slug);
    updateMeta(frontMatter.title||slug, frontMatter.description||'');
  } catch (err) {
    render404(container);
  }
}

async function renderArchive(container) {
  const posts = await loadPosts();
  const groups = {};
  posts.forEach(p => {
    const d = new Date(p.date);
    const k = `${d.getFullYear()}年${d.getMonth()+1}月`;
    (groups[k] ||= []).push(p);
  });
  const allTags = [...new Set(posts.flatMap(p => p.tags||[]))];

  let html = '<div class="mdui-typescale-headline-medium" style="margin-bottom:24px;">文章归档</div>';
  if (allTags.length) {
    html += '<div class="mdui-typescale-title-small" style="margin-bottom:8px;">标签</div>';
    html += '<div class="tag-cloud">';
    allTags.forEach(t => {
      html += `<mdui-chip onclick="filterTag('${escapeHtml(t)}')">${escapeHtml(t)}</mdui-chip>`;
    });
    html += '</div><mdui-divider style="margin-bottom:24px;"></mdui-divider>';
  }
  Object.entries(groups).forEach(([m, ps]) => {
    html += `<div style="margin-bottom:24px;">
      <div class="mdui-typescale-title-medium" style="margin-bottom:12px;color:rgb(var(--mdui-color-primary));">${m}</div>
      <mdui-list>`;
    ps.forEach(p => {
      html += `<mdui-list-item rounded href="#/post/${p.slug}">
        <div slot="headline">${escapeHtml(p.title)}</div>
        <div slot="description">${formatDate(p.date)}</div>
      </mdui-list-item>`;
    });
    html += '</mdui-list></div>';
  });
  container.innerHTML = html;
  updateMeta('归档', '文章归档');
}

async function renderAbout(container) {
  try {
    const res = await fetch('/about.md');
    const md = await res.text();
    const { frontMatter, content } = parseFrontMatter(md);
    const body = marked.parse(content);

    let html = '<div style="text-align:center;margin-bottom:32px;">';
    if (frontMatter.avatar) {
      html += `<mdui-avatar src="${escapeHtml(frontMatter.avatar)}" style="width:120px;height:120px;margin-bottom:16px;"></mdui-avatar>`;
    }
    html += `<div class="mdui-typescale-headline-medium">${escapeHtml(frontMatter.name||'博主')}</div></div>`;
    html += `<article class="mdui-prose">${body}</article>`;
    container.innerHTML = html;
    updateMeta('关于', '关于博主');
  } catch (err) {
    container.innerHTML = '<mdui-card style="padding:24px;">关于页面加载失败</mdui-card>';
  }
}

async function renderFriends(container) {
  const res = await fetch('/friends.json');
  const friends = await res.json();
  let html = '<div class="mdui-typescale-headline-medium" style="margin-bottom:24px;">朋友们</div>';
  html += '<div class="friends-grid">';
  friends.forEach(f => {
    html += `
      <mdui-card style="padding:16px;cursor:pointer;" onclick="location.hash='#/friend/${encodeURIComponent(f.name)}'">
        <div style="display:flex;align-items:center;gap:12px;">
          <mdui-avatar src="${escapeHtml(f.avatar)}" style="width:48px;height:48px;"></mdui-avatar>
          <div>
            <div class="mdui-typescale-title-medium">${escapeHtml(f.name)}</div>
            <div class="mdui-typescale-body-small" style="opacity:0.7;">${escapeHtml(f.desc||'')}</div>
          </div>
        </div>
      </mdui-card>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  updateMeta('朋友', '友情链接');
}

async function renderFriendDetail(container, params) {
  const name = decodeURIComponent(params.name);
  try {
    const res = await fetch('/friends.json');
    const friends = await res.json();
    const f = friends.find(x => x.name === name);
    if (!f) throw new Error('404');

    let html = `
      <div style="text-align:center;margin-bottom:32px;">
        <mdui-avatar src="${escapeHtml(f.avatar)}" style="width:80px;height:80px;margin-bottom:16px;"></mdui-avatar>
        <div class="mdui-typescale-headline-medium">${escapeHtml(f.name)}</div>
        <div style="margin-top:12px;">
          <a href="${escapeHtml(f.url)}" target="_blank" rel="noopener">
            <mdui-button variant="filled">访问博客</mdui-button>
          </a>
        </div>
      </div>
      <div class="mdui-typescale-title-medium" style="margin-bottom:16px;">最新文章</div>
      <div id="friend-rss">
        <mdui-linear-progress style="margin:24px 0;"></mdui-linear-progress>
        <div style="text-align:center;" class="mdui-typescale-body-small">正在加载 RSS…</div>
      </div>
    `;
    container.innerHTML = html;
    updateMeta(f.name, f.desc||'');

    const rssUrl = encodeURIComponent(f.rss);
    const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
    const data = await rssRes.json();
    const rssContainer = $('friend-rss');

    if (data.status !== 'ok') throw new Error(data.message || 'RSS 解析失败');

    let list = '<mdui-list>';
    data.items.slice(0, 10).forEach(item => {
      list += `<mdui-list-item rounded href="${escapeHtml(item.link)}" target="_blank" rel="noopener">
        <div slot="headline">${escapeHtml(item.title)}</div>
        <div slot="description">${formatDate(item.pubDate)}</div>
      </mdui-list-item>`;
    });
    list += '</mdui-list>';
    rssContainer.innerHTML = list;
  } catch (err) {
    container.innerHTML = `<mdui-card style="padding:24px;color:rgb(var(--mdui-color-error));">错误：${escapeHtml(err.message)}</mdui-card>`;
  }
}

function render404(container) {
  container.innerHTML = `
    <div class="not-found">
      <mdui-icon name="error_outline" class="not-found-icon"></mdui-icon>
      <div class="mdui-typescale-headline-medium" style="margin-top:16px;">404</div>
      <div class="mdui-typescale-body-large" style="margin-top:8px;opacity:0.7;">页面不存在</div>
      <mdui-button style="margin-top:24px;" href="#/">返回首页</mdui-button>
    </div>
  `;
  updateMeta('404', '页面不存在');
}

// ==================== Waline ====================
function initWaline(path) {
  if (!window.WalineInit) {
    setTimeout(() => initWaline(path), 100);
    return;
  }
  window.WalineInit({
    el: '#waline',
    serverURL: CONFIG.walineServer,
    path: `/post/${path}`,
    dark: 'html.mdui-theme-dark',
    lang: 'zh-CN',
  });
}

// ==================== 页脚统计 ====================
async function updatePageviews() {
  const el = $('pageviews');
  try {
    const res = await fetch(`${CONFIG.walineServer}/api/pageview`);
    const data = await res.json();
    el.textContent = `总访问 ${data.data || 0} 次`;
  } catch (err) {
    el.textContent = '访问量统计暂不可用';
  }
}

// ==================== SEO 更新 ====================
function updateMeta(title, desc) {
  document.title = title ? `${title} - ${CONFIG.siteName}` : CONFIG.siteName;
  const m = document.querySelector('meta[name="description"]');
  if (m) m.content = desc;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.content = document.title;
  if (ogDesc) ogDesc.content = desc;
}

// ==================== 标签筛选 ====================
function filterTag(tag) {
  console.log('Filter by tag:', tag);
}

// ==================== 初始化入口 ====================
document.addEventListener('DOMContentLoaded', () => {
  $('year').textContent = new Date().getFullYear();
  initTheme();
  initZoomBlock();
  initSidebar();
  initSearch();
  updatePageviews();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
});