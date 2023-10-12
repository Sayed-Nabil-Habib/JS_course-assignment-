const API_BASE_URL = 'https://api.noroff.dev';

/**
 * Registers a new user profile.
 * @param {string} url - The URL to send the registration request.
 * @param {Object} data - The user data to create a new profile.
 * @param {string} data.name - The user's name.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's password.
 * @returns {Promise<{ status: number, data: Object }>} A promise that resolves with the registration status and response data.
 */
async function registerUser(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    console.log(response); 

    const json = await response.json();
    console.log(json); 

    return { status: response.status, data: json }; 
  } catch (error) {
    console.log(error);
    return { status: 500, data: null }; 
  }
}

const registrationForm = document.getElementById('registrationForm');
const registrationMessage = document.getElementById('registrationMessage');

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const user = {
    name: name,
    email: email,
    password: password,
  };

  const registrationResponse = await registerUser(
    `${API_BASE_URL}/api/v1/social/auth/register`,
    user
  );

 
  if (registrationResponse.status === 201 && registrationResponse.data) {
    registrationMessage.textContent = 'You are registered successfully';
    registrationMessage.style.color = 'green';
  } else {
    registrationMessage.textContent = 'Registration failed. Please try again';
    registrationMessage.style.color = 'red';
  }
});
