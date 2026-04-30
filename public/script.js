// Listen for form submit
document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);

const bookmarkForm = document.getElementById('bookmarkForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');

// Real-time validation
const validateBookmarkForm = () => {
  const isNameValid = siteNameInput.value.trim() !== '';
  const isUrlValid = siteUrlInput.checkValidity(); // Uses the HTML5 url validation

  const submitBtn = bookmarkForm.querySelector('button[type="submit"]');
  if (isNameValid && isUrlValid) {
    submitBtn.classList.add('btn-success');
  } else {
    submitBtn.classList.remove('btn-success');
  }
};

[siteNameInput, siteUrlInput].forEach(input => {
  input.addEventListener('input', validateBookmarkForm);
});

// Save Bookmark
function saveBookmark(e) {
  // Prevent form from submitting
  e.preventDefault();

  // Get form values
  const siteName = siteNameInput.value;
  const siteUrl = siteUrlInput.value;

  if (!siteName || !siteUrl) {
    alert('Please fill in the form');
    return false;
  }

  const bookmark = {
    name: siteName,
    url: siteUrl
  };

  // LocalStorage Test
  if (localStorage.getItem('bookmarks') === null) {
    // Init array
    const bookmarks = [];
    // Add to array
    bookmarks.push(bookmark);
    // Set to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } else {
    // Get bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    // Add bookmark to array
    bookmarks.push(bookmark);
    // Re-set back to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  // Clear form
  document.getElementById('bookmarkForm').reset();

  // Re-fetch bookmarks
  fetchBookmarks();

  // Reset validation state
  validateBookmarkForm();
}

// Delete bookmark
function deleteBookmark(url) {
  // Get bookmarks from localStorage
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  // Loop through bookmarks
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].url == url) {
      // Remove from array
      bookmarks.splice(i, 1);
    }
  }
  // Re-set back to localStorage
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  // Re-fetch bookmarks
  fetchBookmarks();
}

// Fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  // Get output id
  const bookmarksResults = document.getElementById('bookmarksResults');

  // Build output
  bookmarksResults.innerHTML = '';
  if (bookmarks) {
    for (let i = 0; i < bookmarks.length; i++) {
      const name = bookmarks[i].name;
      const url = bookmarks[i].url;

      bookmarksResults.innerHTML += `
        <div class="bookmark-item">
          <h3>${name}</h3>
          <div class="bookmark-actions">
            <a class="btn btn-visit" target="_blank" href="${url}">Visit</a>
            <button onclick="deleteBookmark('${url}')" class="btn btn-delete">Delete</button>
          </div>
        </div>
      `;
    }
  }
}

// Initial fetch
fetchBookmarks();
