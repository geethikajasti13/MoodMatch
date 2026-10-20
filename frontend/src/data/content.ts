import type { ContentRecord } from '@/types';

/**
 * Curated content records — real books, films, and series with honest metadata.
 * Cover images are representative stock photography (Pexels), NOT official covers,
 * since official cover art is copyrighted. No ratings are invented.
 */
export const CONTENT: ContentRecord[] = [
  // ---------- COZY / COMFORT ----------
  {
    _id: 'bk-pride-prejudice',
    title: 'Pride and Prejudice',
    type: 'book',
    creator: 'Jane Austen',
    year: 1813,
    genres: ['Classic', 'Romance', 'Comedy'],
    moods: ['cozy', 'warm', 'romantic', 'hopeful', 'witty'],
    intensity: 'light',
    description:
      'Elizabeth Bennet navigates love, class, and first impressions in Regency-era England. Sharp dialogue and slow-burn romance make this a comfort read.',
    themes: ['love', 'class', 'family', 'self-discovery'],
    coverUrl:
      'https://images.pexels.com/photos/1132577/pexels-photo-1132577.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '432 pages',
    source: 'Representative photo — Pexels (lil artsy)',
  },
  {
    _id: 'mv-amelie',
    title: 'Amélie',
    type: 'movie',
    creator: 'Jean-Pierre Jeunet',
    year: 2001,
    genres: ['Comedy', 'Romance', 'Drama'],
    moods: ['cozy', 'warm', 'whimsical', 'hopeful', 'romantic'],
    intensity: 'light',
    description:
      'A shy Parisian waitress quietly improves the lives of those around her while wrestling with her own loneliness. Whimsical, warm, and visually charming.',
    themes: ['kindness', 'loneliness', 'imagination'],
    coverUrl:
      'https://images.pexels.com/photos/10252811/pexels-photo-10252811.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 2m',
    source: 'Representative photo — Pexels (Ioana Motoc)',
  },
  {
    _id: 'sr-great-british-bake-off',
    title: 'The Great British Bake Off',
    type: 'series',
    creator: 'BBC / Love Productions',
    year: 2010,
    genres: ['Reality', 'Food', 'Comedy'],
    moods: ['cozy', 'warm', 'relaxing', 'wholesome', 'gentle'],
    intensity: 'light',
    description:
      'Amateur bakers compete in a tent in the English countryside. Gentle, kind-spirited competition that is the definition of comfort television.',
    themes: ['community', 'creativity', 'kindness'],
    coverUrl:
      'https://images.pexels.com/photos/10313368/pexels-photo-10313368.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '15 seasons',
    source: 'Representative photo — Pexels (Alina Vilchenko)',
  },

  // ---------- SAD / MELANCHOLY ----------
  {
    _id: 'bk-fault-stars',
    title: 'The Fault in Our Stars',
    type: 'book',
    creator: 'John Green',
    year: 2012,
    genres: ['Young Adult', 'Romance', 'Drama'],
    moods: ['sad', 'melancholy', 'romantic', 'bittersweet', 'emotional'],
    intensity: 'intense',
    description:
      'Two teenagers with cancer fall in love and confront what it means to live fully when time is uncertain. Tender, funny, and devastating.',
    themes: ['mortality', 'love', 'meaning'],
    coverUrl:
      'https://images.pexels.com/photos/3007370/pexels-photo-3007370.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '318 pages',
    source: 'Representative photo — Pexels (Sofia Alejandra)',
  },
  {
    _id: 'mv-eternal-sunshine',
    title: 'Eternal Sunshine of the Spotless Mind',
    type: 'movie',
    creator: 'Michel Gondry',
    year: 2004,
    genres: ['Drama', 'Romance', 'Sci-Fi'],
    moods: ['sad', 'melancholy', 'bittersweet', 'reflective', 'romantic'],
    intensity: 'moderate',
    description:
      'A couple undergoes a procedure to erase memories of each other, only to rediscover why they loved each other in the first place. A meditation on love and loss.',
    themes: ['memory', 'love', 'identity'],
    coverUrl:
      'https://images.pexels.com/photos/3630100/pexels-photo-3630100.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1h 48m',
    source: 'Representative photo — Pexels (Johannes Plenio)',
  },
  {
    _id: 'sr-normal-people',
    title: 'Normal People',
    type: 'series',
    creator: 'Lenny Abrahamson & Hettie Macdonald',
    year: 2020,
    genres: ['Drama', 'Romance'],
    moods: ['sad', 'melancholy', 'romantic', 'intimate', 'emotional'],
    intensity: 'intense',
    description:
      'Marianne and Connell navigate an on-again, off-again relationship from secondary school through university in Ireland. Quiet, raw, and intimate.',
    themes: ['love', 'class', 'mental health', 'intimacy'],
    coverUrl:
      'https://images.pexels.com/photos/19770884/pexels-photo-19770884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1 season, 12 episodes',
    source: 'Representative photo — Pexels (Aylin Çıplak)',
  },

  // ---------- ADVENTUROUS / EXCITING ----------
  {
    _id: 'bk-hobbit',
    title: 'The Hobbit',
    type: 'book',
    creator: 'J.R.R. Tolkien',
    year: 1937,
    genres: ['Fantasy', 'Adventure'],
    moods: ['adventurous', 'exciting', 'epic', 'magical', 'hopeful'],
    intensity: 'moderate',
    description:
      'Bilbo Baggins leaves the Shire on a quest to reclaim a dwarf kingdom from a dragon. The foundational modern fantasy adventure.',
    themes: ['courage', 'friendship', 'home'],
    coverUrl:
      'https://images.pexels.com/photos/7244094/pexels-photo-7244094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '310 pages',
    source: 'Representative photo — Pexels (Gilles Scherrer)',
  },
  {
    _id: 'mv-mad-max-fury-road',
    title: 'Mad Max: Fury Road',
    type: 'movie',
    creator: 'George Miller',
    year: 2015,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    moods: ['exciting', 'adventurous', 'intense-thrill', 'epic', 'adrenaline'],
    intensity: 'intense',
    description:
      'In a post-apocalyptic wasteland, Max and Furiosa flee a tyrant across the desert in a non-stop vehicular chase. One of the greatest action films ever made.',
    themes: ['survival', 'rebellion', 'redemption'],
    coverUrl:
      'https://images.pexels.com/photos/10762275/pexels-photo-10762275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 0m',
    source: 'Representative photo — Pexels (Ali Kazal)',
  },
  {
    _id: 'sr-avatar-last-airbender',
    title: 'Avatar: The Last Airbender',
    type: 'series',
    creator: 'Michael Dante DiMartino & Bryan Konietzko',
    year: 2005,
    genres: ['Animation', 'Fantasy', 'Adventure'],
    moods: ['adventurous', 'exciting', 'hopeful', 'heartwarming', 'epic'],
    intensity: 'moderate',
    description:
      'A young boy must master four elements to end a century-long war. Beloved for its storytelling, character growth, and surprising emotional depth.',
    themes: ['destiny', 'friendship', 'balance', 'growth'],
    coverUrl:
      'https://images.pexels.com/photos/12217679/pexels-photo-12217679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '3 seasons',
    source: 'Representative photo — Pexels (Emmanuel Hernández)',
  },

  // ---------- THRILLING / SUSPENSEFUL ----------
  {
    _id: 'bk-gone-girl',
    title: 'Gone Girl',
    type: 'book',
    creator: 'Gillian Flynn',
    year: 2012,
    genres: ['Thriller', 'Mystery', 'Crime'],
    moods: ['thrilling', 'suspenseful', 'dark', 'intense-thrill', 'gripping'],
    intensity: 'intense',
    description:
      'When his wife disappears, Nick Dunne becomes the prime suspect. A twisty psychological thriller about marriage, media, and manipulation.',
    themes: ['marriage', 'deception', 'identity'],
    coverUrl:
      'https://images.pexels.com/photos/13185436/pexels-photo-13185436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '432 pages',
    source: 'Representative photo — Pexels (Abdullah Al Mallah)',
  },
  {
    _id: 'mv-se7en',
    title: 'Se7en',
    type: 'movie',
    creator: 'David Fincher',
    year: 1995,
    genres: ['Thriller', 'Crime', 'Drama'],
    moods: ['thrilling', 'suspenseful', 'dark', 'gritty', 'gripping'],
    intensity: 'intense',
    description:
      'Two detectives hunt a serial killer who murders according to the seven deadly sins. Bleak, atmospheric, and unforgettable.',
    themes: ['justice', 'sin', 'obsession'],
    coverUrl:
      'https://images.pexels.com/photos/6486933/pexels-photo-6486933.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 7m',
    source: 'Representative photo — Pexels (Vlado Pitbullgrif)',
  },
  {
    _id: 'sr-dark',
    title: 'Dark',
    type: 'series',
    creator: 'Baran bo Odar & Jantje Friese',
    year: 2017,
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    moods: ['suspenseful', 'dark', 'mysterious', 'mind-bending', 'gripping'],
    intensity: 'intense',
    description:
      'A child disappearance in a German town unravels a time-travel conspiracy spanning four generations. Dense, dark, and deeply rewarding.',
    themes: ['time', 'family', 'fate', 'secrets'],
    coverUrl:
      'https://images.pexels.com/photos/38161952/pexels-photo-38161952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '3 seasons',
    source: 'Representative photo — Pexels (Berkay Zeyrek)',
  },

  // ---------- THOUGHTFUL / REFLECTIVE ----------
  {
    _id: 'bk-just-mercy',
    title: 'Just Mercy',
    type: 'book',
    creator: 'Bryan Stevenson',
    year: 2014,
    genres: ['Non-Fiction', 'Memoir', 'Social Justice'],
    moods: ['thoughtful', 'reflective', 'powerful', 'hopeful', 'heavy'],
    intensity: 'moderate',
    description:
      'A young lawyer defends those wrongly condemned on death row. A real, devastating, and ultimately hopeful account of justice in America.',
    themes: ['justice', 'compassion', 'systemic inequality'],
    coverUrl:
      'https://images.pexels.com/photos/11287069/pexels-photo-11287069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '352 pages',
    source: 'Representative photo — Pexels (Hurrah suhail)',
  },
  {
    _id: 'mv-arrival',
    title: 'Arrival',
    type: 'movie',
    creator: 'Denis Villeneuve',
    year: 2016,
    genres: ['Sci-Fi', 'Drama'],
    moods: ['thoughtful', 'reflective', 'emotional', 'mind-bending', 'hopeful'],
    intensity: 'moderate',
    description:
      'A linguist is recruited to communicate with alien visitors, uncovering a truth that reshapes her understanding of time and loss. Cerebral and deeply human.',
    themes: ['language', 'time', 'grief', 'connection'],
    coverUrl:
      'https://images.pexels.com/photos/7672265/pexels-photo-7672265.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1h 56m',
    source: 'Representative photo — Pexels (Mikhail Nilov)',
  },
  {
    _id: 'sr-queen-gambit',
    title: "The Queen's Gambit",
    type: 'series',
    creator: 'Scott Frank',
    year: 2020,
    genres: ['Drama'],
    moods: ['thoughtful', 'intense-thrill', 'powerful', 'reflective', 'gripping'],
    intensity: 'moderate',
    description:
      'An orphaned chess prodigy rises through the competitive circuit while battling addiction. Stylish, focused, and quietly powerful.',
    themes: ['genius', 'addiction', 'ambition', 'identity'],
    coverUrl:
      'https://images.pexels.com/photos/19778376/pexels-photo-19778376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1 season, 7 episodes',
    source: 'Representative photo — Pexels (Ihsan Adityawarman)',
  },

  // ---------- ROMANTIC ----------
  {
    _id: 'bk-me-before-you',
    title: 'Me Before You',
    type: 'book',
    creator: 'Jojo Moyes',
    year: 2012,
    genres: ['Romance', 'Drama'],
    moods: ['romantic', 'emotional', 'bittersweet', 'sad', 'warm'],
    intensity: 'moderate',
    description:
      'A young woman becomes a caregiver for a paralyzed man and both their lives are transformed. Romantic, funny, and heart-wrenching.',
    themes: ['love', 'dignity', 'choice'],
    coverUrl:
      'https://images.pexels.com/photos/14391561/pexels-photo-14391561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '369 pages',
    source: 'Representative photo — Pexels (vkmoraesPH)',
  },
  {
    _id: 'mv-la-la-land',
    title: 'La La Land',
    type: 'movie',
    creator: 'Damien Chazelle',
    year: 2016,
    genres: ['Romance', 'Musical', 'Drama'],
    moods: ['romantic', 'whimsical', 'hopeful', 'bittersweet', 'warm'],
    intensity: 'light',
    description:
      'A jazz pianist and an aspiring actress fall in love in Los Angeles while pursuing their dreams. A dazzling, bittersweet modern musical.',
    themes: ['dreams', 'love', 'ambition', 'sacrifice'],
    coverUrl:
      'https://images.pexels.com/photos/39838826/pexels-photo-39838826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 8m',
    source: 'Representative photo — Pexels (Breno Cardoso)',
  },
  {
    _id: 'sr-outlander',
    title: 'Outlander',
    type: 'series',
    creator: 'Ronald D. Moore',
    year: 2014,
    genres: ['Romance', 'Drama', 'Fantasy', 'Historical'],
    moods: ['romantic', 'adventurous', 'epic', 'emotional', 'intense-thrill'],
    intensity: 'intense',
    description:
      'A WWII nurse is transported to 1743 Scotland and falls for a Highland warrior. Sweeping romance, history, and adventure.',
    themes: ['love', 'time', 'loyalty', 'identity'],
    coverUrl:
      'https://images.pexels.com/photos/18046666/pexels-photo-18046666.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '7 seasons',
    source: 'Representative photo — Pexels (Ángel Pardo)',
  },

  // ---------- FUNNY / LIGHTHEARTED ----------
  {
    _id: 'bk-good-omens',
    title: 'Good Omens',
    type: 'book',
    creator: 'Neil Gaiman & Terry Pratchett',
    year: 1990,
    genres: ['Fantasy', 'Comedy'],
    moods: ['funny', 'light', 'whimsical', 'witty', 'adventurous'],
    intensity: 'light',
    description:
      'An angel and a demon team up to stop the apocalypse because they rather like Earth. Hilarious, clever, and absurd.',
    themes: ['friendship', 'humanity', 'free will'],
    coverUrl:
      'https://images.pexels.com/photos/30089830/pexels-photo-30089830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '288 pages',
    source: 'Representative photo — Pexels (Helena Jankovičová Kováčová)',
  },
  {
    _id: 'mv-grand-budapest',
    title: 'The Grand Budapest Hotel',
    type: 'movie',
    creator: 'Wes Anderson',
    year: 2014,
    genres: ['Comedy', 'Drama', 'Adventure'],
    moods: ['funny', 'whimsical', 'light', 'witty', 'bittersweet'],
    intensity: 'light',
    description:
      'A legendary concierge and his protégé become embroiled in a theft and a family fortune dispute. Symmetrical, fast-paced, and utterly charming.',
    themes: ['friendship', 'nostalgia', 'craft'],
    coverUrl:
      'https://images.pexels.com/photos/7867914/pexels-photo-7867914.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1h 39m',
    source: 'Representative photo — Pexels (RDNE Stock project)',
  },
  {
    _id: 'sr-schitts-creek',
    title: 'Schitt\u2019s Creek',
    type: 'series',
    creator: 'Dan & Eugene Levy',
    year: 2015,
    genres: ['Comedy'],
    moods: ['funny', 'light', 'warm', 'heartwarming', 'hopeful'],
    intensity: 'light',
    description:
      'A wealthy family loses everything and must live in a small town they once bought as a joke. Funny, tender, and full of heart.',
    themes: ['family', 'acceptance', 'growth'],
    coverUrl:
      'https://images.pexels.com/photos/34649922/pexels-photo-34649922.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '6 seasons',
    source: 'Representative photo — Pexels (fewmiracles)',
  },

  // ---------- EPIC / IMMERSIVE ----------
  {
    _id: 'bk-dune',
    title: 'Dune',
    type: 'book',
    creator: 'Frank Herbert',
    year: 1965,
    genres: ['Sci-Fi', 'Adventure'],
    moods: ['epic', 'adventurous', 'immersive', 'intense-thrill', 'thoughtful'],
    intensity: 'intense',
    description:
      'On the desert planet Arrakis, young Paul Atreides navigates politics, prophecy, and ecology in a sweeping space opera. The foundational sci-fi epic.',
    themes: ['power', 'ecology', 'destiny', 'religion'],
    coverUrl:
      'https://images.pexels.com/photos/7672879/pexels-photo-7672879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '688 pages',
    source: 'Representative photo — Pexels (Mikhail Nilov)',
  },
  {
    _id: 'mv-lord-rings-fellowship',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    type: 'movie',
    creator: 'Peter Jackson',
    year: 2001,
    genres: ['Fantasy', 'Adventure', 'Action'],
    moods: ['epic', 'adventurous', 'magical', 'hopeful', 'immersive'],
    intensity: 'intense',
    description:
      'Frodo and a fellowship set out to destroy a powerful ring before it falls into the hands of evil. The gold standard of fantasy filmmaking.',
    themes: ['friendship', 'sacrifice', 'good vs evil'],
    coverUrl:
      'https://images.pexels.com/photos/27524852/pexels-photo-27524852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 58m',
    source: 'Representative photo — Pexels (Luke Miller)',
  },
  {
    _id: 'sr-game-thrones',
    title: 'Game of Thrones',
    type: 'series',
    creator: 'David Benioff & D.B. Weiss',
    year: 2011,
    genres: ['Fantasy', 'Drama', 'Adventure'],
    moods: ['epic', 'dark', 'intense-thrill', 'gripping', 'immersive'],
    intensity: 'intense',
    description:
      'Noble families vie for the Iron Throne while an ancient threat returns beyond the Wall. Political, brutal, and grand in scope.',
    themes: ['power', 'family', 'survival', 'loyalty'],
    coverUrl:
      'https://images.pexels.com/photos/3011825/pexels-photo-3011825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '8 seasons',
    source: 'Representative photo — Pexels (Marius Schmidt)',
  },

  // ---------- MAGICAL / WHIMSICAL ----------
  {
    _id: 'bk-night-circus',
    title: 'The Night Circus',
    type: 'book',
    creator: 'Erin Morgenstern',
    year: 2011,
    genres: ['Fantasy', 'Romance'],
    moods: ['magical', 'whimsical', 'romantic', 'immersive', 'mysterious'],
    intensity: 'moderate',
    description:
      'A mysterious circus appears without warning, and two young magicians are bound in a duel they do not fully understand. Lush and atmospheric.',
    themes: ['magic', 'competition', 'love', 'art'],
    coverUrl:
      'https://images.pexels.com/photos/14253678/pexels-photo-14253678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '387 pages',
    source: 'Representative photo — Pexels (iulianna)',
  },
  {
    _id: 'mv-spirited-away',
    title: 'Spirited Away',
    type: 'movie',
    creator: 'Hayao Miyazaki',
    year: 2001,
    genres: ['Animation', 'Fantasy', 'Adventure'],
    moods: ['magical', 'whimsical', 'adventurous', 'heartwarming', 'immersive'],
    intensity: 'moderate',
    description:
      'A young girl is trapped in a spirit world and must work in a bathhouse for gods to free her parents. A masterpiece of imagination and wonder.',
    themes: ['courage', 'identity', 'kindness', 'growth'],
    coverUrl:
      'https://images.pexels.com/photos/15022098/pexels-photo-15022098.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '2h 5m',
    source: 'Representative photo — Pexels (Bayram Musayev)',
  },
  {
    _id: 'sr-his-dark-materials',
    title: 'His Dark Materials',
    type: 'series',
    creator: 'Jack Thorne',
    year: 2019,
    genres: ['Fantasy', 'Drama', 'Adventure'],
    moods: ['magical', 'adventurous', 'dark', 'thoughtful', 'epic'],
    intensity: 'moderate',
    description:
      'A young girl journeys across parallel worlds uncovering a cosmic conspiracy. Adapted from Philip Pullman\u2019s acclaimed trilogy.',
    themes: ['freedom', 'truth', 'courage', 'faith'],
    coverUrl:
      'https://images.pexels.com/photos/33649660/pexels-photo-33649660.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '3 seasons',
    source: 'Representative photo — Pexels (Iván Rojas)',
  },

  // ---------- HOPEFUL / UPLIFTING ----------
  {
    _id: 'bk-alchemist',
    title: 'The Alchemist',
    type: 'book',
    creator: 'Paulo Coelho',
    year: 1988,
    genres: ['Fiction', 'Philosophy', 'Adventure'],
    moods: ['hopeful', 'reflective', 'warm', 'inspiring', 'adventurous'],
    intensity: 'light',
    description:
      'A shepherd boy travels from Spain to Egypt in search of treasure, discovering the meaning of his own legend. A simple, uplifting parable.',
    themes: ['destiny', 'dreams', 'self-discovery'],
    coverUrl:
      'https://images.pexels.com/photos/22043451/pexels-photo-22043451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '163 pages',
    source: 'Representative photo — Pexels (Alexander Mass)',
  },
  {
    _id: 'mv-intouchables',
    title: 'The Intouchables',
    type: 'movie',
    creator: 'Olivier Nakache & Éric Toledano',
    year: 2011,
    genres: ['Comedy', 'Drama', 'Biography'],
    moods: ['hopeful', 'warm', 'funny', 'heartwarming', 'light'],
    intensity: 'light',
    description:
      'A wealthy quadriplegic hires a charismatic ex-con as his caregiver. Based on a true friendship that defied expectations. Joyful and moving.',
    themes: ['friendship', 'dignity', 'acceptance'],
    coverUrl:
      'https://images.pexels.com/photos/1687046/pexels-photo-1687046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '1h 53m',
    source: 'Representative photo — Pexels (freestocks.org)',
  },
  {
    _id: 'sr-ted-lasso',
    title: 'Ted Lasso',
    type: 'series',
    creator: 'Jason Sudeikis & Bill Lawrence',
    year: 2020,
    genres: ['Comedy', 'Drama', 'Sports'],
    moods: ['hopeful', 'warm', 'funny', 'heartwarming', 'light'],
    intensity: 'light',
    description:
      'An American football coach is hired to manage a struggling English football club. Relentlessly optimistic and surprisingly deep.',
    themes: ['kindness', 'leadership', 'mental health', 'community'],
    coverUrl:
      'https://images.pexels.com/photos/6827272/pexels-photo-6827272.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    runtimeNote: '3 seasons',
    source: 'Representative photo — Pexels (Dario Fernandez Ruz)',
  },
];

export const ALL_MOODS = [
  'cozy', 'warm', 'romantic', 'hopeful', 'witty', 'whimsical',
  'sad', 'melancholy', 'bittersweet', 'emotional',
  'adventurous', 'exciting', 'epic', 'magical', 'adrenaline',
  'thrilling', 'suspenseful', 'dark', 'gripping', 'gritty', 'mysterious', 'mind-bending',
  'thoughtful', 'reflective', 'powerful', 'heavy', 'inspiring',
  'funny', 'light', 'heartwarming', 'wholesome', 'gentle',
  'immersive', 'relaxing', 'intense-thrill', 'intimate',
] as const;

export const ALL_GENRES = Array.from(
  new Set(CONTENT.flatMap((c) => c.genres))
).sort();

export const ALL_TYPES = ['book', 'movie', 'series'] as const;
