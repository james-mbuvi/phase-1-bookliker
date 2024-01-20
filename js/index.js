
document.addEventListener('DOMContentLoaded', function() {
    const listPanel = document.getElementById('list-panel');
    const list = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
  
    // Function to fetch and render books
    function fetchAndRenderBooks() {
      fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(books => renderBooks(books));
    }
  
    // Function to render books in the list
    function renderBooks(books) {
      list.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.innerText = book.title;
        li.addEventListener('click', () => showBookDetails(book));
        list.appendChild(li);
      });
    }
  
    // Function to show book details
    function showBookDetails(book) {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnailUrl}" alt="${book.title}">
        <p>${book.description}</p>
        <h3>Liked by:</h3>
        <ul id="liked-users">
          ${renderLikedUsers(book.users)}
        </ul>
        <button id="like-button">Like</button>
      `;
  
      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', () => likeBook(book));
    }
  
    // Function to render liked users
    function renderLikedUsers(users) {
      return users.map(user => `<li>${user.username}</li>`).join('');
    }
  
    // Function to handle book liking
    function likeBook(book) {
      const currentUser = { id: 1, username: "pouros" };
  
      // Check if the current user already liked the book
      const likedByCurrentUser = book.users.some(user => user.id === currentUser.id);
  
      // If liked, unlike; otherwise, like
      if (likedByCurrentUser) {
        unlikeBook(book, currentUser);
      } else {
        likeBookRequest(book, currentUser);
      }
    }
  
    // Function to handle book liking request
    function likeBookRequest(book, currentUser) {
      const updatedUsers = [...book.users, currentUser];
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ users: updatedUsers })
      })
      .then(response => response.json())
      .then(updatedBook => {
        showBookDetails(updatedBook);
        fetchAndRenderBooks();
      });
    }
  
    // Function to handle book unliking
    function unlikeBook(book, currentUser) {
      const updatedUsers = book.users.filter(user => user.id !== currentUser.id);
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ users: updatedUsers })
      })
      .then(response => response.json())
      .then(updatedBook => {
        showBookDetails(updatedBook);
        fetchAndRenderBooks();
      });
    }
  
    // Fetch and render books on page load
    fetchAndRenderBooks();
  });
  