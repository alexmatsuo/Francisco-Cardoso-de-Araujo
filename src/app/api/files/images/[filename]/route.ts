import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // With Vercel Blob, files are served directly via their URLs
    // This route might not be needed anymore, but we can redirect
    const blobUrl = `${process.env.BLOB_STORE_URL}/images/${filename}`;
    
    return NextResponse.redirect(blobUrl);
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    );
  }
}