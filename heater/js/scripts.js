$.fn.hasAttr = function (name) {
  return this.attr(name) !== undefined;
};

/**
 * Device/Browser Detection
 */

var ua = {
  Android: function () {
    return !!navigator.userAgent.match(/android/i);
  },

  iOS: function () {
    return !!navigator.platform.match(/ip(hone|od|ad)/i);
  },

  Mac: function () {
    return /mac/i.test(navigator.platform);
  },

  Apple: function () {
    return ua.iOS() || ua.Mac();
  },

  Mobile: function () {
    return ua.iOS() || ua.Android();
  },

  IE: function () {
    return /msie|trident/i.test(navigator.userAgent);
  },

  Edge: function () {
    return /Edg(e|)/i.test(navigator.userAgent);
  },

  Chrome: function () {
    return /chrom(e|ium)/i.test(navigator.userAgent);
  },

  Firefox: function () {
    return /firefox/i.test(navigator.userAgent);
  },

  Safari: function () {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
};

/**
 * jQuery
 */

$(function () {
  var animationend = "webkitAnimationEnd animationend";
  objectFitImages();

  ua.IE() && $(".discount").addClass("ie");
  var $discount = $(".discount");

  $discount.each(function () {
    var _ = $(this),
      discountID = null;

    setTimeout(function () {
      _.addClass("animate");
      discountID = setInterval(function () {
        _.addClass("animate");
      }, randomNum(4500, 8000));
    }, 1000);

    _.on("mouseenter", function () {
      if (!_.hasClass("animate")) {
        _.addClass("animate");
        clearInterval(discountID);
        discountID = null;
      }
    });
    _.on("animationend", function () {
      _.removeClass("animate");
      clearInterval(discountID);
      discountID = setInterval(function () {
        _.addClass("animate");
      }, randomNum(4500, 8000));
    });
  });

  /**
   * Parallax
   */

  var scenesParallax = [];

  mQ(
    "(max-width: 991px)",
    function () {
      if (!scenesParallax.length) return;

      scenesParallax.forEach(function (scene) {
        scene.disable();
        $(scene.element).children().removeAttr("style");
      });
    },
    function () {
      if (scenesParallax.length === 0) {
        $(".decor-prllx")
          .children("span")
          .each(function (i) {
            scenesParallax[i] = new Parallax(
              $(this)
                .children("i")
                .attr({
                  "data-depth": randomNum(10, 20),
                  style: "animation-delay: " + randomNum(-1000, 2000) + "ms",
                })
                .end()
                .get(0),
              {
                frictionX: 0.01,
                frictionY: 0.01,
                invertX: Math.random() >= 0.5,
                invertY: Math.random() >= 0.5,
              }
            );
          });
      } else {
        scenesParallax.forEach(function (scene) {
          scene.enable();
        });
      }
    }
  );

  function randomNum(min, max) {
    var numLow = min,
      numHigh = max,
      adjustedHigh = parseFloat(numHigh) - parseFloat(numLow) + 1;

    return Math.floor(Math.random() * adjustedHigh) + parseFloat(numLow);
  }

  /**
   * Price
   */

  var getPrice = (function fn(price, discount) {
    var globalSettingsSelector = "body",
      priceContainerSelector = ".price",
      oldPriceSelector = ".old-price",
      actualPriceSelector = ".actual-price";

    var $globEl = $(globalSettingsSelector),
      $priceContainer = $(priceContainerSelector),
      globalDiscount = $globEl.attr("data-discount") || 50,
      currency = $globEl.attr("data-currency") || "грн";

    if (!arguments.length) {
      $priceContainer.each(function () {
        var $price = $(this),
          $oldPrice = $price.find(oldPriceSelector),
          $actualPrice = $price.find(actualPriceSelector);

        var localDiscount = $price.attr("data-discount")
            ? $price.attr("data-discount")
            : globalDiscount,
          actualPrice = parseFloat($actualPrice.text());

        var oldPrice = Math.round((actualPrice / (100 - localDiscount)) * 100);

        if ($price.hasClass("price__banner")) {
          mQ(
            "(min-width: 992px)",
            function () {
              $actualPrice
                .html(actualPrice + "<span>" + currency + "</span>")
                .fadeTo(1000, 1);
              $oldPrice
                .html(oldPrice + "<span>" + currency + "</span>")
                .prependTo($actualPrice.children("span"))
                .fadeTo(1000, 1);
            },
            function () {
              $actualPrice
                .html(actualPrice + "<span>" + currency + "</span>")
                .fadeTo(1000, 1);
              $oldPrice
                .html(oldPrice + "<span>" + currency + "</span>")
                .appendTo($price)
                .fadeTo(1000, 1);
            }
          );
        } else {
          $actualPrice
            .html(actualPrice + "<span>" + currency + "</span>")
            .fadeTo(1000, 1);
          $oldPrice
            .html(oldPrice + "<span>" + currency + "</span>")
            .fadeTo(1000, 1);
        }
      });

      return fn;
    } else {
      var discount = discount ? discount : globalDiscount;

      return Math.round((price / (100 - discount)) * 100);
    }
  })();

  /**
   * Date
   */

  function formatDate(args) {
    var options = {
      date: null,
      separator: ".",
      format: "default",
      locale: "default",
    };

    $.extend(options, args);

    var date = null;

    if (Object.prototype.toString.call(options.date) === "[object Date]") {
      date = options.date;
    } else if (
      new Date(options.date) !== "Invalid Date" &&
      !isNaN(new Date(options.date))
    ) {
      date = new Date(options.date);
    } else {
      console.log("Incorrect date input format!");
      return;
    }

    var year = date.getFullYear(),
      month = date.getMonth() + 1, // January is 0
      day = date.getDate();

    var separator = options.separator,
      format = options.format,
      locale = options.locale;

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    switch (format) {
      case "american": // month dd, yyyy
        month = date.toLocaleString(locale, { month: "long" }) + " " + day;
        return [month, year].join(", ");
      default:
        // dd.mm.yyyy
        return [day, month, year].join(separator);
    }
  }

  var tomorrow = new Date();

  var formattedDate = formatDate({
    date: tomorrow.setDate(tomorrow.getDate() + 1),
    separator: ".",
    format: "default",
    locale: "ru-RU",
  });

  $(".date").text(formattedDate).fadeTo(1000, 1);

  /**
   * YouTube
   */

  (function youtube() {
    var $videos = $(".video");
    var isMobile = ua.Mobile();

    $videos.each(function () {
      var $video = $(this);

      var $link = $video.find(".video-link"),
        $poster = $video.find(".video-poster"),
        $button = $video.find(".video-button"),
        $iframe = $video.find(".iframe-fluid"),
        id = parseLinkURL($link);

      $link.removeAttr("href");
      $poster.on(animationend, function () {
        $link.remove();
      });
      $button.on(animationend, function () {
        $button.remove();
      });

      $video.on("click", function () {
        var iframe = createIframe(id);

        if (isMobile) {
          $video.addClass("active mobile");
        } else {
          $video.addClass("active");
        }

        $iframe.append(iframe);
      });
    });

    function parseLinkURL(link) {
      var regexp = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i,
        url = link.attr("href"),
        match = url.match(regexp);

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
      var player = new YT.Player("player-" + id, {
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
   * Forms
   */

  var $forms = $(".order-form-wrap");

  $forms.each(function () {
    var $form = $(this);

    $form
      .find("input")
      .addClass("input")
      .closest(".form-group")
      .addClass("input-group");
    $form
      .find("button")
      .addClass("btn btn__order-form")
      .closest(".form-group")
      .addClass("btn-group");
    $form.find("input#name_last").parent().css({
      visibility: "hidden",
      position: "absolute",
      left: 0,
      top: 0,
    });

    $form.hasAttr("selectW") &&
      $form
        .find("input#phone")
        .closest(".form-group")
        .after(
          '<div class="form-group select-group">' +
            '<select class="input">' +
            '<option selected disabled hidden value="">Размер</option>' +
            '<option value="37">37 (24см)  </option>' +
            '<option value="38">38 (24,5см)</option>' +
            '<option value="39">39 (25см)  </option>' +
            '<option value="40">40 (26см)  </option>' +
            '<option value="41">41 (26,5см)</option>' +
            '<option value="42">42 (27,5см)</option>' +
            "</select>" +
            "</div>"
        );

    $form.hasAttr("selectM") &&
      $form
        .find("input#phone")
        .closest(".form-group")
        .after(
          '<div class="form-group select-group">' +
            '<select class="input">' +
            '<option selected disabled hidden value="">Размер</option>' +
            '<option value="40">40 (26,5см)</option>' +
            '<option value="41">41 (27,5см)</option>' +
            '<option value="42">42 (28см)  </option>' +
            '<option value="43">43 (28,5см)</option>' +
            '<option value="44">44 (29см)  </option>' +
            '<option value="45">45 (29,5см)</option>' +
            "</select>" +
            "</div>"
        );

    $form.hasAttr("price") &&
      $form
        .find("input#phone")
        .closest(".form-group")
        .after(
          '<div class="price price__order-form">' +
            '<div class="old-price" style="opacity: 1">' +
            getPrice(1278) +
            "</div>" +
            '<div class="actual-price" style="opacity: 1">1278</div>' +
            "</div>"
        );

    $form.hasAttr("name") &&
      $form.attr("name") === "false" &&
      $form
        .find("input#name_first")
        .removeAttr("required")
        .closest(".form-group")
        .css({
          visibility: "hidden",
          position: "absolute",
          left: 0,
          top: 0,
        });

    $form.hasAttr("comment") &&
      $form
        .find("input#phone")
        .closest(".form-group")
        .after(
          '<div class="form-group text-group">' +
            '<textarea class="form-control" id="text" placeholder="Краткий коментарий"></textarea>' +
            "</ div>"
        );

    $form.hasAttr("note") &&
      $form
        .find("button")
        .after(
          '<div class="btn-note btn-note__order-form">*Количество товара ограничено</div>'
        );
  });

  /**
   * Orders
   */

  var $orders = $(".order");

  $orders.each(function () {
    var $order = $(this),
      $galleries = $order.find(".order-gallery"),
      $form = $order.find(".order-form-wrap");

    // galleries

    $galleries.each(function () {
      var $gallery = $(this);

      $gallery.magnificPopup({
        delegate: "a",
        type: "image",
        gallery: {
          enabled: true,
          navigateByImgClick: true,
        },
        mainClass: "mfp-fade",
      });
    });
  });

  /**
   * Reviews
   */

  var $reviewsSlider = $(".reviews-slider");

  $reviewsSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 0,
    speed: 300,
    fade: true,
    arrows: false,
    dots: true,
  });

  /**
   * Smooth Scrolling
   */

  $('a[href*="#"]:not([href="#"]):not([href="#policy"])').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var $target = $(this.hash);

      if ($target.length) {
        var baseMinScrollTime = 1000,
          baseMaxScrollTime = 1000;

        var docHeight = $(document).height(),
          triggerTop = $(this).offset().top,
          targetTop = $target.offset().top;

        var scrollProportion = (targetTop - triggerTop) / docHeight,
          relativeTime =
            (baseMaxScrollTime - baseMinScrollTime) * scrollProportion +
            baseMinScrollTime,
          // Create inverse relationship (quicker the further we scroll)
          scrollTime = -1 * (1 - relativeTime);

        $("html, body").animate(
          {
            scrollTop: targetTop - 10,
          },
          scrollTime
        );
        return false;
      }
    }
  });

  // gallery
  $(".gallery").magnificPopup({
    delegate: "a",
    type: "image",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
    },
    mainClass: "mfp-fade",
  });

  // policy
  $(".policy-link").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
    mainClass: "mfp-fade",
  });

  /**
   * Media Queries
   */

  function mQ(mqStr, match, mismatch) {
    var mq = matchMedia(mqStr);

    mq.addListener(widthChange);
    widthChange(mq);

    function widthChange(mq) {
      if (mq.matches) {
        match();
      } else {
        mismatch();
      }
    }
  }
});