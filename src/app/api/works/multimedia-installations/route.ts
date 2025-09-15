import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const works = await prisma.work.findMany({
      where: { category: 'solo' },
      orderBy: { year: 'desc' }
    });

    // Process works to ensure videoUrls is always an array
    const processedWorks = works.map(work => ({
      ...work,
      videoUrls: Array.isArray(work.videoUrls) ? work.videoUrls : []
    }));

    return NextResponse.json({ works: processedWorks });
  } catch (error) {
    console.error('Error fetching works:', error);
    return NextResponse.json(
      { error: 'Failed to fetch works' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { works } = await request.json();
    
    console.log('Received works data:', works);

    if (!works || !Array.isArray(works)) {
      return NextResponse.json(
        { error: 'Works data is required and must be an array' },
        { status: 400 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing solo works
      console.log('Deleting existing solo works...');
      await tx.work.deleteMany({
        where: { category: 'solo' }
      });

      // Create new works
      const createdWorks = [];
      for (const workData of works) {
        console.log('Processing work:', workData);
        
        // Extract all fields from the work object
        const {
          title,
          year,
          instruments,
          duration,
          information,
          programNotes,
          imageFileName,
          videoUrls, // Now expects an array
          soundcloudUrl,
          slug
        } = workData;
        
        if (!title || !year || !instruments) {
          console.warn('Missing required fields for work:', workData);
          continue;
        }

        // Ensure videoUrls is an array and filter out empty URLs
        const processedVideoUrls = Array.isArray(videoUrls) 
          ? videoUrls.filter(url => url && url.trim()) 
          : [];

        const work = await tx.work.create({
          data: {
            title: title.trim(),
            category: 'solo',
            year: parseInt(year.toString()),
            instruments: instruments.trim(),
            duration: duration?.trim() || null,
            information: information?.trim() || null,
            programNotes: programNotes?.trim() || null,
            imageFileName: imageFileName?.trim() || null,
            videoUrls: processedVideoUrls, // Store as JSON array
            soundcloudUrl: soundcloudUrl?.trim() || null,
            slug: slug?.trim() || slugify(title.trim())
          }
        });
        
        createdWorks.push(work);
        console.log('Created work:', work);
      }
      
      return createdWorks;
    });

    console.log('Transaction completed, created works:', result.length);

    return NextResponse.json({ 
      message: 'Works updated successfully',
      works: result,
      count: result.length
    });
    
  } catch (error) {
    console.error('Error updating works:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update works',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}