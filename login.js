const API_BASE_URL = 'https://api.noroff.dev';

/**
 * Function to log in a user by sending a POST request to the API_BASE_URL with user data.
 * @param {string} url - The URL to send the login request to.
 * @param {Object} data - An object containing user login data.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {void}
 */
async function loginUser(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);

    if (response.status === 200) {
      const json = await response.json();
      const accessToken = json.accessToken;
      const username = json.name;
      const email = json.email;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);

      window.location.href = './feed.html';
    } else {
      logInMessage.textContent = 'Log in failed. Please try again';
      logInMessage.style.color = 'red';
    }
  } catch (error) {
    console.log(error);
  }
}

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userLogin = {
    email: email,
    password: password,
  };

  await loginUser(`${API_BASE_URL}/api/v1/social/auth/login`, userLogin);

  const savedUsername = localStorage.getItem('username');
  const savedEmail = localStorage.getItem('email');

  if (savedUsername && savedEmail) {
    console.log('Username is saved:', savedUsername);
    console.log('Email is saved:', savedEmail);
  } else {
    console.log('Username or Email is not saved.');
  }
});
