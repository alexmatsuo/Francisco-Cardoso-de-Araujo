import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const work = await prisma.work.findFirst({
      where: { 
        slug: params.slug,
        category: 'electroacoustic-acousmatic'
      }
    });

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      );
    }

    // Process work to ensure videoUrls is always an array
    const processedWork = {
      ...work,
      videoUrls: Array.isArray(work.videoUrls) ? work.videoUrls : []
    };

    return NextResponse.json({ work: processedWork });
  } catch (error) {
    console.error('Error fetching work:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work' },
      { status: 500 }
    );
  }
}