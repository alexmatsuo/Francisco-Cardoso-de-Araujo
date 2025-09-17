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
    const requestData = await request.json();
    console.log('Received request data:', requestData);
    
    // Check if this is the old bulk update format (for editing existing events)
    if (requestData.events && Array.isArray(requestData.events)) {
      console.log('Processing bulk update...');
      
      // Old bulk update logic (for editing)
      const result = await prisma.$transaction(async (tx) => {
        await tx.event.deleteMany({});
        
        const createdEvents = [];
        for (const eventData of requestData.events) {
          const event = await tx.event.create({
            data: {
              title: eventData.title?.trim() || '',
              date: new Date(eventData.date),
              location: eventData.location?.trim() || '',
              venue: eventData.venue?.trim() || null,
              description: eventData.description?.trim() || null,
              eventType: eventData.eventType || 'concert',
              works: eventData.works?.trim() || null,
              performers: eventData.performers?.trim() || null,
              website: eventData.website?.trim() || null,
              imageFileNames: eventData.imageFileNames || null,
              pdfFileName: eventData.pdfFileName || null,
              isUpcoming: new Date(eventData.date) > new Date(),
            }
          });
          createdEvents.push(event);
        }
        return createdEvents;
      });

      return NextResponse.json({ 
        message: 'Events updated successfully',
        events: result 
      });
    }
    
    // New single event creation (for adding new events)
    console.log('Processing single event creation...');
    const eventData = requestData;
    
    // Validate required fields
    if (!eventData.title || !eventData.location || !eventData.date) {
      return NextResponse.json(
        { error: 'Title, location, and date are required' },
        { status: 400 }
      );
    }
    
    const newEvent = await prisma.event.create({
      data: {
        title: eventData.title?.trim() || '',
        date: new Date(eventData.date),
        location: eventData.location?.trim() || '',
        venue: eventData.venue?.trim() || null,
        description: eventData.description?.trim() || null,
        eventType: eventData.eventType || 'concert',
        works: eventData.works?.trim() || null,
        performers: eventData.performers?.trim() || null,
        website: eventData.website?.trim() || null,
        imageFileNames: eventData.imageFileNames || null,
        pdfFileName: eventData.pdfFileName || null,
        isUpcoming: new Date(eventData.date) > new Date(),
      }
    });

    return NextResponse.json({ 
      message: 'Event created successfully',
      event: newEvent 
    });
    
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}