import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const works = await prisma.work.findMany({
      where: { category: 'solo' },
      orderBy: { year: 'desc' }
    });

    return NextResponse.json({ works });
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
        
        // Handle both object format and string format
        let title, year, instruments;
        
        if (typeof workData === 'object') {
          // New format: work object
          title = workData.title;
          year = workData.year;
          instruments = workData.instruments;
        } else {
          // Legacy format: work string "Title (Year) - Instruments"
          const match = workData.match(/^(.+?)\s*\((\d{4})\)\s*-\s*(.+)$/);
          
          if (match) {
            [, title, year, instruments] = match;
            year = parseInt(year);
          } else {
            console.warn('Could not parse work string:', workData);
            continue;
          }
        }
        
        if (!title || !year || !instruments) {
          console.warn('Missing required fields for work:', workData);
          continue;
        }

        const work = await tx.work.create({
          data: {
            title: title.trim(),
            category: 'solo',
            year: parseInt(year.toString()),
            instruments: instruments.trim()
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