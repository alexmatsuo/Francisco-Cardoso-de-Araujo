// Create this as: app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test if tables exist
    const userCount = await prisma.user.count();
    const workCount = await prisma.work.count();
    
    console.log('User count:', userCount);
    console.log('Work count:', workCount);
    
    // Get all works to see current data
    const allWorks = await prisma.work.findMany({
      orderBy: { id: 'asc' }
    });
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      tables: {
        users: userCount,
        works: workCount
      },
      allWorks: allWorks
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown database error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    console.log('Testing work creation...');
    
    // Create a test work
    const testWork = await prisma.work.create({
      data: {
        title: 'Test Composition',
        category: 'solo',
        year: 2024,
        instruments: 'Piano'
      }
    });
    
    console.log('Created test work:', testWork);
    
    return NextResponse.json({
      status: 'success',
      message: 'Test work created successfully',
      work: testWork
    });
    
  } catch (error) {
    console.error('Work creation test failed:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}