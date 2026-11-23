/* SWI Sales 2.0 — shared shell & interactions */
(function () {
  var SB =
    '<div class="statusbar"><span>09:41</span><span class="sb-r">' +
    '<svg class="ic"><use href="#i-signal"/></svg>' +
    '<svg class="ic"><use href="#i-wifi"/></svg>' +
    '<svg class="ic"><use href="#i-battery"/></svg>' +
    '</span></div>';

  var NAV = [
    ['beranda', 'Beranda', 'home', '02-main.html'],
    ['rute', 'Rute', 'map', '04-jalur.html'],
    ['jual', 'Jual', 'cart', '12-jualplgn.html'],
    ['piutang', 'Piutang', 'wallet', '26-piutplgn.html'],
    ['lainnya', 'Lainnya', 'grid', '37-upload.html']
  ];

  function injectShell() {
    var app = document.querySelector('.app');
    if (!app) return;
    if (!app.querySelector('.statusbar')) {
      app.insertAdjacentHTML('afterbegin', SB);
    }
    var nav = app.getAttribute('data-nav');
    if (nav && nav !== 'none' && !app.querySelector('.bottomnav')) {
      var html = '<nav class="bottomnav">';
      for (var i = 0; i < NAV.length; i++) {
        var n = NAV[i];
        html += '<a class="navitem' + (n[0] === nav ? ' active' : '') + '" href="' + n[3] + '">' +
          '<span class="navic"><svg class="ic"><use href="#i-' + n[2] + '"/></svg></span>' +
          '<span>' + n[1] + '</span></a>';
      }
      html += '</nav>';
      app.insertAdjacentHTML('beforeend', html);
    }
  }

  function fmt(n) {
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }

  function onClick(e) {
    var t = e.target;

    var chip = t.closest('.chips .chip');
    if (chip) {
      chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
    }

    var segb = t.closest('.seg button');
    if (segb) {
      segb.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      segb.classList.add('active');
    }

    var tab = t.closest('.tabs .tab');
    if (tab) {
      tab.parentNode.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
      tab.classList.add('active');
    }

    var opt = t.closest('.opts .opt');
    if (opt) {
      opt.parentNode.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
      opt.classList.add('sel');
    }

    var panelBtn = t.closest('[data-panel-btn]');
    if (panelBtn) {
      var group = panelBtn.closest('[data-panel-group]');
      group.querySelectorAll('[data-panel-btn]').forEach(function (b) { b.classList.remove('active'); });
      panelBtn.classList.add('active');
      group.querySelectorAll('[data-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-panel') !== panelBtn.getAttribute('data-panel-btn');
      });
    }

    var step = t.closest('[data-step]');
    if (step) {
      var wrap = step.closest('.stepper');
      var qtyEl = wrap.querySelector('[data-qty]');
      if (qtyEl) {
        var v = parseInt(qtyEl.textContent, 10) || 0;
        v += step.getAttribute('data-step') === '+' ? 1 : -1;
        if (v < 0) v = 0;
        qtyEl.textContent = v;
        var totalEl = wrap.parentNode.querySelector('[data-total]');
        if (totalEl && totalEl.hasAttribute('data-price')) {
          totalEl.textContent = fmt(v * parseFloat(totalEl.getAttribute('data-price')));
        }
      }
    }

    var sw = t.closest('.switch');
    if (sw) sw.classList.toggle('on');

    var cb = t.closest('.checkbox');
    if (cb) cb.classList.toggle('on');

    var pw = t.closest('[data-pw-toggle]');
    if (pw) {
      var input = pw.parentNode.querySelector('input');
      var icon = pw.querySelector('use');
      if (input) {
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        if (icon) icon.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      }
    }

    var opener = t.closest('[data-sheet-open]');
    if (opener) {
      var sheet = document.getElementById(opener.getAttribute('data-sheet-open'));
      if (sheet) sheet.classList.add('open');
    }
    if (t.closest('[data-sheet-close]')) {
      var open = document.querySelector('.sheet-backdrop.open');
      if (open) open.classList.remove('open');
    }
  }

  document.addEventListener('DOMContentLoaded', injectShell);
  document.addEventListener('click', onClick);
})();
