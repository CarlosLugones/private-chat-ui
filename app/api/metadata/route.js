"use server";

import { NextResponse } from "next/server";
import * as cheerio from 'cheerio'

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    try {
        const parsed = new URL(url);

        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
        }

        const hostname = parsed.hostname.toLowerCase();
        const privatePatterns = [
            /^localhost$/,
            /^127\./,
            /^10\./,
            /^172\.(1[6-9]|2\d|3[01])\./,
            /^192\.168\./,
            /^::1$/,
            /^fc00:/,
            /^fe80:/,
            /^0\./,
            /^169\.254\./,
        ];
        if (privatePatterns.some(p => p.test(hostname))) {
            return NextResponse.json({ error: "Private URLs are not allowed" }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch the URL" }, { status: response.status });
        }

        const html = await response.text();
        const metadata = extractMetadata(html, url);

        return NextResponse.json(metadata, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

function extractMetadata(html, url) {
    const $ = cheerio.load(html);

    const getMetaContent = (name) =>
        $(`meta[property='${name}'], meta[name='${name}']`).attr("content") ||
        $(`meta[name='${name}']`).attr("content") ||
        "";

    return {
        title: $("title").text() || getMetaContent("og:title") || url,
        description: getMetaContent("og:description") || getMetaContent("description") || undefined,
        image: getMetaContent("og:image") ||  undefined,
        url,
    };
}