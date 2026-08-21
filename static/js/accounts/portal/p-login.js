// variable p-login
const pLogin = document.getElementById('pLogin');
// variable phone input
const countryCode = document.getElementById('pCountryCodeBtn');
countryCode.disabled = true;
const phoneCode = document.getElementById('pCountryId');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('prm');
const phoneCheckIcon = document.getElementById('phoneCheckIcon');
// variable send otp btn
const sendOtp = document.getElementById('sendOtpBtn');
const btnText = document.getElementById('btnText');
const sendOtpLoder = document.getElementById('loader');
// variable property related
const propertyRelated = document.getElementById('propertyRelated');
propertyRelated.classList.remove('hidden');
propertyRelated.classList.add('flex');
// variable otp input
const otpBox = document.getElementById('otp-box');
const otpInputs = document.querySelectorAll('.otp-input');
const otpError = document.getElementById('orm');
const otpClockIcon = document.getElementById('otpClockIcon');
// variable resend otp
const resendOtpB = document.getElementById('resendOtpBtn');
const timerText = document.getElementById('timerText');
const verifyOtpLoader = document.getElementById('verifyOtpLoader');
// variable p profile
const pProfile = document.getElementById('pProfile');
const pAvatarPreview = document.getElementById('avatarPreview');
const pimg = document.getElementById('avatarInput');
// variable img loader
const pImgLoader = document.getElementById('pImgLoader');
const pname = document.getElementById('pname');
// variable p skip btn
const pConBtn = document.getElementById('pConBtn');
// variable state select btn
document.getElementById('pStateId').value = '';
document.getElementById('pSelectedState').innerText = window.stateEr.selectState;
// variable city select btn
const pcitylabel = document.getElementById('pCityLabel');
pcitylabel.classList.add('disabled');
const pcitybtn = document.getElementById('pCityBtn');
pcitybtn.disabled = true;
document.getElementById('pCityId').value = '';
document.getElementById('pSelectedCity').innerText = window.cityEr.selectCity;
// variable update profile btn
const pUpdateBtn = document.getElementById('pUpdateBtn');
const pUpbtnText = document.getElementById('pUpbtnText');
pUpbtnText.innerText = window.allError.profileUpdate;
const pLoaderUpdate = document.getElementById('pLoaderUpdate');
pLoaderUpdate.classList.add('hidden');

// show loader
function showLoader(loader) {
  loader.classList.remove('hidden');
  loader.classList.add('flex');
}
// hide loader
function hideLoader(loader) {
  loader.classList.remove('flex');
  loader.classList.add('hidden');
}
hideLoader(pImgLoader);

otpInputs.forEach((input) => {
  input.disabled = true;
  input.value = '';
});
let senconds;
let isPaused = false;

// Start Timer function
function startTimer() {
  senconds = 120;
  isPaused = false;
  resendOtpB.disabled = true;
  const otpTimer = setInterval(() => {
    if (isPaused) return;
    let mins = Math.floor(senconds / 60);
    let secs = senconds % 60;
    timerText.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    if (senconds <= 0) {
      clearInterval(otpTimer);
      otpInputs.forEach((input) => {
        input.disabled = true;
      });
      resendOtpB.disabled = false;
    }
    senconds--;
  }, 1000);
}

// Stop Timer function
function pausedTime() {
  isPaused = true;
}

// check Phone number input validation
phoneInput.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
  const phoneInput = this.value;
  if (phoneInput.length === 0) {
    phoneError.innerText = window.fieldProPhNumEr.required;
    phoneCheckIcon.classList.remove('flex');
    phoneCheckIcon.classList.add('hidden');
    return;
  }
  if (!/^[6-9]\d{9}$/.test(phoneInput)) {
    phoneError.innerText = window.fieldProPhNumEr.validPn;
    phoneCheckIcon.classList.remove('flex');
    phoneCheckIcon.classList.add('hidden');
    return;
  }
  phoneError.innerText = '';
  phoneCheckIcon.classList.remove('hidden');
  phoneCheckIcon.classList.add('flex');
});

// check OTP input validation
sendOtp.addEventListener('click', function (e) {
  e.preventDefault();
  const phone = phoneInput.value.trim();
  phoneError.innerText = '';
  if (phone === '') {
    phoneError.innerText = window.fieldProPhNumEr.required;
    phoneCheckIcon.classList.remove('flex');
    phoneCheckIcon.classList.add('hidden');
    phoneInput.focus();
    return;
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    phoneError.innerText = window.fieldProPhNumEr.min10Digit;
    phoneCheckIcon.classList.remove('flex');
    phoneCheckIcon.classList.add('hidden');
    return;
  }
  phoneError.innerText = '';
  phoneCheckIcon.classList.remove('hidden');
  phoneCheckIcon.classList.add('flex');
  sendOTP();
});

// send OTP
function sendOTP() {
  let codeID = pCountryId.value.trim();
  let codeShow = document.getElementById('pSelectedCode').innerText;
  let phone = phoneInput.value.trim();
  phoneError.innerText = '';
  countryCode.disabled = true;
  phoneInput.disabled = true;
  sendOtp.disabled = true;
  btnText.innerText = window.otpEr.sendOtp;
  sendOtpLoder.classList.remove('hidden');

  fetch('/portal/login/', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': getCSRF(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: phone, code: codeID }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    })
    .then((data) => {
      phoneError.innerText = data.message;
      if (data.step === 'otp') {
        propertyRelated.classList.remove('flex');
        propertyRelated.classList.add('hidden');
        sendOtp.classList.replace('flex', 'hidden');
        otpBox.classList.remove('hidden');
        otpInputs.forEach((input) => {
          input.disabled = false;
        });
        otpInputs[0].focus();
        startTimer();
      }
    })
    .catch((error) => {
      phoneError.innerText = error.message || window.allError.tryAgain;
      countryCode.disabled = false;
      phoneInput.disabled = false;
      sendOtp.disabled = false;
      sendOtp.classList.replace('flex', 'hidden');
    })
    .finally(() => {
      btnText.innerText = window.otpEr.btnText;
      sendOtpLoder.classList.add('hidden');
    });
}

// check OTP input validation
otpInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    // Allow only number
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
    if (getOTP().length === 6) {
      verifyOTP();
    }
  });
  // Backspace and Previous
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
  // Paste OTP
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    let pasteData = e.ClipboardData.getData('text').trim();
    pasteData = pasteData.replace(/[^0-9]/g, '');

    pasteData.split('').forEach((char, i) => {
      if (otpInputs[i]) {
        otpInputs[i].value = char;
      }
    });
    // focus on last filled input
    const lastInput = Math.min(pasteData.length, otpInputs.length) - 1;

    if (lastInput >= 0) {
      otpInputs[lastInput].focus();
    }

    if (getOTP().length === 6) {
      verifyOTP();
    }
  });
});

// get OTP Function
function getOTP() {
  let otp = '';
  otpInputs.forEach((input) => {
    otp += input.value;
  });
  return otp;
}

// Resend OTP
function resendOTP() {
  resendOtpB.disabled = true;
  otpError.innerText = '';
  otpClockIcon.classList.add('hidden');
  resendOtpB.classList.add('hidden');
  timerText.classList.add('hidden');
  verifyOtpLoader.classList.remove('hidden');
  fetch('/resend-otp/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRF(),
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        otpError.innerText = data.message;
      }
      if (data.success) {
        otpClockIcon.classList.remove('hidden');
        resendOtpB.classList.remove('hidden');
        timerText.classList.remove('hidden');
        verifyOtpLoader.classList.add('hidden');
        otpError.innerText = data.message;
        otpInputs.forEach((input) => {
          input.disabled = false;
          input.value = '';
        });
        otpInputs[0].focus();
        startTimer();
      }
    })
    .catch(() => {
      otpError.innerText = window.allError.tryAgain;
    });
}

// Verify OTP
function verifyOTP() {
  const pSelectedState = document.getElementById('pSelectedState');
  const pStateId = document.getElementById('pStateId');
  const pSelectedCity = document.getElementById('pSelectedCity');
  const pCityId = document.getElementById('pCityId');
  otpError.innerText = '';
  otpClockIcon.classList.add('hidden');
  resendOtpB.classList.add('hidden');
  timerText.classList.add('hidden');
  verifyOtpLoader.classList.remove('hidden');
  verifyOtpLoader.classList.add('flex');
  let otp = getOTP();
  if (otp.length !== 6) {
    otpError.innerText = window.otpEr.required;
    return;
  }
  fetch('/verify-otp/', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-CSRFToken': getCSRF(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ otp: otp }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        otpError.innerText = data.message;
        otpClockIcon.classList.remove('hidden');
        resendOtpB.classList.remove('hidden');
        timerText.classList.remove('hidden');
        verifyOtpLoader.classList.replace('flex', 'hidden');
        otpInputs.forEach((input) => {
          input.value = '';
        });
        otpInputs[0].focus();
        return;
      }
      if (data.success) {
        otpError.innerText = '';
        pausedTime();
        otpClockIcon.classList.add('hidden');
        resendOtpB.classList.add('hidden');
        timerText.classList.add('hidden');
        verifyOtpLoader.classList.replace('flex', 'hidden');
      }
      if (data.step === 'profile') {
        pLogin.classList.replace('flex', 'hidden');
        pProfile.classList.remove('hidden');
        pProfile.classList.add('flex');
      }
      if (data.profile) {
        pname.value = data.profile.name || '';
        pSelectedState.innerText = data.profile.state_name || window.stateEr.selectState;
        pStateId.value = data.profile.state_id || '';
        if (data.profile.state_name) {
          pcitybtn.disabled = false;
          pcitylabel.classList.remove('disabled');
        } else {
          pcitybtn.disabled = true;
          pcitylabel.classList.add('disabled');
        }

        pSelectedCity.innerText = data.profile.city_name || window.cityEr.selectCity;
        pCityId.value = data.profile.city_id || '';
        if (data.profile.img) {
          showLoader(pImgLoader);
          pAvatarPreview.onload = function () {
            hideLoader(pImgLoader);
          };
          pAvatarPreview.onerror = function () {
            hideLoader(pImgLoader);
            pAvatarPreview.src = '/static/images/avatar.png';
          };
          pAvatarPreview.src = data.profile.img;
        } else {
          hideLoader(pImgLoader);
          pAvatarPreview.src = '/static/images/avatar.png';
        }
      }
    })
    .catch(() => {
      verifyOtpLoader.classList.replace('flex', 'hidden');
      resendOtpB.classList.remove('hidden');
      timerText.classList.remove('hidden');
      otpClockIcon.classList.remove('hidden');
      pausedTime();
      alert(window.allError.tryAgain);
    });
}

// Continue(Skip) Button
pConBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (pConBtn.disabled) return;
  pConBtn.disabled = true;
  let themeValue = localStorage.getItem('pthemeValue') || '1';
  let languageId = localStorage.getItem('plangId') || '1';

  let fd = new FormData();
  fd.append('ptheme', themeValue);
  fd.append('plang', languageId);

  fetch('/portal/profile/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRF(),
    },
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.message || window.allError.tryAgain);
      }
      if (data.success) {
        window.location.href = '/portal/dashboard/';
        return;
      }
    })
    .catch((error) => {
      alert(window.allError.networkEr);
    })
    .finally(() => {
      pConBtn.disabled = false;
    });
});

// Portal Update Profile
pUpdateBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const themeValue = localStorage.getItem('pthemeValue') || '1';
  const languageId = localStorage.getItem('plangId') || '1';
  const file = pimg.files[0];
  const name = pname.value.trim();
  const stateid = document.getElementById('pStateId').value.trim();
  const cityid = document.getElementById('pCityId').value.trim();
  const nameError = document.getElementById('pnrm');
  nameError.innerText = '';

  if (!name) {
    nameError.innerText = window.userNameEr.required;
    return;
  }

  if (!confirm(window.allError.upDate)) return;

  let fd = new FormData();
  fd.append('ptheme', themeValue);
  fd.append('plang', languageId);
  fd.append('pname', name);
  if (file) fd.append('pimg', file);
  if (stateid) fd.append('pstateid', stateid);
  if (cityid) fd.append('pcityid', cityid);

  pUpbtnText.disabled = true;
  pUpbtnText.innerText = '';
  pLoaderUpdate.classList.remove('hidden');

  fetch('/portal/profile/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRF(),
    },
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.message);
        return;
      }
      if (data.success) {
        pUpbtnText.innerText = data.message;
        setTimeout(() => {
          pUpbtnText.innerText = window.allError.profileUpdate;
        }, 2000);
      }
    })
    .catch(() => {
      alert(window.allError.tryAgain);
      pUpbtnText.innerText = window.allError.profileUpdate;
      pLoaderUpdate.classList.add('hidden');
    })
    .finally(() => {
      pUpbtnText.disabled = false;
      pLoaderUpdate.classList.add('hidden');
      if (!uUpbtnText.innerText) {
        uUpbtnText.innerText = window.allError.profileUpdate;
      }
    });
});

// CSRF token function
function getCSRF() {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];
}
