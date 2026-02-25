function qs(s) { return document.querySelector(s); }

/* 1. MUSIC OVERLAY */
(function () {
  var overlay = qs('#music-overlay'), audio = qs('#bgAudio'),
    btnYes = qs('#btnMusicYes'), btnNo = qs('#btnMusicNo'),
    toggleBtn = qs('#audioToggleBtn');
  var isPlaying = false;
  function openCard() {
    var sides = qs('#card-opening-sides'); if (!sides) return;
    setTimeout(function () { sides.classList.add('_animating'); }, 100);
    setTimeout(function () { sides.style.display = 'none'; }, 5200);
  }
  function dismiss() {
    overlay.classList.add('hiding');
    setTimeout(function () { overlay.classList.add('hidden'); }, 650);
    openCard();
  }
  function setPlaying(state) {
    isPlaying = state;
    if (toggleBtn) {
      var pi = toggleBtn.querySelector('.icon-play'), pa = toggleBtn.querySelector('.icon-pause');
      if (pi) pi.style.display = isPlaying ? 'none' : '';
      if (pa) pa.style.display = isPlaying ? '' : 'none';
      toggleBtn.classList.toggle('playing', isPlaying);
    }
  }
  function fadeIn() {
    audio.volume = 0; audio.play().catch(function () { });
    var v = 0, t = setInterval(function () { v = Math.min(v + 0.04, 0.6); audio.volume = v; if (v >= 0.6) clearInterval(t); }, 100);
    setPlaying(true);
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (isPlaying) { audio.pause(); setPlaying(false); }
      else { audio.play().catch(function () { }); setPlaying(true); }
    });
  }
  btnYes.addEventListener('click', function () { fadeIn(); dismiss(); });
  btnNo.addEventListener('click', dismiss);
})();

/* 2. LIVE COUNTDOWN */
(function () {
  var target = new Date('2026-03-27T11:30:00');
  var elD = qs('#lcd-days'), elH = qs('#lcd-hours'), elM = qs('#lcd-minutes'), elS = qs('#lcd-seconds');
  var prev = {};
  function pad(n) { return String(n).padStart(2, '0'); }
  function flash(el) { el.classList.add('flip'); setTimeout(function () { el.classList.remove('flip'); }, 150); }
  function tick() {
    var diff = Math.max(0, target - new Date());
    var d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
      m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    if (prev.d !== d) { elD.textContent = pad(d); flash(elD); prev.d = d; }
    if (prev.h !== h) { elH.textContent = pad(h); flash(elH); prev.h = h; }
    if (prev.m !== m) { elM.textContent = pad(m); flash(elM); prev.m = m; }
    if (prev.s !== s) { elS.textContent = pad(s); flash(elS); prev.s = s; }
  }
  tick(); setInterval(tick, 1000);
})();

/* 3. GUEST NAME TYPEWRITER */
(function () {
  var params = new URLSearchParams(window.location.search);
  var guest = params.get('guest') || '';
  var typedEl = qs('#guest-name-typed'), suffixEl = qs('#guest-invite-suffix');
  if (!guest) {
    var line = qs('#invite-text-line');
    if (line) line.innerHTML = '<span style="font-family:var(--font-sans);font-size:1rem;color:var(--c-mid);">Thân mời đến dự lễ thành hôn của chúng tôi</span>';
    return;
  }
  if (suffixEl) suffixEl.textContent = '\u00a0đến dự lễ thành hôn của chúng tôi';
  var i = 0;
  function type() {
    if (i < guest.length) { typedEl.textContent += guest[i]; i++; setTimeout(type, 80); }
    else typedEl.classList.add('done');
  }
  setTimeout(type, 900);
})();

/* 4. SCROLL REVEAL */
(function () {
  var els = document.querySelectorAll('.sr');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('sr-visible'); }); return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var siblings = en.target.parentElement.querySelectorAll('.sr');
        var idx = Array.prototype.indexOf.call(siblings, en.target);
        en.target.style.transitionDelay = (idx * 0.10) + 's';
        en.target.classList.add('sr-visible');
        io.unobserve(en.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
  });
  els.forEach(function (e) { io.observe(e); });
})();

/* 5. LOVE STORY hearts + petals */
(function () {
  var hc = qs('#loveHeartsContainer');
  if (hc) {
    var em = ['❤️', '💕', '💖', '✨', '🌸'];
    for (var i = 0; i < 12; i++) {
      var h = document.createElement('div'); h.className = 'love-heart';
      h.textContent = em[Math.floor(Math.random() * em.length)];
      h.style.cssText = 'left:' + (5 + Math.random() * 90) + '%;bottom:' + (Math.random() * 35) + '%;font-size:' + (0.85 + Math.random() * 0.85) + 'rem;animation-duration:' + (4 + Math.random() * 5) + 's;animation-delay:' + (Math.random() * 7) + 's;';
      hc.appendChild(h);
    }
  }
  var pc = qs('#petalsContainer');
  if (pc) {
    var cols = ['#f9c4c4', '#f7a8a8', '#fcdde8', '#f9d4c6', '#fce4b8', '#ffd6e0'];
    for (var j = 0; j < 20; j++) {
      var p = document.createElement('div'); p.className = 'petal';
      p.style.cssText = 'left:' + (Math.random() * 100) + '%;background:' + cols[Math.floor(Math.random() * cols.length)] + ';width:' + (7 + Math.random() * 10) + 'px;height:' + (9 + Math.random() * 12) + 'px;animation-duration:' + (7 + Math.random() * 9) + 's;animation-delay:' + (Math.random() * 12) + 's;';
      pc.appendChild(p);
    }
  }
})();

/* 6. AUTO SLIDESHOW */
(function () {
  var slides = document.querySelectorAll('#albumSlideshow .slide');
  var dotsWrap = qs('#slideDots'), prevBtn = qs('#slidePrev'), nextBtn = qs('#slideNext');
  if (!slides.length) return;
  var cur = 0, timer = null;
  slides.forEach(function (_, i) {
    var d = document.createElement('button'); d.className = 'sdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', function () { goTo(i); });
    dotsWrap.appendChild(d);
  });
  function getDots() { return document.querySelectorAll('.sdot'); }
  function goTo(n) {
    slides[cur].classList.remove('active'); getDots()[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active'); getDots()[cur].classList.add('active');
    var img = slides[cur].querySelector('img'); img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
  }
  function startAuto() { timer = setInterval(function () { goTo(cur + 1); }, 5000); }
  function stopAuto() { clearInterval(timer); }
  startAuto();
  prevBtn.addEventListener('click', function () { stopAuto(); goTo(cur - 1); startAuto(); });
  nextBtn.addEventListener('click', function () { stopAuto(); goTo(cur + 1); startAuto(); });
  var wrap = qs('#albumSlideshow');
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);
})();

/* 7. FILMSTRIP */
(function () {
  var track = qs('#filmTrack');
  var frame = qs('#card-gallery-film-frame');
  if (!track || !frame) return;
  var PHOTOS = [
    'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg',
    'images/image9.jpg', 'images/image10.jpg'
  ];
  var FRAME_LABELS = ['01A', '02A', '03A', '04A', '05A'];
  var SPEED = 0.82;
  var offset = 0;
  var paused = false;
  var unitWidth = 0;
  var TOTAL_UNITS = 0;
  function makeUnit(photoSrc, label, holeCount) {
    var unit = document.createElement('div'); unit.className = 'film-unit';
    function makeSprocket() {
      var sp = document.createElement('div'); sp.className = 'film-sprocket';
      for (var i = 0; i < holeCount; i++) {
        var hole = document.createElement('div'); hole.className = 'film-hole'; sp.appendChild(hole);
      }
      return sp;
    }
    var edgeTop = document.createElement('div'); edgeTop.className = 'film-edge-top';
    var edgeBottom = document.createElement('div'); edgeBottom.className = 'film-edge-bottom';
    var photo = document.createElement('div'); photo.className = 'film-photo';
    photo.style.backgroundImage = 'url(' + photoSrc + ')';
    photo.setAttribute('data-frame', label);
    unit.appendChild(makeSprocket()); unit.appendChild(edgeTop);
    unit.appendChild(photo); unit.appendChild(edgeBottom); unit.appendChild(makeSprocket());
    return unit;
  }
  function buildStrip() {
    track.innerHTML = '';
    var h = frame.offsetHeight || 220;
    unitWidth = Math.round(h * 0.78);
    var holeCount = Math.max(2, Math.round(unitWidth / 18));
    var allPhotos = PHOTOS.concat(PHOTOS);
    var allLabels = FRAME_LABELS.concat(FRAME_LABELS);
    allPhotos.forEach(function (src, i) {
      var unit = makeUnit(src, allLabels[i % FRAME_LABELS.length], holeCount);
      unit.style.width = unitWidth + 'px';
      track.appendChild(unit);
    });
    TOTAL_UNITS = allPhotos.length;
  }
  function sizeUnits() { buildStrip(); offset = 0; track.style.transform = 'translateX(0)'; }
  var rafId = null;
  function startLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    var loopWidth = unitWidth * (TOTAL_UNITS / 2);
    function step() {
      if (!paused) {
        offset += SPEED;
        if (offset >= loopWidth) offset -= loopWidth;
        track.style.transform = 'translateX(-' + offset.toFixed(2) + 'px)';
      }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }
  function init() { sizeUnits(); startLoop(); }
  requestAnimationFrame(function () { requestAnimationFrame(init); });
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (rafId) cancelAnimationFrame(rafId); sizeUnits(); startLoop(); }, 200);
  });
  frame.addEventListener('mouseenter', function () { paused = true; });
  frame.addEventListener('mouseleave', function () { paused = false; });
  frame.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  frame.addEventListener('touchend', function () { setTimeout(function () { paused = false; }, 1500); }, { passive: true });
})();

/* 8. CALENDAR */
(function () {
  var grid = qs('#ccalDays'); if (!grid) return;
  var startDay = 0, totalDays = 31, weddingDay = 27;
  for (var e = 0; e < startDay; e++) {
    var empty = document.createElement('div'); empty.className = 'ccal-day empty'; grid.appendChild(empty);
  }
  for (var d = 1; d <= totalDays; d++) {
    var cell = document.createElement('div');
    var dow = (startDay + d - 1) % 7;
    var cls = 'ccal-day';
    if (dow === 0) cls += ' sun'; if (dow === 6) cls += ' sat';
    if (d === weddingDay) { cls += ' wedding-day'; cell.className = cls; cell.innerHTML = '<div class="day-bg"></div>' + d; }
    else { cell.className = cls; cell.textContent = d; }
    grid.appendChild(cell);
  }
  var calSection = qs('#card-calendar'); if (!calSection) return;
  var triggered = false;
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true; var book = qs('#ccalBook'); if (book) book.classList.add('cal-page-flip'); io.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(calSection);
})();

/* 9. WISH POPUP */
(function () {
  var overlay = qs('#wishPopupOverlay');
  var closeBtn = qs('#wishPopupClose');
  var popName = qs('#wishPopupName'), popMsg = qs('#wishPopupMsg');
  function openPopup(name, msg) {
    popName.textContent = name; popMsg.textContent = msg;
    popMsg.scrollTop = 0;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });
  window._openWishPopup = openPopup;
})();

/* 10. WISHES — Google Sheets + ticker + FIX 3: drag-to-scroll */
(function () {
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbwkrSDvAaio7AzTojeuweNky2zXWAIETvD05-0vfaFQw9uCSrjCVyw33ufT6kvdBx2b/exec';
  var LONG_MSG_LIMIT = 80;
  var track = qs('#wishList'), wrap = qs('#wishTickerWrap'), countRow = qs('#wishCountRow');
  var form = qs('#wishForm'), status = qs('#wf-status');
  var IS_CONFIGURED = GAS_URL.indexOf('THAY_BANG') === -1;

  /* --- FIX 3: drag-to-scroll state --- */
  var drag = {
    active: false,
    startX: 0,
    startOffset: 0
  };

  var ticker = {
    raf: null, offset: 0, speed: 0.55, totalW: 0, paused: false,
    start: function () {
      var self = this; if (self.raf) cancelAnimationFrame(self.raf);
      (function step() {
        if (!self.paused && self.totalW > 0) {
          self.offset += self.speed;
          if (self.offset >= self.totalW / 2) self.offset = 0;
          if (track) track.style.transform = 'translateX(-' + self.offset + 'px)';
        }
        self.raf = requestAnimationFrame(step);
      })();
    },
    stop: function () { if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; } },
    measure: function () { if (track) this.totalW = track.scrollWidth; }
  };

  /* --- Drag events on the wrapper --- */
  if (wrap) {
    /* MOUSE drag */
    wrap.addEventListener('mousedown', function (e) {
      drag.active = true;
      drag.startX = e.clientX;
      drag.startOffset = ticker.offset;
      ticker.paused = true;
      wrap.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
      if (!drag.active) return;
      var delta = drag.startX - e.clientX;
      var newOffset = drag.startOffset + delta;
      /* Clamp within looping range */
      var half = ticker.totalW / 2;
      if (half > 0) {
        newOffset = ((newOffset % half) + half) % half;
      }
      ticker.offset = newOffset;
      if (track) track.style.transform = 'translateX(-' + ticker.offset + 'px)';
    });
    document.addEventListener('mouseup', function () {
      if (!drag.active) return;
      drag.active = false;
      wrap.style.cursor = 'grab';
      /* Resume auto-scroll after a short pause */
      setTimeout(function () { ticker.paused = false; }, 800);
    });

    /* TOUCH drag */
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      drag.active = true;
      drag.startX = e.touches[0].clientX;
      drag.startOffset = ticker.offset;
      ticker.paused = true;
    }, { passive: true });
    wrap.addEventListener('touchmove', function (e) {
      if (!drag.active || e.touches.length !== 1) return;
      var delta = drag.startX - e.touches[0].clientX;
      var newOffset = drag.startOffset + delta;
      var half = ticker.totalW / 2;
      if (half > 0) {
        newOffset = ((newOffset % half) + half) % half;
      }
      ticker.offset = newOffset;
      if (track) track.style.transform = 'translateX(-' + ticker.offset + 'px)';
    }, { passive: true });
    wrap.addEventListener('touchend', function () {
      drag.active = false;
      setTimeout(function () { ticker.paused = false; }, 1500);
    }, { passive: true });
  }

  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function makeCard(w) {
    var name = w.NAME || w.name || '', msg = w.MSG || w.msg || '';
    var isLong = msg.length > LONG_MSG_LIMIT;
    var card = document.createElement('div'); card.className = 'wish-card';
    var html = '<div class="wc-name">' + esc(name) + '</div><div class="wc-msg">' + esc(msg) + '</div>';
    if (isLong) html += '<button class="wc-readmore" data-name="' + esc(name) + '" data-msg="' + esc(msg) + '">Xem thêm…</button>';
    card.innerHTML = html;
    if (isLong) {
      var btn = card.querySelector('.wc-readmore');
      btn.addEventListener('click', function (e) { e.stopPropagation(); if (window._openWishPopup) window._openWishPopup(name, msg); });
    }
    return card;
  }
  function bindCloneBtn(clone) {
    var btn = clone.querySelector('.wc-readmore');
    if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); if (window._openWishPopup) window._openWishPopup(btn.dataset.name, btn.dataset.msg); });
  }
  function populateTicker(list) {
    ticker.stop(); if (!track) return;
    track.innerHTML = ''; track.style.transform = 'translateX(0)'; ticker.offset = 0;
    if (!list || !list.length) return;
    list.forEach(function (w) { track.appendChild(makeCard(w)); });
    requestAnimationFrame(function () {
      var vw = window.innerWidth || 375, safety = 0;
      while (track.scrollWidth < vw * 2.5 && safety < 8) {
        Array.prototype.slice.call(track.querySelectorAll('.wish-card')).forEach(function (c) { var cl = c.cloneNode(true); bindCloneBtn(cl); track.appendChild(cl); }); safety++;
      }
      Array.prototype.slice.call(track.querySelectorAll('.wish-card')).forEach(function (c) { var cl = c.cloneNode(true); bindCloneBtn(cl); track.appendChild(cl); });
      ticker.measure(); ticker.start();
    });
  }
  function showLoading() { ticker.stop(); if (track) { track.innerHTML = '<div class="wish-loading"><div class="wish-spinner"></div><span>Đang tải lời chúc...</span></div>'; track.style.transform = ''; } if (countRow) countRow.innerHTML = ''; }
  function showEmpty() { ticker.stop(); if (track) { track.innerHTML = '<div class="wish-empty">Chưa có lời chúc nào. Hãy là người đầu tiên! 🌸</div>'; track.style.transform = ''; } if (countRow) countRow.innerHTML = ''; }
  function showSetupNote() { ticker.stop(); if (track) track.innerHTML = '<div class="wish-setup-note">⚙️ Chưa cấu hình Google Sheets.</div>'; }
  function fetchWishes() {
    if (!IS_CONFIGURED) { showSetupNote(); return; }
    showLoading();
    fetch(GAS_URL + '?t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.length) { showEmpty(); return; }
        var list = data.slice().reverse();
        if (countRow) countRow.innerHTML = '<span class="wish-count-badge">💌 ' + list.length + ' lời chúc</span>';
        populateTicker(list);
      })
      .catch(function () { ticker.stop(); if (track) { track.innerHTML = '<div class="wish-empty">Không thể tải lời chúc lúc này 🌸</div>'; track.style.transform = ''; } });
  }
  fetchWishes(); setInterval(fetchWishes, 60000);
  if (form) {
    /* Dynamic guest count visibility */
    var rsvpYes = qs('#rsvp-yes');
    var rsvpNo = qs('#rsvp-no');
    var guestGroup = qs('#guest-count-group');
    if (rsvpYes && rsvpNo && guestGroup) {
      var updateGuestVis = function () { guestGroup.style.display = rsvpYes.checked ? 'block' : 'none'; };
      rsvpYes.addEventListener('change', updateGuestVis);
      rsvpNo.addEventListener('change', updateGuestVis);
      updateGuestVis();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = qs('#wf-name').value.trim();
      var msg = qs('#wf-msg').value.trim();
      var guests = qs('#wf-guests').value.trim() || '0';
      var rsvpRadio = document.querySelector('input[name="wf-rsvp"]:checked');
      var rsvpVal = rsvpRadio ? rsvpRadio.value : 'Chắc chắn rồi!';

      // 'rel' now only represents RSVP status
      var rel = rsvpVal;

      if (!name || !msg) { alert('Vui lòng điền tên và lời chúc nhé! 🌸'); return; }
      if (name.length > 100) { alert('Tên quá dài (tối đa 100 ký tự)!'); return; }
      if (msg.length > 500) { alert('Lời chúc quá dài (tối đa 500 ký tự)!'); return; }
      if (!IS_CONFIGURED) { alert('Chưa cấu hình Google Sheets URL.'); return; }

      var btn = form.querySelector('.submit-btn-noble');
      btn.disabled = true;
      var originalBtnInner = btn.innerHTML;
      btn.querySelector('span').textContent = 'Đang gửi...';

      fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, rel: rel, msg: msg, guestNum: guests })
      })
        .then(function () {
          status.style.display = 'block'; status.textContent = 'Đã gửi lời chúc! Cảm ơn bạn rất nhiều 🌸';
          form.reset(); btn.disabled = false; btn.innerHTML = originalBtnInner;
          if (updateGuestVis) updateGuestVis();
          setTimeout(function () { status.style.display = 'none'; }, 5000);
          setTimeout(fetchWishes, 2000);
        })
        .catch(function () {
          status.style.display = 'block'; status.style.color = '#c0392b';
          status.textContent = 'Có lỗi khi gửi, vui lòng thử lại!';
          btn.disabled = false; btn.innerHTML = originalBtnInner;
          setTimeout(function () { status.style.display = 'none'; status.style.color = ''; }, 5000);
        });
    });
  }
})();


/* 11. GIFT MODALS (Parisian + Quỹ Đen) */
(function () {
  var giftOverlay = document.getElementById('giftModalOverlay');
  var giftClose = document.getElementById('giftModalClose');
  var giftToggle = document.getElementById('giftToggleBtn');

  var qdOverlay = document.getElementById('quydenOverlay');
  var qdClose = document.getElementById('quydenClose');
  var qdTriggers = document.querySelectorAll('.qd-trigger-btn');
  var qdOpenBtn = document.getElementById('openQuyDen'); // Legacy support
  var giftBoxCard = document.getElementById('giftBoxBtn'); // Gift card in the content

  function openGift() {
    if (giftOverlay) giftOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeGift() {
    if (giftOverlay) giftOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openQD() {
    // Close Gift modal if opening Quỹ Đen
    closeGift();
    setTimeout(function () {
      if (qdOverlay) qdOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 100);
  }
  function closeQD() {
    if (qdOverlay) qdOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Event Listeners
  if (giftToggle) giftToggle.addEventListener('click', openGift);
  if (giftClose) giftClose.addEventListener('click', closeGift);
  if (giftOverlay) {
    giftOverlay.addEventListener('click', function (e) {
      if (e.target.classList.contains('pgm-backdrop') || e.target.classList.contains('pgm-wrap')) closeGift();
    });
  }

  if (giftBoxCard) giftBoxCard.addEventListener('click', openQD);
  if (qdTriggers) {
    qdTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent opening the main gift modal if clicking from card
        openQD();
      });
    });
  }
  if (qdOpenBtn) qdOpenBtn.addEventListener('click', openQD);
  if (qdClose) qdClose.addEventListener('click', closeQD);
  if (qdOverlay) {
    qdOverlay.addEventListener('click', function (e) {
      if (e.target === qdOverlay) closeQD();
    });
  }

  // Esc key to close both
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeGift(); closeQD(); }
  });
})();


/* Character counter for wish textarea */
(function () {
  var msgEl = document.getElementById('wf-msg');
  var counter = document.getElementById('wf-char-counter');
  if (!msgEl || !counter) return;
  msgEl.addEventListener('input', function () {
    var len = msgEl.value.length;
    counter.textContent = len + ' / 500';
    counter.style.color = len > 450 ? '#c0392b' : '#bbb';
  });
})();

/* Initialize WOW.js */
if (typeof WOW !== 'undefined') { new WOW().init(); }
