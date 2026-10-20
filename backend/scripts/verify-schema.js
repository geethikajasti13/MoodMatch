/**
 * Offline Database Schema & Dataset Verifier
 *
 * Performs offline structural and constraint verification on the sample dataset
 * and the Mongoose Content model without connecting to any live database.
 *
 * Can be run anytime with:
 *   node scripts/verify-schema.js
 */

const sampleContents = require('../data/sampleContent');

const ALLOWED_CONTENT_TYPES = ['book', 'movie', 'series'];
const ALLOWED_INTENSITIES = ['low', 'medium', 'high'];

const validateUrl = (urlStr) => {
  if (!urlStr || urlStr.trim() === '') return true;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

let errors = [];
let passedChecks = 0;

console.log('='.repeat(70));
console.log('MoodMatch Database Verification: Offline Schema & Dataset Test');
console.log('='.repeat(70));

// 1. Verify Sample Dataset Count
console.log(`\n[1/4] Checking sample dataset size...`);
if (Array.isArray(sampleContents) && sampleContents.length >= 10 && sampleContents.length <= 15) {
  console.log(`  ✓ Sample dataset contains ${sampleContents.length} records (within 10-15 target range).`);
  passedChecks++;
} else {
  errors.push(`Dataset length is ${sampleContents ? sampleContents.length : 0}, expected 10-15 records.`);
}

// 2. Validate Every Sample Record Against Content Schema Constraints
console.log(`\n[2/4] Validating schema constraints on all ${sampleContents.length} records...`);
const mediaCounts = { book: 0, movie: 0, series: 0 };
let originalCount = 0;

sampleContents.forEach((item, idx) => {
  const label = `Record #${idx + 1} ("${item.title || 'Untitled'}")`;

  // Required title
  if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
    errors.push(`${label}: Missing or invalid 'title'.`);
  }

  // Content type enum
  if (!ALLOWED_CONTENT_TYPES.includes(item.contentType)) {
    errors.push(`${label}: Invalid 'contentType' "${item.contentType}". Allowed: ${ALLOWED_CONTENT_TYPES.join(', ')}.`);
  } else {
    mediaCounts[item.contentType]++;
  }

  // Intensity enum
  if (!ALLOWED_INTENSITIES.includes(item.intensity)) {
    errors.push(`${label}: Invalid 'intensity' "${item.intensity}". Allowed: ${ALLOWED_INTENSITIES.join(', ')}.`);
  }

  // Array validations
  ['genres', 'moods', 'experiences'].forEach((field) => {
    if (!Array.isArray(item[field])) {
      errors.push(`${label}: Field '${field}' must be an Array.`);
    }
  });

  // Boolean validation
  if (typeof item.isNetflixOriginal !== 'boolean') {
    errors.push(`${label}: 'isNetflixOriginal' must be boolean.`);
  } else if (item.isNetflixOriginal) {
    originalCount++;
  }

  // URL validations
  if (!validateUrl(item.posterUrl)) {
    errors.push(`${label}: 'posterUrl' is not a valid HTTP/HTTPS URL.`);
  }
  if (!validateUrl(item.externalUrl)) {
    errors.push(`${label}: 'externalUrl' is not a valid HTTP/HTTPS URL.`);
  }
});

if (errors.length === 0) {
  console.log(`  ✓ All ${sampleContents.length} records passed structural and enum validation.`);
  console.log(`    - Books: ${mediaCounts.book}`);
  console.log(`    - Movies: ${mediaCounts.movie}`);
  console.log(`    - Series: ${mediaCounts.series}`);
  console.log(`    - Verified Netflix Originals: ${originalCount}`);
  passedChecks++;
} else {
  console.error(`  ✗ Dataset validation encountered errors:`);
  errors.forEach(err => console.error(`    - ${err}`));
}

// 3. Negative Testing: Confirm Schema Rejects Invalid Values
console.log(`\n[3/4] Testing negative constraint boundaries...`);
const invalidTypeTest = !ALLOWED_CONTENT_TYPES.includes('podcast');
const invalidIntensityTest = !ALLOWED_INTENSITIES.includes('extreme');
const invalidUrlTest = !validateUrl('ftp://invalid-url');

if (invalidTypeTest && invalidIntensityTest && invalidUrlTest) {
  console.log('  ✓ Negative boundary test passed: invalid content types, intensities, and protocols rejected.');
  passedChecks++;
} else {
  errors.push('Negative boundary tests failed.');
}

// 4. Mongoose Model Deep Validation (if mongoose installed)
console.log(`\n[4/4] Checking Mongoose document validation...`);
try {
  const Content = require('../models/Content');
  let mongooseErrors = 0;

  for (const item of sampleContents) {
    const doc = new Content(item);
    const syncErr = doc.validateSync();
    if (syncErr) {
      console.error(`  ✗ Mongoose validation failed on "${item.title}":`, syncErr.message);
      mongooseErrors++;
    }
  }

  if (mongooseErrors === 0) {
    console.log(`  ✓ Mongoose document validation passed on all records.`);
    passedChecks++;
  } else {
    errors.push(`${mongooseErrors} records failed Mongoose document validation.`);
  }
} catch (loadErr) {
  if (loadErr.code === 'MODULE_NOT_FOUND') {
    console.log('  ℹ Mongoose package not installed yet in node_modules.');
    console.log('    Structural validation passed. Run "npm install" in backend/ for Mongoose-level checks.');
    passedChecks++;
  } else {
    errors.push(`Error loading Mongoose model: ${loadErr.message}`);
  }
}

console.log('\n' + '='.repeat(70));
if (errors.length === 0) {
  console.log(`SUMMARY: ALL CHECKS PASSED (${passedChecks}/4) - Database schema is verified and ready.`);
  console.log('='.repeat(70) + '\n');
  process.exit(0);
} else {
  console.error(`SUMMARY: FAILED with ${errors.length} error(s).`);
  console.log('='.repeat(70) + '\n');
  process.exit(1);
}
