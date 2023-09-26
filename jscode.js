const API_BASE_URL = 'https://api.noroff.dev';

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
    console.log(response); // Log the response

    const json = await response.json();
    console.log(json); // Log the parsed JSON data

    return { status: response.status, data: json }; // Return both status and data
  } catch (error) {
    console.log(error);
    return { status: 500, data: null }; // Return an error status and no data
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

  // Determine the registration status based on the HTTP status code and response data
  if (registrationResponse.status === 201 && registrationResponse.data) {
    registrationMessage.textContent = 'You are registered successfully';
    registrationMessage.style.color = 'green';
  } else {
    registrationMessage.textContent = 'Registration failed. Please try again';
    registrationMessage.style.color = 'red';
  }
});
