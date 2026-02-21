import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const writingId = parseInt(params.id);
    
    if (isNaN(writingId)) {
      return NextResponse.json(
        { error: 'Invalid writing ID' },
        { status: 400 }
      );
    }

    const writing = await prisma.writing.findUnique({
      where: { id: writingId }
    });

    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ writing });
  } catch (error) {
    console.error('Error fetching writing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writing' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const writingId = parseInt(params.id);
    
    if (isNaN(writingId)) {
      return NextResponse.json(
        { error: 'Invalid writing ID' },
        { status: 400 }
      );
    }

    const writingData = await request.json();

    // Get current writing to check if it exists
    const currentWriting = await prisma.writing.findUnique({
      where: { id: writingId }
    });

    if (!currentWriting) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      );
    }

    // Prepare the update data
    const updateData: any = {
      title: writingData.title?.trim(),
      author: writingData.author?.trim(),
    };

    // Handle optional fields - use null for empty values to properly clear them
    updateData.style = writingData.style?.trim() || null;
    updateData.description = writingData.description?.trim() || null;
    updateData.pdfUrl = writingData.pdfUrl || null;

    // Handle order if provided
    if (writingData.order !== undefined) {
      updateData.order = writingData.order;
    }

    // Update the writing
    const updatedWriting = await prisma.writing.update({
      where: { id: writingId },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Writing updated successfully',
      writing: updatedWriting 
    });
  } catch (error) {
    console.error('Error updating writing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const writingId = parseInt(params.id);
    
    if (isNaN(writingId)) {
      return NextResponse.json(
        { error: 'Invalid writing ID' },
        { status: 400 }
      );
    }

    // Get writing first to check if it exists
    const writing = await prisma.writing.findUnique({
      where: { id: writingId }
    });
    
    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      );
    }

    // Delete the writing from database
    await prisma.writing.delete({
      where: { id: writingId }
    });
    
    // Note: With Vercel Blob storage, we don't delete files from the filesystem
    // If you want to delete blobs, you would use Vercel Blob API here

    return NextResponse.json({ 
      message: 'Writing deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting writing:', error);
    return NextResponse.json(
      { error: 'Failed to delete writing' },
      { status: 500 }
    );
  }
}