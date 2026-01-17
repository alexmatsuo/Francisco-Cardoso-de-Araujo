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
      // Get existing works for this category
      const existingWorks = await tx.work.findMany({
        where: { category: 'solo' }
      });

      const existingWorkIds = new Set(existingWorks.map(w => w.id));
      const receivedWorkIds = new Set<number>();
      const processedWorks = [];
      
      // Track slugs being used in this batch to prevent duplicates
      const usedSlugsInBatch = new Set<string>();

      // Process each work
      for (const workData of works) {
        console.log('Processing work:', workData);
        
        const {
          id,
          title,
          year,
          instruments,
          duration,
          information,
          programNotes,
          imageFileName,
          videoUrls,
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

        // Check if this is an existing work (has a valid database ID)
        const isExistingWork = id && typeof id === 'number' && existingWorkIds.has(id);
        
        // Generate or use provided slug
        let finalSlug = slug?.trim() || slugify(title.trim());
        
        // For existing works being updated, get their current slug
        const currentWorkSlug = isExistingWork 
          ? existingWorks.find(w => w.id === id)?.slug 
          : null;

        // Ensure slug is unique across ALL works (not just this category)
        // Skip the uniqueness check if this is the same work keeping its own slug
        if (finalSlug !== currentWorkSlug) {
          let slugCounter = 1;
          const originalSlug = finalSlug;
          
          while (true) {
            // Check if slug exists in database (excluding current work if updating)
            const existingWorkWithSlug = await tx.work.findFirst({
              where: {
                slug: finalSlug,
                ...(isExistingWork ? { NOT: { id } } : {})
              }
            });
            
            // Also check if slug is already used in this batch
            const usedInBatch = usedSlugsInBatch.has(finalSlug);
            
            if (!existingWorkWithSlug && !usedInBatch) {
              break; // Slug is unique, we can use it
            }
            
            // Slug is taken, try with a counter
            finalSlug = `${originalSlug}-${slugCounter}`;
            slugCounter++;
          }
        }
        
        // Add to used slugs for this batch
        usedSlugsInBatch.add(finalSlug);

        const workPayload = {
          title: title.trim(),
          category: 'solo',
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
          console.log('Creating new work with slug:', finalSlug);
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
            category: 'solo'
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