$.fn.hasAttr = function (name) {
  return this.attr(name) !== undefined;
};

/**
 * Loading the IFrame Player API code
 */

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * Device Detection
 */

var isApple = !!navigator.platform.match(/(Mac)/i),
  isMac = !!navigator.platform.match(/(Mac)/i),
  isAndroid = /Android/i.test(navigator.userAgent),
  mobile = isAndroid || (isApple && !isMac);

var ua = window.navigator.userAgent;
var isIE = /MSIE|Trident/.test(ua);

if (isIE) {
  $(".g-text").addClass("ie");
  $(".s-item").addClass("ie");
}

// DOM is ready
$(function () {
  // polyfills
  objectFitImages();

  var animationend = "webkitAnimationEnd animationend";
  var animationiteration = "webkitAnimationIteration animationiteration";

  /**
   * YouTube
   */

  (function youtube() {
    var $videoLinks = $(".video-button, .video-link"),
      $iframesContainer = $("#video").find(".iframe-fluid");

    $videoLinks.each(function () {
      var $videoLink = $(this),
        id = parseLinkURL($videoLink);

      $videoLink.magnificPopup({
        type: "inline",
        removalDelay: 300,
        closeBtnInside: true,
        fixedContentPos: true,
        mainClass: "mfp-zoom-out",
        midClick: true,
        callbacks: {
          open: function () {
            // this - is Magnific Popup object
          },

          beforeOpen: function () {
            var $iframes = $iframesContainer.find("iframe"),
              $curIframe = $iframes.filter("#player-" + id);

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
      var regexp = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i,
        url = link.attr("href"),
        match = url.match(regexp);

      return match[1];
    }

    function createIframe(id) {
      var base = "https://www.youtube.com/embed/";
      var query = mobile ? "?rel=0&enablejsapi=1" : "?rel=0&autoplay=1";

      return $("<iframe>", {
        src: base + id + query,
        id: "player-" + id,
        allow: "autoplay",
        allowfullscreen: "",
        on: {
          load: function () {
            mobile && createPlayer(id);
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

  var $videoLink = $(".videoLink");

  $videoLink.on("mouseenter", function () {
    $videoLink.on(animationiteration, function () {
      $videoLink.removeClass("ripple");
    });
  });
  $videoLink.on("mouseleave", function () {
    $videoLink.off(animationiteration);
    $videoLink.addClass("ripple");
  });

  /**
   * Price
   */

  var getPrice = (function fn(price, discount) {
    // selectors
    var globalSettingsSelector = "body",
      priceContainerSelector = ".price",
      oldPriceSelector = ".old-price",
      actualPriceSelector = ".actual-price";

    // init
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

        $oldPrice.text(oldPrice + " " + currency).fadeTo(1000, 1);
        $actualPrice.text(actualPrice + " " + currency).fadeTo(1000, 1);
      });

      return fn;
    } else {
      var discount = discount ? discount : globalDiscount;

      return Math.round((price / (100 - discount)) * 100);
    }
  })();

  /**
   * Lottery
   * @constructor
   * @param {string} element -
   * @param {Object} settings -
   * @param {string} settings.actualPS - Actual product price SELECTOR [constant].
   * @param {string} settings.calculatedPS - SELECTOR containing the calculated price from the actual [inconstant].
   */

  var Lottery = function (element, settings) {
    var _ = this;

    _.$lottery = $(element);

    var defaults = {
      element: element,
      section: [40, 70, 40, 50, 60, 70, 50, 60], // все скидки в порядке следования (как на барабане)
      target: [50, 70], // должны выпасть
      circling: 4, // количество полных кругов
      transition: 5000, // в миллисекундах
      initItem: 60, // цифра под стрелкой (в начале)
      centerLine: true, // под стрелкой линия (правая грань) секции с initItem (только в начале)
      centerSection: false, // выравнивать секцию по середине стрелки или рандомно в ее пределах
      sectionAngle: 0,
      clickCount: 1, // количество попыток
      localStorage: true,
      actualPS: ".actual-price", // селектор фактической стоимости товара
      calculatedPS: ".old-price",
      lotteryBtnS: ".lotteryBtn",
    };

    var lotteryLS = JSON.parse(localStorage["Lottery3"] || "{}");

    if ($.isEmptyObject(lotteryLS)) {
      $.extend(_, defaults, settings);

      _.init();
    } else {
      $.extend(_, defaults, lotteryLS);

      _.init();

      _.$lottery.trigger("finalState", [_]);
    }

    return this;
  };

  Lottery.prototype = {
    init: function () {
      var _ = this;

      if (typeof jQuery !== "undefined" && !(_.$lottery instanceof jQuery)) {
        _.$lottery = $(_.element);
      }

      _.sectionAngle = 360 / _.section.length;

      _.currentAngle = _.hasOwnProperty("currentAngle")
        ? _.currentAngle
        : _.getAngle(_.initItem, true);
      _.finalAngle = _.hasOwnProperty("finalAngle")
        ? _.finalAngle
        : _.currentAngle;

      _.$lottery
        .css({
          transform: "rotate(" + _.finalAngle + "deg)",
          "-webkit-transform": "rotate(" + _.finalAngle + "deg)",
        })
        .children(".drum-items, .drum-lines")
        .fadeTo(300, 1);

      $(_.lotteryBtnS).on("click", function (e) {
        e.preventDefault();

        if (_.clickCount <= 0) return;

        _.run();

        localStorage.Lottery3 = JSON.stringify(_.localStorage && _);
      });
    },

    run: function (callback) {
      var _ = this;

      _.$lottery.trigger("beforeRun", _.transition);

      _.clickCount--;
      _.currentItem = _.discount || _.discount === 0 ? _.discount : _.initItem;

      _.getDiscount(_.target);

      _.currentAngle += _.circling * 360 + _.getAngle(_.discount);

      if (_.centerLine && !_.centerSection) {
        _.finalAngle = _.currentAngle + getRandom(2, _.sectionAngle - 2);
      } else if (_.centerLine && _.centerSection) {
        _.finalAngle = _.currentAngle += _.sectionAngle / 2;
        _.centerLine = false;
      } else if (!_.centerLine && _.centerSection) {
        _.finalAngle = _.currentAngle;
      } else {
        _.finalAngle =
          _.currentAngle -
          (_.sectionAngle / 2 - getRandom(2, _.sectionAngle - 2));
      }

      _.$lottery.css({
        transform: "rotate(" + _.finalAngle + "deg)",
        WebkitTransform: "rotate(" + _.finalAngle + "deg)",
        transition:
          "transform " +
          _.transition +
          "ms cubic-bezier(0.645, 0.045, 0.355, 1.1)",
        WebkitTransition:
          "transform " +
          _.transition +
          "ms cubic-bezier(0.645, 0.045, 0.355, 1.1)",
      });

      if (callback) {
        setTimeout(function () {
          callback.call();
        }, _.transition);
      }

      setTimeout(function () {
        _.$lottery.trigger("afterRun", [_]);
      }, _.transition);
    },

    getDiscount: function (targetArr) {
      var _ = this;

      if (!targetArr) return;

      _.discount = targetArr[getRandom(0, targetArr.length - 1)];
      _.discountIndex = _.section.indexOf(_.discount);
    },

    getAngle: function (target, onInit) {
      var _ = this;
      var onInit = onInit || false;

      var curAngle = onInit
        ? _.centerLine
          ? 360 - _.sectionAngle / 2
          : 360
        : _.sectionAngle * _.section.indexOf(_.currentItem);

      target = +target;
      if (!target && target !== 0) return;

      var targetSectionAngle = _.section.indexOf(target) * _.sectionAngle;

      return 360 - targetSectionAngle + curAngle;
    },
  };

  function getRandom(min, max) {
    var numLow = min,
      numHigh = max,
      adjustedHigh = parseFloat(numHigh) - parseFloat(numLow) + 1;

    return Math.floor(Math.random() * adjustedHigh) + parseFloat(numLow);
  }

  // from local storage

  $(".drum").on("finalState", function (event, lottery) {
    $("body").attr("data-discount", lottery.discount);
    getPrice();

    $(".lotteryBtn")
      .children("span")
      .hide()
      .html(
        '<span class="lottery-btn-congrats">поздравляем<br> ваша скидка <b>' +
          lottery.discount +
          "%</b></span>"
      )
      .fadeIn(0);

    $(".lottery").nextUntil("script").show();

    $(".discount-val")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn(0);
  });

  // initialization

  new Lottery(".drum", {
    localStorage: true,
    clickCount: 1,
    section: [10, 20, 25, 35, 40, 50, 60, 70],
    target: [50, 70],
    initItem: 70,
    centerLine: true,
  });

  // before run

  $(".drum").on("beforeRun", function (event, transition) {
    $(".drum-wrap").addClass("animate-arrow");
    $(".drum-wrap").on(animationend, function () {
      $(".drum-wrap").removeClass("animate-arrow");
    });

    $(".confetti").remove();
    createConfetti();
  });

  // after run

  $(".drum").on("afterRun", function (event, lottery) {
    $("body").attr("data-discount", lottery.discount);
    getPrice();

    $(".confetti").each(function () {
      var _this = $(this);
      _this.css({
        top: "100%",
        left: parseFloat(_this[0].style.left) + Math.random() * 15 + "%",
      });
    });

    $(".lotteryBtn")
      .children("span")
      .hide()
      .html(
        '<span class="lottery-btn-congrats">поздравляем<br> ваша скидка <b>' +
          lottery.discount +
          "%</b></span>"
      )
      .fadeIn(2000);

    $(".lottery").nextUntil("script").show();
    $(".discount-val")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn();

    $(".slick-initialized").each(function () {
      $(this).slick("setPosition");
    });

    setTimeout(function () {
      $("html, body").animate(
        {
          scrollTop: $(".lottery").next().offset().top,
        },
        1000
      );
    }, 4000);
  });

  // lottery link

  $(".lotteryLink").click(function () {
    var $target = $(this.hash);

    if ($target.length) {
      var $lotterySection = $(".lottery");

      var targetOffset =
        $lotterySection.height() <= $(window).height()
          ? $lotterySection.offset().top -
            ($(window).height() - $lotterySection.outerHeight())
          : $target.offset().top -
            ($(window).height() / 2 - $target.height() / 2);

      $("html,body").animate(
        {
          scrollTop: targetOffset,
        },
        1000
      );
      return false;
    }
  });

  // features items

  $(".features-item").each(function () {
    var $item = $(this);

    $item.on("mouseenter", function () {
      $(this).addClass("fi active");
    });
    $item.on("mouseleave", function () {
      $(this).removeClass("active");
    });
  });

  function createConfetti() {
    for (var i = 0; i < 150; i++) {
      var width = Math.random() * 8;
      var height = width * 0.8;
      var colourIdx = Math.ceil(Math.random() * 3);
      var colour = "red";

      switch (colourIdx) {
        case 1:
          colour = "yellow";
          break;
        case 2:
          colour = "blue";
          break;
        default:
          colour = "red";
      }

      $('<div class="confetti ' + colour + '"></div>')
        .css({
          width: width + "px",
          height: height + "px",
          top: -Math.random() * 20 + "%",
          left: Math.random() * 100 + "%",
          opacity: Math.random() + 0.5,
          transform: "rotate(" + Math.random() * 360 + "deg)",
        })
        .appendTo(".lottery");
    }
  }

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
      $orderSlider = $order.find(".order-slider"),
      $orderSliderNav = $order.find(".order-slider-nav"),
      $orderForm = $order.find(".order-form-wrap");

    // order sizes

    var $sizesContainer = $order.find(".order-sizes");
    $sizesContainer.prepend("<div class='size-float'></div>");
    var $sizeFloat = $sizesContainer.find(".size-float");
    var $sizes = $sizesContainer.find(".order-size");
    var posLeft = 0;
    var actionDelayTimer = null;

    $sizeFloat
      .css("left", sizeLeft($sizes.filter(".active")))
      .data("left", $sizeFloat.position().left || -50);

    $sizes.each(function () {
      var $size = $(this);

      $size.on("click", function () {
        var $sizeSelected = $order.find(".size-selected");
        $sizeSelected.fadeOut(200, function () {
          $sizeSelected.text($size.data("size")).fadeIn(300);
        });
        $sizes.removeClass("animate").filter(".active").addClass("animate");
        $sizes.removeClass("left right");
        $size.addClass("active").siblings().removeClass("active");
        $size.prevAll().addClass("left");
        $size.nextAll().addClass("right");
        $sizeFloat.data("left", sizeLeft($size));
      });

      $size.filter(".animate").on(animationend, function () {
        $(this).removeClass("animate");
      });

      $size.hover(
        function () {
          posLeft = sizeLeft($size);
          $sizes.removeClass("hovered");
          $size.addClass("hovered");
          $sizeFloat.css({ left: posLeft });
          clearTimeout(actionDelayTimer);
        },
        function () {
          actionDelayTimer = setTimeout(function () {
            $size.removeClass("hovered");
            $sizeFloat.css({
              left: $sizeFloat.data("left"),
            });
          }, 2000);
        }
      );

      $sizesContainer.on("mouseleave", function () {
        $sizes.removeClass("hovered");
        $sizeFloat.css({
          left: $sizeFloat.data("left"),
        });
        clearTimeout(actionDelayTimer);
      });
    });

    // order title

    mQ(
      "(max-width: 1199px)",
      function () {
        var $orderTitles = $order.find(".order-title-wrap"),
          $orderIn = $order.find(".order-in");

        $orderTitles
          .clone()
          .addClass("order-title-wrap-clone")
          .prependTo($orderIn);
      },
      function () {
        $(".order-title-wrap-clone").remove();
      }
    );

    // order sliders

    $orderSlider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 300,
      fade: false,
      arrows: false,
      dots: false,
      asNavFor: $orderSliderNav,
    });

    $orderSliderNav.slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      rows: 0,
      speed: 300,
      fade: false,
      arrows: false,
      dots: false,
      focusOnSelect: true,
      asNavFor: $orderSlider,
    });

    $orderSlider.magnificPopup({
      delegate: ".slick-slide:not(.slick-cloned) a",
      type: "image",
      gallery: {
        enabled: true,
        navigateByImgClick: true,
      },
      mainClass: "mfp-fade",
    });
  });

  function sizeLeft(elem) {
    return elem.length ? $(elem).position().left : -50;
  }

  /**
   * Reviews
   */

  var $reviewsSlider = $(".reviews-slider"),
    $reviewsArrows = $(".reviews-slider-arrows");

  $reviewsSlider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 0,
    speed: 0,
    fade: true,
    arrows: true,
    dots: true,
    prevArrow: $reviewsArrows.children(".reviews-slider-prev"),
    nextArrow: $reviewsArrows.children(".reviews-slider-next"),
  });

  var $commentFormWrap = $(".reviews-form-wrap"),
    $commentForm = $commentFormWrap.find("form"),
    $commentSubmitBtn = $commentForm.find('button[type="submit"]'),
    $reviewsContainer = $commentFormWrap.parent(),
    $commentMsgWrap = $(".reviews-message-wrap"),
    $reviewsMain = $commentFormWrap.prevAll(),
    $reviewBtn = $(".reviewsLink"),
    $reviewBtnText = $reviewBtn.find("span"),
    $closeComment = $(".reviews-close-btn");

  $reviewsContainer
    .css("height", "auto")
    .css("height", $reviewsContainer.outerHeight(false));

  $reviewsSlider.on("setPosition", function () {
    if ($(this).is(":visible")) {
      $reviewsContainer
        .css("height", "auto")
        .css("height", $reviewsContainer.outerHeight(false));
    }
  });

  $reviewBtn.on("click", function (e) {
    e.preventDefault();

    if (!$commentFormWrap.is(":visible") || $commentMsgWrap.is(":visible")) {
      $reviewsArrows.fadeTo(200, 0);
      $reviewsMain.add($commentMsgWrap).fadeOut(200, function () {
        $commentFormWrap.fadeIn(400);
      });
      $reviewBtnText.fadeOut(300, function () {
        $reviewBtnText.text("Отправить").fadeIn(300);
      });
    } else {
      $commentSubmitBtn.trigger("click");
    }
  });

  $commentForm.submit(function (e) {
    e.preventDefault();

    var $inputs = $commentForm.find('input[type="text"]');
    var $texts = $commentForm.find("textarea");
    var $radios = $commentForm.find('input[type="radio"]');

    $commentFormWrap.fadeOut(200, function () {
      $commentMsgWrap.css("display", "flex").hide().fadeIn(400);
    });

    $reviewBtnText.fadeOut(300, function () {
      $reviewBtnText.text("Оставить отзыв").fadeIn(300);
    });

    $inputs.val("");
    $texts.val("");
    $radios.prop("checked", false);
  });

  $closeComment.on("click", function () {
    $commentFormWrap.add($commentMsgWrap).fadeOut(0, function () {
      $reviewsMain.fadeIn(200, function () {
        if ($reviewsSlider.hasClass("slick-initialized")) {
          $reviewsSlider.slick("setPosition").slick("setPosition");
        }
      });
      $reviewBtnText.fadeOut(300, function () {
        $reviewBtnText.text("Оставить отзыв").fadeIn(300);
      });
      $reviewsArrows.fadeTo(200, 1);
    });
  });

  mQ(
    "(max-width: 991px)",
    function () {
      var $featuresItems = $(".features-items");

      $featuresItems.each(function () {
        if (!$featuresItems.hasClass("slick-initialized")) {
          $featuresItems.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            rows: 0,
            speed: 300,
            fade: true,
            arrows: false,
            dots: true,
          });
        }
      });
    },
    function () {
      var $featuresItems = $(".features-items");

      $featuresItems.each(function () {
        if ($featuresItems.hasClass("slick-initialized")) {
          $featuresItems.slick("unslick");
        }
      });
    }
  );

  /**
   * Smooth Scrolling
   */

  var $orderLink = $(".orderLink").data("offset", 0);

  $([$orderLink]).each(function () {
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
