// variable u-login
const uLogin = document.getElementById('uLogin');
// variable phone input
const countryCode = document.getElementById('uCountryCodeBtn');
countryCode.disabled = true;
const phoneCode = document.getElementById('uCountryId');
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
// variable u profile
const uProfile = document.getElementById('uProfile');
const uAvatarPreview = document.getElementById('avatarPreview');
const uimg = document.getElementById('avatarInput');
// variable img loader
const uImgLoader = document.getElementById('uImgLoader');
const uname = document.getElementById('uname');
// variable u skip btn
const uConBtn = document.getElementById('uConBtn');
// variable state select btn
document.getElementById('uStateId').value = "";
document.getElementById('uSelectedState').innerText = '{% trans "Select State" %}';
// variable city select btn
const ucitylabel = document.getElementById('uCityLabel');
ucitylabel.classList.add('disabled');
const ucitybtn = document.getElementById('uCityBtn');
ucitybtn.disabled = true
document.getElementById('uCityId').value = "";
document.getElementById('uSelectedCity').innerText = '{% trans "Select City" %}';
// variable update profile btn
const uUpdateBtn = document.getElementById('uUpdateBtn');
const uUpbtnText = document.getElementById('uUpbtnText')
uUpbtnText.innerText = '{% trans "Update profile" %}';
const uLoaderUpdate = document.getElementById('uLoaderUpdate');
uLoaderUpdate.classList.add('hidden');

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
hideLoader(uImgLoader);

otpInputs.forEach((input) => {
    input.disabled = true;
    input.value = "";
});
let senconds
let isPaused = false;

// Start Timer function
function startTimer() {
    senconds = 120
    isPaused = false;
    resendOtpB.disabled = true;
    const otpTimer = setInterval(() => {
        if (isPaused) return;
        let mins = Math.floor(senconds / 60);
        let secs = senconds % 60;
        timerText.innerText = `${mins}:${secs < 10 ? '0' : ""}${secs}`;
        if (senconds <= 0) {
            clearInterval(otpTimer);
            otpInputs.forEach((input) => {
                input.disabled = true;
            })
            resendOtpB.disabled = false;
        }
        senconds--;
    }, 1000)
}

// Stop Timer function
function pausedTime() {
    isPaused = true;
}

// check Phone number input validation
phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    const phoneInput = this.value;
    // phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
    if (phoneInput.length === 0) {
        phoneError.innerText = '{% trans "Phone number is required" %}';
        phoneCheckIcon.classList.remove('flex');
        phoneCheckIcon.classList.add('hidden');
        return;
    }
    if (!/^[6-9]\d{9}$/.test(phoneInput)) {
        phoneError.innerText = '{% trans "Enter a valid phone number" %}';
        phoneCheckIcon.classList.remove('flex');
        phoneCheckIcon.classList.add('hidden');
        return;
    }
    phoneError.innerText = "";
    phoneCheckIcon.classList.remove('hidden');
    phoneCheckIcon.classList.add('flex');
});

// check OTP input validation
sendOtp.addEventListener('click', function (e) {
    e.preventDefault();
    const phone = phoneInput.value.trim()
    phoneError.innerText = "";
    if (phone === "") {
        phoneError.innerText = '{% trans "Phone number is required" %}';
        phoneCheckIcon.classList.remove('flex');
        phoneCheckIcon.classList.add('hidden');
        phoneInput.focus();
        return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
        phoneError.innerText = '{% trans "Enter a valid phone number" %}';
        phoneCheckIcon.classList.remove('flex');
        phoneCheckIcon.classList.add('hidden');
        return;
    }
    phoneError.innerText = "";
    phoneCheckIcon.classList.remove('hidden');
    phoneCheckIcon.classList.add('flex');

    sendOTP();
});

// send OTP
function sendOTP() {
    const codeID = uCountryId.value.trim();
    const codeShow = document.getElementById('uSelectedCode').innerText;
    const phone = phoneInput.value.trim();
    phoneError.innerText = "";
    countryCode.disabled = true;
    phoneInput.disabled = true;
    sendOtp.disabled = true;
    btnText.innerText = "{% trans 'OTP Sending...' %}";
    sendOtpLoder.classList.remove('hidden');

    fetch('/login/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': getCSRF(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phone,
            code: codeID
        })
    })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Request failed");
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
                })
                otpInputs[0].focus();
                startTimer();
            }
        })
        .catch((error) => {
            phoneError.innerText = error.message || "{% trans 'Something went wrong. Try again.' %}";
            countryCode.disabled = false;
            phoneInput.disabled = false;
            sendOtp.disabled = false;
            sendOtp.classList.replace('flex', 'hidden');
        })
        .finally(() => {
            btnText.innerText = "{% trans 'Send OTP' %}";
            sendOtpLoder.classList.add('hidden');
        });
}

// check OTP input validation
otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        // Allow only number
        input.value = input.value.replace(/[^0-9]/g, "");
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
    })
    // Paste OTP
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        let pasteData = e.clipboardData.getData("text").trim();
        pasteData = pasteData.replace(/[^0-9]/g, "");

        pasteData.split("").forEach((char, i) => {
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
    let otp = "";
    otpInputs.forEach((input) => {
        otp += input.value;
    })
    return otp;
}

// Resend OTP
function resendOTP() {
    resendOtpB.disabled = true;
    otpError.innerText = "";
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
                    input.value = "";
                })
                otpInputs[0].focus();
                startTimer();
            }
        })
        .catch(() => {
            otpError.innerText = "{% trans 'Something went wrong. Please Try again.' %}";
        })
}

// Verify OTP
function verifyOTP() {
    const uSelectedState = document.getElementById('uSelectedState');
    const uStateId = document.getElementById('uStateId');
    const uSelectedCity = document.getElementById('uSelectedCity');
    const uCityId = document.getElementById('uCityId');
    otpError.innerText = "";
    otpClockIcon.classList.add('hidden');
    resendOtpB.classList.add('hidden');
    timerText.classList.add('hidden');
    verifyOtpLoader.classList.remove('hidden');
    verifyOtpLoader.classList.add('flex');
    let otp = getOTP();
    if (otp.length !== 6) {
        otpError.innerText = '{% trans "Enter complete 6-digit OTP" %}';
        otpInputs[0].focus();
        return;
    }
    fetch('/verify-otp/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': getCSRF(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp: otp })
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
                    input.value = "";
                })
                otpInputs[0].focus();
                return;
            }
            if (data.success) {
                otpError.innerText = "";
                pausedTime();
                otpClockIcon.classList.add('hidden');
                resendOtpB.classList.add('hidden');
                timerText.classList.add('hidden');
                verifyOtpLoader.classList.replace('flex', 'hidden');
            }
            if (data.step === 'profile') {
                uLogin.classList.replace('flex', 'hidden');
                uProfile.classList.remove('hidden');
                uProfile.classList.add('flex');
            }
            if (data.profile) {
                uname.value = data.profile.name || "";
                uSelectedState.innerText = data.profile.state_name || '{% trans "Select State" %}';
                uStateId.value = data.profile.state_id || "";
                if (data.profile.state_name) {
                    ucitybtn.disabled = false;
                    ucitylabel.classList.remove('disabled');
                } else {
                    ucitybtn.disabled = true;
                    ucitylabel.classList.add('disabled');
                }
                uSelectedCity.innerText = data.profile.city_name || '{% trans "Select City" %}';
                uCityId.value = data.profile.city_id || "";
                if (data.profile.img) {
                    showLoader(uImgLoader);
                    uAvatarPreview.onload = function () {
                        hideLoader(uImgLoader);
                    }
                    uAvatarPreview.onerror = function () {
                        hideLoader(uImgLoader);
                        uAvatarPreview.src = '/static/images/avatar.png';
                    }
                    uAvatarPreview.src = data.profile.img;
                } else {
                    hideLoader(uImgLoader);
                    uAvatarPreview.src = '/static/images/avatar.png';
                }
            }
        })
        .catch(() => {
            verifyOtpLoader.classList.replace('flex', 'hidden');
            resendOtpB.classList.remove('hidden');
            timerText.classList.remove('hidden');
            otpClockIcon.classList.remove('hidden');
            pausedTime();
            alert("{% trans 'Something went wrong. Try again.' %}");
        });
}

// Continue(Skip) Button
uConBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (uConBtn.disabled) return;
    uConBtn.disabled = true;
    let themeValue = localStorage.getItem('uthemeValue') || "1";
    let languageId = localStorage.getItem('ulangId') || "1";

    let fd = new FormData();
    fd.append('utheme', themeValue);
    fd.append('ulang', languageId);

    fetch('/user-profile/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRF()
        },
        body: fd
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.message || "{% trans 'Something went wrong.' %}");
            }
            if (data.success) {
                window.location.href = '/home/';
                return;
            }
        })
        .catch((error) => {
            alert("{% trans 'Network error. Please try again.' %}");
        })
        .finally(() => {
            uConBtn.disabled = false;
        })
});

// User Update Profile
uUpdateBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const themeValue = localStorage.getItem('uthemeValue') || "1";
    const languageId = localStorage.getItem('ulangId') || "1";
    const file = uimg.files[0];
    const name = uname.value.trim();
    const stateid = document.getElementById('uStateId').value.trim();
    const cityid = document.getElementById('uCityId').value.trim();
    const nameError = document.getElementById('unrm');
    nameError.innerText = "";

    if (!name) {
        nameError.innerText = '{% trans "Username is required" %}';
        return;
    }
    if (!confirm('{% trans "Are you sure you want to update your profile?" %}')) return;

    const fd = new FormData();
    fd.append('utheme', themeValue);
    fd.append('ulang', languageId);
    fd.append('uname', name);
    if (file) fd.append('uimg', file);
    if (stateid) fd.append('ustateid', stateid);
    if (cityid) fd.append('ucityid', cityid);

    uUpbtnText.disabled = true;
    uUpbtnText.innerText = "";
    uLoaderUpdate.classList.remove('hidden');

    fetch('/user-profile/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRF()
        },
        body: fd
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.message);
                return;
            }
            if (data.success) {
                uUpbtnText.innerText = data.message;
                setTimeout(() => {
                    uUpbtnText.innerText = '{% trans "Update profile" %}';
                }, 2000)
            }
        })
        .catch(() => {
            alert("{% trans 'Something went wrong. Try again.' %}");
            uUpbtnText.innerText = '{% trans "Update profile" %}';
            uLoaderUpdate.classList.add('hidden');
        })
        .finally(() => {
            uUpbtnText.disabled = false;
            uLoaderUpdate.classList.add('hidden');
            if (!uUpbtnText.innerText) {
                uUpbtnText.innerText = "{% trans 'Update profile' %}";
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