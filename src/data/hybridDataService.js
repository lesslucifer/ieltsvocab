// Hybrid data service that uses Firebase when authenticated, localStorage otherwise
import * as firebaseService from '../firebase/firestoreService';
import * as localStorageService from '../utils/storage';
import { getCurrentUser } from '../firebase/authService';
import { initializeVocabulary } from './vocabularyData';

// Check if user is authenticated
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

const getUserId = () => {
  const user = getCurrentUser();
  return user ? user.uid : null;
};

// Initialize user data
export const initializeUserData = async () => {
  if (isAuthenticated()) {
    const userId = getUserId();
    const result = await firebaseService.initializeUserData(userId);
    if (result.success) {
      // Sync data to localStorage for offline use
      const { vocabulary } = await firebaseService.getUserVocabulary(userId);
      localStorageService.saveVocabulary(vocabulary);
    }
    return result;
  } else {
    // Use localStorage
    const stored = localStorageService.loadVocabulary();
    return { success: true, isLocal: true };
  }
};

// Get vocabulary
export const getVocabulary = async () => {
  if (isAuthenticated()) {
    const userId = getUserId();
    const { vocabulary, error } = await firebaseService.getUserVocabulary(userId);

    if (!error) {
      // Cache in localStorage
      localStorageService.saveVocabulary(vocabulary);
      return vocabulary;
    }

    // Fallback to localStorage on error
    return localStorageService.loadVocabulary();
  } else {
    // Load from localStorage, initialize only if empty
    let vocabulary = localStorageService.loadVocabulary();
    console.log('hybridDataService - Loaded from storage:', vocabulary?.length, 'words');

    // Only initialize if vocabulary is completely empty
    if (!vocabulary || vocabulary.length === 0) {
      console.log('🔄 Initializing vocabulary database...');
      vocabulary = initializeVocabulary();
      console.log('✅ New vocabulary loaded:', vocabulary?.length, 'words');
    } else {
      console.log('✅ Using existing vocabulary:', vocabulary?.length, 'words');
    }

    return vocabulary;
  }
};

// Update word status
export const updateWordStatus = async (wordId, status) => {
  // Update localStorage immediately for offline support
  localStorageService.updateWord(wordId, { status });

  if (isAuthenticated()) {
    const userId = getUserId();
    await firebaseService.updateWordStatus(userId, wordId, status);
  }
};

// Increment review count
export const incrementReviewCount = async (wordId) => {
  // Update localStorage immediately
  localStorageService.incrementWordReview(wordId);
  localStorageService.incrementDailyProgress('reviewCount', 1);

  if (isAuthenticated()) {
    const userId = getUserId();
    await firebaseService.incrementReviewCount(userId, wordId);
    await firebaseService.updateDailyProgress(userId);
  }
};

// Save study session
export const saveStudySession = async (wordsStudied, duration) => {
  // Update localStorage
  localStorageService.incrementDailyProgress('wordsStudied', wordsStudied);
  localStorageService.incrementDailyProgress('studyTime', duration);

  const stats = localStorageService.loadUserStats();
  localStorageService.saveUserStats({
    ...stats,
    totalStudyTime: stats.totalStudyTime + duration,
    lastStudyDate: new Date().toISOString()
  });

  if (isAuthenticated()) {
    const userId = getUserId();
    await firebaseService.saveStudySession(userId, wordsStudied, duration);
  }
};

// Save quiz result
export const saveQuizResult = async (score, totalQuestions, duration, wordsQuizzed) => {
  // Update localStorage
  localStorageService.incrementDailyProgress('quizzesTaken', 1);

  const stats = localStorageService.loadUserStats();
  localStorageService.saveUserStats({
    ...stats,
    totalQuizzesTaken: stats.totalQuizzesTaken + 1,
    lastStudyDate: new Date().toISOString()
  });

  if (isAuthenticated()) {
    const userId = getUserId();
    await firebaseService.saveQuizResult(userId, score, totalQuestions, duration, wordsQuizzed);
  }

  return {
    score,
    totalQuestions,
    accuracy: Math.round((score / totalQuestions) * 100),
    duration,
    wordsQuizzed
  };
};

// Get user stats
export const getUserStats = async () => {
  if (isAuthenticated()) {
    const userId = getUserId();
    const { stats, error } = await firebaseService.getUserStats(userId);

    if (!error && stats) {
      // Update localStorage cache
      localStorageService.saveUserStats(stats);
      return stats;
    }
  }

  // Fallback to localStorage
  return localStorageService.loadUserStats();
};
