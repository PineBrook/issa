import { NextResponse } from 'next/server';
import { getMediaAssets, saveMediaAsset } from '@/lib/site-cms';
import { getCurrentStaff } from '@/lib/staff';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || undefined;
  const assets = await getMediaAssets(search);
  return NextResponse.json({ assets });
}

export async function POST(req: Request) {
  try {
    const staff = await getCurrentStaff();
    if (!staff || (staff.role !== 'ADMIN' && staff.role !== 'CONTENT')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const asset = await saveMediaAsset(
      {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        buffer,
        altText,
      },
      staff
    );

    return NextResponse.json({ success: true, asset });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to upload media' }, { status: 400 });
  }
}
