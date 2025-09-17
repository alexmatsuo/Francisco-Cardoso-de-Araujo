import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const eventData = await request.json();

    // Get current event to know what files to delete
    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!currentEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Prepare the update data
    const updateData: any = {
      title: eventData.title?.trim(),
      location: eventData.location?.trim(),
      eventType: eventData.eventType || 'concert',
      isUpcoming: eventData.isUpcoming
    };

    // Handle date - only update if provided
    if (eventData.date) {
      updateData.date = new Date(eventData.date);
      updateData.isUpcoming = new Date(eventData.date) > new Date();
    }

    // Handle optional fields - use null for empty values to properly clear them
    updateData.venue = eventData.venue?.trim() || null;
    updateData.description = eventData.description?.trim() || null;
    updateData.works = eventData.works?.trim() || null;
    updateData.performers = eventData.performers?.trim() || null;
    updateData.website = eventData.website?.trim() || null;
    updateData.pdfFileName = eventData.pdfFileName || null;

    // Handle imageFileNames array - convert undefined to null for database
    if (eventData.imageFileNames !== undefined) {
      updateData.imageFileNames = eventData.imageFileNames;
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData
    });

    // Check if images were removed and delete the physical files
    const currentImages = Array.isArray(currentEvent?.imageFileNames) 
      ? (currentEvent.imageFileNames as string[]) 
      : [];
    const newImages = Array.isArray(eventData.imageFileNames) 
      ? eventData.imageFileNames 
      : [];
    
    if (currentImages.length > 0) {
      const imagesToDelete = currentImages.filter(
        (img: string) => !newImages.includes(img)
      );
      
      // Delete the physical files
      for (const imageName of imagesToDelete) {
        if (typeof imageName === 'string') {
          try {
            const filePath = join(process.cwd(), 'public', 'uploads', 'images', imageName);
            await unlink(filePath);
          } catch (error) {
            console.error('Error deleting image file:', imageName, error);
            // Continue even if file deletion fails
          }
        }
      }
    }

    // Check if PDF was removed and delete the physical file
    if (currentEvent?.pdfFileName && 
        typeof currentEvent.pdfFileName === 'string' && 
        currentEvent.pdfFileName !== eventData.pdfFileName) {
      try {
        const pdfPath = join(process.cwd(), 'public', 'uploads', 'pdfs', currentEvent.pdfFileName);
        await unlink(pdfPath);
      } catch (error) {
        console.error('Error deleting PDF file:', error);
      }
    }

    return NextResponse.json({ 
      message: 'Event updated successfully',
      event: updatedEvent 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update event',
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
    const eventId = parseInt(params.id);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Get event first to know what files to delete
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete the event from database
    await prisma.event.delete({
      where: { id: eventId }
    });
    
    // Delete associated image files (only if it's an array)
    if (event?.imageFileNames && Array.isArray(event.imageFileNames)) {
      for (const imageName of event.imageFileNames) {
        if (typeof imageName === 'string') {
          try {
            const filePath = join(process.cwd(), 'public', 'uploads', 'images', imageName);
            await unlink(filePath);
          } catch (error) {
            console.error('Error deleting image file:', error);
            // Continue even if file deletion fails
          }
        }
      }
    }
    
    // Also delete PDF if exists
    if (event?.pdfFileName && typeof event.pdfFileName === 'string') {
      try {
        const pdfPath = join(process.cwd(), 'public', 'uploads', 'pdfs', event.pdfFileName);
        await unlink(pdfPath);
      } catch (error) {
        console.error('Error deleting PDF file:', error);
      }
    }

    return NextResponse.json({ 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}