/**
 * MoodMatch Sample Content Dataset
 *
 * Curated initial collection of 14 records across books, movies, and series.
 * Designed for testing recommendation matching based on mood keywords,
 * desired experiences, content types, and engagement intensity.
 *
 * Rules:
 * - Content types strictly limited to: 'book', 'movie', 'series'
 * - Intensity values strictly limited to: 'low', 'medium', 'high'
 * - Netflix Original status is strictly accurate (only verified originals are true)
 * - Optional poster URLs are left empty when not verified
 */

const sampleContents = [
  // =========================================================================
  // BOOKS (5 records)
  // =========================================================================
  {
    title: 'The Midnight Library',
    contentType: 'book',
    platform: 'Canongate Books',
    isNetflixOriginal: false,
    genres: ['Fiction', 'Fantasy', 'Philosophical'],
    moods: ['hopeful', 'introspective', 'melancholic'],
    experiences: ['comfort', 'reflection', 'emotional-release'],
    intensity: 'medium',
    description: 'Between life and death there is a library where every book offers a chance to experience another life you could have lived.',
    posterUrl: '',
    externalUrl: 'https://www.goodreads.com/book/show/52578297-the-midnight-library',
  },
  {
    title: 'The Alchemist',
    contentType: 'book',
    platform: 'HarperOne',
    isNetflixOriginal: false,
    genres: ['Quest', 'Philosophy', 'Inspirational'],
    moods: ['motivated', 'hopeful', 'relaxed'],
    experiences: ['inspiration', 'learning'],
    intensity: 'low',
    description: 'A philosophical fable about following your dreams and listening to your heart through the journey of an Andalusian shepherd boy.',
    posterUrl: '',
    externalUrl: 'https://www.goodreads.com/book/show/18144590-the-alchemist',
  },
  {
    title: 'Project Hail Mary',
    contentType: 'book',
    platform: 'Ballantine Books',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Adventure', 'Mystery'],
    moods: ['curious', 'motivated', 'hopeful'],
    experiences: ['excitement', 'escapism', 'learning'],
    intensity: 'high',
    description: 'A lone astronaut awakens with amnesia and must scientifically decipher an interstellar catastrophe threatening Earth.',
    posterUrl: '',
    externalUrl: 'https://www.goodreads.com/book/show/54493401-project-hail-mary',
  },
  {
    title: 'Atomic Habits',
    contentType: 'book',
    platform: 'Avery / Penguin Random House',
    isNetflixOriginal: false,
    genres: ['Self-Help', 'Productivity', 'Psychology'],
    moods: ['motivated', 'stressed', 'hopeful'],
    experiences: ['learning', 'inspiration'],
    intensity: 'low',
    description: 'A practical framework that reveals how tiny incremental adjustments can compound into transformative personal habits.',
    posterUrl: '',
    externalUrl: 'https://jamesclear.com/atomic-habits',
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    contentType: 'book',
    platform: 'Pan Books',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Comedy', 'Satire'],
    moods: ['happy', 'relaxed', 'curious'],
    experiences: ['laughter', 'escapism'],
    intensity: 'low',
    description: 'Seconds before Earth is demolished for a hyperspace bypass, Arthur Dent is plucked into a hilarious cosmic adventure.',
    posterUrl: '',
    externalUrl: 'https://www.goodreads.com/book/show/386162.The_Hitchhiker_s_Guide_to_the_Galaxy',
  },

  // =========================================================================
  // MOVIES (5 records)
  // =========================================================================
  {
    title: 'Spirited Away',
    contentType: 'movie',
    platform: 'Studio Ghibli',
    isNetflixOriginal: false,
    genres: ['Animation', 'Fantasy', 'Adventure'],
    moods: ['relaxed', 'nostalgic', 'curious'],
    experiences: ['comfort', 'escapism', 'inspiration'],
    intensity: 'low',
    description: 'A young girl enters an enchanted spirit realm and must demonstrate courage and resilience to rescue her parents.',
    posterUrl: '',
    externalUrl: 'https://www.imdb.com/title/tt0245429/',
  },
  {
    title: 'Knives Out',
    contentType: 'movie',
    platform: 'Lionsgate',
    isNetflixOriginal: false,
    genres: ['Mystery', 'Comedy', 'Crime'],
    moods: ['happy', 'curious', 'stressed'],
    experiences: ['laughter', 'excitement', 'escapism'],
    intensity: 'medium',
    description: 'An astute detective unravels a web of lies surrounding the suspicious demise of a wealthy patriarch among his scheming family.',
    posterUrl: '',
    externalUrl: 'https://www.imdb.com/title/tt8946378/',
  },
  {
    title: 'Interstellar',
    contentType: 'movie',
    platform: 'Paramount Pictures',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    moods: ['lonely', 'hopeful', 'introspective'],
    experiences: ['emotional-release', 'excitement', 'inspiration'],
    intensity: 'high',
    description: 'A team of courageous explorers embarks through an interstellar wormhole in a desperate endeavor to preserve humanity.',
    posterUrl: '',
    externalUrl: 'https://www.imdb.com/title/tt0816692/',
  },
  {
    title: 'Paddington 2',
    contentType: 'movie',
    platform: 'StudioCanal',
    isNetflixOriginal: false,
    genres: ['Comedy', 'Family', 'Adventure'],
    moods: ['happy', 'relaxed', 'hopeful'],
    experiences: ['comfort', 'laughter', 'inspiration'],
    intensity: 'low',
    description: 'Paddington bear brings warmth and cheer to Windsor Gardens until a treasured antique book is wrongfully stolen.',
    posterUrl: '',
    externalUrl: 'https://www.imdb.com/title/tt4468766/',
  },
  {
    title: 'Before Sunrise',
    contentType: 'movie',
    platform: 'Warner Bros.',
    isNetflixOriginal: false,
    genres: ['Romance', 'Drama'],
    moods: ['romantic', 'hopeful', 'introspective'],
    experiences: ['comfort', 'reflection', 'emotional-release'],
    intensity: 'low',
    description: 'Two travelers meet on a train across Europe and spend a fleeting, unforgettable night wandering Vienna discussing life and love.',
    posterUrl: '',
    externalUrl: 'https://www.imdb.com/title/tt0112471/',
  },

  // =========================================================================
  // SERIES (4 records)
  // =========================================================================
  {
    title: 'Stranger Things',
    contentType: 'series',
    platform: 'Netflix',
    isNetflixOriginal: true,
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    moods: ['stressed', 'curious', 'nostalgic'],
    experiences: ['excitement', 'escapism'],
    intensity: 'high',
    description: 'When a boy mysteriously disappears, a small town uncovers clandestine government laboratories and an ominous parallel dimension.',
    posterUrl: '',
    externalUrl: 'https://www.netflix.com/title/80057281',
  },
  {
    title: "The Queen's Gambit",
    contentType: 'series',
    platform: 'Netflix',
    isNetflixOriginal: true,
    genres: ['Drama', 'Coming-of-Age'],
    moods: ['motivated', 'lonely', 'curious'],
    experiences: ['inspiration', 'excitement', 'emotional-release'],
    intensity: 'medium',
    description: 'Orphaned chess prodigy Beth Harmon overcomes addiction and societal hurdles on her journey toward the world championship.',
    posterUrl: '',
    externalUrl: 'https://www.netflix.com/title/80234304',
  },
  {
    title: 'Ted Lasso',
    contentType: 'series',
    platform: 'Apple TV+',
    isNetflixOriginal: false,
    genres: ['Comedy', 'Sports', 'Drama'],
    moods: ['happy', 'hopeful', 'stressed'],
    experiences: ['comfort', 'laughter', 'inspiration'],
    intensity: 'low',
    description: 'An irrepressibly optimistic American football coach moves abroad to steer a struggling English Premier League football club.',
    posterUrl: '',
    externalUrl: 'https://tv.apple.com/us/show/ted-lasso/umc.cmc.vtoh0mn0xn7t3c643bvd9m32',
  },
  {
    title: 'Severance',
    contentType: 'series',
    platform: 'Apple TV+',
    isNetflixOriginal: false,
    genres: ['Sci-Fi', 'Psychological Thriller', 'Mystery'],
    moods: ['curious', 'stressed', 'lonely'],
    experiences: ['excitement', 'reflection'],
    intensity: 'high',
    description: 'Corporate office workers undergo a surgical memory split dividing personal memories from work memories, concealing dark secrets.',
    posterUrl: '',
    externalUrl: 'https://tv.apple.com/us/show/severance/umc.cmc.1srk2goyh2q2zdxcx605w8vtx',
  },
];

module.exports = sampleContents;
