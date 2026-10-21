var supportForm = document.getElementById('supportForm');
var supportStatus = document.getElementById('formStatus');
if (new URLSearchParams(location.search).get('submitted') === '1') {
  supportStatus.textContent = 'Your inquiry was saved. Thank you for contacting ZeroUpload.';
}
supportForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  var button = document.getElementById('submitBtn');
  button.disabled = true;
  supportStatus.textContent = 'Saving your inquiry…';
  try {
    var response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' },
      body: new URLSearchParams(new FormData(supportForm))
    });
    var result = await response.json();
    if (!response.ok) {
      supportStatus.textContent = response.status === 429 ? 'Too many inquiries. Please wait ten minutes and try again.' : 'Your inquiry was not saved. Check the form fields or try again later.';
      return;
    }
    supportStatus.textContent = 'Inquiry saved. Reference: ' + result.id + '. Keep this reference for follow-up.';
    supportForm.reset();
  } catch {
    supportStatus.textContent = 'Unable to reach support. Your inquiry was not confirmed; please try again.';
  } finally { button.disabled = false; }
});
