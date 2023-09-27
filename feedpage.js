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
async function fetchAndDisplayDataFromOtherAPI() {
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
      const responseData = await otherAPIResponse.json();
      console.log('Data from other API:', responseData);

      // Assuming responseData is an array of posts
      const feedContainer = document.getElementById('feed-container');
      if (feedContainer) {
        
        responseData.forEach((post) => {
          if(post.media){

       
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

window.addEventListener('load', () => {
  fetchUserInfoAndDisplay();
  fetchAndDisplayDataFromOtherAPI(); // Call the new function here
});

