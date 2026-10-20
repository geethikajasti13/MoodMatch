const Content = require('../models/Content');
const { interpretMood } = require('../services/moodService');

/**
 * Calculates relevance score and data-grounded match reason for a content item.
 * Scoring rules:
 * - Matching a mood tag: +3 points per match
 * - Matching a desired experience: +2 points per match
 * - Matching intensity: +1 point
 *
 * @param {object} content - Mongoose Content document or plain object
 * @param {string[]} inferredMoods - Inferred mood tags
 * @param {string[]} desiredExperiences - Inferred desired experiences
 * @param {string} targetIntensity - Target intensity ('low', 'medium', 'high')
 * @returns {object} { score, matchedMoods, matchedExperiences, matchedIntensity, matchReason }
 */
function calculateMatchScore(content, inferredMoods = [], desiredExperiences = [], targetIntensity = 'medium') {
  let score = 0;
  const matchedMoods = [];
  const matchedExperiences = [];
  let matchedIntensity = false;

  const contentMoods = (content.moods || []).map((m) => m.toLowerCase());
  const contentExperiences = (content.experiences || []).map((e) => e.toLowerCase());

  // Mood tag matching (+3 each)
  for (const mood of inferredMoods) {
    if (contentMoods.includes(mood.toLowerCase())) {
      score += 3;
      if (!matchedMoods.includes(mood)) {
        matchedMoods.push(mood);
      }
    }
  }

  // Desired experience matching (+2 each)
  for (const exp of desiredExperiences) {
    if (contentExperiences.includes(exp.toLowerCase())) {
      score += 2;
      if (!matchedExperiences.includes(exp)) {
        matchedExperiences.push(exp);
      }
    }
  }

  // Intensity matching (+1)
  if (
    targetIntensity &&
    content.intensity &&
    content.intensity.toLowerCase() === targetIntensity.toLowerCase()
  ) {
    score += 1;
    matchedIntensity = true;
  }

  // Data-grounded match explanation based strictly on actual matches
  let matchReason = '';
  if (matchedExperiences.length > 0 && matchedMoods.length > 0) {
    matchReason = `Matches your requested ${matchedExperiences.join(' & ')} experience and ${matchedMoods.join(' & ')} mood.`;
  } else if (matchedExperiences.length > 0) {
    matchReason = `Matches your requested ${matchedExperiences.join(' & ')} experience.`;
  } else if (matchedMoods.length > 0) {
    matchReason = `Curated for feeling ${matchedMoods.join(' & ')}.`;
  } else if (matchedIntensity) {
    matchReason = `Matches your preferred ${targetIntensity} intensity level.`;
  } else {
    matchReason = `Featured ${content.contentType || 'content'} recommendation.`;
  }

  return {
    score,
    matchedMoods,
    matchedExperiences,
    matchedIntensity,
    matchReason
  };
}

/**
 * POST /api/recommend
 * Recommends content based on natural language user feeling.
 */
async function getRecommendations(req, res, next) {
  try {
    const { response, contentType } = req.body;

    // 1. Validation: response must be non-empty string with max 1000 characters
    if (response === undefined || response === null) {
      return res.status(400).json({
        success: false,
        error: "The 'response' field is required."
      });
    }

    if (typeof response !== 'string') {
      return res.status(400).json({
        success: false,
        error: "The 'response' field must be a string."
      });
    }

    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      return res.status(400).json({
        success: false,
        error: "The 'response' field cannot be empty."
      });
    }

    if (trimmedResponse.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'The response exceeds maximum permitted length of 1000 characters.'
      });
    }

    // Validation: contentType must be 'all', 'book', 'movie', or 'series'
    const allowedTypes = ['all', 'book', 'movie', 'series'];
    const requestedType = (contentType || 'all').toString().trim().toLowerCase();
    if (!allowedTypes.includes(requestedType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid contentType '${contentType}'. Allowed values are: all, book, movie, series.`
      });
    }

    // 2. Interpret the response using moodService
    const { inferredMoods, desiredExperiences, intensity } = interpretMood(trimmedResponse);

    // 3. Build MongoDB query
    const baseFilter = {};
    if (requestedType !== 'all') {
      baseFilter.contentType = requestedType;
    }

    // 4. Retrieve candidate records
    const orConditions = [];
    if (inferredMoods.length > 0) {
      orConditions.push({ moods: { $in: inferredMoods } });
    }
    if (desiredExperiences.length > 0) {
      orConditions.push({ experiences: { $in: desiredExperiences } });
    }

    let candidates = [];
    if (orConditions.length > 0) {
      const query = {
        ...baseFilter,
        $or: orConditions
      };
      candidates = await Content.find(query).lean();
    }

    // 5. Score and rank candidates
    let scoredList = candidates
      .map((item) => {
        const { score, matchReason } = calculateMatchScore(
          item,
          inferredMoods,
          desiredExperiences,
          intensity
        );
        return {
          _id: item._id,
          title: item.title,
          contentType: item.contentType,
          platform: item.platform,
          isNetflixOriginal: item.isNetflixOriginal,
          genres: item.genres,
          moods: item.moods,
          experiences: item.experiences,
          intensity: item.intensity,
          description: item.description,
          posterUrl: item.posterUrl,
          externalUrl: item.externalUrl,
          matchScore: score,
          matchReason
        };
      })
      .filter((item) => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    // 6. Handle fallback if no exact mood/experience matches found
    if (scoredList.length === 0) {
      // Fetch fallback content matching requested content type
      const fallbackItems = await Content.find(baseFilter).limit(6).lean();

      if (fallbackItems.length > 0) {
        scoredList = fallbackItems.map((item) => {
          const { score, matchReason } = calculateMatchScore(
            item,
            inferredMoods,
            desiredExperiences,
            intensity
          );
          return {
            _id: item._id,
            title: item.title,
            contentType: item.contentType,
            platform: item.platform,
            isNetflixOriginal: item.isNetflixOriginal,
            genres: item.genres,
            moods: item.moods,
            experiences: item.experiences,
            intensity: item.intensity,
            description: item.description,
            posterUrl: item.posterUrl,
            externalUrl: item.externalUrl,
            matchScore: score,
            matchReason:
              score > 0
                ? matchReason
                : `Suggested ${item.contentType} pick from our catalog based on broad appeal.`
          };
        });
      }
    }

    // Limit top recommendations to 10
    const topRecommendations = scoredList.slice(0, 10);

    return res.status(200).json({
      inferredMoods,
      desiredExperiences,
      intensity,
      recommendations: topRecommendations
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecommendations,
  calculateMatchScore
};
