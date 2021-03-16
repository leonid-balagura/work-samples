window.onload = function () {
  document.body.className += " loaded";
  var $mainNavWrap = document.querySelectorAll(".main-nav-wrap")[0];

  // document.ready
  if (matchMedia("(max-width: 991px)").matches) {
  } else {
    $mainNavWrap.classList.add("animate");
  }

  // window.resize
  matchMedia("(max-width: 991px)").addListener(function (mql) {
    if (mql.matches) {
      $mainNavWrap.classList.remove("animate");
    } else {
      $mainNavWrap.classList.add("animate");
    }
  });
};

$(function () {
  objectFitImages();

  $('[data-fancybox="gallery"]').fancybox({
    loop: true,
    infobar: false,
    buttons: ["close"],
    animationEffect: "fade",
  });

  /**
   ** Order Forms
   **/

  var orderForms = $(".order-form");

  orderForms.each(function () {
    var orderForm = $(this);

    orderForm.find("input[name=name_last]").parent().css({
      visibility: "hidden",
      position: "absolute",
    });

    orderForm
      .find("button")
      .addClass("btn btn-yellow btn__order")
      .closest(".form-group")
      .addClass("btn-group");
    orderForm
      .find("input")
      .addClass("input")
      .closest(".form-group")
      .addClass("input-group");
  });

  /***
   ** Reviews Slider
   **/

  $(".reviews-slider").slick({
    slidesToShow: 2,
    slidesToScroll: 2,
    rows: 0,
    speed: 500,
    arrows: false,
    dots: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  });

  /***
   ** Animate On Scroll
   **/

  var $animatedEl = $(".tb-title, .tb-descr, .workflow-imgs");
  var $animatedElPartial = $(
    ".title-text, .gallery-content, .lp-about-content, .lp-imgs, .lp-item-icon, .lp-item-text, .scheme-item-icon, .scheme-item-text, .extra-item-icon, .extra-item-text"
  );

  $animatedEl.each(function () {
    var _this = $(this);

    if (_this.visible()) {
      _this.addClass("animate");
    }

    $(window).scroll(function () {
      if (!_this.hasClass("animate") && _this.visible()) {
        _this.addClass("animate");
      }
    });
  });

  $animatedElPartial.each(function () {
    var _this = $(this);

    if (_this.visible(true)) {
      _this.addClass("animate");
    }

    $(window).scroll(function () {
      if (!_this.hasClass("animate") && _this.visible(true)) {
        _this.addClass("animate");
      }
    });
  });

  /***
   ** Toggle Main Nav
   **/

  var $mainNavToggle = $(".main-nav-toggle"),
    $mainNav = $(".main-nav"),
    $mainNavWrap = $mainNav.parent(),
    $navActive = false;

  $mainNavWrap.on("click", function (e) {
    var target = e.target;

    if (
      $navActive &&
      !$mainNav.is(e.target) &&
      $mainNav.has(e.target).length === 0
    ) {
      $mainNav.slideToggle(500);
      $mainNavWrap.toggleClass("animate");
    }
  });

  $(document).on("mouseup touchend", function (e) {
    var target = e.target;

    if (
      $navActive &&
      !$mainNavWrap.is(e.target) &&
      $mainNavWrap.has(e.target).length === 0
    ) {
      $mainNav.slideUp(500);
      $mainNavWrap.removeClass("animate");
    }
  });

  /**
   ** Smooth Scroll
   **/

  var $mainNavLinks = $(".main-nav").find('a[href^="#"]').data("offset", 15),
    $requestLink = $(".request-link").data("offset", 10),
    $mouseLink = $(".mouse-link");

  $([$mainNavLinks, $requestLink, $mouseLink]).each(function () {
    var $link = $(this);

    $link.click(function () {
      var offset = $(this).data("offset") ? $(this).data("offset") : 0;

      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html,body").animate(
          {
            scrollTop: target.offset().top - offset,
          },
          1000
        );
        return false;
      }
    });
  });

  /**
   ** Media Query Events via JavaScript
   **/

  //
  // 992px
  //
  // on document.ready
  if (matchMedia("(max-width: 991px)").matches) {
    $navActive = true;
  } else {
  }
  //
  // on window.resize
  matchMedia("(max-width: 991px)").addListener(function (mql) {
    if (mql.matches) {
      $navActive = true;
    } else {
      $navActive = false;
      $mainNav.attr("style", "");
      $mainNavWrap.removeClass("animate");
    }
  });
});