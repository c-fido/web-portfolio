import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookshelf.css';

// Update mock books to have proper structure
const mockBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://via.placeholder.com/150x200?text=The+Great+Gatsby",
    description: "A classic novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    tags: ["Classic", "Fiction", "American Literature"],
    rating: 4
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://via.placeholder.com/150x200?text=To+Kill+a+Mockingbird",
    description: "A powerful story about racial injustice and moral growth in the American South.",
    tags: ["Classic", "Fiction", "Drama"],
    rating: 5
  },
  {
    title: "1984",
    author: "George Orwell",
    cover: "https://via.placeholder.com/150x200?text=1984",
    description: "A dystopian novel about surveillance, totalitarianism, and the loss of individuality.",
    tags: ["Dystopian", "Science Fiction", "Political"],
    rating: 4
  }
];

function Bookshelf() {
  const [readingBooks, setReadingBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const navigate = useNavigate();

  // Navigate back to main portfolio
  const goBackHome = () => {
    navigate('/');
  };

  useEffect(() => {
    // For now, let's use the actual data structure we saw from your API response
    // This will show your actual book while we debug the CORS issue
    const sampleBooks = [
      {
        title: "Oathbringer",
        cover: "https://assets.hardcover.app/edition/21953653/ad88cb8a8339d5c7aadcccaee4add1144bf80c45.jpeg",
        tags: ["Fantasy", "Fiction", "Science Fiction"],
        rating: null
      }
    ];

    // Set the sample book in reading for now
    setReadingBooks(sampleBooks);
    setWantToReadBooks([]);
    setReadBooks([]);

    // Also try the API call
    fetchBooksFromAPI();
  }, []);

  // Cursor follow effect
  useEffect(() => {
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const updateCursor = (e) => {
      // Keep cursor glow visible but dimmed when modal is open
      if (selectedBook) {
        cursorGlow.style.opacity = '0.3'; // Dimmed instead of hidden
      } else {
        cursorGlow.style.opacity = '1'; // Full opacity when no modal
      }

      // Always update cursor position
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    };

    // Add mousemove listener
    document.addEventListener('mousemove', updateCursor);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      if (cursorGlow && cursorGlow.parentNode) {
        cursorGlow.parentNode.removeChild(cursorGlow);
      }
    };
  }, [selectedBook]); // Add selectedBook as dependency

  // Window resize listener for responsive book chunking
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to fetch books from API for each category
  const fetchBooksFromAPI = async () => {
    setLoading(true);
    try {
      // Fixed queries - remove 'summary' field and use only existing fields
      const readingQuery = `{
        me {
          user_books(where: {status_id: {_eq: 2}}, order_by: {date_added: asc}) {
            book {
              pages
              title
              cached_image
              cached_tags
              contributions {
                author{
                  name}}
            }
            rating
            status_id
          }
        }
      }`;

      // Fix the queries to use contributions consistently
      const wantToReadQuery = `{
        me {
          user_books(where: {status_id: {_eq: 1}}, order_by: {date_added: asc}) {
            book {
              title
              pages
              contributions {
                author {
                  name
                }
              }
              cached_image
              cached_tags
            }
            rating
            status_id
          }
        }
      }`;

      const readQuery = `{
        me {
          user_books(where: {status_id: {_eq: 3}}, order_by: {date_added: asc}) {
            book {
              title
              pages
              contributions {
                author {
                  name
                }
              }
              cached_image
              cached_tags
            }
            rating
            status_id
          }
        }
      }`;

      console.log('Starting API calls through proxy...');

      // Fetch all three categories through the proxy
      const fetchWithProxy = async (query, category) => {
        try {
          // Replace 'your-portfolio-name' with your actual Vercel deployment URL
          const apiUrl = 'https://web-portfolio-nine-nu.vercel.app/api/books';

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });

          console.log(`${category} proxy response status:`, response.status);

          if (!response.ok) {
            console.error(`${category} proxy error:`, response.status, response.statusText);
            const errorText = await response.text();
            console.error(`${category} proxy error body:`, errorText);
            return null;
          }

          const data = await response.json();
          console.log(`${category} proxy data:`, data);

          if (data.errors) {
            console.error(`${category} GraphQL errors:`, data.errors);
            data.errors.forEach((error, index) => {
              console.error(`${category} Error ${index + 1}:`, error.message);
              if (error.extensions) {
                console.error(`${category} Error details:`, error.extensions);
              }
            });
            return null;
          }

          return data;
        } catch (error) {
          console.error(`${category} proxy fetch error:`, error);
          return null;
        }
      };

      // Fetch all categories
      const [readingData, wantToReadData, readData] = await Promise.all([
        fetchWithProxy(readingQuery, 'Reading'),
        fetchWithProxy(wantToReadQuery, 'Want to Read'),
        fetchWithProxy(readQuery, 'Read')
      ]);

      // Update the book transformation to handle different possible field names
      // Process reading books
      if (readingData?.data?.me && Array.isArray(readingData.data.me) && readingData.data.me.length > 0) {
        const meData = readingData.data.me[0];
        console.log('📖 Processing reading books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedReading = meData.user_books.map(userBook => {
            console.log('📖 Raw book data:', userBook.book);

            // Fix the data extraction based on the actual API response
            const pages = userBook.book.pages || null;

            // Fix author extraction - it's in contributions, not authors
            let author = null;
            if (userBook.book.contributions && userBook.book.contributions.length > 0) {
              author = userBook.book.contributions[0].author.name;
            }

            console.log('📖 Processed pages:', pages);
            console.log('📖 Processed author:', author);

            return {
              title: userBook.book.title || 'Unknown Title',
              cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
              tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
              rating: userBook.rating,
              pages: pages,
              author: author
            };
          });
          setReadingBooks(transformedReading);
          console.log('✅ Set reading books:', transformedReading.length, 'books');
        } else {
          console.log('📖 Reading books array is empty');
          setReadingBooks([]);
        }
      } else {
        console.log('❌ Reading data structure check failed - setting empty array');
        setReadingBooks([]);
      }

      // Process want to read books  
      if (wantToReadData?.data?.me && Array.isArray(wantToReadData.data.me) && wantToReadData.data.me.length > 0) {
        const meData = wantToReadData.data.me[0];
        console.log('📚 Processing want to read books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedWantToRead = meData.user_books.map(userBook => {
            // Try both author structures in case the API is inconsistent
            let author = null;
            if (userBook.book.contributions && userBook.book.contributions.length > 0) {
              author = userBook.book.contributions[0].author.name;
            } else if (userBook.book.authors && userBook.book.authors.length > 0) {
              author = userBook.book.authors[0].name;
            }

            return {
              title: userBook.book.title || 'Unknown Title',
              cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
              tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
              rating: userBook.rating,
              pages: userBook.book.pages || null,
              author: author
            };
          });
          setWantToReadBooks(transformedWantToRead);
          console.log('✅ Set want to read books:', transformedWantToRead.length, 'books');
        } else {
          console.log('📚 Want to read books array is empty');
          setWantToReadBooks([]);
        }
      } else {
        console.log('❌ Want to read data structure check failed - setting empty array');
        setWantToReadBooks([]);
      }

      // Process read books with the same flexible author handling
      if (readData?.data?.me && Array.isArray(readData.data.me) && readData.data.me.length > 0) {
        const meData = readData.data.me[0];
        console.log('✅ Processing read books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedRead = meData.user_books.map(userBook => {
            // Try both author structures in case the API is inconsistent  
            let author = null;
            if (userBook.book.contributions && userBook.book.contributions.length > 0) {
              author = userBook.book.contributions[0].author.name;
            } else if (userBook.book.authors && userBook.book.authors.length > 0) {
              author = userBook.book.authors[0].name;
            }

            return {
              title: userBook.book.title || 'Unknown Title',
              cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
              tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
              rating: userBook.rating,
              pages: userBook.book.pages || null,
              author: author
            };
          });
          setReadBooks(transformedRead);
          console.log('✅ Set read books:', transformedRead.length, 'books');
        } else {
          console.log('✅ Read books array is empty');
          setReadBooks([]);
        }
      } else {
        console.log('❌ Read data structure check failed - setting empty array');
        setReadBooks([]);
      }

      // If all API calls failed, use mock data
      if (!readingData && !wantToReadData && !readData) {
        console.log('🔄 All API calls failed, keeping existing data or using mock data');
        if (readingBooks.length === 0 && wantToReadBooks.length === 0 && readBooks.length === 0) {
          setReadingBooks([mockBooks[0]]);
          setWantToReadBooks([mockBooks[1]]);
          setReadBooks([mockBooks[2]]);
        }
      }

    } catch (error) {
      console.error('❌ Major error fetching books:', error);
      // Only fallback to mock data if no books are currently displayed
      if (readingBooks.length === 0 && wantToReadBooks.length === 0 && readBooks.length === 0) {
        setReadingBooks([mockBooks[0]]);
        setWantToReadBooks([mockBooks[1]]);
        setReadBooks([mockBooks[2]]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle book clicks
  const handleBookClick = (book) => {
    console.log('📚 Clicked book object:', book);
    console.log('📚 Book title:', book.title);
    console.log('📚 Book pages:', book.pages);
    console.log('📚 Book pages type:', typeof book.pages);
    console.log('📚 Book tags:', book.tags);
    setSelectedBook(book);
  };

  // Add this function to close the modal
  const closeModal = () => {
    setSelectedBook(null);
  };

  // Add this function to handle clicking outside the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Helper function to split books into rows (chunks) - responsive
  const chunkBooksIntoRows = (books) => {
    // Determine books per row based on screen size
    const getBooksPerRow = () => {
      if (windowWidth <= 480) return 2; // Very small screens: 2 books per shelf
      if (windowWidth <= 768) return 3; // Small screens: 3 books per shelf  
      if (windowWidth <= 1024) return 4; // Medium screens: 4 books per shelf
      return 5; // Large screens: 5 books per shelf
    };

    const booksPerRow = getBooksPerRow();
    const chunks = [];
    for (let i = 0; i < books.length; i += booksPerRow) {
      chunks.push(books.slice(i, i + booksPerRow));
    }
    return chunks;
  };

  // Update the return statement to wrap each section properly
  return (
    <div className="bookshelf-page">
      <div className="bookshelf-header">
        <button onClick={goBackHome} className="back-button">← Back to Portfolio</button>
        <h1>My Bookshelf</h1>
        <div></div> {/* Spacer for flexbox alignment */}
      </div>

      {loading && <div className="loading">Loading your books...</div>}

      <div className="shelves-container">
        <div className="category">
          <h2>Currently Reading</h2>
          {readingBooks.length === 0 && !loading && (
            <div className="books">
              <div className="no-books">No books currently being read. Start a new adventure!</div>
            </div>
          )}
          {readingBooks.length > 0 && chunkBooksIntoRows(readingBooks).map((booksRow, rowIndex) => (
            <div key={rowIndex} className="books">
              {booksRow.map((book, index) => (
                <div key={index} className="book-card" onClick={() => handleBookClick(book)}>
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/120x180?text=${encodeURIComponent(book.title)}`;
                    }}
                  />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>

                    {book.rating && (
                      <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">
                            {i < book.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="category">
          <h2>Want to Read</h2>
          {wantToReadBooks.length === 0 && !loading && (
            <div className="books">
              <div className="no-books">No books in your wishlist. Add some books you'd like to read!</div>
            </div>
          )}
          {wantToReadBooks.length > 0 && chunkBooksIntoRows(wantToReadBooks).map((booksRow, rowIndex) => (
            <div key={rowIndex} className="books">
              {booksRow.map((book, index) => (
                <div key={index} className="book-card" onClick={() => handleBookClick(book)}>
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/120x180?text=${encodeURIComponent(book.title)}`;
                    }}
                  />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>

                    {book.rating && (
                      <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">
                            {i < book.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="category">
          <h2>Read</h2>
          {readBooks.length === 0 && !loading && (
            <div className="books">
              <div className="no-books">No completed books yet. Finish reading to populate this shelf!</div>
            </div>
          )}
          {readBooks.length > 0 && chunkBooksIntoRows(readBooks).map((booksRow, rowIndex) => (
            <div key={rowIndex} className="books">
              {booksRow.map((book, index) => (
                <div key={index} className="book-card" onClick={() => handleBookClick(book)}>
                  <img
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/120x180?text=${encodeURIComponent(book.title)}`;
                    }}
                  />
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>

                    {book.rating && (
                      <div className="book-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="star">
                            {i < book.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add this modal JSX before the closing </div> of bookshelf-page */}
      {selectedBook && (
        <div className="book-modal-overlay" onClick={handleOverlayClick}>
          <div className="book-modal">
            <button className="book-modal-close" onClick={closeModal}>×</button>

            <div className="book-modal-content">
              <img
                src={selectedBook.cover}
                alt={`${selectedBook.title} cover`}
                className="book-modal-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/180x270?text=${encodeURIComponent(selectedBook.title)}`;
                }}
              />

              <div className="book-modal-info">
                <h2 className="book-modal-title">{selectedBook.title}</h2>

                {selectedBook.author && (
                  <p className="book-modal-author">by {selectedBook.author}</p>
                )}

                {selectedBook.pages && (
                  <p className="book-modal-pages">{selectedBook.pages} pages</p>
                )}

                {selectedBook.rating && (
                  <div className="book-modal-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="star">
                        {i < selectedBook.rating ? '★' : '☆'}
                      </span>
                    ))}
                    <span className="rating-text">({selectedBook.rating}/5)</span>
                  </div>
                )}

                <div className="book-modal-divider"></div>

                {selectedBook.tags && selectedBook.tags.length > 0 && (
                  <div className="book-modal-genres">
                    <h4>Genres</h4>
                    {selectedBook.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="genre-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookshelf;