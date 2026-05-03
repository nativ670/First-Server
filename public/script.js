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
async function saveBookmark(e) {
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

  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });

    if (response.ok) {
      // Clear form
      document.getElementById('bookmarkForm').reset();
      // Re-fetch bookmarks
      fetchBookmarks();
      // Reset validation state
      validateBookmarkForm();
    } else {
      alert('Failed to save bookmark');
    }
  } catch (err) {
    console.error('Error saving bookmark:', err);
    alert('Server error while saving bookmark');
  }
}

// Delete bookmark
async function deleteBookmark(url) {
  try {
    const response = await fetch(`/api/bookmarks?url=${encodeURIComponent(url)}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Re-fetch bookmarks
      fetchBookmarks();
    } else {
      alert('Failed to delete bookmark');
    }
  } catch (err) {
    console.error('Error deleting bookmark:', err);
    alert('Server error while deleting bookmark');
  }
}

// Fetch bookmarks
async function fetchBookmarks() {
  // Get filter value
  const filter = document.getElementById('searchFilter').value || '';
  
  try {
    const response = await fetch('/api/bookmarks');
    const bookmarks = await response.json();
    
    // Get output id
    const bookmarksResults = document.getElementById('bookmarksResults');

    // Build output
    bookmarksResults.innerHTML = '';
    if (bookmarks && Array.isArray(bookmarks)) {
      const filteredBookmarks = bookmarks.filter(bookmark => 
        bookmark.name.toLowerCase().includes(filter.toLowerCase())
      );

      for (let i = 0; i < filteredBookmarks.length; i++) {
        const name = filteredBookmarks[i].name;
        const url = filteredBookmarks[i].url;

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
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
  }
}

// Search filter listener
document.getElementById('searchFilter').addEventListener('input', fetchBookmarks);

// Initial fetch
fetchBookmarks();
