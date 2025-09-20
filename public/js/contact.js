(() => {
  "use strict";

  // Constants for form elements
  const FORM_ID = "contact-form";
  const RESPONSE_ID = "contact-button-response";
  const FIRST_NAME_ID = "contact-first";
  const MIDDLE_NAME_ID = "contact-middle";
  const LAST_NAME_ID = "contact-last";
  const EMAIL_ID = "contact-email-addr";
  const MESSAGE_ID = "contact-question";

  const FORM_TIMEOUT = 5000; // 5 seconds for message display

  // Utility to trim and check a string
  function sanitize(input) {
    if (typeof input === "string" && input.trim().length > 0) {
      return input.trim();
    }
    return "";
  }

  // Check validity and set custom messages
  function checkFormValidity() {
    const first = document.getElementById(FIRST_NAME_ID);
    const last = document.getElementById(LAST_NAME_ID);
    const email = document.getElementById(EMAIL_ID);
    const message = document.getElementById(MESSAGE_ID);

    first.setCustomValidity(first.value.trim() ? "" : "Please enter your first name.");
    last.setCustomValidity(last.value.trim() ? "" : "Please enter your last name.");
    email.setCustomValidity(email.value.trim() ? "" : "Please enter your email.");
    message.setCustomValidity(message.value.trim() ? "" : "Please enter a message.");

    return first.checkValidity() && last.checkValidity() && email.checkValidity() && message.checkValidity();
  }

  // Disable form while sending
  function disableForm() {
    const elements = document.getElementById(FORM_ID).elements;
    Array.from(elements).forEach((el) => (el.disabled = true));
  }

  // Enable form after sending
  function enableForm() {
    const elements = document.getElementById(FORM_ID).elements;
    Array.from(elements).forEach((el) => (el.disabled = false));
  }

  // Clear response message
  function clearResponse() {
    const resp = document.getElementById(RESPONSE_ID);
    resp.className = "";
    resp.textContent = "";
  }

  // Send the email via fetch
  async function sendContactEmail() {
    const first = sanitize(document.getElementById(FIRST_NAME_ID).value);
    const middle = sanitize(document.getElementById(MIDDLE_NAME_ID).value);
    const last = sanitize(document.getElementById(LAST_NAME_ID).value);
    const email = sanitize(document.getElementById(EMAIL_ID).value);
    const message = sanitize(document.getElementById(MESSAGE_ID).value);

    const fullName = [first, middle, last].filter(Boolean).join(" ");
    const requestBody = {
      sub: `I have a secret! - Contact Form Submission from ${fullName} <${email}>`,
      txt: message,
    };

    const responseEl = document.getElementById(RESPONSE_ID);
    disableForm();

    try {
      const response = await fetch("/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        responseEl.classList.add("text-success");
        responseEl.textContent = "Message sent successfully. Thank you!";
        document.getElementById(FORM_ID).reset();
        document.getElementById(FORM_ID).classList.remove("was-validated");
      } else {
        throw new Error("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      responseEl.classList.add("text-danger");
      responseEl.textContent = "Error sending message. Please try again later.";
    }

    setTimeout(() => {
      clearResponse();
      enableForm();
    }, FORM_TIMEOUT);
  }

  // Form submit handler
  const form = document.getElementById(FORM_ID);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add("was-validated");

    if (checkFormValidity()) {
      await sendContactEmail();
    }
  });

  // Real-time validation feedback
  form.addEventListener("input", () => {
    form.classList.remove("was-validated");
    checkFormValidity();
    form.classList.add("was-validated");
  });
})();
