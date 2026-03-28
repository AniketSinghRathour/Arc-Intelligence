import { NextRequest, NextResponse } from 'next/server';
import { scrapeArticle } from '@/lib/scraper';
import { analyzeWithAI } from '@/lib/ai';
import { AnalyzeResponse } from '@/lib/types';

export const maxDuration = 60; // 60 second timeout for Vercel

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ success: false, error: 'Only HTTP/HTTPS URLs are supported' }, { status: 400 });
    }

    // Step 1: Scrape the article
    let article;
    try {
      article = await scrapeArticle(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scrape article';
      return NextResponse.json(
        { success: false, error: `Scraping failed: ${message}` },
        { status: 422 }
      );
    }

    // Step 2: Analyze with AI
    let result;
    try {
      result = await analyzeWithAI(article.body, article.title, url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI analysis failed';
      return NextResponse.json(
        { success: false, error: `AI analysis failed: ${message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('Analyze API error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
