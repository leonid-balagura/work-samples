(function () {
  var years = document.querySelectorAll(".year");
  for (var i = 0; i < years.length; i++) {
    years[i].innerHTML = new Date().getFullYear();
  }
})();

// DOM ready
$(function () {
  if (checkTouchDevice()) {
    $("body").addClass("touchscreen");
  }

  function checkTouchDevice() {
    return "ontouchstart" in document.documentElement;
  }

  objectFitImages();

  /**
   * Price
   */

  var globalSettingsSelector = "body",
    priceContainerSelector = ".price",
    oldPriceSelector = ".old-price",
    actualPriceSelector = ".new-price";

  var $globEl = $(globalSettingsSelector),
    $priceContainer = $(priceContainerSelector),
    globalDiscount = $globEl.attr("data-discount") || 50,
    currency = $globEl.attr("data-currency") || "грн";

  $priceContainer.each(function () {
    var $price = $(this),
      $oldPrice = $price.find(oldPriceSelector),
      $actualPrice = $price.find(actualPriceSelector);

    var localDiscount = $price.attr("data-discount")
      ? $price.attr("data-discount")
      : globalDiscount;

    var actualPrice = parseFloat($actualPrice.text().replace(/\s|\./g, ""));
    var oldPrice = Math.round((actualPrice / (100 - localDiscount)) * 100);

    $oldPrice.text(splitThous(oldPrice) + " " + currency).fadeTo(1000, 1);
    $actualPrice.text(splitThous(actualPrice) + " " + currency).fadeTo(1000, 1);
  });

  function splitThous(string, separator) {
    string += "";
    separator = separator ? separator : " ";

    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(string)) {
      string = string.replace(rgx, "$1" + separator + "$2");
    }
    return string;
  }

  /**
   * Order Items
   */

  if (!checkTouchDevice()) {
    var $itemCards = $(".order-item-card");
    $itemCards.on("mouseenter", function () {
      $(this).addClass("is-hovered");
    });
    $itemCards.on("mouseleave", function () {
      $(this).removeClass("is-hovered");
    });
  }

  var $items = $(".order-item");
  var $page = $("html, body");

  $items.each(function () {
    var $item = $(this);
    var $itemButton = $item.find(".btn__order-item");
    $itemButton.on("click", function (e) {
      e.preventDefault();
      if (!$item.hasClass("is-open")) {
        $items.removeClass("is-open");
        $item.addClass("is-open");

        $page.animate({ scrollTop: scrollToBottom($item) }, 800);

        getRating($item);

        setTimeout(function () {
          var $itemSlider = $item.find(".order-slider");
          var $itemSliderNav = $item.find(".order-slider-nav");

          $itemSlider.add($itemSliderNav).on("init", function (event, slick) {
            slick.$slider.fadeTo(400, 1);
          });

          if (!$itemSlider.hasClass("slick-initialized")) {
            initItemSlider($itemSlider, $itemSliderNav);
          }
        }, 10);
      }
    });
  });

  function initItemSlider($itemSlider, $itemSliderNav) {
    $itemSlider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 300,
      fade: false,
      arrows: false,
      dots: false,
      asNavFor: $itemSliderNav,
    });

    $itemSliderNav.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      rows: 0,
      speed: 300,
      fade: false,
      vertical: true,
      arrows: false,
      dots: false,
      focusOnSelect: true,
      asNavFor: $itemSlider,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            vertical: false,
          },
        },
      ],
    });

    $itemSlider.magnificPopup({
      delegate: ".slick-slide:not(.slick-cloned) a",
      type: "image",
      gallery: {
        enabled: true,
        navigateByImgClick: true,
      },
      mainClass: "mfp-fade",
    });
  }

  $(".order-close").on("click", function (e) {
    e.preventDefault();
    $items.removeClass("is-open");
  });

  // rating

  function getRating($item) {
    var $ratingItem = $item.find(".order-rating");
    var $ratingItemText = $ratingItem.find(".rating-text");
    var $ratingItemStars = $ratingItem.find(".rating-stars-full");
    var rating = parseFloat($ratingItemText.text());

    var ratingPercentage = (rating / 5) * 100;
    var ratingPercentageRounded = Math.round(ratingPercentage / 10) * 10 + "%";

    $ratingItemStars.css({ width: ratingPercentageRounded });
  }

  /**
   * Reviews
   */

  var $reviewSlider1 = $(".reviews-slider-1");
  var $reviewSlider2 = $(".reviews-slider-2");

  mediaQuery(
    "(max-width: 1199px)",
    function (load) {
      if (load) {
        initReviewSlider($reviewSlider2);
      } else {
        $reviewSlider2.slick("slickUnfilter");
        $reviewSlider1.slick("slickUnfilter");
        $reviewSlider1.slick("unslick");
      }

      $(".reviews-arrow-prev").on("click", function () {
        $reviewSlider2.slick("slickPrev");
      });
      $(".reviews-arrow-next").on("click", function () {
        $reviewSlider2.slick("slickNext");
      });
    },
    function (load) {
      if (load) {
        initReviewSlider($reviewSlider2);
        initReviewSlider($reviewSlider1);
        $reviewSlider2.slick("slickFilter", ":even");
        $reviewSlider1.slick("slickFilter", ":odd");
      } else {
        $reviewSlider2.slick("slickFilter", ":even");
        $reviewSlider1 = $(".reviews-slider-1");
        initReviewSlider($reviewSlider1);
        $reviewSlider1.slick("slickFilter", ":odd");
      }

      $(".reviews-arrow-prev").on("click", function () {
        $reviewSlider2.slick("slickPrev");
        $reviewSlider1.slick("slickNext");
      });
      $(".reviews-arrow-next").on("click", function () {
        $reviewSlider2.slick("slickNext");
        $reviewSlider1.slick("slickPrev");
      });
    }
  );

  function initReviewSlider($slider) {
    $slider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 300,
      arrows: false,
      dots: false,
      centerMode: true,
      draggable: false,
      centerPadding: 0,
    });
  }

  /**
   * Scrolling
   */

  $(".order-rating-link").on("click", function () {
    var $target = $(this.hash);
    var offset = scrollToBottom($target);
    $("html, body").animate({ scrollTop: offset }, 900);
    return false;
  });

  $(".tb-btn").on("click", function () {
    var $target = $(this.hash);
    var offset = $target.offset().top;
    $("html, body").animate({ scrollTop: offset }, 800);
    return false;
  });

  function scrollToBottom($target, offset) {
    offset = offset === undefined ? 0 : offset;
    return (
      $target.offset().top + $target.outerHeight() - window.innerHeight + offset
    );
  }

  // policy
  $(".footer-policy").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
    mainClass: "mfp-fade",
  });

  /**
   * Media Queries
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