/* ============================================================
   MY SITE — CONTACT
   Form Validation + Toast + EmailJS-ready
   ============================================================ */

(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ---------- 1. CONFIG ---------- */
  // EmailJS'ga ulash uchun keyinchalik quyidagilarni to'ldiring:
  const EMAILJS_CONFIG = {
    enabled: false,
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
  };

  /* ---------- 2. FIELD RULES ---------- */
  const rules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 60,
      messages: {
        required: 'Ismingizni kiriting',
        minLength: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak',
        maxLength: 'Ism 60 ta belgidan oshmasligi kerak',
      },
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      messages: {
        required: 'Email manzilingizni kiriting',
        pattern: 'To\'g\'ri email manzil kiriting (masalan: ism@example.com)',
      },
    },
    subject: {
      required: true,
      minLength: 3,
      maxLength: 100,
      messages: {
        required: 'Mavzuni kiriting',
        minLength: 'Mavzu kamida 3 ta belgidan iborat bo\'lishi kerak',
        maxLength: 'Mavzu 100 ta belgidan oshmasligi kerak',
      },
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      messages: {
        required: 'Xabar matnini kiriting',
        minLength: 'Xabar kamida 10 ta belgidan iborat bo\'lishi kerak',
        maxLength: 'Xabar 1000 ta belgidan oshmasligi kerak',
      },
    },
  };

  /* ---------- 3. VALIDATE FIELD ---------- */
  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return '';

    const v = (value || '').trim();

    if (rule.required && !v) {
      return rule.messages.required;
    }

    if (rule.minLength && v.length < rule.minLength) {
      return rule.messages.minLength;
    }

    if (rule.maxLength && v.length > rule.maxLength) {
      return rule.messages.maxLength;
    }

    if (rule.pattern && !rule.pattern.test(v)) {
      return rule.messages.pattern;
    }

    return '';
  }

  /* ---------- 4. SHOW / CLEAR ERROR ---------- */
  function showError(name, message) {
    const group = form.querySelector(`[name="${name}"]`)?.closest('.form-group');
    const errEl = form.querySelector(`[data-error-for="${name}"]`);

    if (group) group.classList.add('error');
    if (errEl) errEl.textContent = message;

    // Shake animation
    if (group) {
      group.classList.add('shake');
      setTimeout(() => group.classList.remove('shake'), 400);
    }
  }

  function clearError(name) {
    const group = form.querySelector(`[name="${name}"]`)?.closest('.form-group');
    const errEl = form.querySelector(`[data-error-for="${name}"]`);

    if (group) group.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  /* ---------- 5. REAL-TIME VALIDATION ---------- */
  Object.keys(rules).forEach((name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = validateField(name, input.value);
      if (error) showError(name, error);
      else clearError(name);
    });

    input.addEventListener('input', () => {
      // Only clear error while typing if field is now valid
      if (input.closest('.form-group')?.classList.contains('error')) {
        const error = validateField(name, input.value);
        if (!error) clearError(name);
      }
    });
  });

  /* ---------- 6. SUBMIT ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect values
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // Validate all
    let hasError = false;
    let firstErrorField = null;

    Object.keys(rules).forEach((name) => {
      const error = validateField(name, data[name]);
      if (error) {
        showError(name, error);
        if (!firstErrorField) firstErrorField = name;
        hasError = true;
      } else {
        clearError(name);
      }
    });

    if (hasError) {
      if (firstErrorField) {
        form.querySelector(`[name="${firstErrorField}"]`)?.focus();
      }
      if (window.showToast) {
        window.showToast(
          'Xatolik',
          'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring',
          'error'
        );
      }
      return;
    }

    // Submit button state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Xabar yuborish';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Yuborilmoqda...';
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // TODO: EmailJS integratsiyasi (kelajakda)
      if (EMAILJS_CONFIG.enabled && window.emailjs) {
        await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
          },
          EMAILJS_CONFIG.publicKey
        );
      }

      // Success
      if (window.showToast) {
        window.showToast(
          'Muvaffaqiyat!',
          'Xabaringiz muvaffaqiyatli yuborildi. Tez orada javob beraman!',
          'success',
          5000
        );
      }

      // Reset
      form.reset();
      Object.keys(rules).forEach(clearError);

      // Log for demo
      console.log('[MY SITE] Demo xabar:', data);

    } catch (err) {
      console.error('Xabar yuborishda xatolik:', err);
      if (window.showToast) {
        window.showToast(
          'Xatolik',
          'Xabar yuborilmadi. Iltimos, keyinroq qayta urinib ko\'ring.',
          'error'
        );
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });

  /* ---------- 7. CHARACTER COUNTER (message) ---------- */
  const messageField = form.querySelector('[name="message"]');
  const messageError = form.querySelector('[data-error-for="message"]');

  if (messageField && messageError) {
    messageField.addEventListener('input', () => {
      const len = messageField.value.length;
      const max = rules.message.maxLength;

      // Don't overwrite error messages
      if (messageField.closest('.form-group')?.classList.contains('error')) return;

      if (len > max) {
        messageError.textContent = `Xabar juda uzun (${len}/${max})`;
        messageError.style.color = '#EF4444';
      } else {
        messageError.textContent = '';
      }
    });
  }
})();