$(function () {
  /***
   ** Filters Slide-Up
   **/

  $(".filters-toggle").click(function () {
    $("html").addClass("filters-open");

    var filters = $(this).siblings(".catalog-filter");

    // hide on click outside filters
    $(document).on("mouseup touchend", function (e) {
      if (!filters.is(e.target) && filters.has(e.target).length === 0) {
        $("html").removeClass("filters-open");
      }
    });
  });

  /***
   ** Ratings
   **/

  $(".product__rating")
    .find(".rating")
    .each(function () {
      $(this).RatingStar({ change: false });
    });

  $(".leave-comment__rating")
    .find(".rating")
    .each(function () {
      $(this).RatingStar({ change: true });
    });

  /***
   ** Search
   **/

  $("#search input[name='search']")
    .parent()
    .find("button")
    .on("click", function () {
      var url = $("base").attr("href") + "index.php?route=product/search";

      var value = $("#search input[name='search']").val();

      if (value) {
        url += "&search=" + encodeURIComponent(value);
      }

      location = url;
    });

  $("#search input[name='search']").on("keydown", function (e) {
    if (e.keyCode == 13) {
      $("header #search input[name='search']")
        .parent()
        .find("button")
        .trigger("click");
    }
  });

  /***
   ** Menu Toggle
   **/

  $(".main-nav-toggle").click(function () {
    var mainNavBtn = $(this).toggleClass("on");
    var mainNav = $(".main-nav__wrapper").slideToggle();

    $(document).on("mouseup touchend", function (e) {
      // if the target of the click isn't the nav nor navBtn
      if (
        !mainNav.is(e.target) &&
        mainNav.has(e.target).length === 0 &&
        !mainNavBtn.is(e.target) &&
        mainNavBtn.has(e.target).length === 0
      ) {
        mainNav.slideUp();
        mainNavBtn.removeClass("on");
      }
    });

    return false;
  });

  /**
   ** Magnific Popup
   **/

  // кнопки 'корзина' и 'добавить в корзину'
  $(".add-to-cart, .cart-show-up").magnificPopup({
    type: "inline",
    mainClass: "mfp-cart",
    closeBtnInside: true,
    fixedContentPos: true,
    closeMarkup:
      '<button title="%title%" type="button" class="mfp-close"><span></span><span></span></button>',
    tClose: "Закрыть",
  });

  // продолжить покупки
  $(".cart-continue").click(function () {
    $.magnificPopup.close();
  });

  // обратный звонок
  $(".callback-show-up").magnificPopup({
    type: "inline",
    mainClass: "mfp-cart",
    closeBtnInside: true,
    fixedContentPos: true,
    closeMarkup:
      '<button title="%title%" type="button" class="mfp-close"><span></span><span></span></button>',
    tClose: "Закрыть",
  });

  /**
   ** Timer
   **/

  var now = new Date(),
    secPassed =
      now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
  var t = 60 * 60 * 24 - secPassed;

  $(".timer").countdown({
    until: t,
    labels: ["Годы", "Месяцы", "Недели", "Дни", "Часов", "Минут", "Секунд"],
    format: "HMS",
    layout:
      '<span class="time-descr">До конца распродажи осталось:</span>' +
      '<ul class="time">' +
      '<li class="time-item">' +
      '<div class="time-num"><div><span>{h10}</span></div><div><span>{h1}</span></div></div>' +
      '<span class="time-text">часов</span>' +
      "</li>" +
      '<li class="time-item">' +
      '<div class="time-num"><div><span>{m10}</span></div><div><span>{m1}</span></div></div>' +
      '<span class="time-text">минут</span>' +
      "</li>" +
      '<li class="time-item">' +
      '<div class="time-num"><div><span>{s10}</span></div><div><span>{s1}</span></div></div>' +
      '<span class="time-text">секунд</span>' +
      "</li>" +
      "</ul>",
  });

  /**
   ** Slideshow Main Page
   **/

  $(".slideshow")
    .find(".js-slider")
    .slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 4000,
      infinite: true,
      arrows: true,
      nextArrow: ".slider-arrow-next",
      prevArrow: ".slider-arrow-prev",
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            arrows: false,
            dots: true,
          },
        },
      ],
    });

  /***
   ** Similar Products Slider
   **/

  $(".similar-products-slider")
    .find(".js-similar-products")
    .slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      rows: 0,
      speed: 1000,
      infinite: true,
      autoplay: true,
      pauseOnHover: false,
      autoplaySpeed: 2000,
      arrows: false,
      dots: false,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
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

  /**
   ** Smooth Scroll
   **/

  var smoothOffset = 0;

  $(".selector")
    .find("a[href*='#']:not([href='#'])")
    .click(function () {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") ||
        location.hostname == this.hostname
      ) {
        // offset specified in data attribute 'data-smooth-offset'
        var scrollOn = $(this).data("smoothOffset")
          ? $(this).data("smoothOffset")
          : smoothOffset;

        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top - scrollOn,
            },
            1000
          );
          return false;
        }
      }
    });

  /**
   ** Magnific Popup Policy
   **/

  $(".policy-link").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
  });

  var slideShowImgs = $(".slideshow").find(".slider__item img");

  /**
   ** Media Query Events via JavaScript
   **/

  //
  // 992px
  //
  // on document.ready
  if (matchMedia("(max-width: 991px)").matches) {
  } else {
    $("html").removeClass("filters-open");
  }
  //
  // on window.resize
  matchMedia("(max-width: 991px)").addListener(function (mql) {
    if (mql.matches) {
    } else {
      $("html").removeClass("filters-open");
    }
  });

  //
  // 768px
  //
  // on document.ready
  if (matchMedia("(max-width: 767px)").matches) {
    slideShowImgs.each(function () {
      $(this).attr("src", $(this).data("tablet"));
    });
  } else {
    slideShowImgs.each(function () {
      $(this).attr("src", $(this).data("pc"));
    });

    $(".main-nav")
      .find("li.dropdown")
      .each(function () {
        $(this)
          .children("a")
          .click(function (e) {
            e.preventDefault();
          });
      });
  }
  //
  // on window.resize
  matchMedia("(max-width: 767px)").addListener(function (mql) {
    if (mql.matches) {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("tablet"));
      });

      $(".main-nav")
        .find("li.dropdown")
        .each(function () {
          $(this).children("a").unbind("click");
        });
    } else {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("pc"));
      });

      $(".main-nav")
        .find("li.dropdown")
        .each(function () {
          $(this)
            .children("a")
            .click(function (e) {
              e.preventDefault();
            });
        });
    }
  });

  //
  // 320px
  //
  // on document.ready
  if (matchMedia("(max-width: 320px)").matches) {
    slideShowImgs.each(function () {
      $(this).attr("src", $(this).data("mobile"));
    });
  } else {
  }
  //
  // on window.resize
  matchMedia("(max-width: 320px)").addListener(function (mql) {
    if (mql.matches) {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("mobile"));
      });
    } else {
      slideShowImgs.each(function () {
        $(this).attr("src", $(this).data("tablet"));
      });
    }
  });
});
