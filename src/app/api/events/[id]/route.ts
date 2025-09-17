import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Get current event to check if it exists
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
    updateData.posterUrl = eventData.posterUrl || null;  // New field
    updateData.pdfUrl = eventData.pdfUrl || null;

    // Handle imageUrls array - convert undefined to empty array for database
    if (eventData.imageUrls !== undefined) {
      updateData.imageUrls = eventData.imageUrls || [];
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData
    });

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

    // Get event first to check if it exists
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
    
    // Note: With Vercel Blob storage, we don't delete files from the filesystem
    // If you want to delete blobs, you would use Vercel Blob API here

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