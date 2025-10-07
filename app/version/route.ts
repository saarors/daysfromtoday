// app/version/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const versionInfo = {
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
    commitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || 'N/A',
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    gaId_env: process.env.NEXT_PUBLIC_GA_ID || 'undefined',
    siteUrl_env: process.env.NEXT_PUBLIC_SITE_URL || 'undefined',
    vercelEnv: process.env.VERCEL_ENV || 'development',
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(versionInfo, {
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}

