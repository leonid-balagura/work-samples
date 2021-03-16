$(function () {
  objectFitImages();

  $(".scroll-up").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });

  /***
   ** Main Nav Magic Line
   **/

  var leftPos, newWidth, $magicLine;

  function magicLineLinkPos(elem) {
    return (
      $(elem).position().left +
      parseInt($(elem).children("a").first().css("paddingLeft"), 10)
    );
  }

  $(".main-nav").append("<li class='magic-line'></li>");
  $magicLine = $(".magic-line");

  $magicLine
    .width($(".main-nav__item.active a").width())
    .css("left", magicLineLinkPos($(".main-nav__item.active")))
    .data("origLeft", $magicLine.position().left)
    .data("origWidth", $magicLine.width());

  // Magic Line click
  $(".main-nav__item")
    .children("a")
    .click(function () {
      var $this = $(this);
      $this.parent().addClass("active").siblings().removeClass("active");
      $magicLine
        .data("origLeft", magicLineLinkPos($this.parent()))
        .data("origWidth", $this.width());
    });

  // Magic Line hover animation
  $(".main-nav")
    .children("li")
    .hover(
      function () {
        var $thisBar = $(this);

        leftPos = magicLineLinkPos($thisBar);
        newWidth = $thisBar.children("a").first().width();
        $magicLine.css({
          left: leftPos,
          width: newWidth,
        });
      },
      function () {
        $magicLine.css({
          left: $magicLine.data("origLeft"),
          width: $magicLine.data("origWidth"),
        });
      }
    );

  /***
   ** Cart Popup
   **/

  var timerMenu = null,
    lastLi = null,
    lastAction = null;

  var cartPopup = $(".cart-popup");

  function now() {
    return new Date().getTime();
  }

  cartPopup.hover(
    function (e) {
      var _this = $(this);
      if (lastAction && now() - lastAction < 500) {
        lastLi = _this;
        return false;
      }
      _this.addClass("active");
    },
    function (e) {
      var _this = $(this);
      if (lastAction && now() - lastAction < 500) {
        lastLi = null;
        return false;
      }
      lastAction = now();
      timerMenu = setTimeout(function () {
        if (_this !== lastLi) {
          _this.removeClass("active");
          if (lastLi) {
            $(lastLi).addClass("active");
          }
        }
        lastAction = null;
        lastLi = null;
        lastAction = null;
        clearTimeout(timerMenu);
      }, 300);
    }
  );

  /***
   ** Cart Plus/Minus Handler
   **/

  var cartQtyInput = $(".cart__product-quantity").find("input");

  $(".cart__product-quantity")
    .find("a, button")
    .click(function (e) {
      e.preventDefault();
      _this = $(this);

      var cartQtyInput = _this.parent().find("input");
      var cartQtyValue = cartQtyInput.val();
      var qtyAction = _this.attr("class");

      if (qtyAction.indexOf("up") !== -1) {
        cartQtyValue++;
      } else {
        cartQtyValue--;
      }

      cartQtyValue =
        cartQtyValue < 1 ? 1 : cartQtyValue > 99 ? 99 : cartQtyValue;
      cartQtyInput.val(cartQtyValue).change();
    });

  // Prevent negative value insertion
  cartQtyInput.on("keydown", function (e) {
    if (
      e.keyCode == 8 ||
      e.keyCode == 46 ||
      e.keyCode == 37 ||
      e.keyCode == 39
    ) {
      return true;
    } else if (
      !(
        (e.keyCode > 95 && e.keyCode < 106) ||
        (e.keyCode > 47 && e.keyCode < 58)
      )
    ) {
      return false;
    }
  });

  // Max characters limitation
  cartQtyInput.on("keydown keyup", function () {
    var maxChars = 2;
    if ($(this).val().length >= maxChars) {
      $(this).val($(this).val().substr(0, maxChars));
    }
  });

  /***
   ** Ajax Handler
   **/

  var ajaxDelay = false; // здесь будет айдишник таймера

  cartQtyInput.on("change keyup", function (e) {
    var _this = $(this); // наш инпут

    // если ввели ручками ноль - пишем 1
    if (_this.val() < 1) {
      _this.val(1);
    }

    // устанавоиваем задержку ajax-запроса относительно последнего события change/keyup

    // убиваем таймер если время еще не истекло (с последнего изменения input'а)
    if (ajaxDelay !== false) clearTimeout(ajaxDelay);

    // запускаем новый
    ajaxDelay = setTimeout(function () {
      // наш ajax
      $.ajax({
        url: window.location.href,
        type: "GET",
        data: {
          id: "product_id",
          qty: _this.val(),
        },
        success: function (res) {
          console.log(res);
        },
        error: function (err) {
          console.log(err);
        },
      });

      ajaxDelay = false;
    }, 300);
  });

  /**
   ** Slick Main Slider (.main-slider)
   **/

  // animation on init
  $(".js-main-slider").on("init", function (e, slick) {
    var firstElements = $(".main-slider-slide.slick-current").find(
      "[data-animation]"
    );

    slickAnimations(firstElements, function () {
      firstElements.css("opacity", "1");
    });
  });

  // look at a swipe event !!

  // animation on change
  $(".js-main-slider").on(
    "beforeChange",
    function (e, slick, currentSlide, nextSlide) {
      var nextElements = $(
        '.main-slider-slide[data-slick-index="' + nextSlide + '"]'
      ).find("[data-animation]");
      var currentElements = $(
        '.main-slider-slide[data-slick-index="' + currentSlide + '"]'
      ).find("[data-animation]");

      currentElements.animate({ opacity: "0" }, 1000);

      slickAnimations(nextElements, function () {
        nextElements.css("opacity", "1");
      });
    }
  );

  // initialization
  $(".js-main-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 0,
    speed: 500,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
  });

  // slick animation function
  function slickAnimations(elements, cb) {
    var animationEndEvents =
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

    elements.each(function () {
      var $this = $(this);
      var $animationDelay = $this.data("delay");
      var $animationType = "animated " + $this.data("animation");

      $this.css({
        "animation-delay": $animationDelay,
        "-webkit-animation-delay": $animationDelay,
      });

      $this.addClass($animationType).one(animationEndEvents, function () {
        $this.removeClass($animationType);
        cb && cb();
      });
    });
  }

  /**
   ** Categories Slick Slider (.c-item-slider)
   **/

  $(".js-c-item-slider").each(function (index) {
    $(this).slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 500,
      arrows: false,
      dots: true,
      autoplay: true,
      autoplaySpeed: 2000 + index * 1000,
    });
  });

  /**
   ** Testimonials Slick Slider (.testimonials__slider)
   **/

  $(".testimonials__slider").each(function () {
    var _this = $(this);

    _this.on("init", function () {
      _this.parent().append(_this.find("ul.slick-dots").detach());
    });
    _this.on("setPosition", function () {
      _this.parent().append(_this.find("ul.slick-dots").detach());
    });

    _this.slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      rows: 0,
      speed: 500,
      arrows: false,
      dots: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  });

  /**
   ** Slick Slider
   **/

  $(".product-details__slider").find(".js-pd-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 0,
    speed: 300,
    arrows: true,
    nextArrow: ".pd-slider-arrow-next",
    prevArrow: ".pd-slider-arrow-prev",
    asNavFor: ".product-details__slider .pd-slider-nav",
  });

  $(".product-details__slider").find(".pd-slider-nav").slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    rows: 0,
    speed: 300,
    dots: false,
    asNavFor: ".product-details__slider .js-pd-slider",
    focusOnSelect: true,
  });

  /**
   ** Similar Products Slider (.testimonials__slider)
   **/

  $(".similar-products-slider").each(function () {
    $(this).slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      rows: 0,
      speed: 500,
      arrows: false,
      dots: false,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  });

  /***
   ** Menu Toggle
   **/

  $(".main-nav-toggle").click(function () {
    var mainNavBtn = $(this).toggleClass("on");
    var mainNav = $(".main-nav-wrapper").fadeToggle(200);

    $(document).on("mouseup touchend", function (e) {
      // if the target of the click isn't the nav nor navBtn
      if (
        !mainNav.is(e.target) &&
        mainNav.has(e.target).length === 0 &&
        !mainNavBtn.is(e.target) &&
        mainNavBtn.has(e.target).length === 0
      ) {
        mainNav.fadeOut();
        mainNavBtn.removeClass("on");
      }
    });

    return false;
  });

  /***
   ** Item Tabs
   **/

  var itemTabs = $(".item-tabs-nav"),
    itemTabsEl = itemTabs.children("li"),
    itemElHasActive = itemTabs.find("li.active"),
    itemContentTabs = $(".item-tabs > div");

  itemContentTabs.hide();

  if (itemElHasActive.length) {
    var loadTab = itemElHasActive.attr("data-tab");
    $("." + loadTab).fadeIn();
  }

  itemTabs.on("click", "li", function () {
    if (!$(this).hasClass("active")) {
      itemTabsEl.removeClass("active");
      itemContentTabs.hide();

      var activeTab = $(this).attr("data-tab");

      $("." + activeTab).fadeIn();
      $(this).addClass("active");
    } else {
      return false;
    }
    return false;
  });

  /***
   ** Product Details Tabs
   **/

  var pdTabs = $(".product-details-tabs-nav"),
    pdTabsEl = pdTabs.children("li"),
    pdElHasActive = pdTabs.find("li.active"),
    pdContentTabs = $(".pd-tabs-content > div");

  pdContentTabs.hide();

  if (pdElHasActive.length) {
    var loadTab = pdElHasActive.attr("data-tab");
    $("." + loadTab).fadeIn();
  }

  pdTabs.on("click", "li", function () {
    if (!$(this).hasClass("active")) {
      pdTabsEl.removeClass("active");
      pdContentTabs.hide();

      var activeTab = $(this).attr("data-tab");

      $("." + activeTab).fadeIn();
      $(this).addClass("active");
    } else {
      return false;
    }
    return false;
  });

  /**
   ** Magnific Popup Lightbox Gallery
   **/

  $(".js-pd-slider").magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
    },
    mainClass: "mfp-product",
  });

  /**
   ** Magnific Popup Policy
   **/

  $(".policy-link").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
  });

  /**
   ** Media Query Events via JavaScript
   **/

  var slideShowImgs = $(".main-slider").find(".main-slider__img img");
  var bannerImgs = $(".category-banner-img").find("img");

  //
  // 768px
  //
  // on document.ready
  if (matchMedia("(max-width: 767px)").matches) {
  } else {
    $(".main-nav")
      .children("li.dropdown")
      .each(function () {
        $(this)
          .children("a")
          .click(function (e) {
            e.preventDefault();
          });
      });

    $(".cart-popup__link").click(function (e) {
      e.preventDefault();
    });
  }
  //
  // on window.resize
  matchMedia("(max-width: 767px)").addListener(function (mql) {
    if (mql.matches) {
      $(".main-nav")
        .children("li.dropdown")
        .each(function () {
          $(this).children("a").unbind("click");
        });

      $(".cart-popup__link").unbind("click");
    } else {
      $(".main-nav")
        .children("li.dropdown")
        .each(function () {
          $(this)
            .children("a")
            .click(function (e) {
              e.preventDefault();
            });
        });

      $(".cart-popup__link").click(function (e) {
        e.preventDefault();
      });
    }
  });

  //
  // 576px
  //
  // on document.ready
  if (matchMedia("(max-width: 575px)").matches) {
    $(window).resize(function () {
      $(".stock__title").css("z-index", 1);
    });
  } else {
  }
  //
  // on window.resize
  matchMedia("(max-width: 575px)").addListener(function (mql) {
    if (mql.matches) {
    } else {
    }
  });

  //
  // 480px
  //
  // on document.ready
  if (matchMedia("(max-width: 479px)").matches) {
    slideShowImgs.each(function () {
      $(this).attr("src", $(this).data("mobile"));
    });

    bannerImgs.each(function () {
      $(this).attr("src", $(this).data("mobile"));
    });
  } else {
    slideShowImgs.each(function () {
      $(this).attr("src", $(this).data("pc"));
    });

    bannerImgs.each(function () {
      $(this).attr("src", $(this).data("pc"));
    });
  }
  //
  // on window.resize
  matchMedia("(max-width: 479px)").addListener(function (mql) {
    if (mql.matches) {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("mobile"));
      });

      bannerImgs.each(function () {
        $(this).attr("src", $(this).data("mobile"));
      });
    } else {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("pc"));
      });

      bannerImgs.each(function () {
        $(this).attr("src", $(this).data("pc"));
      });
    }
  });
});