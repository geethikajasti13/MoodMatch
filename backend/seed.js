require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

const sampleContent = [
  {
    title: 'The Good Place',
    contentType: 'series',
    platform: 'Netflix',
    isNetflixOriginal: false,
    genres: ['Comedy', 'Fantasy', 'Philosophical'],
    moods: ['stressed', 'bored', 'anxious'],
    experiences: ['comfort', 'laughter', 'intellectual stimulation'],
    intensity: 'low',
    description: 'Four people and their otherworldly afterlife facilitator try to become good people in a hilarious and wholesome journey.',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.netflix.com/title/80113701'
  },
  {
    title: 'Ted Lasso',
    contentType: 'series',
    platform: 'Apple TV+',
    isNetflixOriginal: false,
    genres: ['Comedy', 'Drama', 'Sport'],
    moods: ['sad', 'stressed', 'lonely'],
    experiences: ['comfort', 'laughter', 'inspiration'],
    intensity: 'low',
    description: 'An optimistic American football coach moves to the UK to manage a British soccer team, spreading kindness and optimism.',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://tv.apple.com/show/ted-lasso'
  },
  {
    title: 'Spirited Away',
    contentType: 'movie',
    platform: 'Max',
    isNetflixOriginal: false,
    genres: ['Animation', 'Adventure', 'Fantasy'],
    moods: ['nostalgic', 'bored', 'lonely'],
    experiences: ['escapism', 'comfort', 'adventure'],
    intensity: 'medium',
    description: 'During her family move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.max.com'
  },
  {
    title: 'Knives Out',
    contentType: 'movie',
    platform: 'Amazon Prime',
    isNetflixOriginal: false,
    genres: ['Mystery', 'Comedy', 'Crime'],
    moods: ['curious', 'bored', 'excited'],
    experiences: ['suspense', 'laughter', 'intellectual stimulation'],
    intensity: 'medium',
    description: 'A master detective investigates the death of the patriarch of an eccentric, combative family.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.amazon.com/gp/video/detail/knives-out'
  },
  {
    title: 'Severance',
    contentType: 'series',
    platform: 'Apple TV+',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    moods: ['curious', 'bored'],
    experiences: ['suspense', 'intellectual stimulation'],
    intensity: 'high',
    description: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://tv.apple.com/show/severance'
  },
  {
    title: 'Stranger Things',
    contentType: 'series',
    platform: 'Netflix',
    isNetflixOriginal: true,
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    moods: ['nostalgic', 'excited'],
    experiences: ['adventure', 'suspense', 'escapism'],
    intensity: 'high',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.netflix.com/title/80057281'
  },
  {
    title: 'Atomic Habits',
    contentType: 'book',
    platform: 'Kindle',
    isNetflixOriginal: false,
    genres: ['Self-Help', 'Psychology', 'Productivity'],
    moods: ['motivated', 'hopeful', 'bored'],
    experiences: ['inspiration', 'intellectual stimulation'],
    intensity: 'medium',
    description: 'An easy & proven way to build good habits and break bad ones through tiny, compound improvements.',
    posterUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://jamesclear.com/atomic-habits'
  },
  {
    title: 'The Midnight Library',
    contentType: 'book',
    platform: 'Kindle',
    isNetflixOriginal: false,
    genres: ['Fiction', 'Fantasy', 'Philosophical'],
    moods: ['sad', 'lonely', 'hopeful'],
    experiences: ['comfort', 'inspiration', 'emotional connection'],
    intensity: 'medium',
    description: 'Between life and death there is a library where shelves go on forever and each book provides a chance to try another life.',
    posterUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.amazon.com/dp/0525559477'
  },
  {
    title: 'Paddington 2',
    contentType: 'movie',
    platform: 'Netflix',
    isNetflixOriginal: false,
    genres: ['Comedy', 'Family', 'Adventure'],
    moods: ['stressed', 'sad', 'anxious'],
    experiences: ['comfort', 'laughter'],
    intensity: 'low',
    description: 'Paddington takes up a series of odd jobs to buy a pop-up book for his aunt, but when the book is stolen, he must unmask the thief.',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.netflix.com'
  },
  {
    title: 'Interstellar',
    contentType: 'movie',
    platform: 'Amazon Prime',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    moods: ['curious', 'hopeful'],
    experiences: ['intellectual stimulation', 'adventure', 'emotional connection'],
    intensity: 'high',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.amazon.com'
  },
  {
    title: 'Project Hail Mary',
    contentType: 'book',
    platform: 'Audible',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Adventure', 'Humor'],
    moods: ['curious', 'excited', 'bored'],
    experiences: ['adventure', 'intellectual stimulation', 'laughter'],
    intensity: 'high',
    description: 'A lone astronaut must save the earth from disaster, armed only with scientific ingenuity and an unexpected alien ally.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.audible.com'
  },
  {
    title: 'Amélie',
    contentType: 'movie',
    platform: 'Amazon Prime',
    isNetflixOriginal: false,
    genres: ['Romance', 'Comedy', 'Whimsical'],
    moods: ['lonely', 'happy', 'nostalgic'],
    experiences: ['comfort', 'emotional connection', 'laughter'],
    intensity: 'low',
    description: 'An imaginative Paris waitress decides to orchestrate quiet acts of kindness for those around her, finding love in the process.',
    posterUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    externalUrl: 'https://www.amazon.com'
  }
];

async function seedDatabase(mongoUri) {
  const uri = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/moodmatch';
  console.log('[Seed] Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');

    console.log('[Seed] Clearing existing content collection...');
    await Content.deleteMany({});

    console.log('[Seed] Inserting sample content records...');
    const inserted = await Content.insertMany(sampleContent);
    console.log(`[Seed] Successfully seeded ${inserted.length} content items!`);

    await mongoose.connection.close();
    console.log('[Seed] MongoDB connection closed.');
    return inserted;
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    throw err;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedDatabase, sampleContent };
