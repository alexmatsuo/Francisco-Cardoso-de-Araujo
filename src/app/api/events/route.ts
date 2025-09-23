import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { id: 'asc' }  // Changed to maintain order by ID instead of date
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
    
    // Check if this is bulk update format (for reordering/editing existing events)
    if (requestData.events && Array.isArray(requestData.events)) {
      console.log('Processing bulk update for events...');
      
      // Get all existing events
      const existingEvents = await prisma.event.findMany();
      const existingEventIds = new Set(existingEvents.map(e => e.id));
      const receivedEventIds = new Set();

      const result = await prisma.$transaction(async (tx) => {
        const processedEvents = [];

        for (const eventData of requestData.events) {
          const {
            id,
            title,
            date,
            location,
            venue,
            description,
            eventType,
            works,
            performers,
            website,
            posterUrl,
            imageUrls,
            pdfUrl
          } = eventData;

          console.log('Processing event:', { id, title });

          const eventPayload = {
            title: title?.trim() || '',
            date: new Date(date),
            location: location?.trim() || '',
            venue: venue?.trim() || null,
            description: description?.trim() || null,
            eventType: eventType || 'concert',
            works: works?.trim() || null,
            performers: performers?.trim() || null,
            website: website?.trim() || null,
            posterUrl: posterUrl?.trim() || null,
            imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
            pdfUrl: pdfUrl?.trim() || null,
            isUpcoming: new Date(date) > new Date(),
          };

          let event;

          // Check if this is an existing event (has a valid database ID)
          if (id && typeof id === 'number' && id < 1000000000 && existingEventIds.has(id)) {
            // This is an existing event - UPDATE it
            console.log('Updating existing event with ID:', id);
            event = await tx.event.update({
              where: { id },
              data: eventPayload
            });
            receivedEventIds.add(id);
          } else {
            // This is a new event - CREATE it
            console.log('Creating new event');
            event = await tx.event.create({
              data: eventPayload
            });
          }

          processedEvents.push(event);
          console.log('Processed event:', event);
        }

        // Delete events that were not in the received list
        const idsToDelete = Array.from(existingEventIds).filter(id => !receivedEventIds.has(id));
        if (idsToDelete.length > 0) {
          console.log('Deleting removed events:', idsToDelete);
          await tx.event.deleteMany({
            where: {
              id: { in: idsToDelete }
            }
          });
        }

        return processedEvents;
      });

      console.log('Transaction completed, processed events:', result.length);

      return NextResponse.json({ 
        message: 'Events updated successfully',
        events: result,
        count: result.length
      });
    }
    
    // Single event creation (for adding new events)
    console.log('Processing single event creation...');
    const eventData = requestData;
    
    // Validate required fields
    if (!eventData.title || !eventData.location || !eventData.date) {
      return NextResponse.json(
        { error: 'Title, location, and date are required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: eventData.title.trim(),
        date: new Date(eventData.date),
        location: eventData.location.trim(),
        venue: eventData.venue?.trim() || null,
        description: eventData.description?.trim() || null,
        eventType: eventData.eventType || 'concert',
        works: eventData.works?.trim() || null,
        performers: eventData.performers?.trim() || null,
        website: eventData.website?.trim() || null,
        posterUrl: eventData.posterUrl?.trim() || null,
        imageUrls: Array.isArray(eventData.imageUrls) ? eventData.imageUrls : [],
        pdfUrl: eventData.pdfUrl?.trim() || null,
        isUpcoming: new Date(eventData.date) > new Date(),
      }
    });

    return NextResponse.json({ 
      message: 'Event created successfully',
      event 
    });
    
  } catch (error) {
    console.error('Error processing events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}