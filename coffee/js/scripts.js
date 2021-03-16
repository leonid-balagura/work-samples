/*
 * Device Detection
 */

var isApple = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)
    ? true
    : false,
  isMac = navigator.platform.match(/(Mac)/i) ? true : false,
  isAndroid = /Android/i.test(navigator.userAgent) ? true : false,
  mobile = false;

if (isApple || isAndroid) {
  mobile = isMac ? false : true;

  var commonClass = true,
    btns = document.querySelectorAll(".btn");

  switch (true) {
    case commonClass:
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add("f-btn");
      }
      break;

    case isApple:
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add("i-btn");
      }
      break;

    case isAndroid:
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.add("a-btn");
      }
      break;
  }
}

// DOM ready
$(function () {
  objectFitImages();

  /*
   * Formated Date
   */

  function formatedDate(date, separator) {
    var date = date ? new Date(date) : new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1, // January is 0
      day = date.getDate();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    var separator = separator || ".";
    return [day, month, year].join(separator);
  }

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  $(".discount-date").hide().text(formatedDate(tomorrow, ".")).fadeIn(0);

  /**
   * Drum Arrow Vars
   */

  var $drumArrow = $(".drum-arrow"),
    drumPlaying = true,
    drumAngle,
    drumMaxRadius = 5,
    drumRadius = drumMaxRadius,
    drumTime = 0,
    drumAnimFrame = -1;

  var drumArrowYourCT = new CircleType(
    document.querySelectorAll(".drum-arrow-your")[0]
  ).radius(250);
  var drumArrowWinningsCT = new CircleType(
    document.querySelectorAll(".drum-arrow-winnings")[0]
  ).radius(220);

  /**
   * Lottery
   */

  var Lottery = function (settings) {
    var _ = this;

    _.lottery = $(".lottery").find(".drum");

    var defaults = {
      section: [50, 30, 70, 20, 40, 10, 0, 60], // все скидки в порядке следования (как на барабане)
      containerWidth: 900, // ширина контейнера
      target: [50, 70], // должны выпасть
      circling: 4, // количество полных кругов
      transition: 5000, // в миллисекундах
      initItem: 10, // цифра под стрелкой (в начале)
      sectionAngle: 0,
      clickCount: 1,
      localStorage: true,
    };

    $.extend(_, defaults, settings);

    if (!_.hasOwnProperty("price")) {
      _.price = parseFloat($(".actual-price").eq(0).text());
    }

    _.init();
  };

  Lottery.prototype = {
    init: function () {
      var _ = this;

      _.sectionAngle = 360 / _.section.length;

      _.currentAngle = _.getAngle(_.initItem, true);

      _.lottery
        .css({
          transform: "rotate(" + _.currentAngle + "deg)",
          "-webkit-transform": "rotate(" + _.currentAngle + "deg)",
        })
        .fadeTo(300, 1);
    },

    run: function (callback) {
      var _ = this;

      _.clickCount--;
      _.currentItem = _.discount || _.discount === 0 ? _.discount : _.initItem;

      _.getDiscount(_.target);

      _.currentAngle += _.circling * 360 + _.getAngle(_.discount);

      _.lottery.css({
        transform: "rotate(" + _.currentAngle + "deg)",
        "-webkit-transform": "rotate(" + _.currentAngle + "deg)",
        transition:
          "transform " +
          _.transition +
          "ms cubic-bezier(0.645, 0.045, 0.355, 1.1)",
      });

      if (callback) {
        setTimeout(function () {
          callback.call();
        }, _.transition);
      }
    },

    getDiscount: function (targetArr) {
      var _ = this;

      if (!targetArr) return;

      _.discount = targetArr[getRandom(0, targetArr.length - 1)];
    },

    getAngle: function (target, onInit) {
      var _ = this;
      var onInit = onInit || false;

      var curAngle = onInit
        ? 360
        : _.sectionAngle * _.section.indexOf(_.currentItem);

      target = +target;
      if (!target && target !== 0) return;

      var targetSectionAngle = _.section.indexOf(target) * _.sectionAngle,
        sectionInnerAngle = !onInit ? getRandom(2, _.sectionAngle - 2) : 0;

      return 360 - targetSectionAngle + curAngle;
    },
  };

  function getRandom(min, max) {
    var numLow = min,
      numHigh = max,
      adjustedHigh = parseFloat(numHigh) - parseFloat(numLow) + 1;

    return Math.floor(Math.random() * adjustedHigh) + parseFloat(numLow);
  }

  var lottery = JSON.parse(localStorage["Lottery"] || "{}");

  if ($.isEmptyObject(lottery)) {
    lottery = new Lottery();

    /**
     * Drum Arrow Animation
     */

    (function loop() {
      drumAngle = Math.sin(drumTime) * drumRadius;
      setTransform($drumArrow, drumAngle);
      if (drumPlaying) {
        if (drumRadius < drumMaxRadius) drumRadius *= 1.03;
      } else {
        drumRadius *= 0.99;
      }

      drumTime += 0.03;
      drumAnimFrame = requestAnimationFrame(loop);

      if (drumRadius < 0.1) cancelAnimationFrame(drumAnimFrame);
    })();

    function setTransform(elem, angle) {
      elem.css({
        transform: "rotate(" + angle + "deg)",
        "-webkit-transform": "rotate(" + angle + "deg)",
      });
    }
  } else if (lottery.clickCount > 0) {
    lottery = new Lottery({
      initItem: lottery.discount,
      discount: lottery.discount,
      price: lottery.price,
      clickCount: lottery.clickCount,
    });

    $(".lottery").nextUntil("script").show();
    $(".discount")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn(0);
  } else {
    var $priceActual = $(".actual-price"),
      $priceOld = $(".old-price");

    var priceOld = Math.round((lottery.price / (100 - lottery.discount)) * 100);

    $priceActual.text(lottery.price + " ₹").fadeTo(300, 1);
    $priceOld.text(priceOld + " ₹").fadeTo(300, 1);

    $(".lottery").nextUntil("script").show();

    $(".drum")
      .css({
        transform: "rotate(" + lottery.currentAngle + "deg)",
        "-webkit-transform": "rotate(" + lottery.currentAngle + "deg)",
      })
      .fadeTo(300, 1);

    $(".discount")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn(0);
  }

  $(".lotteryBtn").on("click", function (e) {
    e.preventDefault();

    if (lottery.clickCount <= 0) return;

    drumPlaying = !drumPlaying;
    if (drumPlaying && drumRadius < 0.1) drumRadius = 0.1;

    lottery.run(function () {
      var $priceActual = $(".actual-price"),
        $priceOld = $(".old-price");

      var priceOld = Math.round(
        (lottery.price / (100 - lottery.discount)) * 100
      );

      $priceActual.text(lottery.price + " ₹").fadeTo(300, 1);
      $priceOld.text(priceOld + " ₹").fadeTo(300, 1);

      $(".lottery").nextUntil("script").show();

      setTimeout(function () {
        $("html, body").animate(
          {
            scrollTop: $(".lottery").next().offset().top,
          },
          1000
        );

        $(".discount")
          .hide()
          .text(lottery.discount + "%")
          .fadeIn();
      }, 500);
    });

    localStorage.Lottery = JSON.stringify(lottery.localStorage && lottery);
  });

  $(".lotteryLink").click(function () {
    var target = $(this.hash);

    if (target.length) {
      $("html,body").animate(
        {
          scrollTop:
            target.offset().top - ($(window).height() - target.height()),
        },
        1000
      );
      return false;
    }
  });

  /**
   * Order Forms
   */

  var $orderForms = $(".order-form-wrap");

  $orderForms.each(function () {
    var $orderForm = $(this),
      $formData = $orderForm.data("form") || {};

    if ($formData.select) {
      $orderForm
        .find("input[name=phone]")
        .closest(".form-group")
        .after(
          '<div class="form-group select-group">' +
            '<select class="input">' +
            '<option selected disabled hidden value="не указан">Размер</option>' +
            '<option value="36 (24 см)  ">36 (24 см)  </option>' +
            '<option value="37 (25 см)  ">37 (25 см)  </option>' +
            '<option value="38 (25,5 см)">38 (25,5 см)</option>' +
            '<option value="39 (26 см)  ">39 (26 см)  </option>' +
            '<option value="40 (26,5 см)">40 (26,5 см)</option>' +
            "</select>" +
            "</ div>"
        );
    }

    if ($formData.price) {
      $orderForm
        .find("input[name=phone]")
        .closest(".form-group")
        .after(
          '<div class="price price__spray">' +
            '<div class="old-price">4120 грн</div>' +
            '<div class="actual-price">1290 грн</div>' +
            "</div>"
        );
    }

    if (!$formData.name && $formData.name !== undefined) {
      $orderForm
        .find("input[name=name_first]")
        .removeAttr("required")
        .closest(".form-group")
        .css({
          visibility: "hidden",
          position: "absolute",
        });
    }

    $orderForm.find("input[name=name_last]").parent().css({
      visibility: "hidden",
      position: "absolute",
    });

    if ($formData.footnote) {
      $orderForm
        .find("button")
        .addClass("btn btn__order")
        .after(
          '<div class="btn-note btn-note__order">*Количество товара ограничено</div>'
        )
        .closest(".form-group")
        .addClass("btn-group");
    } else {
      $orderForm
        .find("button")
        .addClass("btn btn__order")
        .closest(".form-group")
        .addClass("btn-group");
    }

    if ($formData.comment) {
      $orderForm
        .find("input[name=phone]")
        .closest(".form-group")
        .after(
          '<div class="form-group text-group">' +
            '<textarea class="form-control" id="text" placeholder="Краткий коментарий"></textarea>' +
            "</ div>"
        );
    }

    $orderForm
      .find("input")
      .addClass("input")
      .closest(".form-group")
      .addClass("input-group");
  });

  /*
   * Reviews
   */

  var $reviewsSlider = $(".reviews-slider");

  $reviewsSlider.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    rows: 0,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: false,
    arrows: true,
    dots: false,
    prevArrow: ".reviews-slider-prev",
    nextArrow: ".reviews-slider-next",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  });

  // policy
  $(".policy-link").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
    mainClass: "mfp-fade",
  });
});