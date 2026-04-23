'use strict';


const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('newsletterEmail');
const submitButton = document.getElementById('emailSubmitBtn');

const errorCont = document.getElementById('newletterEmailErrorCont');
const errorText = document.getElementById('newletterEmailErrorText');



newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  errorCont.style.display = 'none';

  const email = emailInput.value.trim();

  if (!email || !validateEmail(email)) {
    errorCont.style.display = 'flex';
    errorText.innerHTML = 'Enter a valid email address';
    return;
  }

  sendEmailToServer(email)
    .then((response) => {
      submitButton.innerHTML = '<i class="bi-check-circle"></i> Subscribed';
      submitButton.disabled = true;
      emailInput.value = '';
      errorCont.style.display = 'none';
    })
    .catch((error) => {
      alert('Error subscribing. Please try again.');
      console.error(error);
    });
});


function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


function sendEmailToServer(email) {
  const url = 'https://your-server.com/newsletter';

  const apiKey = 'your-api-key';

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email }),
  });
}
