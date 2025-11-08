import { useState, useEffect } from 'react';
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
      // Always update cursor position, never hide it
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
  }, []);

  // Function to fetch books from API for each category
  const fetchBooksFromAPI = async () => {
    setLoading(true);
    try {
      // Query for books currently reading (status_id: 2) - CORRECTED
      const readingQuery = `{
        me {
          user_books(where: {status_id: {_eq: 2}}, order_by: {date_added: asc}) {
            book {
              title
              cached_image
              cached_tags
            }
            rating
            status_id
          }
        }
      }`;

      // Query for books want to read (status_id: 1) - CORRECTED
      const wantToReadQuery = `{
        me {
          user_books(where: {status_id: {_eq: 1}}, order_by: {date_added: asc}) {
            book {
              title
              cached_image
              cached_tags
            }
            rating
            status_id
          }
        }
      }`;

      // Query for books already read (status_id: 3)
      const readQuery = `{
        me {
          user_books(where: {status_id: {_eq: 3}}, order_by: {date_added: asc}) {
            book {
              title
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
          // For development, check if we're running locally
          const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3001/api/books'  // Use your local server during development
            : '/api/books';  // Use Vercel function in production

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

      // Update the processing sections with better debugging
      // Process reading books
      if (readingData?.data?.me && Array.isArray(readingData.data.me) && readingData.data.me.length > 0) {
        const meData = readingData.data.me[0]; // Get the first (and likely only) object from the me array
        console.log('📖 Processing reading books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedReading = meData.user_books.map(userBook => ({
            title: userBook.book.title || 'Unknown Title',
            cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
            tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
            rating: userBook.rating
          }));
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
        const meData = wantToReadData.data.me[0]; // Get the first object from the me array
        console.log('📚 Processing want to read books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedWantToRead = meData.user_books.map(userBook => ({
            title: userBook.book.title || 'Unknown Title',
            cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
            tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
            rating: userBook.rating
          }));
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

      // Process read books
      if (readData?.data?.me && Array.isArray(readData.data.me) && readData.data.me.length > 0) {
        const meData = readData.data.me[0]; // Get the first object from the me array
        console.log('✅ Processing read books from me[0]:', meData);

        if (meData.user_books && meData.user_books.length > 0) {
          const transformedRead = meData.user_books.map(userBook => ({
            title: userBook.book.title || 'Unknown Title',
            cover: userBook.book.cached_image?.url || "https://via.placeholder.com/120x180?text=" + encodeURIComponent(userBook.book.title || 'Unknown'),
            tags: (userBook.book.cached_tags?.Genre || []).map(tagObj => tagObj.tag || tagObj).slice(0, 3),
            rating: userBook.rating
          }));
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

  return (
    <div className="bookshelf">
      <h1>Your Bookshelf</h1>
      <button onClick={goBackHome} className="back-home">Back to Home</button>

      {loading && <div className="loading">Loading your books...</div>}

      <div className="shelf">
        <div className="category">
          <h2>Currently Reading</h2>
          <div className="books">
            {readingBooks.length === 0 && !loading && <div className="no-books">No books found. Try adding some!</div>}
            {readingBooks.map((book, index) => (
              <div key={index} className="book-card">
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`;
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

                  {book.tags && book.tags.length > 0 && (
                    <div className="book-tags">
                      {book.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="book-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category">
          <h2>Want to Read</h2>
          <div className="books">
            {wantToReadBooks.length === 0 && !loading && <div className="no-books">No books found. Try adding some!</div>}
            {wantToReadBooks.map((book, index) => (
              <div key={index} className="book-card">
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`;
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

                  {book.tags && book.tags.length > 0 && (
                    <div className="book-tags">
                      {book.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="book-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category">
          <h2>Read</h2>
          <div className="books">
            {readBooks.length === 0 && !loading && <div className="no-books">No books found. Try adding some!</div>}
            {readBooks.map((book, index) => (
              <div key={index} className="book-card">
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  className="book-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`;
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

                  {book.tags && book.tags.length > 0 && (
                    <div className="book-tags">
                      {book.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="book-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookshelf;