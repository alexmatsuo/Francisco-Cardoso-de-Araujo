import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const writings = await prisma.writing.findMany({
      orderBy: [
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ writings });
  } catch (error) {
    console.error('Error fetching writings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log('Received request data:', requestData);
    
    // Check if this is bulk update format (for reordering/editing existing writings)
    if (requestData.writings && Array.isArray(requestData.writings)) {
      console.log('Processing bulk update for writings...');
      
      // Get all existing writings
      const existingWritings = await prisma.writing.findMany();
      const existingWritingIds = new Set(existingWritings.map(w => w.id));
      const receivedWritingIds = new Set();

      const result = await prisma.$transaction(async (tx) => {
        const processedWritings = [];

        for (const writingData of requestData.writings) {
          const {
            id,
            title,
            author,
            style,
            description,
            pdfUrl,
            order
          } = writingData;

          console.log('Processing writing:', { id, title });

          const writingPayload = {
            title: title?.trim() || '',
            author: author?.trim() || '',
            style: style?.trim() || null,
            description: description?.trim() || null,
            pdfUrl: pdfUrl?.trim() || null,
            order: order !== undefined ? order : 0
          };

          let writing;

          // Check if this is an existing writing (has a valid database ID)
          if (id && typeof id === 'number' && id < 1000000000 && existingWritingIds.has(id)) {
            // This is an existing writing - UPDATE it
            console.log('Updating existing writing with ID:', id);
            writing = await tx.writing.update({
              where: { id },
              data: writingPayload
            });
            receivedWritingIds.add(id);
          } else {
            // This is a new writing - CREATE it
            console.log('Creating new writing');
            writing = await tx.writing.create({
              data: writingPayload
            });
          }

          processedWritings.push(writing);
          console.log('Processed writing:', writing);
        }

        // Delete writings that were not in the received list
        const idsToDelete = Array.from(existingWritingIds).filter(id => !receivedWritingIds.has(id));
        if (idsToDelete.length > 0) {
          console.log('Deleting removed writings:', idsToDelete);
          await tx.writing.deleteMany({
            where: {
              id: { in: idsToDelete }
            }
          });
        }

        return processedWritings;
      });

      console.log('Transaction completed, processed writings:', result.length);

      return NextResponse.json({ 
        message: 'Writings updated successfully',
        writings: result,
        count: result.length
      });
    }
    
    // Single writing creation (for adding new writings)
    console.log('Processing single writing creation...');
    const writingData = requestData;
    
    // Validate required fields
    if (!writingData.title || !writingData.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const writing = await prisma.writing.create({
      data: {
        title: writingData.title.trim(),
        author: writingData.author.trim(),
        style: writingData.style?.trim() || null,
        description: writingData.description?.trim() || null,
        pdfUrl: writingData.pdfUrl?.trim() || null,
        order: writingData.order !== undefined ? writingData.order : 0
      }
    });

    return NextResponse.json({ 
      message: 'Writing created successfully',
      writing 
    });
    
  } catch (error) {
    console.error('Error processing writings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process writings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}