import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    // Check if we have the necessary environment variable
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Storage configuration error. Please check server configuration.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadType: type
    });

    // Check file size (Vercel Blob free tier: 1GB storage total)
    if (file.size > 50 * 1024 * 1024) { // 50MB limit per file
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
    if (type === 'image') {
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedImageTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid image type. Allowed types: ${allowedImageTypes.join(', ')}` },
          { status: 400 }
        );
      }
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

    console.log('Attempting to upload to Vercel Blob:', filename);

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('Upload successful:', blob.url);

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
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        return NextResponse.json(
          { 
            error: 'Storage service not configured',
            details: 'The storage service is not properly configured. Please contact the administrator.'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to upload file',
          details: error.message
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method to remove files from blob storage
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    // Only delete if it's a blob URL from your storage
    if (!url.includes('.blob.vercel-storage.com')) {
      return NextResponse.json(
        { error: 'Invalid blob URL' },
        { status: 400 }
      );
    }

    await del(url);

    return NextResponse.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}