import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the first (and should be only) about record
    const about = await prisma.about.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      about: about
    });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch about data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Text is required' 
        },
        { status: 400 }
      );
    }

    // Check if about record already exists
    const existingAbout = await prisma.about.findFirst();
    
    if (existingAbout) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'About record already exists. Use PUT to update.' 
        },
        { status: 400 }
      );
    }

    const about = await prisma.about.create({
      data: {
        text: text.trim()
      }
    });

    return NextResponse.json({
      success: true,
      about: about,
      message: 'About section created successfully'
    });
  } catch (error) {
    console.error('Error creating about:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create about data' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Text is required' 
        },
        { status: 400 }
      );
    }

    // Find the first about record to update
    const existingAbout = await prisma.about.findFirst();
    
    if (!existingAbout) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No about record found. Use POST to create.' 
        },
        { status: 404 }
      );
    }

    const about = await prisma.about.update({
      where: {
        id: existingAbout.id
      },
      data: {
        text: text.trim()
      }
    });

    return NextResponse.json({
      success: true,
      about: about,
      message: 'About section updated successfully'
    });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update about data' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const existingAbout = await prisma.about.findFirst();
    
    if (!existingAbout) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No about record found' 
        },
        { status: 404 }
      );
    }

    await prisma.about.delete({
      where: {
        id: existingAbout.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'About section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete about data' 
      },
      { status: 500 }
    );
  }
}