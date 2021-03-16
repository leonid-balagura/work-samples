$(function () {
  var $body = $("body");
  var $header = $(".header");
  var animationend = "webkitAnimationEnd animationend";

  $header.on(animationend, function () {
    $header.removeClass("is-static");
  });

  /**
   * Header
   */

  var delta = 5;
  var didScroll = false;
  var isStatic = true;
  var hideHeader = true;
  var richedBottom = false;
  var lastScrollTop = 0;
  var navbarHeight = $(".header-wrap").outerHeight();
  var headerOffset = $header.offset().top;

  $(window).on("scroll", function (event) {
    didScroll = true;
  });

  setInterval(function () {
    if (didScroll && hideHeader) {
      hasScrolled();
      didScroll = false;
    }
  }, 50);

  function hasScrolled() {
    var st = $(window).scrollTop();

    if (Math.abs(lastScrollTop - st) <= delta) return;

    richedBottom =
      st + window.innerHeight >= $(document).height() - 20 ? true : false;

    if (st > lastScrollTop && st > navbarHeight && !richedBottom) {
      // scroll down
      $header.addClass("is-fixed").removeClass("is-static is-shown");
      isStatic = false;
    } else {
      // scroll up
      if (st > navbarHeight || richedBottom) {
        $header.addClass("is-shown");
      } else if (!isStatic && st < headerOffset) {
        // at the top of the page
        $header.addClass("is-static").removeClass("is-fixed is-shown");
        isStatic = true;
      }
    }

    lastScrollTop = st;
  }

  /**
   * Burger
   */

  var $burger = $("#header-toggle");
  var fixScroll = 0;

  $burger.on("click", function () {
    if (!$burger.hasClass("is-open")) {
      $burger.addClass("is-open");
      $header.addClass("is-open");
      lockBody();
    } else {
      $burger.removeClass("is-open");
      $header.removeClass("is-open");
      unlockBody();
    }
  });

  /**
   * Open Popup
   */

  var $popupContainer = $(".popup-container");
  var $popupCollection = $popupContainer.children();
  var $popupPrevious = null;
  var isContainerOpen = false;

  $(".openPopup").on("click", function (e) {
    e.preventDefault();
    openPopup($(this));
  });

  $(".closePopup").on("click", function (e) {
    e.preventDefault();
    closePopup();
  });

  function openPopup(param, keepTitle) {
    var popupId = "";
    var popupContentId = "";
    var popupTitleText = "";

    if (typeof param === "string") {
      popupId = param;
    } else {
      popupId = param.attr("data-popup");
      popupContentId = param.attr("data-content");
    }

    $popupCollection.removeClass("is-opened");
    var $popup = $popupCollection.filter(popupId).addClass("is-opened");

    if (popupContentId) {
      $popup
        .find(".popup-tab-wrap")
        .children()
        .filter('[data-content="' + popupContentId + '"]')
        .trigger("click");
    }

    popupTitleText = keepTitle ? $popupPrevious.find(".title").text() : "";
    if (popupTitleText) {
      var $popupTitle = $popup.find(".title");
      $popupTitle.length
        ? $popupTitle.text(popupTitleText)
        : $popup
            .find(".popup-in")
            .before(
              '<div class="title title__popup">' + popupTitleText + "</div>"
            );
    }

    lockBody();
    $popupPrevious = $popup;

    if (!isContainerOpen) {
      $popupContainer.addClass("opening");
      $popupContainer.one(animationend, function () {
        $(this).addClass("is-opened").removeClass("opening");
      });
      isContainerOpen = true;
    }

    $popup.find(".popup-overflow").scrollTop(0);
  }

  function closePopup() {
    $popupContainer.removeClass("is-opened");
    $popupCollection.removeClass("is-opened");
    isContainerOpen = false;
    unlockBody();
  }

  function lockBody() {
    hideHeader = false;
    fixScroll = $(window).scrollTop() || fixScroll;
    if (!$body.hasClass("is-locked")) {
      $body.addClass("is-locked").css("top", -1 * fixScroll);
    }
  }

  function unlockBody() {
    if (!$header.hasClass("is-open")) {
      $body.removeClass("is-locked").removeAttr("style");
      $(window).scrollTop(fixScroll);
      fixScroll = 0;
      hideHeader = true;
    }
  }

  // dummy form submit
  $("#login-form, #advertiser-form, #webmaster-form").on(
    "submit",
    function (e) {
      e.preventDefault();

      var $form = $(this);
      $.ajax({
        url: window.location.href,
        type: "GET",
        data: $form.serialize(),
        success: function () {
          openPopup("#key-enter", true);
        },
      });
    }
  );

  $("#pass-forget-form").on("submit", function (e) {
    e.preventDefault();
    openPopup("#pass-forget-msg", true);
  });

  /**
   * Reveal Content
   */

  $(".popup-tab-wrap")
    .find(".btn")
    .on("click", function (e) {
      e.preventDefault();
      revealContent($(this), ".tab-form");
    });

  $(".rules-buttons")
    .find(".btn")
    .on("click", function (e) {
      e.preventDefault();
      revealContent($(this), ".rules-wrap");
    });

  function revealContent($button, content) {
    if ($button.hasClass("active")) return;
    $button.addClass("active").siblings().removeClass("active");
    $($button.data("content"))
      .addClass("active")
      .siblings(content)
      .removeClass("active");
  }

  // lang
  var $langMenu = $(".header-lang-menu");

  mediaQuery(
    "(min-width: 1300px)",
    function () {
      $langMenu.on("mouseenter.langMenu", function () {
        $langMenu.addClass("is-open");
      });
      $langMenu.on("mouseleave.langMenu", function () {
        $langMenu.removeClass("is-open");
      });
    },
    function () {
      $langMenu.off(".langMenu");
    }
  );

  // form inputs
  var $inputs = $("input");

  $inputs.each(function () {
    var $input = $(this);
    $input.on("blur", function () {
      if ($input.val()) {
        $input.addClass("full");
      } else {
        $input.removeClass("full");
      }
    });
  });

  /**
   * News Slider
   */

  var $newsSlider = $(".news-slider");

  $newsSlider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    rows: 0,
    speed: 600,
    arrows: true,
    dots: false,
    prevArrow: $newsSlider.parent().find(".arrow-prev"),
    nextArrow: $newsSlider.parent().find(".arrow-next"),
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  /**
   * Advantages Slider
   */

  var $advSlider = $(".advantages-items");

  var $contentBlock = $(".block");

  $advSlider.on("init", function (event, slick) {
    slick.$dots.insertAfter(slick.$prevArrow);
  });

  mediaQuery(
    "(max-width: 1299px)",
    function () {
      $header.addClass("is-collapsed");

      $contentBlock.each(function () {
        var $block = $(this);
        var $blockImg = $block.find(".block-img");
        if ($blockImg.length > 0) {
          $blockImg.insertAfter($block.find(".title"));
        }
      });

      $advSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 500,
        arrows: true,
        infinite: false,
        centerMode: true,
        centerPadding: "0px",
        dots: true,
        prevArrow: $advSlider.parent().find(".arrow-prev"),
        nextArrow: $advSlider.parent().find(".arrow-next"),
      });
    },
    function () {
      $header.removeClass("is-collapsed");

      $contentBlock.each(function () {
        var $block = $(this);
        var $blockImg = $block.find(".block-img");
        if ($blockImg.length > 0) {
          $blockImg.appendTo($block);
        }
      });

      if ($advSlider.hasClass("slick-initialized")) {
        $advSlider.slick("unslick");
      }
    }
  );

  /***
   ** Informers Slider
   **/

  var $informersSlider = $(".informers-slider");
  var $informersSliderNav = $(".informers-slider-nav");
  var $informersArrowsTitle = $(".informers-arrows-title");

  $informersSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 0,
    arrows: false,
    speed: 500,
    fade: true,
    draggable: false,
    waitForAnimate: true,
    prevArrow: $informersSlider.parent().find(".arrow-prev"),
    nextArrow: $informersSlider.parent().find(".arrow-next"),
    asNavFor: ".informers-slider-nav",
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  });

  $informersSliderNav.on("init", function (event, slick) {
    var arrowText = slick.$slides.filter(".slick-current").find(".btn").text();
    $informersArrowsTitle.hide().text(arrowText).fadeIn();
  });

  var informersWaitForAnimate = $informersSlider.slick(
    "slickGetOption",
    "waitForAnimate"
  );
  var informersNavDelay = $informersSlider.slick("slickGetOption", "speed");
  var isInformersDelayed = false;

  informersWaitForAnimate &&
    $informersSliderNav.children().on("click", function (e) {
      if ($(this).hasClass("slick-current") || isInformersDelayed) {
        e.stopImmediatePropagation();
        return;
      }
      isInformersDelayed = true;
      setTimeout(function () {
        isInformersDelayed = false;
      }, informersNavDelay);
    });

  $informersSliderNav.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    rows: 0,
    dots: false,
    speed: 500,
    focusOnSelect: true,
    asNavFor: ".informers-slider",
  });

  $informersSliderNav.on(
    "beforeChange",
    function (event, slick, currentSlide, nextSlide) {
      var arrowText = slick.$slides.eq(nextSlide).find(".btn").text();
      $informersArrowsTitle.hide().text(arrowText).fadeIn();
    }
  );

  $(".anim").waypoint(
    function (direction) {
      if (direction === "down") {
        $(this.element).addClass("animate");
      }
    },
    {
      offset: function () {
        return this.context.innerHeight() * 0.75;
      },
    }
  );

  $(".tb-main-imgs").on(animationend, function () {
    $(this).addClass("levitate");
  });

  /**
   * Media Query
   */

  function mediaQuery(mqStr, match, mismatch) {
    var mq = matchMedia(mqStr);

    mq.addListener(widthChange);
    widthChange(mq, true);

    function widthChange(mq, load) {
      load = typeof load !== "undefined" ? load : false;

      if (mq.matches) {
        match(load);
      } else {
        mismatch(load);
      }
    }
  }
});