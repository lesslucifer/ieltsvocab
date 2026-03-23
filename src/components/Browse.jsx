import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import './Browse.css';
import { updateWordStatus, incrementReviewCount } from '../data/hybridDataService';

const Browse = ({ vocabulary, refreshVocabulary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [wordSearchTerm, setWordSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Display 15 words per page
  const wordsPerPage = 15;

  // Text-to-speech function - memoized
  const speakWord = useCallback((word) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Open flashcard modal - memoized
  const handleWordClick = useCallback((word) => {
    setSelectedWord(word);
    setIsFlipped(false);
  }, []);

  // Close flashcard modal - memoized
  const handleCloseModal = useCallback(() => {
    setSelectedWord(null);
    setIsFlipped(false);
  }, []);

  // Handle "I Knew It" in modal - memoized
  const handleKnewIt = useCallback(async () => {
    if (!selectedWord) return;
    await updateWordStatus(selectedWord.id, 'mastered');
    await incrementReviewCount(selectedWord.id);
    await refreshVocabulary();
    handleCloseModal();
  }, [selectedWord, refreshVocabulary, handleCloseModal]);

  // Handle "Study Again" in modal - memoized
  const handleStudyAgain = useCallback(async () => {
    if (!selectedWord) return;
    await updateWordStatus(selectedWord.id, 'learning');
    await incrementReviewCount(selectedWord.id);
    await refreshVocabulary();
    handleCloseModal();
  }, [selectedWord, refreshVocabulary, handleCloseModal]);

  const filters = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'Education & Learning', label: 'Education' },
    { id: 'Environment & Climate', label: 'Environment' },
    { id: 'Technology & Digital Life', label: 'Technology' },
    { id: 'Health & Lifestyle', label: 'Health' },
    { id: 'Work & Business', label: 'Business' },
    { id: '6.0', label: 'Band 6.0-6.5' },
    { id: '7.0', label: 'Band 7.0-7.5' },
    { id: '8.0', label: 'Band 8.0-8.5' },
    { id: '9.0', label: 'Band 9.0' }
  ], []);

  // Calculate real album data from vocabulary - memoized for performance
  const getAlbumData = useCallback((category = null, bandLevel = null) => {
    let words = vocabulary;

    if (category) {
      words = vocabulary.filter(w => w.category === category);
    } else if (bandLevel) {
      words = vocabulary.filter(w => w.bandLevel === bandLevel);
    }

    const totalWords = words.length;
    const masteredWords = words.filter(w => w.status === 'mastered').length;
    const learnedPercentage = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

    return { totalWords, learnedPercentage };
  }, [vocabulary]);

  // Memoize album statistics calculations
  const albumStats = useMemo(() => ({
    education: getAlbumData('Education & Learning'),
    environment: getAlbumData('Environment & Climate'),
    technology: getAlbumData('Technology & Digital Life'),
    health: getAlbumData('Health & Lifestyle'),
    business: getAlbumData('Work & Business'),
    society: getAlbumData('Society & Community'),
    travel: getAlbumData('Travel & Globalization'),
    science: getAlbumData('Science & Innovation'),
    media: getAlbumData('Media & Communication'),
    urban: getAlbumData('Urban Development'),
    band60: getAlbumData(null, '6.0'),
    band65: getAlbumData(null, '6.5'),
    band70: getAlbumData(null, '7.0'),
    band75: getAlbumData(null, '7.5'),
    band80: getAlbumData(null, '8.0'),
    band85: getAlbumData(null, '8.5'),
    band90: getAlbumData(null, '9.0')
  }), [getAlbumData]);

  // Album/Category data with real statistics - memoized
  const albums = useMemo(() => [
    {
      id: 1,
      title: 'Education & Learning',
      totalWords: albumStats.education.totalWords,
      category: 'Education & Learning',
      learnedPercentage: albumStats.education.learnedPercentage
    },
    {
      id: 2,
      title: 'Environment & Climate',
      totalWords: albumStats.environment.totalWords,
      category: 'Environment & Climate',
      learnedPercentage: albumStats.environment.learnedPercentage
    },
    {
      id: 3,
      title: 'Technology & Digital Life',
      totalWords: albumStats.technology.totalWords,
      category: 'Technology & Digital Life',
      learnedPercentage: albumStats.technology.learnedPercentage
    },
    {
      id: 4,
      title: 'Health & Lifestyle',
      totalWords: albumStats.health.totalWords,
      category: 'Health & Lifestyle',
      learnedPercentage: albumStats.health.learnedPercentage
    },
    {
      id: 5,
      title: 'Work & Business',
      totalWords: albumStats.business.totalWords,
      category: 'Work & Business',
      learnedPercentage: albumStats.business.learnedPercentage
    },
    {
      id: 6,
      title: 'Society & Community',
      totalWords: albumStats.society.totalWords,
      category: 'Society & Community',
      learnedPercentage: albumStats.society.learnedPercentage
    },
    {
      id: 7,
      title: 'Travel & Globalization',
      totalWords: albumStats.travel.totalWords,
      category: 'Travel & Globalization',
      learnedPercentage: albumStats.travel.learnedPercentage
    },
    {
      id: 8,
      title: 'Science & Innovation',
      totalWords: albumStats.science.totalWords,
      category: 'Science & Innovation',
      learnedPercentage: albumStats.science.learnedPercentage
    },
    {
      id: 9,
      title: 'Media & Communication',
      totalWords: albumStats.media.totalWords,
      category: 'Media & Communication',
      learnedPercentage: albumStats.media.learnedPercentage
    },
    {
      id: 10,
      title: 'Urban Development',
      totalWords: albumStats.urban.totalWords,
      category: 'Urban Development',
      learnedPercentage: albumStats.urban.learnedPercentage
    },
    {
      id: 11,
      title: 'Band 6.0-6.5 (Basic)',
      totalWords: albumStats.band60.totalWords + albumStats.band65.totalWords,
      bandLevel: '6.0',
      learnedPercentage: Math.round(
        ((albumStats.band60.totalWords * albumStats.band60.learnedPercentage + albumStats.band65.totalWords * albumStats.band65.learnedPercentage) /
        (albumStats.band60.totalWords + albumStats.band65.totalWords)) || 0
      )
    },
    {
      id: 12,
      title: 'Band 7.0-7.5 (Intermediate)',
      totalWords: albumStats.band70.totalWords + albumStats.band75.totalWords,
      bandLevel: '7.0',
      learnedPercentage: Math.round(
        ((albumStats.band70.totalWords * albumStats.band70.learnedPercentage + albumStats.band75.totalWords * albumStats.band75.learnedPercentage) /
        (albumStats.band70.totalWords + albumStats.band75.totalWords)) || 0
      )
    },
    {
      id: 13,
      title: 'Band 8.0-8.5 (Advanced)',
      totalWords: albumStats.band80.totalWords + albumStats.band85.totalWords,
      bandLevel: '8.0',
      learnedPercentage: Math.round(
        ((albumStats.band80.totalWords * albumStats.band80.learnedPercentage + albumStats.band85.totalWords * albumStats.band85.learnedPercentage) /
        (albumStats.band80.totalWords + albumStats.band85.totalWords)) || 0
      )
    },
    {
      id: 14,
      title: 'Band 9.0 (Expert)',
      totalWords: albumStats.band90.totalWords,
      bandLevel: '9.0',
      learnedPercentage: albumStats.band90.learnedPercentage
    },
    {
      id: 15,
      title: 'All Words',
      totalWords: vocabulary.length,
      category: null,
      bandLevel: null,
      learnedPercentage: vocabulary.length > 0
        ? Math.round((vocabulary.filter(w => w.status === 'mastered').length / vocabulary.length) * 100)
        : 0
    }
  ], [albumStats, vocabulary]);

  // Memoize filtered albums for performance
  const filteredAlbums = useMemo(() => albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;

    // Category filters
    if ([
      'Education & Learning',
      'Environment & Climate',
      'Technology & Digital Life',
      'Health & Lifestyle',
      'Work & Business',
      'Society & Community',
      'Travel & Globalization',
      'Science & Innovation',
      'Media & Communication',
      'Urban Development'
    ].includes(activeFilter)) {
      return matchesSearch && album.category === activeFilter;
    }

    // Band level filters
    if (['6.0', '7.0', '8.0', '9.0'].includes(activeFilter)) {
      return matchesSearch && album.bandLevel === activeFilter;
    }

    return matchesSearch;
  }), [albums, searchTerm, activeFilter]);

  const totalWords = useMemo(() => vocabulary.length, [vocabulary]);

  // Memoize click handlers
  const handleAlbumClick = useCallback((album) => {
    setSelectedAlbum(album);
    setCurrentPage(1);
    setWordSearchTerm('');
    setStatusFilter('all');
  }, []);

  const handleBackToAlbums = useCallback(() => {
    setSelectedAlbum(null);
    setCurrentPage(1);
  }, []);

  // Get words for selected album - memoized
  const albumWords = useMemo(() => {
    if (!selectedAlbum) return [];

    if (selectedAlbum.category) {
      return vocabulary.filter(w => w.category === selectedAlbum.category);
    } else if (selectedAlbum.bandLevel) {
      // Handle band level ranges
      if (selectedAlbum.bandLevel === '6.0') {
        return vocabulary.filter(w => w.bandLevel === '6.0' || w.bandLevel === '6.5');
      } else if (selectedAlbum.bandLevel === '7.0') {
        return vocabulary.filter(w => w.bandLevel === '7.0' || w.bandLevel === '7.5');
      } else if (selectedAlbum.bandLevel === '8.0') {
        return vocabulary.filter(w => w.bandLevel === '8.0' || w.bandLevel === '8.5');
      } else if (selectedAlbum.bandLevel === '9.0') {
        return vocabulary.filter(w => w.bandLevel === '9.0');
      }
    }

    // "All Words" album
    return vocabulary;
  }, [selectedAlbum, vocabulary]);

  // Memoize word filtering for performance with large datasets
  const filteredWords = useMemo(() =>
    albumWords.filter(word =>
      word.word.toLowerCase().includes(wordSearchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(wordSearchTerm.toLowerCase())
    ), [albumWords, wordSearchTerm]);

  const statusFilters = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'mastered', label: 'Mastered' },
    { id: 'learning', label: 'Learning' },
    { id: 'not-started', label: 'Not Started' }
  ], []);

  // Memoize status filtering
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return filteredWords;
    if (statusFilter === 'not-started') {
      return filteredWords.filter(w => !w.status || w.status === 'struggling');
    }
    return filteredWords.filter(w => w.status === statusFilter);
  }, [filteredWords, statusFilter]);

  // If an album is selected, show the word list as table
  if (selectedAlbum) {
    const learnedPercentage = selectedAlbum.learnedPercentage;

    // Pagination logic
    const totalPages = Math.ceil(filteredByStatus.length / wordsPerPage);
    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    const currentWords = filteredByStatus.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
      setCurrentPage(page);
      const container = document.querySelector('.word-list-container');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    return (
      <div className="browse browse-with-pagination">
        <div className="browse-header">
          <div className="album-header-row">
            <svg className="back-icon" viewBox="0 0 24 24" onClick={handleBackToAlbums} style={{cursor: 'pointer'}}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <h1 className="album-title">{selectedAlbum.title}</h1>
            <span className="word-count">{albumWords.length} words</span>
            <div style={{flex: 1}}></div>
            <div className="learned-badge">
              <span>{learnedPercentage}% learned</span>
            </div>
          </div>

          <div className="search-bar">
            <svg className="icon icon-sm search-icon" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search words in this album..."
              value={wordSearchTerm}
              onChange={(e) => setWordSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-row">
            {statusFilters.map(filter => (
              <button
                key={filter.id}
                className={`chip ${statusFilter === filter.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="word-list-container">
          <div className="word-table">
            <div className="table-header">
              <div className="th-word">Word</div>
              <div className="th-type">Type</div>
              <div className="th-definition">Definition</div>
              <div className="th-status">Status</div>
              <div className="th-accuracy">Accuracy</div>
            </div>
            {currentWords.map((word, index) => (
              <div key={word.id} className={`table-row ${index % 2 === 1 ? 'alt' : ''}`}>
                <div className="td-word">
                  <span className="word-text" onClick={() => handleWordClick(word)}>{word.word}</span>
                  <button
                    className="speaker-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(word.word);
                    }}
                    title="Pronounce word"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </button>
                </div>
                <div className="td-type">{word.partOfSpeech.slice(0, 4)}</div>
                <div className="td-definition">{word.definition}</div>
                <div className="td-status">
                  <span className={`status-label ${word.status}`}>
                    {word.status === 'mastered' ? 'Mastered' : word.status === 'learning' ? 'Learning' : 'Not Started'}
                  </span>
                </div>
                <div className="td-accuracy">
                  {word.status === 'mastered' ? '95%' : word.status === 'learning' ? '72%' : '0%'}
                </div>
              </div>
            ))}
          </div>

          {filteredByStatus.length === 0 && (
            <div className="empty-state">
              <p>No words found matching your search.</p>
            </div>
          )}
        </div>

        {filteredByStatus.length > 0 && totalPages > 1 && (
          <div className="pagination-fixed">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="pagination-numbers">
              {currentPage > 1 && (
                <button className="page-number" onClick={() => handlePageChange(1)}>
                  1
                </button>
              )}
              {currentPage > 2 && totalPages > 3 && <span className="pagination-dots">...</span>}

              <button className="page-number active">{currentPage}</button>

              {currentPage < totalPages - 1 && totalPages > 3 && <span className="pagination-dots">...</span>}
              {currentPage < totalPages && (
                <button className="page-number" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              )}
            </div>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* Flashcard Modal */}
        {selectedWord && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="flashcard-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                <div className="flashcard-front">
                  <div className="card-header">
                    <span className="band-label">Band {selectedWord.bandLevel}</span>
                    <span className="category-label">{selectedWord.category}</span>
                  </div>
                  <h2 className="card-word">{selectedWord.word}</h2>
                  <p className="card-pronunciation">{selectedWord.pronunciation}</p>
                  <button
                    className="speaker-btn-large"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(selectedWord.word);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </button>
                  <p className="tap-hint">Tap to see definition</p>
                </div>

                <div className="flashcard-back">
                  <div className="card-header">
                    <span className="part-of-speech">{selectedWord.partOfSpeech}</span>
                  </div>
                  <h3 className="card-word-small">{selectedWord.word}</h3>
                  <p className="card-definition">{selectedWord.definition}</p>
                  {selectedWord.exampleSentence && (
                    <div className="card-example">
                      <p className="example-label">Example:</p>
                      <p className="example-text">"{selectedWord.exampleSentence}"</p>
                    </div>
                  )}
                  <p className="tap-hint">Tap to flip back</p>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleStudyAgain}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Study Again
                </button>
                <button className="btn-primary" onClick={handleKnewIt}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  I Knew It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default album grid view
  return (
    <div className="browse">
      <div className="browse-header">
        <div className="header-title">
          <h1>Browse Vocabulary</h1>
          <span className="word-count">{totalWords.toLocaleString()} words</span>
        </div>

        <div className="search-bar">
          <svg className="icon icon-sm search-icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search words, definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`chip ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="album-grid">
        {filteredAlbums.map(album => (
          <div
            key={album.id}
            className="album-card card"
            onClick={() => handleAlbumClick(album)}
          >
            <h3 className="album-title">{album.title}</h3>
            <p className="album-count">{album.totalWords} words</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${album.learnedPercentage}%` }}
              ></div>
            </div>
            <p className="progress-text">{album.learnedPercentage}% learned</p>
          </div>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="empty-state">
          <p>No collections found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Browse;
