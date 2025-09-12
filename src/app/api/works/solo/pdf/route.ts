import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdf = formData.get('pdf') as File;
    const workId = formData.get('workId') as string;

    if (!pdf || !workId) {
      return NextResponse.json(
        { error: 'PDF file and work ID are required' },
        { status: 400 }
      );
    }

    if (pdf.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (pdf.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const workIdNum = parseInt(workId);
    if (isNaN(workIdNum)) {
      return NextResponse.json(
        { error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    // Check if work exists
    const existingWork = await prisma.work.findUnique({
      where: { id: workIdNum },
    });

    if (!existingWork) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Convert file to Uint8Array (compatible with Prisma)
    const arrayBuffer = await pdf.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Update the work with PDF data
    const updatedWork = await prisma.work.update({
      where: { id: workIdNum },
      data: {
        pdfData: uint8Array,
        pdfFileName: pdf.name,
        pdfMimeType: pdf.type,
      },
    });

    return NextResponse.json({
      message: 'PDF uploaded successfully',
      fileName: pdf.name,
      workId: updatedWork.id,
    });

  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}