import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  body: string;
  publishedAt?: string;
  author?: string;
}

// Selectors for popular Indian news sites
const SITE_CONFIGS: Record<string, {
  title: string[];
  body: string[];
  date?: string[];
  author?: string[];
}> = {
  'economictimes.indiatimes.com': {
    title: ['h1.artTitle', 'h1[class*="title"]', 'h1'],
    body: ['.artText', '.article-body', '[class*="articleBody"]', '.Normal'],
    date: ['.publish_on', 'time', '[class*="date"]'],
    author: ['.author', '[class*="author"]'],
  },
  'livemint.com': {
    title: ['h1.headline', 'h1'],
    body: ['.mainArea', '.article-body', '[class*="storyContent"]'],
    date: ['[class*="date"]', 'time'],
    author: ['[class*="author"]'],
  },
  'business-standard.com': {
    title: ['h1.headline', 'h1'],
    body: ['[class*="article-content"]', '.story-content', '[class*="MainStory"]'],
    date: ['[class*="date"]', 'time'],
    author: ['[class*="author"]'],
  },
  'moneycontrol.com': {
    title: ['h1.article_title', 'h1'],
    body: ['.content_wrapper', '.article-body', '#article-main'],
    date: ['[class*="publish"]', 'time'],
    author: ['[class*="author"]'],
  },
  'ndtv.com': {
    title: ['h1.sp-ttl', 'h1'],
    body: ['.sp-cn', '.story__content', '[class*="story-content"]'],
    date: ['[class*="date"]', 'time'],
    author: ['[class*="author"]'],
  },
  'thehindu.com': {
    title: ['h1.title', 'h1'],
    body: ['.article', '[class*="articleBody"]', '.story-card-news'],
    date: ['[class*="date"]', 'time'],
    author: ['[class*="author"]'],
  },
};

const DEFAULT_CONFIG = {
  title: ['h1', '[class*="title"]', '[class*="headline"]'],
  body: [
    'article',
    '[class*="article-body"]',
    '[class*="story-body"]',
    '[class*="content"]',
    'main p',
  ],
  date: ['time', '[class*="date"]', '[class*="publish"]'],
  author: ['[class*="author"]', '[rel="author"]'],
};

function getSiteConfig(url: string) {
  const hostname = new URL(url).hostname.replace('www.', '');
  return SITE_CONFIGS[hostname] || DEFAULT_CONFIG;
}

function trySelectors($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const el = $(selector).first();
    if (el.length && el.text().trim().length > 10) {
      return el.text().trim();
    }
  }
  return '';
}

function tryBodySelectors($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const el = $(selector).first();
    if (el.length) {
      // Remove ads, scripts, nav etc.
      el.find('script, style, nav, .ad, [class*="ad-"], [class*="subscribe"], [class*="social"]').remove();
      const text = el.text().replace(/\s+/g, ' ').trim();
      if (text.length > 200) return text;
    }
  }
  // Fallback: grab all paragraphs
  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 40) paragraphs.push(text);
  });
  return paragraphs.join(' ');
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove noise
  $('script, style, noscript, iframe, .advertisement, .ad-container, nav, footer, header').remove();

  const config = getSiteConfig(url);

  const title = trySelectors($, config.title) || $('title').text().trim();
  const body = tryBodySelectors($, config.body);
  const publishedAt = config.date ? trySelectors($, config.date) : undefined;
  const author = config.author ? trySelectors($, config.author) : undefined;

  if (!body || body.length < 100) {
    throw new Error('Could not extract article content. The site may block scraping or require JS rendering.');
  }

  // Truncate to ~8000 chars to stay within LLM context limits
  const truncatedBody = body.length > 8000 ? body.slice(0, 8000) + '...' : body;

  return { title, body: truncatedBody, publishedAt, author };
}
