/* حمد العقيل للاستقدام — سلوكيات الموقع المشتركة */
(function () {
  'use strict';

  // ===== بيانات التواصل (مصدر واحد للحقيقة) =====
  // الرقم الموحد كما في الموقع الرسمي alaqeelmanpower.com
  var PHONE = '920015350';
  var WA_LINK = 'https://api.whatsapp.com/send?phone=' + PHONE;

  function waLinkWithText(text) {
    return WA_LINK + '&text=' + encodeURIComponent(text);
  }

  // ===== قائمة الجوال =====
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ===== نموذج طلب الاستقدام (الرئيسية + تواصل معنا) =====
  var form = document.querySelector('[data-order-form]');
  if (form) {
    var errorBox = form.querySelector('.form-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var service = form.querySelector('[name="service"]');
      var country = form.querySelector('[name="country"]');
      var notes = form.querySelector('[name="notes"]');

      var errors = [];
      name.classList.remove('invalid');
      phone.classList.remove('invalid');

      if (!name.value.trim()) {
        errors.push('فضلاً أدخل الاسم الكريم.');
        name.classList.add('invalid');
      }
      var phoneDigits = phone.value.replace(/[^0-9]/g, '');
      if (!/^(05\d{8}|9665\d{8})$/.test(phoneDigits)) {
        errors.push('فضلاً أدخل رقم جوال سعودي صحيح (مثال: 05xxxxxxxx).');
        phone.classList.add('invalid');
      }

      if (errors.length) {
        if (errorBox) {
          errorBox.textContent = errors.join(' ');
          errorBox.classList.add('show');
        }
        return;
      }
      if (errorBox) errorBox.classList.remove('show');

      var lines = [
        'السلام عليكم، أرغب بطلب استقدام:',
        'الاسم: ' + name.value.trim(),
        'الجوال: ' + phone.value.trim(),
        'الخدمة: ' + service.value,
        'الدولة: ' + country.value,
      ];
      if (notes && notes.value.trim()) lines.push('ملاحظات: ' + notes.value.trim());
      window.open(waLinkWithText(lines.join('\n')), '_blank');
    });
  }

  // ===== سلايدر الهيرو =====
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var slides = slider.querySelectorAll('.slide');
    if (slides.length < 2) return;
    var dotsWrap = slider.querySelector('.slider-dots');
    var dots = [];
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'شريحة ' + (i + 1));
      dot.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function go(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 5000);
    }

    var next = slider.querySelector('.slider-arrow.next');
    var prev = slider.querySelector('.slider-arrow.prev');
    if (next) next.addEventListener('click', function () { go(current + 1); restart(); });
    if (prev) prev.addEventListener('click', function () { go(current - 1); restart(); });

    // سحب باللمس على الجوال
    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(dx > 0 ? current + 1 : current - 1); restart(); }
      startX = null;
    }, { passive: true });

    restart();
  });

  // ===== أزرار عروض الصيف =====
  document.querySelectorAll('.offer-order').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var country = btn.getAttribute('data-country');
      var price = btn.getAttribute('data-price');
      var msg = 'السلام عليكم، أرغب بالاستفادة من عرض الصيف لاستقدام عاملة من ' +
        country + ' بسعر ' + price + ' ريال.';
      window.open(waLinkWithText(msg), '_blank');
    });
  });

  // ===== فلترة السير الذاتية =====
  var filterButtons = document.querySelectorAll('.cv-filter');
  var cvCards = document.querySelectorAll('.cv-card');
  if (filterButtons.length && cvCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var target = btn.getAttribute('data-filter');
        cvCards.forEach(function (card) {
          var match = target === 'الكل' || card.getAttribute('data-nationality') === target;
          card.classList.toggle('hidden', !match);
        });
      });
    });
  }

  // ===== زر «اطلب هذه السيرة» =====
  document.querySelectorAll('.cv-request').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.cv-card');
      var msg = 'السلام عليكم، أرغب بالاستفسار عن السيرة الذاتية رقم ' +
        card.getAttribute('data-ref') + ' (' +
        card.getAttribute('data-role') + ' — ' +
        card.getAttribute('data-nationality') + ')';
      window.open(waLinkWithText(msg), '_blank');
    });
  });
})();
