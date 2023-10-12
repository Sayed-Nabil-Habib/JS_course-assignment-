const API_BASE_URL = 'https://api.noroff.dev';
let savedUsername;
let accessToken;

/**
 * Fetch and display user's information, such as username and user email.
 * @returns {void}
 */
async function fetchUserInfoAndDisplay() {
  accessToken = localStorage.getItem('accessToken');
  savedUsername = localStorage.getItem('username');
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
        const userName = user.name;
        const userEmail = user.email;

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

/**
 * Fetch all posts made or will be created by the logged-in user.
 * @returns {void}
 */
async function fetchPostsByUserProfile() {
  try {
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
        postContainer.innerHTML = '';

        postsData.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.className = 'card mb-3';

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

/**
 * Delete the selected post by pressing the delete post on the profile page.
 * @param {string} postId - The ID of the post to delete.
 * @returns {void}
 */
async function deletePost(postId) {
  try {
    const deleteResponse = await fetch(`${API_BASE_URL}/api/v1/social/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteResponse.status === 204) {
      console.log(`Post with ID ${postId} deleted successfully.`);
      fetchPostsByUserProfile();
    } else if (deleteResponse.status === 200) {
      const responseBody = await deleteResponse.json();
      console.log(`Received status code 200. Response body:`, responseBody);
    } else {
      console.log(`Failed to delete post with ID ${postId}. Status code: ${deleteResponse.status}`);
    }
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
  }
}

/**
 * Handle the edit button click for a specific post.
 * @param {number} postId - The ID of the post to edit.
 * @returns {void}
 */
function handleEditButtonClick(postId) {
  const postTextElement = document.querySelector(`[data-post-id="${postId}"]`);
  const currentText = postTextElement.textContent;

  const newText = prompt('Edit the post body:', currentText);

  if (newText !== null && newText !== currentText) {
    updatePost(postId, newText);
  }
}

/**
 * Update the post's body.
 * @param {string} postId - The ID of the post to update.
 * @param {string} newBody - The new body text for the post.
 * @returns {void}
 */
async function updatePost(postId, newBody) {
  try {
    const updateData = {
      body: newBody,
    };

 
  const updateResponse = await fetch(`${API_BASE_URL}/api/v1/social/posts/${postId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (updateResponse.status === 200) {
   
    console.log(`Post with ID ${postId} body updated successfully.`);
  } else {
    console.log(`Failed to update post with ID ${postId}. Status code: ${updateResponse.status}`);
  }
} catch (error) {
  console.error(`Error updating post with ID ${postId}:`, error);
}
}


window.addEventListener('load', fetchUserInfoAndDisplay);


document.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-post')) {
    const postId = event.target.getAttribute('data-post-id');
    handleEditButtonClick(postId);
  }
});