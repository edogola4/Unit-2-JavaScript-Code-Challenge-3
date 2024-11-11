document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'http://localhost:3000/books';
    const currentUser = { id: 1, username: "pouros" };

    const bookList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');

    // Function to fetch books
    function fetchBooks() {
        fetch(API_URL)
            .then(response => response.json())
            .then(books => {
                books.forEach(book => {
                    const li = document.createElement('li');
                    li.textContent = book.title;
                    li.addEventListener('click', () => showBookDetails(book));
                    bookList.appendChild(li);
                });
            });
    }

    // Function to show book details
    function showBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <ul id="likers-list">${book.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
            <div class="action-buttons">
                <button id="like-button" ${isUserLiker(book) ? 'disabled' : ''}>LIKE</button>
                <button id="unlike-button" ${isUserLiker(book) ? '' : 'disabled'}>UNLIKE</button>
            </div>
        `;
        document.getElementById('like-button').addEventListener('click', () => toggleLike(book, true));
        document.getElementById('unlike-button').addEventListener('click', () => toggleLike(book, false));
    }

    // Helper function to check if the current user has liked the book
    function isUserLiker(book) {
        return book.users.some(user => user.id === currentUser.id);
    }

    // Function to toggle like status
    function toggleLike(book, isLiking) {
        const method = 'PATCH';
        const newUsers = isLiking ? 
            [...book.users, currentUser] : 
            book.users.filter(user => user.id !== currentUser.id);

        fetch(`${API_URL}/${book.id}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: newUsers })
        })
        .then(response => response.json())
        .then(updatedBook => {
            showBookDetails(updatedBook);
        });
    }

    // Initialize the app
    fetchBooks();
});