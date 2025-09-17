import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file size (Vercel Blob has generous limits, but good to validate)
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 413 }
      );
    }

    if (!type || !['image', 'pdf'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type specified' },
        { status: 400 }
      );
    }

    // Validate file types
    if (type === 'image' && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    if (type === 'pdf' && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Create filename with folder structure
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const filename = `${type}s/${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: filename,
      url: blob.url,
      originalName: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}