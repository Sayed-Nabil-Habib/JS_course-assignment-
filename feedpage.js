const API_BASE_URL = 'https://api.noroff.dev';

async function fetchUserInfoAndDisplay() {
  const accessToken = localStorage.getItem('accessToken');
  const savedUsername = localStorage.getItem('username');
  const savedUserEmail = localStorage.getItem('email');

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
  
        const user = userArray[1];
        const userName = user.name;
        const userEmail = user.email;
        console.log(userArray)


         const userNameElement = document.getElementById('user-name');
         const userEmailElement = document.getElementById('user-email');

  if (userNameElement) {
    userNameElement.textContent = `Welcome, ${savedUsername}`;
  }
  if (userEmailElement) {
    userEmailElement.textContent = `your email is, ${userEmail}`;
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


window.addEventListener('load', fetchUserInfoAndDisplay);
