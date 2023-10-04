const API_BASE_URL = 'https://api.noroff.dev';
let savedUsername; // Declare savedUsername at a higher scope
let accessToken; // Declare accessToken at a higher scope

async function fetchUserInfoAndDisplay() {
  accessToken = localStorage.getItem('accessToken'); // Assign value to accessToken
  savedUsername = localStorage.getItem('username'); // Assign value to savedUsername
  const savedEmail = localStorage.getItem('email');

  if (!accessToken) {
    console.log('Access token not found in local storage.');
    return;
  }

  try {
    // Fetch user information
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
        const userName = user.name;
        const userEmail = user.email;

        // Display user information
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const userProfileElements = document.querySelectorAll('.user-profile-name');

        if (userProfileElements.length > 0) {
          userProfileElements.forEach((element) => {
            element.textContent = `${savedUsername}`;
          });
        }
        if (userNameElement) {
          userNameElement.textContent = `Welcome ${savedUsername}`;
        }
        if (userEmailElement) {
          userEmailElement.textContent = `Your email is: ${savedEmail}`;
        }

        // Fetch posts by the user's profile
        fetchPostsByUserProfile();
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

async function fetchPostsByUserProfile() {
  try {
    // Fetch posts by the user's profile
    const postsResponse = await fetch(`${API_BASE_URL}/api/v1/social/profiles/${savedUsername}/posts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (postsResponse.status === 200) {
      const postsData = await postsResponse.json();
      const postContainer = document.getElementById('post-container');

      if (postsData.length > 0) {
        // Clear any existing content in the post container
        postContainer.innerHTML = '';

        // Loop through the retrieved posts and display them as cards
        postsData.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.className = 'card mb-3';

          // Check if the post has media (image)
     
            postElement.innerHTML = `
              <!-- Card structure with media -->
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
                <button type="button" class="btn btn-danger delete-post" data-post-id="${post.id}">Delete</button>
                <button type="button" class="btn btn-warning edit-post" data-post-id="${post.id}">Edit</button>

              </div>
            `;
          
            if (post.media) {
              const cardImgTop = document.createElement('img');
              cardImgTop.className = 'card-img-top';
              cardImgTop.src = post.media;
              cardImgTop.alt = 'post-image';
              postElement.querySelector('.card-header').appendChild(cardImgTop);
            }
          postContainer.appendChild(postElement);

          // Attach event listener to the delete button
          const deleteButton = postElement.querySelector('.delete-post');
          if (deleteButton) {
            deleteButton.addEventListener('click', () => {
              const postId = deleteButton.getAttribute('data-post-id');
              deletePost(postId);
            });
          }
        });

        
      } else {
        postContainer.innerHTML = '<p>No posts found for this user.</p>';
      }
    } else {
      console.log(`Failed to fetch user's posts. Status code: ${postsResponse.status}`);
    }
  } catch (error) {
    console.error('Error fetching user posts:', error);
  }
}

// Function to delete a post by ID
async function deletePost(postId) {
  try {
    // Send a DELETE request to the API endpoint
    const deleteResponse = await fetch(`${API_BASE_URL}/api/v1/social/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteResponse.status === 204) {
      // Post deleted successfully, you can update the UI as needed
      console.log(`Post with ID ${postId} deleted successfully.`);
      // Refresh the posts after deletion
      fetchPostsByUserProfile();
    } else if (deleteResponse.status === 200) {
      // Log the response body if status code is 200 (for debugging purposes)
      const responseBody = await deleteResponse.json();
      console.log(`Received status code 200. Response body:`, responseBody);
    } else {
      console.log(`Failed to delete post with ID ${postId}. Status code: ${deleteResponse.status}`);
    }
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
  }
}





// Function to handle the edit button click
function handleEditButtonClick(postId) {
  const postTextElement = document.querySelector(`[data-post-id="${postId}"]`);
  const currentText = postTextElement.textContent;
  
  const newText = prompt('Edit the post body:', currentText);
  
  if (newText !== null && newText !== currentText) {
    // Update the post body locally
    
    // Send a PUT request to update the post on the server
    updatePost(postId, newText);
  }
}

// Function to update a post body
async function updatePost(postId, newBody) {
  try {
    const updateData = {
      body: newBody,
    };

  // Send a PUT request to the API endpoint to update the post body
  const updateResponse = await fetch(`${API_BASE_URL}/api/v1/social/posts/${postId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (updateResponse.status === 200) {
    // Post body updated successfully
    console.log(`Post with ID ${postId} body updated successfully.`);
  } else {
    console.log(`Failed to update post with ID ${postId}. Status code: ${updateResponse.status}`);
  }
} catch (error) {
  console.error(`Error updating post with ID ${postId}:`, error);
}
}


window.addEventListener('load', fetchUserInfoAndDisplay);

// Attach event listeners to the "Edit" buttons only
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-post')) {
    const postId = event.target.getAttribute('data-post-id');
    handleEditButtonClick(postId);
  }
});