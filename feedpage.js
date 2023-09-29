const API_BASE_URL = 'https://api.noroff.dev';
const socialPost = '/api/v1/social/posts';

async function fetchUserInfoAndDisplay() {
  const accessToken = localStorage.getItem('accessToken');
  const savedUsername = localStorage.getItem('username');
  const savedEmail = localStorage.getItem('email');

  if (!accessToken) {
    console.log('Access token not found in local storage.');
    return;
  }

  try {
    const userInfoResponse = await fetch(`${API_BASE_URL}/api/v1/social/profiles`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userInfoResponse.status === 200) {
      const userArray = await userInfoResponse.json();

      if (userArray.length > 0) {
        const user = userArray[0];
      
        const userProfileElements = document.querySelectorAll('.user-profile-name');
        
        if (userProfileElements.length > 0) {
          userProfileElements.forEach((element) => {
            element.textContent = `${savedUsername}`;
            });
          }
      
      } else {
        console.log('No user information found in the response array.');
      }
    } else {
      console.log(`Failed to fetch user information. Status code: ${userInfoResponse.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}











// Function to fetch and display data from another API
async function fetchAndDisplayDataFromOtherAPI(selectedFilter = 'all') {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.log('Access token not found in local storage.');
    return;
  }

  try {
    // Make an API call to the other endpoint using the access token
    const otherAPIResponse = await fetch(`${API_BASE_URL}${socialPost}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (otherAPIResponse.status === 200) {
      // Handle the response data as needed
      responseData = await otherAPIResponse.json();
      console.log('Data from other API:', responseData);

      // Assuming responseData is an array of posts
      const feedContainer = document.getElementById('feed-container');
      if (feedContainer) {
        // Clear any existing content
        feedContainer.innerHTML = '';

        // Filter posts based on the selected filter
        const filteredPosts = filterPostsBySelectedOption(responseData, selectedFilter);

        filteredPosts.forEach((post) => {
           if (post.media) {
            const postElement = document.createElement('div');
            postElement.className = 'card mb-3';

          postElement.innerHTML = `
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-auto d-flex align-items-center">
                  <img src="${post.title}" class="rounded-circle custom-rounded-image img-fluid" alt="" style="max-width: 30px;">
                  <h6 id="user-profile-name" class="user-profile-name card-title mb-0 ms-2">${post.title}</h6>
                </div>
              </div>
            </div>
            <img src="${post.media}" class="card-img-top" alt="post-image">
            <div class="card-body">
              <p class="card-text">${post.body}</p>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary"><i class="far fa-thumbs-up"></i> Like</button>
              <button type="button" class="btn btn-secondary"><i class="far fa-comment"></i> Comment</button>
              <button type="button" class="btn btn-info"><i class="fas fa-share"></i> Share</button>
            </div>
          `;

           // Append the post element to the feed container
            feedContainer.appendChild(postElement);
          }
        });
      }
    } else {
      console.log(`Failed to fetch data from the other API. Status code: ${otherAPIResponse.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}









// Function to post and display a post
async function createNewPost() {
  const accessToken = localStorage.getItem('accessToken');
  const title = document.getElementById('postTitle').value;
  const body = document.getElementById('floatingTextarea2').value;
  const tags = document.getElementById('postTags').value.split(','); // Convert comma-separated tags to an array
  const media = document.getElementById('postMedia').value;

  if (!accessToken) {
    console.log('Access token not found in local storage.');
    return;
  }

  console.log('POST Data:', {
    title,
    body,
    tags,
    media,
  });

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/social/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title,
        body,
        tags,
        media,
      }),
    });
// Validate the media URL format
const mediaUrlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
if (!mediaUrlPattern.test(media)) {
  console.log('Invalid media URL format');
  return;
}
    if (response.status === 200) {
      const newPostData = await response.json();
      console.log('New Post Data:', newPostData);
      // Display the new post data in your UI as needed
    } else {
      console.log(`Failed to create a new post. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Add an event listener to the "Post" button
const postButton = document.getElementById('postButton');
postButton.addEventListener('click', createNewPost);


















// Function to filter posts based on the selected option
function filterPostsBySelectedOption(posts, selectedFilter) {
  if (selectedFilter === 'all') {
    return posts;
  } else if (selectedFilter === 'earliest') {
    return posts.slice().sort((a, b) => new Date(a.created) - new Date(b.created));
  } else if (selectedFilter === 'latest') {
    return posts.slice().sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  return posts;
}

window.addEventListener('load', () => {
  fetchUserInfoAndDisplay();
  fetchAndDisplayDataFromOtherAPI(); // Call the function with the default filter

  const selectElement = document.querySelector('select');
  if (selectElement) {
    selectElement.addEventListener('change', (event) => {
      const selectedFilter = event.target.value;
      fetchAndDisplayDataFromOtherAPI(selectedFilter); // Call the function with the selected filter
    });
  }
});














// Function to filter and display posts based on search input
function filterAndDisplayPosts(searchValue) {
  const feedContainer = document.getElementById('feed-container');
  
  // Clear any existing content
  feedContainer.innerHTML = '';
  
  // Filter posts based on the search value
  const filteredPosts = responseData.filter(post => {
    const title = post.title ? post.title.toLowerCase() : ''; // Check if title exists
    const body = post.body ? post.body.toLowerCase() : '';    // Check if body exists
    return title.includes(searchValue) || body.includes(searchValue);
  });

  console.log('Filtered Posts:', filteredPosts);

  filteredPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'card mb-3';

    postElement.innerHTML = `
      <div class="card-header">
        <div class="row align-items-center">
          <div class="col-auto d-flex align-items-center">
            <img src="${post.title}" class="rounded-circle custom-rounded-image img-fluid" alt="" style="max-width: 30px;">
            <h6 id="user-profile-name" class="user-profile-name card-title mb-0 ms-2">${post.title}</h6>
          </div>
        </div>
      </div>
      <img src="${post.media}" class="card-img-top" alt="post-image">
      <div class="card-body">
        <p class="card-text">${post.body}</p>
      </div>
      <div class="card-footer">
        <button type="button" class="btn btn-primary"><i class="far fa-thumbs-up"></i> Like</button>
        <button type="button" class="btn btn-secondary"><i class="far fa-comment"></i> Comment</button>
        <button type="button" class="btn btn-info"><i class="fas fa-share"></i> Share</button>
      </div>
    `;

    feedContainer.appendChild(postElement);
  });
}

// Event listener for the search input
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function () {
  const searchValue = this.value.trim().toLowerCase();
  console.log('Search Value:', searchValue); // Log the search value to the console

  // Log responseData to verify its contents
  console.log('Response Data:', responseData);

  filterAndDisplayPosts(searchValue);
});