let currentStep = 0;
let isPropertyCreated = false;
const propertySetps = document.querySelectorAll('.step');
const propertyStepName = document.querySelectorAll('.step-name');
const propertyContents = document.querySelectorAll('.step-content');

function showStep(index) {
  if (index < 0 || index >= propertyContents.length) return;
  propertySetps.forEach((item) => {
    item.classList.remove('active');
  });
  propertyStepName.forEach((item) => {
    item.classList.remove('active');
  });
  propertyContents.forEach((item) => {
    item.classList.remove('active');
  });
  propertySetps[index].classList.add('active');
  propertyStepName[index].classList.add('active');
  propertyContents[index].classList.add('active');
  currentStep = index;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function nextStep() {
  if (currentStep < propertyContents.length - 1) {
    showStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
showStep(0);
