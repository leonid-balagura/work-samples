function checkTouchDevice() {
  return "ontouchstart" in document.documentElement;
}

function checkIE() {
  return /msie|trident/i.test(navigator.userAgent);
}

function checkMobile() {
  return /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// loader
(function loader() {
  var elapsed = false;
  var loaded = false;

  setTimeout(function () {
    elapsed = true;
    loaded && hideLoader();
  }, 600);

  var hideLoader = function () {
    document.body.classList.remove("loading");
    var scrollpos = sessionStorage.getItem("scrollpos");
    scrollpos && window.scrollTo(0, scrollpos);
  };

  window.onload = function () {
    loaded = true;
    elapsed && hideLoader();
  };

  window.onbeforeunload = function () {
    sessionStorage.setItem("scrollpos", window.pageYOffset);
  };
})();

// DOM ready
$(function () {
  var isTouchDevice = checkTouchDevice();
  var isIE = checkIE();
  var isMobile = checkMobile();

  objectFitImages();

  var $body = $("body");
  var fixScroll = 0;

  isTouchDevice && $body.addClass("touchscreen");
  isIE && $body.addClass("ie");

  /**
   * Popup
   */

  var $popupContainer = $(".popup-container");
  var $popups = $popupContainer.children();

  $(".openPopup").on("click", function (e) {
    e.preventDefault();
    openPopup($(this).attr("data-popup"));
  });

  $(".closePopup").on("click", function (e) {
    e.preventDefault();
    closePopup();
  });

  function openPopup(popupId) {
    $popups.removeClass("is-opened");
    $popups.filter(popupId).addClass("is-opened").scrollTop(0);
    lockBody();
    $popupContainer.addClass("is-opened");
  }

  function closePopup() {
    $popupContainer.removeClass("is-opened");
    $popups.removeClass("is-opened");
    unlockBody();
  }

  function lockBody() {
    fixScroll = $(window).scrollTop() || fixScroll;
    if (!$body.hasClass("is-locked")) {
      $body.addClass("is-locked").css("top", -1 * fixScroll);
    }
  }

  function unlockBody() {
    $body.removeClass("is-locked").removeAttr("style");
    $(window).scrollTop(fixScroll);
    fixScroll = 0;
  }

  $(".popup .form").on("submit", function (e) {
    e.preventDefault();
    $(this)
      .find("input")
      .each(function () {
        this.value = "";
      });
    openPopup("#popup-msg");
  });

  /**
   * YouTube
   */

  (function youtube() {
    var $videoLinks = $(".video-link");
    var $iframesContainer = $("#video").find(".iframe-fluid");

    $videoLinks.each(function () {
      var $videoLink = $(this);
      var id = parseLinkURL($videoLink);

      $videoLink.magnificPopup({
        type: "inline",
        removalDelay: 300,
        closeBtnInside: true,
        fixedContentPos: true,
        mainClass: "mfp-fade",
        midClick: true,
        closeMarkup:
          '<div class="btn-close btn-close-mfp closeMagnificPopup"></div>',
        callbacks: {
          open: function () {
            $(".closeMagnificPopup").on("click", function () {
              $.magnificPopup.close();
            });
          },

          beforeOpen: function () {
            var $iframes = $iframesContainer.find("iframe");
            var $curIframe = $iframes.filter("#player-" + id);

            if ($curIframe.length) {
              $curIframe
                .attr({
                  allow: "autoplay",
                  src: $curIframe
                    .attr("src")
                    .replace("&autoplay=0", "&autoplay=1"),
                })
                .show();
            } else {
              var iframe = createIframe(id);
              $iframesContainer.append(iframe);
            }
          },

          close: function () {
            var $curIframe = $iframesContainer.find("#player-" + id);

            $curIframe
              .attr({
                allow: "",
                src: $curIframe
                  .attr("src")
                  .replace("&autoplay=1", "&autoplay=0"),
              })
              .hide();
          },
        },
      });

      $videoLink.on("click", function (e) {
        e.preventDefault();
        $(this).magnificPopup("open");
      });
    });

    function parseLinkURL(link) {
      var regexp = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i;
      var url = link.attr("href");
      var match = url.match(regexp);

      return match[1];
    }

    function createIframe(id) {
      var base = "https://www.youtube.com/embed/";
      var query = isMobile ? "?rel=0&enablejsapi=1" : "?rel=0&autoplay=1";

      return $("<iframe>", {
        src: base + id + query,
        id: "player-" + id,
        allow: "autoplay",
        allowfullscreen: "",
        on: {
          load: function () {
            isMobile && createPlayer(id);
          },
        },
      });
    }

    function createPlayer(id) {
      new YT.Player("player-" + id, {
        host: "https://www.youtube.com",
        events: {
          onReady: function (e) {
            e.target.playVideo();
          },
        },
      });
    }
  })();

  /**
   * Ingredients
   */

  var $ingredients = $(".ingredients-item");

  $ingredients.each(function (index) {
    var $ingredientItem = $(this);
    var $ingredientArrow = $ingredientItem.find(".ingredients-item-arrow");
    var $ingredientList = $ingredientItem.find(".ingredients-item-list");

    $ingredientItem.css({
      zIndex: ($ingredients.length - index) * 10,
    });

    $ingredientList.data({ maxHeight: $ingredientList.outerHeight() }).css({
      maxHeight: 50,
    });

    if (isTouchDevice) {
      $ingredientItem.on("click", function () {
        showIngredient();
      });
      $ingredientArrow.on("click", function (e) {
        if ($ingredientItem.hasClass("is-open")) {
          e.stopPropagation();
          hideIngredient();
        }
      });
    } else {
      $ingredientItem.on("mouseenter", function () {
        showIngredient();
      });
      $ingredientItem.on("mouseleave", function () {
        hideIngredient();
      });
    }

    function showIngredient() {
      $ingredientItem.addClass("is-open");
      $ingredientList.css({
        maxHeight: $ingredientList.data("max-height"),
      });
    }

    function hideIngredient() {
      $ingredientItem.removeClass("is-open");
      $ingredientList.css({
        maxHeight: 50,
      });
    }
  });

  $(".popup-agreement-contents a").on("click", function () {
    var $target = $(this.hash);

    $target
      .closest(".popup")
      .animate({ scrollTop: $target.offset().top - 10 }, 300);

    return false;
  });

  /**
   * Reviews
   */

  var $reviewSlider1 = $(".reviews-slider-1");
  var $reviewSlider2 = $(".reviews-slider-2");

  initReviewSlider($reviewSlider2);
  initReviewSlider($reviewSlider1);
  $reviewSlider1.slick("slickFilter", ":odd");
  $reviewSlider2.slick("slickFilter", ":even");

  $(".reviews-arrow-prev").on("click", function () {
    $reviewSlider2.slick("slickPrev");
    $reviewSlider1.slick("slickNext");
  });
  $(".reviews-arrow-next").on("click", function () {
    $reviewSlider2.slick("slickNext");
    $reviewSlider1.slick("slickPrev");
  });

  function initReviewSlider($slider) {
    $slider.on("init", function (event, slick) {
      slick.$slides.each(getRating);
    });

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

  // getRating
  function getRating() {
    var $rating = $(this).find(".rating-stars");
    var $ratingItemStars = $rating.find(".rating-stars-full");
    var ratingVal = parseFloat($rating.data("rating-val"));

    var ratingPercentage = (ratingVal / 5) * 100;
    var ratingPercentageRounded = Math.round(ratingPercentage / 10) * 10 + "%";

    $ratingItemStars.css({ width: ratingPercentageRounded });
  }

  /**
   ** Timer
   **/

  var now = new Date();
  var secPassed = now.getMinutes() * 60 + now.getSeconds();
  var t = 60 * 60 - secPassed;

  $(".timer").countdown({
    until: t,
    format: "HMS",
    layout: "{h10}{h1}:{m10}{m1}:{s10}{s1}",
    // onExpiry: refreshTimer,
  });

  // function refreshTimer() {
  //   t = 60 * 60;
  //   $(".timer").countdown("option", { until: t });
  // }
});