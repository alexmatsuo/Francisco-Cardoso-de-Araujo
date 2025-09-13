import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { isUpcoming: 'desc' },
        { date: 'desc' }
      ]
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { events } = await request.json();
    
    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Events data is required and must be an array' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.event.deleteMany({});
      
      const createdEvents = [];
      for (const eventData of events) {
        const event = await tx.event.create({
          data: {
            title: eventData.title.trim(),
            date: new Date(eventData.date), // Already in ISO format from the client
            location: eventData.location.trim(),
            venue: eventData.venue?.trim() || null,
            description: eventData.description?.trim() || null,
            eventType: eventData.eventType || 'concert',
            works: eventData.works?.trim() || null,
            performers: eventData.performers?.trim() || null,
            website: eventData.website?.trim() || null,
            isUpcoming: new Date(eventData.date) > new Date(),
          }
        });
        createdEvents.push(event);
      }
      
      return createdEvents;
    });

    return NextResponse.json({ 
      message: 'Events updated successfully',
      events: result,
      count: result.length
    });
    
  } catch (error) {
    console.error('Error updating events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}