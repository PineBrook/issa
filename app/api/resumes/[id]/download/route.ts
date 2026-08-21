import { NextRequest, NextResponse } from 'next/server';
import { getResumeFileRecord, getResumeFileBytes } from '@/lib/careers';
import { verifyResumeDownloadToken } from '@/lib/resume-auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const fileId = parseInt(params.id, 10);

  if (isNaN(fileId) || fileId <= 0) {
    return NextResponse.json({ error: 'Invalid resume file ID.' }, { status: 400 });
  }

  // Authorization check: short-lived token OR staff bearer token
  const token = request.nextUrl.searchParams.get('token');
  const authHeader = request.headers.get('Authorization');
  let isAuthorized = false;

  if (token) {
    const tokenResult = verifyResumeDownloadToken(token);
    if (tokenResult.valid && tokenResult.fileId === fileId) {
      isAuthorized = true;
    }
  }

  const staffKey = process.env.STAFF_API_KEY ?? process.env.AUTH_SECRET;
  if (!isAuthorized && staffKey && authHeader) {
    const bearer = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (bearer === staffKey) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized access. A valid short-lived download token or staff authorization is required.' },
      { status: 401 }
    );
  }

  const record = await getResumeFileRecord(fileId);
  if (!record || record.deletedAt) {
    return NextResponse.json({ error: 'Resume file not found.' }, { status: 404 });
  }

  const fileBuffer = await getResumeFileBytes(record.storageKey);
  if (!fileBuffer) {
    return NextResponse.json({ error: 'Resume file content unavailable in storage.' }, { status: 404 });
  }

  const sanitizedFilename = record.originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      'Content-Type': record.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
      'Content-Length': String(fileBuffer.length),
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
