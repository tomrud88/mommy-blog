"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./search.module.css";
import PostCard from "../../postCard/PostCard";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      await performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Błąd podczas wyszukiwania");
      }

      const data = await response.json();
      setResults(data.posts || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setError("Wystąpił błąd podczas wyszukiwania");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.trim().length >= 2 && results.length > 0) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setError("");
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInput}>
        <div className={styles.searchIcon}>🔍</div>
        <input
          type="text"
          placeholder="Szukaj postów..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={styles.input}
          aria-label="Wyszukaj posty"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
          role="combobox"
        />
        {query && (
          <button
            onClick={clearSearch}
            className={styles.clearButton}
            aria-label="Wyczyść wyszukiwanie"
            type="button"
          >
            ✕
          </button>
        )}
        {isLoading && (
          <div className={styles.loadingSpinner} aria-label="Wyszukiwanie...">
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results"
          className={styles.searchResults}
          role="listbox"
          aria-label="Wyniki wyszukiwania"
        >
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {!error && results.length === 0 && !isLoading && (
            <div className={styles.noResults}>
              Nie znaleziono postów dla &quot;{query}&quot;
            </div>
          )}

          {!error && results.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                Znaleziono {results.length}{" "}
                {results.length === 1 ? "post" : "postów"}
              </div>
              <div className={styles.resultsList}>
                {results.map((post) => (
                  <div key={post.id} className={styles.searchResultItem}>
                    <PostCard item={post} compact={true} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
