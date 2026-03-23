import {
  saveVocabulary,
  loadVocabulary,
  updateWord,
  incrementWordReview,
  saveUserStats,
  loadUserStats,
  incrementDailyProgress,
  calculateStreak
} from '../utils/storage';
import ieltsVocabularyDatabase from './ieltsVocabularyComplete';

// Use comprehensive IELTS vocabulary database (1000 words)
export const defaultVocabulary = ieltsVocabularyDatabase;

// Initialize vocabulary in localStorage
export const initializeVocabulary = () => {
  const stored = loadVocabulary();

  if (!stored || stored.length === 0) {
    saveVocabulary(defaultVocabulary);
    return defaultVocabulary;
  }

  return stored;
};

// Update word status
export const updateWordStatus = (wordId, newStatus) => {
  const updatedVocab = updateWord(wordId, { status: newStatus });

  // Update user stats
  if (newStatus === 'mastered') {
    const stats = loadUserStats();
    saveUserStats({
      ...stats,
      totalWordsLearned: stats.totalWordsLearned + 1
    });
  }

  return updatedVocab;
};

// Increment review count for a word
export const incrementReviewCount = (wordId) => {
  const updatedVocab = incrementWordReview(wordId);

  // Update daily progress
  incrementDailyProgress('reviewCount', 1);

  // Update user stats
  const stats = loadUserStats();
  const updatedStats = {
    totalReviews: stats.totalReviews + 1,
    lastStudyDate: new Date().toISOString()
  };

  // Update streak
  const streak = calculateStreak();
  if (streak > stats.currentStreak) {
    updatedStats.currentStreak = streak;
  }
  if (streak > stats.longestStreak) {
    updatedStats.longestStreak = streak;
  }

  saveUserStats({ ...stats, ...updatedStats });

  return updatedVocab;
};

// Save study session
export const saveStudySession = (wordsStudied, duration) => {
  incrementDailyProgress('wordsStudied', wordsStudied);
  incrementDailyProgress('studyTime', duration);

  const stats = loadUserStats();
  saveUserStats({
    ...stats,
    totalStudyTime: stats.totalStudyTime + duration,
    lastStudyDate: new Date().toISOString()
  });
};

// Save quiz result
export const saveQuizResult = (score, totalQuestions, duration, wordsQuizzed) => {
  incrementDailyProgress('quizzesTaken', 1);

  const stats = loadUserStats();
  saveUserStats({
    ...stats,
    totalQuizzesTaken: stats.totalQuizzesTaken + 1,
    lastStudyDate: new Date().toISOString()
  });

  return {
    score,
    totalQuestions,
    accuracy: Math.round((score / totalQuestions) * 100),
    duration,
    wordsQuizzed
  };
};

// Helper function to get vocabulary
export const getVocabulary = () => {
  return loadVocabulary();
};
