/* Support chat bubble (26/09).
   A site-styled launcher that loads Zalo's official chat widget for the AllOne OA only on the
   first click, so no Zalo script or iframe loads until a visitor asks for help. If the SDK
   cannot load (blocked, offline), the bubble opens a small fallback panel with direct links.
   Shared by both page systems (home.js pages and main.js pages); needs no other script. */
(function () {
  'use strict';

  var OA_ID = '3535237407340569955';
  var OA_URL = 'https://zalo.me/' + OA_ID;
  var SDK_URL = 'https://sp.zalo.me/plugins/sdk.js';
  var PHONE = '0396 748 693';
  var WELCOME = 'Xin chào! AllOne có thể hỗ trợ gì cho bạn?';
  var LOAD_TIMEOUT = 8000;

  var ICON_CHAT = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M8.5 10.5h7M8.5 14h4.5"/></svg>';
  var ICON_CLOSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  var root, btn, panel, state = 'idle'; // idle | loading | zalo | fallback

  function build() {
    root = document.createElement('div');
    root.className = 'sc-root';
    root.innerHTML =
      '<div class="sc-panel" id="scPanel" role="dialog" aria-labelledby="scTitle" hidden>' +
        '<p class="sc-title" id="scTitle">Hỗ trợ khách hàng</p>' +
        '<p class="sc-text">Không mở được khung chat ngay trên trang. Bạn vẫn có thể liên hệ AllOne qua:</p>' +
        '<a class="sc-action is-primary" href="' + OA_URL + '" target="_blank" rel="noopener">Nhắn tin Zalo OA</a>' +
        '<a class="sc-action" href="tel:' + PHONE.replace(/\s/g, '') + '">Gọi ' + PHONE + '</a>' +
        '<a class="sc-action" href="/lien-he">Gửi yêu cầu tư vấn</a>' +
      '</div>' +
      '<button type="button" class="sc-bubble" aria-controls="scPanel" aria-expanded="false">' +
        '<span class="sc-icon">' + ICON_CHAT + '</span>' +
        '<span class="sc-label">Hỗ trợ qua Zalo</span>' +
      '</button>';
    document.body.appendChild(root);
    btn = root.querySelector('.sc-bubble');
    panel = root.querySelector('.sc-panel');
    btn.setAttribute('aria-label', 'Mở khung chat hỗ trợ qua Zalo');
    btn.addEventListener('click', onClick);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) togglePanel(false);
    });
  }

  function onClick() {
    if (state === 'loading') return;
    if (state === 'fallback') { togglePanel(panel.hidden); return; }
    loadZalo();
  }

  function togglePanel(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('is-open', open);
    btn.querySelector('.sc-icon').innerHTML = open ? ICON_CLOSE : ICON_CHAT;
    btn.setAttribute('aria-label', open ? 'Đóng hỗ trợ' : 'Mở hỗ trợ khách hàng');
    if (open) { var first = panel.querySelector('a'); if (first) first.focus(); }
  }

  function loadZalo() {
    state = 'loading';
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');

    // The SDK scans for this element when it runs; autopopup opens the chat box right away.
    var widget = document.createElement('div');
    widget.className = 'zalo-chat-widget';
    widget.setAttribute('data-oaid', OA_ID);
    widget.setAttribute('data-welcome-message', WELCOME);
    widget.setAttribute('data-autopopup', '1');
    widget.setAttribute('data-width', '');
    widget.setAttribute('data-height', '');
    document.body.appendChild(widget);

    var done = false;
    var timer = setTimeout(function () { fail(); }, LOAD_TIMEOUT);

    function fail() {
      if (done) return;
      done = true;
      widget.remove();
      state = 'fallback';
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      togglePanel(true);
    }

    var s = document.createElement('script');
    s.src = SDK_URL;
    s.async = true;
    s.onerror = function () { clearTimeout(timer); fail(); };
    document.head.appendChild(s);

    // Hand over once Zalo's iframe exists: its own launcher takes this corner from here on.
    var poll = setInterval(function () {
      if (done) { clearInterval(poll); return; }
      var frame = widget.querySelector('iframe');
      if (!frame) return;
      clearInterval(poll);
      frame.addEventListener('load', function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        state = 'zalo';
        root.hidden = true;
        // Belt and braces next to data-autopopup: ask the widget to open its chat box.
        setTimeout(function () {
          try { window.ZaloSocialSDK && window.ZaloSocialSDK.openChatWidget(); } catch (e) { /* widget still usable via its launcher */ }
        }, 600);
      });
    }, 150);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
