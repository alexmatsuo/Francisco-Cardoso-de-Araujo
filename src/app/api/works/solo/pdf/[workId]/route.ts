import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { workId: string } }
) {
  try {
    const workId = parseInt(params.workId);

    if (isNaN(workId)) {
      return NextResponse.json(
        { error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    const work = await prisma.work.findUnique({
      where: { id: workId },
      select: {
        id: true,
        title: true,
        pdfData: true,
        pdfFileName: true,
        pdfMimeType: true,
      },
    });

    if (!work || !work.pdfData) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }

    // Return the PDF file
    return new NextResponse(work.pdfData, {
      headers: {
        'Content-Type': work.pdfMimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${work.pdfFileName || `${work.title}.pdf`}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { workId: string } }
) {
  try {
    const workId = parseInt(params.workId);

    if (isNaN(workId)) {
      return NextResponse.json(
        { error: 'Invalid work ID' },
        { status: 400 }
      );
    }

    const updatedWork = await prisma.work.update({
      where: { id: workId },
      data: {
        pdfData: null,
        pdfFileName: null,
        pdfMimeType: null,
      },
    });

    return NextResponse.json({
      message: 'PDF removed successfully',
      workId: updatedWork.id,
    });

  } catch (error) {
    console.error('Error removing PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to remove PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}