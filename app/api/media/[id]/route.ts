import { NextResponse } from 'next/server';
import { getMediaAssetData } from '@/lib/site-cms';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const media = await getMediaAssetData(Number(id));

    if (!media) {
      return new NextResponse('Media not found', { status: 404 });
    }

    return new NextResponse(media.buffer as any, {
      status: 200,
      headers: {
        'Content-Type': media.contentType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(media.filename)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
