'use strict';

const form = document.getElementById('consultingForm');

const fullNameInput = document.getElementById('formFullName');
const emailInput = document.getElementById('formEmail');
const countryInput = document.getElementById('form-country');
const phoneInput = document.getElementById('formPhone');
const companyInput = document.getElementById('formCompany');
const companyAddressInput = document.getElementById('formCompanyAddress');
const subjectInput = document.getElementById('formSubject');
const messageInput = document.getElementById('formMessage');

const submitButton = document.getElementById('submitBtn');


const fullNameErrorCont = document.getElementById('fullNameErrorCont');
const fullNameErrorText = document.getElementById('fullNameErrorText');
const emailErrorCont = document.getElementById('emailErrorCont');
const emailErrorText = document.getElementById('emailErrorText');
const phoneErrorCont = document.getElementById('phoneErrorCont');
const phoneErrorText = document.getElementById('phoneErrorText');
const countryErrorCont = document.getElementById('countryErrorCont');
const countryErrorText = document.getElementById('countryErrorText');
const companyErrorCont = document.getElementById('companyErrorCont');
const companyErrorText = document.getElementById('companyErrorText');
const companyAddressErrorCont = document.getElementById('companyAddressErrorCont');
const companyAddressErrorText = document.getElementById('companyAddressErrorText');
const subjectErrorCont = document.getElementById('subjectErrorCont');
const subjectErrorText = document.getElementById('subjectErrorText');
const messageErrorCont = document.getElementById('messageErrorCont');
const messageErrorText = document.getElementById('messageErrorText');

const submitErrorCont = document.getElementById('submitErrorCont');




fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmailField);
phoneInput.addEventListener('blur', validatePhone);
countryInput.addEventListener('blur', validateCountry);
companyInput.addEventListener('blur', validateCompany);
companyAddressInput.addEventListener('blur', validateCompanyAddress);
subjectInput.addEventListener('blur', validateSubject);
messageInput.addEventListener('blur', validateMessage);

// Validation Functions
function validateFullName() {
    const fullName = fullNameInput.value.trim();
    
    if (!fullName || fullName.length < 3) {
        fullNameErrorCont.style.display = 'flex';
        fullNameErrorText.innerHTML = 'Enter a valid name (at least 3 characters)';
        fullNameInput.style.borderColor = '#dc3545';
        return false;
    }
    
    fullNameErrorCont.style.display = 'none';
    fullNameInput.style.borderColor = '#28a745';
    return true;
}

function validateEmailField() {
    const email = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
        emailErrorCont.style.display = 'flex';
        emailErrorText.innerHTML = 'Email is required';
        emailInput.style.borderColor = '#dc3545';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        emailErrorCont.style.display = 'flex';
        emailErrorText.innerHTML = 'Enter a valid email address';
        emailInput.style.borderColor = '#dc3545';
        return false;
    }
    
    emailErrorCont.style.display = 'none';
    emailInput.style.borderColor = '#28a745';
    return true;
}

function validateCompany() {
    const company = companyInput.value.trim();
    
    if (!company || company.length < 3) {
        companyErrorCont.style.display = 'flex';
        companyErrorText.innerHTML = 'Enter a valid company name (at least 3 characters)';
        companyInput.style.borderColor = '#dc3545';
        return false;
    }
    
    companyErrorCont.style.display = 'none';
    companyInput.style.borderColor = '#28a745';
    return true;
}

function validateCompanyAddress() {
    const companyAddress = companyAddressInput.value.trim();
    
    if (!companyAddress || companyAddress.length < 3) {
        companyAddressErrorCont.style.display = 'flex';
        companyAddressErrorText.innerHTML = 'Enter a valid company address (at least 3 characters)';
        companyAddressInput.style.borderColor = '#dc3545';
        return false;
    }
    
    companyAddressErrorCont.style.display = 'none';
    companyAddressInput.style.borderColor = '#28a745';
    return true;
}

function validatePhone() {
    const phone = phoneInput.value.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (!phone) {
        phoneErrorCont.style.display = 'flex';
        phoneErrorText.innerHTML = 'Phone number is required';
        phoneInput.style.borderColor = '#dc3545';
        return false;
    }
    
    if (digitsOnly.length < 10) {
        phoneErrorCont.style.display = 'flex';
        phoneErrorText.innerHTML = 'Phone number must contain at least 10 digits';
        phoneInput.style.borderColor = '#dc3545';
        return false;
    }
    
    phoneErrorCont.style.display = 'none';
    phoneInput.style.borderColor = '#28a745';
    return true;
}

function validateCountry() {
    const country = countryInput.value.trim();
    
    if (!country) {
        countryErrorCont.style.display = 'flex';
        countryErrorText.innerHTML = 'Select your country or region';
        countryInput.style.borderColor = '#dc3545';
        return false;
    }
    
    countryErrorCont.style.display = 'none';
    countryInput.style.borderColor = '#28a745';
    return true;
}


function validateCompany() {
    const company = companyInput.value.trim();
    
    if (!company) {
        return true;
    }
    if (company.length > 0 && company.length < 2) {
        companyErrorCont.style.display = 'flex';
        companyErrorText.innerHTML = 'Company name must be at least 2 characters long';
        companyInput.style.borderColor = '#dc3545';
        return false;        
    }
    
    companyErrorCont.style.display = 'none';
    companyInput.style.borderColor = '#28a745';
    return true;
}

function validateCompanyAddress() {
    const companyAddress = companyAddressInput.value.trim();
    
    if (!companyAddress) {
        return true;
    }
    if (companyAddress.length > 0 && companyAddress.length < 2) {
        companyAddressErrorCont.style.display = 'flex';
        companyAddressErrorText.innerHTML = 'Enter a valid company address';
        companyAddressInput.style.borderColor = '#dc3545';
        return false;        
    }
    
    companyAddressErrorCont.style.display = 'none';
    companyAddressInput.style.borderColor = '#28a745';
    return true;
}

function validateSubject() {
    const subject = subjectInput.value.trim();
    
    if (!subject) {
        subjectErrorCont.style.display = 'flex';
        subjectErrorText.innerHTML = 'Subject is required';
        subjectInput.style.borderColor = '#dc3545';
        return false;
    }
    
    subjectErrorCont.style.display = 'none';
    subjectInput.style.borderColor = '#28a745';
    return true;
}

function validateMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        messageErrorCont.style.display = 'flex';
        messageErrorText.innerHTML = 'Message is required';
        messageInput.style.borderColor = '#dc3545';
        return false;
    }
    
    if (message.length < 10) {
        messageErrorCont.style.display = 'flex';
        messageErrorText.innerHTML = 'Message must be at least 10 characters';
        messageInput.style.borderColor = '#dc3545';
        return false;
    }
    
    messageErrorCont.style.display = 'none';
    messageInput.style.borderColor = '#28a745';
    return true;
}




form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmailField();
    const isPhoneValid = validatePhone();
    const isCountryValid = validateCountry();
    const isCompanyValid = validateCompany();
    const isAddressValid = validateCompanyAddress();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    

    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isCountryValid ||
        !isCompanyValid || !isAddressValid || !isSubjectValid || !isMessageValid) {
        return;
    }
    

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi-spinner"></i> Sending...';
    
    sendEmailToServer({
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        country: countryInput.value.trim(),
        company: companyInput.value.trim(),
        companyAddress: companyAddressInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        submitButton.innerHTML = '<i class="bi-check-circle"></i> Your request has been received';
        submitButton.disabled = true;
        submitErrorCont.style.display = 'none';
        form.reset();
        clearAllBorders();
    })
    .catch((error) => {
        submitButton.innerHTML = 'Submit';
        submitButton.disabled = false;
        submitErrorCont.style.display = 'flex';
    });
});

function clearAllBorders() {
    fullNameInput.style.borderColor = '';
    emailInput.style.borderColor = '';
    phoneInput.style.borderColor = '';
    countryInput.style.borderColor = '';
    companyInput.style.borderColor = '';
    companyAddressInput.style.borderColor = '';
    subjectInput.style.borderColor = '';
    messageInput.style.borderColor = '';
}


// Send the email to your server or API
function sendEmailToServer(email) {
  // Replace with your server or API URL
  const url = 'https://your-server.com/newsletter';

  // Replace with your API key or authentication token
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
