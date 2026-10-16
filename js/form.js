/* ===== FILL THESE IN (see README steps in the chat) ===== */
var EMAILJS_PUBLIC_KEY  = 'IDE_A_PUBLIC_KEY';
var EMAILJS_SERVICE_ID  = 'IDE_A_SERVICE_ID';
var EMAILJS_TEMPLATE_ID = 'IDE_A_FO_SABLON_ID';   // main template; its Auto-Reply tab links the confirmation template
var RECAPTCHA_SITE_KEY  = 'IDE_A_SITE_KEY';        // reCAPTCHA v2 Invisible
/* ======================================================== */

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
  if (form.website.value) return;                  // honeypot: bots fill this
  if (!form.checkValidity()) {
    statusEl.textContent = 'Please fill in all fields correctly.';
    return;
  }
  statusEl.textContent = 'Sending...';
  grecaptcha.execute(captchaId);                   // invisible check, then sendMail()
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
