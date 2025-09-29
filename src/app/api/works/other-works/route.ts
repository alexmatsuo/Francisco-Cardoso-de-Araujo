import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const works = await prisma.work.findMany({
      where: { category: 'other-works' },
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
      // Get existing works for this category
      const existingWorks = await tx.work.findMany({
        where: { category: 'other-works' }
      });

      const existingWorkIds = new Set(existingWorks.map(w => w.id));
      const receivedWorkIds = new Set<number>();
      const processedWorks = [];

      // Process each work
      for (const workData of works) {
        console.log('Processing work:', workData);
        
        const {
          id,
          title,
          year,
          instruments,    // Type of work (e.g., "Poetry", "Visual Art", "Essay")
          duration,
          information,
          programNotes,   // Artist Statement / Description
          imageFileName,
          videoUrls,
          soundcloudUrl,  // Audio works
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

        // Generate a unique slug
        let finalSlug = slug?.trim() || slugify(title.trim());
        
        // Check if this is an existing work being updated
        const isExistingWork = id && typeof id === 'number' && id < 1000000000 && existingWorkIds.has(id);
        
        // If creating new work or slug changed, ensure slug uniqueness across ALL works
        if (!isExistingWork || existingWorks.find(w => w.id === id)?.slug !== finalSlug) {
          // Check against ALL works in database, not just this category
          let counter = 1;
          let testSlug = finalSlug;
          let slugExists = await tx.work.findUnique({
            where: { slug: testSlug },
            select: { id: true }
          });
          
          // If slug exists and it's not this work, make it unique
          while (slugExists && slugExists.id !== id) {
            testSlug = `${finalSlug}-${counter}`;
            counter++;
            slugExists = await tx.work.findUnique({
              where: { slug: testSlug },
              select: { id: true }
            });
          }
          finalSlug = testSlug;
        }

        const workPayload = {
          title: title.trim(),
          category: 'other-works',
          year: parseInt(year.toString()),
          instruments: instruments.trim(),
          duration: duration?.trim() || null,
          information: information?.trim() || null,
          programNotes: programNotes?.trim() || null,
          imageFileName: imageFileName?.trim() || null,
          videoUrls: processedVideoUrls,
          soundcloudUrl: soundcloudUrl?.trim() || null,
          slug: finalSlug
        };

        let work;
        
        // Check if this is an existing work (has a valid database ID)
        if (isExistingWork) {
          // This is an existing work - UPDATE it
          console.log('Updating existing work with ID:', id);
          work = await tx.work.update({
            where: { id },
            data: workPayload
          });
          receivedWorkIds.add(id);
        } else {
          // This is a new work - CREATE it
          console.log('Creating new work');
          work = await tx.work.create({
            data: workPayload
          });
        }
        
        processedWorks.push(work);
        console.log('Processed work:', work);
      }
      
      // Delete works that were not in the received list
      const idsToDelete = Array.from(existingWorkIds).filter(id => !receivedWorkIds.has(id));
      if (idsToDelete.length > 0) {
        console.log('Deleting removed works:', idsToDelete);
        await tx.work.deleteMany({
          where: {
            id: { in: idsToDelete },
            category: 'other-works'
          }
        });
      }
      
      return processedWorks;
    });

    console.log('Transaction completed, processed works:', result.length);

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