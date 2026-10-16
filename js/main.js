$(function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  var $bars = $('.progress_container > div');
  $bars.each(function () { $(this).data('target', $(this).attr('title')); });
  $('.tip').tipsy({ gravity: 's', fade: true });

  function fill($bar) {
    $bar.animate({ width: $bar.data('target') }, reduceMotion ? 0 : 1000);
  }
  if (hasIO) {
    var barObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fill($(en.target)); barObs.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    $bars.each(function () { barObs.observe(this); });
  } else {
    $bars.each(function () { fill($(this)); });
  }

  if (hasIO && !reduceMotion) {
    var $items = $('.item_tittle, .why_me').addClass('reveal');
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { $(en.target).addClass('visible'); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    $items.each(function () { revObs.observe(this); });
  }

  if ($('#gallery').length) { $('#gallery a').lightBox(); }
  $('#gallery img').fadeTo('fast', 0.8).hover(
    function () { $(this).fadeTo('fast', 1.0); },
    function () { $(this).fadeTo('fast', 0.8); }
  );

  var $elem = $('.container_24');
  $('#nav_up, #nav_down').fadeIn('slow');
  $(window).bind('scrollstart', function () {
    $('#nav_up, #nav_down').stop().animate({ opacity: 0.2 });
  });
  $(window).bind('scrollstop', function () {
    $('#nav_up, #nav_down').stop().animate({ opacity: 1 });
  });
  $('#nav_down').click(function () {
    $('html, body').animate({ scrollTop: $elem.height() }, 800);
  });
  $('#nav_up').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });
  $('#nav_up, #nav_down').on('keydown', function (e) {
    if (e.which === 13 || e.which === 32) { e.preventDefault(); $(this).click(); }
  });

  var stored = null;
  try { stored = localStorage.getItem('analytics-consent'); } catch (e) {}
  if (stored === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  } else if (stored === null) {
    $('#consent').show();
  }
  $('#consent button').on('click', function () {
    var granted = $(this).data('choice') === 'granted';
    try { localStorage.setItem('analytics-consent', granted ? 'granted' : 'denied'); } catch (e) {}
    if (granted) { gtag('consent', 'update', { analytics_storage: 'granted' }); }
    $('#consent').hide();
  });
});
