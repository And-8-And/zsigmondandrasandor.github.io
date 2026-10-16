
var EMAILJS_PUBLIC_KEY  = 'PPn3LqQon7Dpe63wp';
var EMAILJS_SERVICE_ID  = 'service_5v414uk';
var EMAILJS_TEMPLATE_ID = 'template_f6lldf8';
var RECAPTCHA_SITE_KEY  = '6Led__EtAAAAACBTMv7fXEUhmuBCfchY07zAAj_y';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

var captchaId;
var form = document.getElementById('contact-form');
var statusEl = document.getElementById('form-status');

function onloadCaptcha() {
  captchaId = grecaptcha.render('recaptcha', {
    sitekey: RECAPTCHA_SITE_KEY,
    size: 'invisible',
    callback: sendMail
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (form.website.value) return;
  if (!form.checkValidity()) {
    statusEl.textContent = 'Please fill in all fields correctly.';
    return;
  }
  statusEl.textContent = 'Sending...';
  grecaptcha.execute(captchaId);
});

function sendMail() {
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(function () {
      if (window.gtag) { gtag('event', 'generate_lead', { method: 'contact_form' }); }
      statusEl.textContent = 'Thank you, your message was sent. A confirmation email is on its way.';
      form.reset();
      grecaptcha.reset(captchaId);
    }, function () {
      statusEl.textContent = 'Something went wrong, please try again later.';
      grecaptcha.reset(captchaId);
    });
}
