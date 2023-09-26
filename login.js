const API_BASE_URL = 'https://api.noroff.dev';

async function loginUser(url, data){
  try{
     const postData = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(data),
     };

     const response = await fetch(url, postData);

     if(response.status === 200){
      const json = await response.json();
      const accessToken = json.accessToken;
      localStorage.setItem('accessToken', accessToken);

      window.location.href = './feed.html';
     }else{
      console.log('login Failed. Please try again');
     }
  }catch(error){
    console.log(error)
  }
}
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async function(event){
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const userLogin = {
    email : email,
    password : password,
  }
  await loginUser(`${API_BASE_URL}/api/v1/social/auth/login`,userLogin)
})
