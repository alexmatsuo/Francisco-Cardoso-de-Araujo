#!/usr/bin/env node

/**
 * Event Database Seeder - Direct Prisma Integration
 * Generates and saves test events directly to your PostgreSQL database
 * 
 * Usage:
 * 1. Save this file as seed-events.js in your project root
 * 2. Make sure your .env file has DATABASE_URL configured
 * 3. Run: node seed-events.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test data arrays (same as before but optimized for database seeding)
const eventTypes = ['concert', 'premiere', 'workshop', 'masterclass', 'festival', 'recital', 'chamber'];

const venues = [
  'Carnegie Hall',
  'Lincoln Center',
  'Kennedy Center',
  'Walt Disney Concert Hall',
  'Royal Albert Hall',
  'Vienna State Opera',
  'Sydney Opera House',
  'Berlin Philharmonic',
  'Teatro alla Scala',
  'Concertgebouw',
  'Wigmore Hall',
  'Davies Symphony Hall',
  'Boston Symphony Hall',
  'Chicago Symphony Center',
  'Philadelphia Academy of Music',
  'Severance Hall',
  'Powell Hall',
  'Benaroya Hall',
  'Music Center at Strathmore',
  'Bass Performance Hall'
];

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Boston, MA',
  'Philadelphia, PA',
  'London, UK',
  'Vienna, Austria',
  'Berlin, Germany',
  'Paris, France',
  'Amsterdam, Netherlands',
  'Sydney, Australia',
  'Toronto, Canada',
  'San Francisco, CA',
  'Washington, DC',
  'Miami, FL',
  'Cleveland, OH',
  'St. Louis, MO',
  'Seattle, WA',
  'North Bethesda, MD',
  'Fort Worth, TX'
];

const composers = [
  'Johann Sebastian Bach',
  'Wolfgang Amadeus Mozart',
  'Ludwig van Beethoven',
  'Frédéric Chopin',
  'Johannes Brahms',
  'Claude Debussy',
  'Igor Stravinsky',
  'Béla Bartók',
  'Sergei Prokofiev',
  'Dmitri Shostakovich',
  'Maurice Ravel',
  'Franz Schubert',
  'Robert Schumann',
  'Franz Liszt',
  'Sergei Rachmaninoff',
  'Pyotr Ilyich Tchaikovsky',
  'Antonio Vivaldi',
  'George Frideric Handel',
  'Felix Mendelssohn',
  'Camille Saint-Saëns'
];

const works = [
  'Symphony No. 5 in C minor',
  'Piano Concerto No. 2 in B-flat major',
  'String Quartet Op. 76 No. 3',
  'Violin Sonata in A major',
  'Cello Suite No. 1 in G major',
  'Preludes Op. 28',
  'Nocturnes Op. 9',
  'Hungarian Rhapsody No. 2',
  'Goldberg Variations',
  'Études Op. 10',
  'Ballades Op. 23',
  'Mazurkas Op. 17',
  'Impromptus Op. 90',
  'Moments Musicaux Op. 94',
  'Intermezzi Op. 117',
  'The Four Seasons',
  'Water Music',
  'A Midsummer Night\'s Dream',
  'Carnival of the Animals',
  'Pictures at an Exhibition'
];

const performers = [
  'New York Philharmonic',
  'London Symphony Orchestra',
  'Berlin Philharmonic',
  'Vienna Philharmonic',
  'Chicago Symphony Orchestra',
  'Boston Symphony Orchestra',
  'Philadelphia Orchestra',
  'Cleveland Orchestra',
  'Los Angeles Philharmonic',
  'San Francisco Symphony',
  'Martha Argerich',
  'Lang Lang',
  'Yo-Yo Ma',
  'Itzhak Perlman',
  'Hilary Hahn',
  'Emanuel Ax',
  'Renée Fleming',
  'Jonas Kaufmann',
  'Gustavo Dudamel',
  'Simon Rattle',
  'Andris Nelsons',
  'Marin Alsop',
  'Esa-Pekka Salonen',
  'Kirill Petrenko'
];

const descriptions = [
  'An evening of classical masterworks featuring renowned soloists and orchestra in an unforgettable performance.',
  'A world premiere performance of contemporary compositions by today\'s most innovative emerging composers.',
  'An intimate chamber music concert in a historic venue, showcasing the beauty of small ensemble performance.',
  'A masterclass series with world-renowned artists, offering unique insights into musical interpretation and technique.',
  'A festival celebrating the rich musical heritage of the romantic era composers and their timeless contributions.',
  'An educational workshop exploring the depths of musical interpretation, performance practice, and artistic expression.',
  'A gala concert featuring virtuoso performances of beloved classical favorites and hidden gems of the repertoire.',
  'A complete recital showcasing the full breadth and genius of a single composer\'s musical output.',
  'An experimental performance blending traditional classical elements with innovative modern interpretative approaches.',
  'A collaborative concert bringing together multiple international ensembles for a truly global musical experience.',
  'A family-friendly concert designed to introduce young audiences to the wonders of classical music.',
  'An outdoor summer concert under the stars, featuring popular classical works in a relaxed atmosphere.',
  'A benefit concert supporting music education programs, featuring performances by students and professionals.',
  'A tribute concert honoring the legacy of a great composer on a significant anniversary.',
  'A cross-cultural musical journey exploring the intersection of classical and world music traditions.'
];

// Utility functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(futureWeight = 0.6) {
  const now = new Date();
  const yearInMs = 365 * 24 * 60 * 60 * 1000;
  
  if (Math.random() < futureWeight) {
    // Future date (0 to 2 years ahead)
    const futureTime = Math.random() * 2 * yearInMs;
    return new Date(now.getTime() + futureTime);
  } else {
    // Past date (0 to 1 year ago)
    const pastTime = Math.random() * yearInMs;
    return new Date(now.getTime() - pastTime);
  }
}

// Database operations
async function clearExistingEvents() {
  console.log('🗑️  Clearing existing events...');
  const deleteResult = await prisma.event.deleteMany({});
  console.log(`   Deleted ${deleteResult.count} existing events`);
}

async function generateAndSaveEvents(count = 20, options = {}) {
  const {
    futureEventRatio = 0.6,
    clearExisting = true,
    batchSize = 5
  } = options;

  try {
    // Clear existing events if requested
    if (clearExisting) {
      await clearExistingEvents();
    }

    console.log(`\n🎵 Generating and saving ${count} events to database...\n`);
    
    const events = [];
    const savedEvents = [];
    
    // Generate event data
    for (let i = 1; i <= count; i++) {
      const date = getRandomDate(futureEventRatio);
      const isUpcoming = date > new Date();
      const eventType = getRandomItem(eventTypes);
      const venue = getRandomItem(venues);
      const location = getRandomItem(locations);
      const composer = getRandomItem(composers);
      const work = getRandomItem(works);
      const performersCount = Math.random() > 0.7 ? 2 : 1;
      const selectedPerformers = getRandomItems(performers, performersCount);
      
      // Create more realistic event titles
      let title;
      if (eventType === 'festival') {
        title = `${composer.split(' ').pop()} Festival: ${work}`;
      } else if (eventType === 'masterclass') {
        title = `Masterclass: ${work} with ${selectedPerformers[0]}`;
      } else if (eventType === 'workshop') {
        title = `Workshop: Exploring ${composer}'s ${work}`;
      } else {
        title = `${composer}: ${work}`;
      }

      const eventData = {
        title: title,
        date: date,
        location: location,
        venue: venue,
        description: getRandomItem(descriptions),
        eventType: eventType,
        works: `${composer} - ${work}`,
        performers: selectedPerformers.join(', '),
        website: `https://example.com/events/event-${i}`,
        posterUrl: `https://example.com/posters/event-${i}-poster.jpg`,
        imageUrls: [
          `https://example.com/images/event-${i}-1.jpg`,
          `https://example.com/images/event-${i}-2.jpg`
        ],
        pdfUrl: `https://example.com/programs/event-${i}-program.pdf`,
        isUpcoming: isUpcoming
      };
      
      events.push(eventData);
    }

    // Save events in batches to avoid overwhelming the database
    console.log('💾 Saving events to database...');
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(events.length / batchSize);
      
      console.log(`   Batch ${batchNumber}/${totalBatches}: Saving events ${i + 1}-${Math.min(i + batchSize, events.length)}...`);
      
      const batchResults = await Promise.all(
        batch.map(eventData => 
          prisma.event.create({
            data: eventData
          })
        )
      );
      
      savedEvents.push(...batchResults);
      
      // Small delay to prevent overwhelming the database
      if (i + batchSize < events.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n✅ Successfully saved ${savedEvents.length} events to database!`);
    return savedEvents;

  } catch (error) {
    console.error('❌ Error generating/saving events:', error);
    throw error;
  }
}

async function displayDatabaseStats() {
  try {
    console.log('\n📊 DATABASE STATISTICS');
    console.log('======================');
    
    // Total count
    const totalEvents = await prisma.event.count();
    console.log(`Total Events: ${totalEvents}`);
    
    // Count by type
    const eventTypeStats = await prisma.event.groupBy({
      by: ['eventType'],
      _count: {
        eventType: true
      },
      orderBy: {
        _count: {
          eventType: 'desc'
        }
      }
    });
    
    console.log('\n📈 Events by Type:');
    eventTypeStats.forEach(stat => {
      console.log(`   ${stat.eventType.padEnd(12)}: ${stat._count.eventType}`);
    });
    
    // Upcoming vs past
    const upcomingCount = await prisma.event.count({
      where: { isUpcoming: true }
    });
    const pastCount = totalEvents - upcomingCount;
    
    console.log('\n📅 Timeline Distribution:');
    console.log(`   Upcoming     : ${upcomingCount}`);
    console.log(`   Past Events  : ${pastCount}`);
    
    // Recent events
    console.log('\n🕒 NEXT 5 UPCOMING EVENTS:');
    const upcomingEvents = await prisma.event.findMany({
      where: { isUpcoming: true },
      orderBy: { date: 'asc' },
      take: 5
    });
    
    if (upcomingEvents.length === 0) {
      console.log('   No upcoming events found.');
    } else {
      upcomingEvents.forEach((event, index) => {
        const date = new Date(event.date);
        console.log(`\n${index + 1}. ${event.title}`);
        console.log(`   📅 ${date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`);
        console.log(`   📍 ${event.venue}, ${event.location}`);
        console.log(`   🎭 ${event.eventType} | 🎵 ${event.performers}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fetching database stats:', error);
  }
}

async function getUserInput() {
  return new Promise((resolve) => {
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function interactiveMenu() {
  console.log('\n🎼 EVENT DATABASE SEEDER');
  console.log('=========================');
  console.log('1. Generate 20 events (replace existing)');
  console.log('2. Generate 20 events (keep existing)');
  console.log('3. Generate custom number of events');
  console.log('4. Show current database statistics');
  console.log('5. Clear all events from database');
  console.log('6. Exit');
  console.log('\nEnter your choice (1-6): ');
  
  const choice = await getUserInput();
  
  switch (choice) {
    case '1':
      await generateAndSaveEvents(20, { clearExisting: true });
      await displayDatabaseStats();
      break;
      
    case '2':
      await generateAndSaveEvents(20, { clearExisting: false });
      await displayDatabaseStats();
      break;
      
    case '3':
      console.log('\nEnter number of events to generate: ');
      const countInput = await getUserInput();
      const count = parseInt(countInput);
      
      if (isNaN(count) || count <= 0) {
        console.log('❌ Invalid number. Please enter a positive integer.');
        break;
      }
      
      console.log('Clear existing events? (y/n): ');
      const clearInput = await getUserInput();
      const clearExisting = clearInput.toLowerCase() === 'y';
      
      await generateAndSaveEvents(count, { clearExisting });
      await displayDatabaseStats();
      break;
      
    case '4':
      await displayDatabaseStats();
      break;
      
    case '5':
      console.log('Are you sure you want to delete ALL events? (y/n): ');
      const confirmInput = await getUserInput();
      if (confirmInput.toLowerCase() === 'y') {
        await clearExistingEvents();
        console.log('✅ All events cleared from database.');
      } else {
        console.log('❌ Operation cancelled.');
      }
      break;
      
    case '6':
      console.log('\n👋 Goodbye!');
      return false;
      
    default:
      console.log('❌ Invalid choice. Please enter 1-6.');
  }
  
  return true;
}

async function main() {
  console.log('🎵 Welcome to the Event Database Seeder!');
  console.log('This tool will generate test events and save them directly to your database.\n');
  
  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Interactive menu loop
    let continueRunning = true;
    while (continueRunning) {
      continueRunning = await interactiveMenu();
      
      if (continueRunning) {
        console.log('\n' + '─'.repeat(50));
        console.log('Press Enter to continue...');
        await getUserInput();
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Please check:');
    console.log('   1. Your .env file has DATABASE_URL configured');
    console.log('   2. Your database is running');
    console.log('   3. You have run "npx prisma generate"');
    console.log('   4. You have run "npx prisma db push" or "npx prisma migrate deploy"');
  } finally {
    await prisma.$disconnect();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Export functions for use as module
module.exports = {
  generateAndSaveEvents,
  displayDatabaseStats,
  clearExistingEvents,
  prisma
};

// Run main if this file is executed directly
if (require.main === module) {
  main().catch(async (error) => {
    console.error('❌ Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
}