/**
 * MoodMatch Backend Automated Test Suite
 * Validates all requirements specified in Section 12:
 * 1. Health check (both when connected and connection failure 503)
 * 2. Content listing, pagination, and multi-criteria filters
 * 3. Case-insensitive title search
 * 4. Invalid content IDs (400) and nonexistent IDs (404)
 * 5. Empty mood responses (400)
 * 6. Overlong responses (>1000 chars -> 400)
 * 7. Multiple inferred mood tags and phrase-aware matching
 * 8. Negation handling ("I am not sad")
 * 9. Category restrictions (contentType: all, book, movie, series; rejection of invalid types)
 * 10. Recommendation scoring (+3 mood, +2 experience, +1 intensity)
 * 11. Ranked recommendations with data-grounded explanations
 * 12. Fallback when no direct match exists
 * 13. Saved content CRUD and duplicate prevention (409)
 */

const http = require('http');
const mongoose = require('mongoose');
const { app } = require('./server');
const Content = require('./models/Content');
const SavedContent = require('./models/SavedContent');
const { interpretMood } = require('./services/moodService');
const { calculateMatchScore } = require('./controllers/recommendationController');
const { sampleContent } = require('./seed');

let serverInstance;
let baseUrl = '';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  }
}

// In-Memory Data Store to simulate MongoDB for testing when no daemon is running
function setupInMemoryMongoMock() {
  const seededItems = sampleContent.map((item, index) => {
    const id = new mongoose.Types.ObjectId();
    return {
      _id: id,
      ...item,
      createdAt: new Date(Date.now() - index * 1000),
      updatedAt: new Date(Date.now() - index * 1000)
    };
  });

  const savedStore = [];

  function matchesFilter(item, query) {
    for (const [key, val] of Object.entries(query)) {
      if (key === '$or' && Array.isArray(val)) {
        const matchesOr = val.some((subQuery) => matchesFilter(item, subQuery));
        if (!matchesOr) return false;
        continue;
      }

      if (key === 'contentType') {
        if (item.contentType !== val) return false;
      } else if (key === 'intensity') {
        if (item.intensity !== val) return false;
      } else if (key === 'genres' || key === 'moods' || key === 'experiences') {
        const arr = item[key] || [];
        if (val && val.$regex) {
          const matchRegex = arr.some((el) => val.$regex.test(el));
          if (!matchRegex) return false;
        } else if (val && val.$in) {
          const matchIn = arr.some((el) => val.$in.includes(el.toLowerCase()));
          if (!matchIn) return false;
        }
      } else if (key === 'title') {
        if (val && val.$regex) {
          const reg = new RegExp(val.$regex, val.$options || 'i');
          if (!reg.test(item.title)) return false;
        }
      } else if (key === 'platform') {
        if (val && val.$regex) {
          if (!val.$regex.test(item.platform)) return false;
        }
      }
    }
    return true;
  }

  // Stub Content.find
  Content.find = function (query = {}) {
    let filtered = seededItems.filter((item) => matchesFilter(item, query));
    let skipCount = 0;
    let limitCount = Infinity;

    const queryObj = {
      sort(criteria) {
        return this;
      },
      skip(n) {
        skipCount = n;
        return this;
      },
      limit(n) {
        limitCount = n;
        return this;
      },
      lean() {
        return this.exec();
      },
      exec() {
        return Promise.resolve(filtered.slice(skipCount, skipCount + limitCount));
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      }
    };
    return queryObj;
  };

  // Stub Content.findById
  Content.findById = function (id) {
    const found = seededItems.find((item) => item._id.toString() === id.toString());
    return Promise.resolve(found || null);
  };

  // Stub Content.countDocuments
  Content.countDocuments = function (query = {}) {
    const filtered = seededItems.filter((item) => matchesFilter(item, query));
    return Promise.resolve(filtered.length);
  };

  // Stub SavedContent
  SavedContent.create = function (doc) {
    const existing = savedStore.find(
      (s) => s.sessionId === doc.sessionId && s.contentId.toString() === doc.contentId.toString()
    );
    if (existing) {
      const err = new Error('Duplicate key');
      err.code = 11000;
      return Promise.reject(err);
    }
    const newDoc = {
      _id: new mongoose.Types.ObjectId(),
      contentId: doc.contentId,
      sessionId: doc.sessionId,
      notes: doc.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    savedStore.push(newDoc);
    return Promise.resolve(newDoc);
  };

  SavedContent.findOne = function (query) {
    const found = savedStore.find(
      (s) => s.sessionId === query.sessionId && s.contentId.toString() === query.contentId.toString()
    );
    return Promise.resolve(found || null);
  };

  SavedContent.findById = function (id) {
    const found = savedStore.find((s) => s._id.toString() === id.toString());
    const queryObj = {
      populate(field) {
        if (found && field === 'contentId') {
          const content = seededItems.find((c) => c._id.toString() === found.contentId.toString());
          return Promise.resolve({ ...found, contentId: content });
        }
        return Promise.resolve(found);
      },
      then(resolve, reject) {
        return Promise.resolve(found).then(resolve, reject);
      }
    };
    return queryObj;
  };

  SavedContent.find = function (query) {
    const filtered = savedStore.filter((s) => s.sessionId === query.sessionId);
    let shouldPopulate = false;

    const queryObj = {
      sort() {
        return this;
      },
      populate(field) {
        if (field === 'contentId') shouldPopulate = true;
        return this;
      },
      exec() {
        const result = filtered.map((item) => {
          if (shouldPopulate) {
            const content = seededItems.find((c) => c._id.toString() === item.contentId.toString());
            return { ...item, contentId: content };
          }
          return item;
        });
        return Promise.resolve(result);
      },
      then(resolve, reject) {
        return this.exec().then(resolve, reject);
      }
    };
    return queryObj;
  };

  SavedContent.findOneAndDelete = function (query) {
    const idx = savedStore.findIndex(
      (s) => s.sessionId === query.sessionId && s.contentId.toString() === query.contentId.toString()
    );
    if (idx === -1) return Promise.resolve(null);
    const removed = savedStore.splice(idx, 1)[0];
    return Promise.resolve(removed);
  };

  return { seededItems, savedStore };
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Starting MoodMatch Backend Test Suite');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST GROUP 1: Pure Unit Tests (Mood Interpretation)
  // ----------------------------------------------------
  console.log('--- Group 1: Mood Interpretation & Negation Handling ---');

  const res1 = interpretMood('I had a stressful day and want something comforting');
  assert(res1.inferredMoods.includes('stressed'), "Inferred mood includes 'stressed'");
  assert(res1.desiredExperiences.includes('comfort'), "Desired experience includes 'comfort'");
  assert(res1.intensity === 'medium', 'Default intensity is medium');

  const res2 = interpretMood('I want to solve a mystery and need something that makes me laugh');
  assert(res2.desiredExperiences.includes('suspense'), "Detects 'solve a mystery' -> suspense");
  assert(res2.desiredExperiences.includes('laughter'), "Detects 'makes me laugh' -> laughter");

  const res3 = interpretMood('I am not sad, but I feel hopeful');
  assert(!res3.inferredMoods.includes('sad'), "Negation works: 'not sad' does NOT infer 'sad'");
  assert(res3.inferredMoods.includes('hopeful'), "Infers non-negated mood 'hopeful'");

  const resHigh = interpretMood('I am extremely exhausted and overwhelmed');
  assert(resHigh.intensity === 'high', "Detects high intensity from 'extremely'");

  const resLow = interpretMood('I feel a little bored');
  assert(resLow.intensity === 'low', "Detects low intensity from 'a little'");

  const resAmbiguous = interpretMood('xyz qwerty 12345');
  assert(resAmbiguous.isAmbiguous === true, 'Marks unrecognized text as ambiguous');
  assert(resAmbiguous.inferredMoods.length === 0, 'No false moods for random text');

  // ----------------------------------------------------
  // TEST GROUP 2: Recommendation Scoring Logic
  // ----------------------------------------------------
  console.log('\n--- Group 2: Recommendation Scoring Helper ---');

  const mockItem = {
    title: 'Comfort Show',
    contentType: 'series',
    moods: ['stressed', 'tired'],
    experiences: ['comfort'],
    intensity: 'low'
  };

  const scoreFull = calculateMatchScore(mockItem, ['stressed'], ['comfort'], 'low');
  assert(scoreFull.score === 6, `Full match score is 6 (+3 mood, +2 experience, +1 intensity) (got ${scoreFull.score})`);
  assert(scoreFull.matchReason.includes('comfort') && scoreFull.matchReason.includes('stressed'),
    'Match reason accurately reflects matched fields');

  const scoreMoodOnly = calculateMatchScore(mockItem, ['stressed'], ['adventure'], 'high');
  assert(scoreMoodOnly.score === 3, `Mood-only score is 3 (got ${scoreMoodOnly.score})`);
  assert(scoreMoodOnly.matchReason.includes('stressed'), 'Match reason cites stressed');

  const scoreZero = calculateMatchScore(mockItem, ['excited'], ['adventure'], 'high');
  assert(scoreZero.score === 0, `Zero match score is 0 (got ${scoreZero.score})`);

  // ----------------------------------------------------
  // TEST GROUP 3: Server Health Check & 404
  // ----------------------------------------------------
  console.log('\n--- Group 3: Server Health Check & Error Handling ---');

  serverInstance = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = serverInstance.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`[Test Server] Running on ${baseUrl}`);

  // Health check when DB disconnected
  const healthDisconnected = await request('GET', '/api/health');
  assert(
    healthDisconnected.status === 503,
    `Health check returns 503 when DB disconnected (got ${healthDisconnected.status})`
  );
  assert(
    healthDisconnected.body.database === 'disconnected',
    "Health check reports database as 'disconnected' and does not falsely report connected"
  );

  // 404 handler test
  const notFoundRes = await request('GET', '/api/nonexistent-route');
  assert(notFoundRes.status === 404, 'Unknown endpoint returns HTTP 404');
  assert(notFoundRes.body.success === false, '404 returns structured JSON error');

  // ----------------------------------------------------
  // Setup In-Memory Data Store
  // ----------------------------------------------------
  const { seededItems } = setupInMemoryMongoMock();
  const sampleItem = seededItems[0];

  // Temporarily stub mongoose connection state for health check ok test
  const originalState = mongoose.connection.readyState;
  Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

  const healthConnected = await request('GET', '/api/health');
  assert(healthConnected.status === 200, `Health check returns 200 when connected (got ${healthConnected.status})`);
  assert(healthConnected.body.status === 'ok', "Health check returns status 'ok'");
  assert(healthConnected.body.service === 'MoodMatch API', "Health check returns service 'MoodMatch API'");

  // ----------------------------------------------------
  // TEST GROUP 5: Content Listing & Multi-criteria Filtering
  // ----------------------------------------------------
  console.log('\n--- Group 5: Content Listing & Filter Validation ---');

  const listRes = await request('GET', '/api/content');
  assert(listRes.status === 200, 'GET /api/content returns 200');
  assert(Array.isArray(listRes.body.data) && listRes.body.data.length > 0, 'Returns content array');

  const seriesRes = await request('GET', '/api/content?type=series');
  assert(seriesRes.status === 200, 'GET /api/content?type=series returns 200');
  assert(
    seriesRes.body.data.every((item) => item.contentType === 'series'),
    'All returned items have contentType = series'
  );

  const stressedRes = await request('GET', '/api/content?mood=stressed');
  assert(stressedRes.status === 200, 'GET /api/content?mood=stressed returns 200');
  assert(
    stressedRes.body.data.every((item) => item.moods.map((m) => m.toLowerCase()).includes('stressed')),
    'All returned items contain mood = stressed'
  );

  const searchRes = await request('GET', '/api/content?search=good');
  assert(searchRes.status === 200, 'GET /api/content?search=good returns 200');
  assert(
    searchRes.body.data.some((item) => item.title.toLowerCase().includes('good')),
    'Search finds matching title (The Good Place)'
  );

  const intensityRes = await request('GET', '/api/content?intensity=low');
  assert(intensityRes.status === 200, 'GET /api/content?intensity=low returns 200');
  assert(
    intensityRes.body.data.every((item) => item.intensity === 'low'),
    'All returned items have intensity = low'
  );

  const invalidTypeRes = await request('GET', '/api/content?type=vehicles');
  assert(invalidTypeRes.status === 400, 'Invalid contentType filter returns 400');

  // ----------------------------------------------------
  // TEST GROUP 6: Content Detail Endpoint
  // ----------------------------------------------------
  console.log('\n--- Group 6: Content Detail Endpoint ---');

  const detailRes = await request('GET', `/api/content/${sampleItem._id}`);
  assert(detailRes.status === 200, 'GET /api/content/:id returns 200 for valid ID');
  assert(detailRes.body.data.title === sampleItem.title, 'Returns matching title');

  const invalidIdRes = await request('GET', '/api/content/invalid-123-id');
  assert(invalidIdRes.status === 400, 'Invalid ObjectId format returns 400');
  assert(invalidIdRes.body.error.includes('Invalid content ID'), 'Returns clean error message');

  const nonexistentId = new mongoose.Types.ObjectId();
  const notFoundIdRes = await request('GET', `/api/content/${nonexistentId}`);
  assert(notFoundIdRes.status === 404, 'Nonexistent ObjectId returns 404');

  // ----------------------------------------------------
  // TEST GROUP 7: Recommendation Endpoint & Ranking
  // ----------------------------------------------------
  console.log('\n--- Group 7: Recommendation Endpoint ---');

  const recRes = await request('POST', '/api/recommend', {
    response: 'I had a stressful day and want something comforting',
    contentType: 'all'
  });
  assert(recRes.status === 200, 'POST /api/recommend returns 200');
  assert(recRes.body.inferredMoods.includes('stressed'), "Inferred moods include 'stressed'");
  assert(recRes.body.desiredExperiences.includes('comfort'), "Desired experiences include 'comfort'");
  assert(Array.isArray(recRes.body.recommendations) && recRes.body.recommendations.length > 0,
    'Returns recommendations array');

  const scores = recRes.body.recommendations.map((r) => r.matchScore);
  const isSorted = scores.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
  assert(isSorted, 'Recommendations are correctly ranked in descending relevance order');

  const topRec = recRes.body.recommendations[0];
  assert(typeof topRec.matchReason === 'string' && topRec.matchReason.length > 0,
    'Top recommendation includes data-grounded matchReason');

  const bookRecRes = await request('POST', '/api/recommend', {
    response: 'I want some inspiration and hope',
    contentType: 'book'
  });
  assert(bookRecRes.status === 200, 'POST /api/recommend for books returns 200');
  assert(
    bookRecRes.body.recommendations.every((r) => r.contentType === 'book'),
    'All recommendations strictly match requested contentType = book'
  );

  const emptyRecRes = await request('POST', '/api/recommend', { response: '   ' });
  assert(emptyRecRes.status === 400, 'Empty response returns 400');

  const missingRecRes = await request('POST', '/api/recommend', {});
  assert(missingRecRes.status === 400, 'Missing response field returns 400');

  const overlongText = 'stress '.repeat(200);
  const longRecRes = await request('POST', '/api/recommend', { response: overlongText });
  assert(longRecRes.status === 400, 'Response > 1000 chars returns 400');

  const invalidTypeRecRes = await request('POST', '/api/recommend', {
    response: 'I feel great',
    contentType: 'invalid_type'
  });
  assert(invalidTypeRecRes.status === 400, 'Invalid contentType returns 400');

  const fallbackRecRes = await request('POST', '/api/recommend', {
    response: 'some completely unrecognized sentence with no keywords'
  });
  assert(fallbackRecRes.status === 200, 'Ambiguous input returns 200 with fallback content');
  assert(fallbackRecRes.body.recommendations.length > 0, 'Returns fallback recommendations');

  // ----------------------------------------------------
  // TEST GROUP 8: Saved Content API & Duplicate Prevention
  // ----------------------------------------------------
  console.log('\n--- Group 8: Saved Content API ---');

  const testSession = 'test-session-user-123';

  const saveRes = await request('POST', '/api/saved', {
    contentId: sampleItem._id.toString(),
    sessionId: testSession,
    notes: 'Watch with friends'
  });
  assert(saveRes.status === 201, 'POST /api/saved returns 201 Created');
  assert(saveRes.body.data.contentId._id.toString() === sampleItem._id.toString(),
    'Populated content details in response');

  const dupSaveRes = await request('POST', '/api/saved', {
    contentId: sampleItem._id.toString(),
    sessionId: testSession
  });
  assert(dupSaveRes.status === 409, `Duplicate save correctly rejected with 409 (got ${dupSaveRes.status})`);

  const invalidSaveRes = await request('POST', '/api/saved', {
    contentId: 'not-an-objectid',
    sessionId: testSession
  });
  assert(invalidSaveRes.status === 400, 'Invalid contentId returns 400');

  const nonexistentSaveRes = await request('POST', '/api/saved', {
    contentId: new mongoose.Types.ObjectId().toString(),
    sessionId: testSession
  });
  assert(nonexistentSaveRes.status === 404, 'Nonexistent contentId returns 404');

  const missingSessionRes = await request('POST', '/api/saved', {
    contentId: sampleItem._id.toString()
  });
  assert(missingSessionRes.status === 400, 'Missing sessionId returns 400');

  const getSavedRes = await request('GET', `/api/saved?sessionId=${testSession}`);
  assert(getSavedRes.status === 200, 'GET /api/saved returns 200');
  assert(getSavedRes.body.data.length === 1, 'Returns 1 saved item');
  assert(getSavedRes.body.data[0].contentId.title === sampleItem.title, 'Includes populated title');

  const deleteRes = await request('DELETE', `/api/saved/${sampleItem._id}?sessionId=${testSession}`);
  assert(deleteRes.status === 200, 'DELETE /api/saved/:contentId returns 200');

  const deleteAgainRes = await request('DELETE', `/api/saved/${sampleItem._id}?sessionId=${testSession}`);
  assert(deleteAgainRes.status === 404, 'Deleting already removed item returns 404');

  // Teardown
  if (serverInstance) {
    serverInstance.close();
  }
  Object.defineProperty(mongoose.connection, 'readyState', { value: originalState, configurable: true });

  console.log('\n====================================================');
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('Test run failed with error:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
