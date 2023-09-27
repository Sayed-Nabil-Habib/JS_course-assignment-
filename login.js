const API_BASE_URL = 'https://api.noroff.dev';

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
      const username = json.name; // Extract the username from the response
      const email = json.email; // Extract the email from the response

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username); // Store the username in local storage
      localStorage.setItem('email', email); // Store the email in local storage

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

  // Check if the username and email are saved in local storage
  const savedUsername = localStorage.getItem('username');
  const savedEmail = localStorage.getItem('email');

  if (savedUsername && savedEmail) {
    // Both the username and email are saved in local storage
    console.log('Username is saved:', savedUsername);
    console.log('Email is saved:', savedEmail);
  } else {
    // Either the username or email is not saved in local storage
    console.log('Username or Email is not saved.');
  }
});
