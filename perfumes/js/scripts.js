window.addEventListener("load", function () {
  document.getElementById("top-banner").classList.add("animate");
  document.getElementById("tb-logo").classList.add("animate");
});

/*
 * Device Detection
 */
var isApple = !!navigator.platform.match(/(Mac)/i),
  isMac = !!navigator.platform.match(/(Mac)/i),
  isAndroid = /Android/i.test(navigator.userAgent),
  mobile = isAndroid || (isApple && !isMac);

// DOM is ready
$(function () {
  objectFitImages();
  var animationend =
    "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

  var cardContentMaxHeight = 0;

  /**
   * Card
   */

  var Card = function (element, settings) {
    var _ = this;

    _.card = $(element);
    _.cardContent = _.card.find(".card-content");
    _.descr = _.card.find(".card-descr-text");
    _.descrLink = _.card.find(".card-descr-link");
    _.descrLinkText = _.descrLink.find(".card-descr-link-text");
    _.form = _.card.find(".order-form-wrap");
    _.formBtn = _.form.find("button");

    var defaults = {
      speed: 500,
    };

    $.extend(_, defaults, settings);

    _.init();
    _.bindEvents();
  };

  Card.prototype = {
    init: function () {
      var _ = this;
      _.card.css({
        zIndex: _.zIndex,
      });
      _.serveForm();
      _.hideDescr(0);
      _.hideInputs(0);
    },

    bindEvents: function () {
      var _ = this;

      // hover
      _.card.hover(
        function () {
          if (!_.card.hasClass("active")) {
            _.cardContent.css({
              maxHeight: cardContentMaxHeight + "px",
            });
          }
        },
        function () {
          if (!_.card.hasClass("active")) {
            _.cardContent.css({
              maxHeight: "",
            });
          }
        }
      );

      // description link
      _.descrLink.on("click", function () {
        if (_.card.attr("data-descr") === "hidden") {
          _.showDescr();
        } else {
          _.hideDescr();
        }
      });

      // submit button
      _.formBtn.on("click", function (e) {
        if (_.card.attr("data-inputs") === "hidden") {
          e.preventDefault();
          _.showInputs();
        } else {
          // _.hideInputs();
        }
      });

      // outside card
      $(document).on("mouseup touchend", function (e) {
        var target = e.target;

        if (
          !_.card.is(e.target) &&
          _.card.has(e.target).length === 0 &&
          _.card.hasClass("active")
        ) {
          _.hideDescr();
          _.hideInputs();
        }
      });

      _.closeBtn.on("click", function () {
        _.hideInputs();
        _.cardContent.css({
          maxHeight: cardContentMaxHeight + "px",
        });
      });
    },

    serveForm: function () {
      var _ = this;

      _.form.find("label").each(function () {
        $(this).attr("for", "");
      });
      _.form
        .find("input")
        .addClass("card-input")
        .closest(".form-group")
        .addClass("input-group");
      _.form
        .find("button")
        .addClass("card-btn")
        .closest(".form-group")
        .addClass("btn-group");
      _.form.find("input[name=name_last]").parent().css({
        visibility: "hidden",
        position: "absolute",
      });
      _.inputs = _.form
        .find(".input-group")
        .wrapAll('<div class="input-form-groups"></div>')
        .parent();
      _.closeBtn = _.inputs
        .prepend('<div class="input-close-btn"></div>')
        .find(".input-close-btn");
      _.formBtnText = _.formBtn
        .wrapInner('<span class="btn__order-text"></span>')
        .find(".btn__order-text");
    },

    hideDescr: function (speed) {
      var _ = this;
      var speed = speed !== undefined ? speed : _.speed;

      _.descr.slideUp(speed, function () {});
      _.card.attr("data-descr", "hidden");
      _.descrLinkText.hide().text("Описание аромата").fadeIn(500);
      _.cardStatus();
    },

    showDescr: function () {
      var _ = this;

      _.cardContent.css({
        maxHeight: "none",
      });
      _.card.addClass("sliding-down");

      _.descr.slideDown(_.speed, function () {
        setTimeout(function () {
          _.card.removeClass("sliding-down");
        }, 100);
        _.cardContent.css("max-height", _.cardContent.outerHeight() + "px");
      });

      _.card.attr("data-descr", "shown");
      _.descrLinkText.hide().text("Скрыть описание").fadeIn(500);
      _.cardStatus();
    },

    hideInputs: function (speed) {
      var _ = this;
      var speed = speed !== undefined ? speed : _.speed;

      _.card.addClass("sliding-up");
      _.cardContent.css("max-height", "");
      _.inputs.slideUp(speed, function () {
        _.card.removeClass("sliding-up");
      });

      if (_.btnDescrText) {
        _.btnDescrText.fadeTo(0, 0, function () {
          _.btnDescr.slideUp(speed);
        });
      }

      _.card.attr("data-inputs", "hidden");
      _.cardStatus();
    },

    showInputs: function () {
      var _ = this;

      _.cardContent.css({
        maxHeight: "none",
      });
      _.card.addClass("sliding-down");

      _.inputs.slideDown(_.speed, function () {
        setTimeout(function () {
          _.card.removeClass("sliding-down");
        }, 100);
        _.cardContent.css("max-height", _.cardContent.outerHeight() + "px");
      });

      if (_.btnDescr) {
        _.btnDescr.slideDown(_.speed, function () {
          _.btnDescrText.fadeTo(300, 1);
        });
      }

      _.card.attr("data-inputs", "shown");
      _.cardStatus();
    },

    cardStatus: function () {
      var _ = this;

      if (
        _.card.attr("data-inputs") === "hidden" &&
        _.card.attr("data-descr") === "hidden"
      ) {
        _.card.removeClass("active");
      } else {
        _.card.addClass("active");
      }
    },
  };

  /**
   * Lottery
   */

  var Lottery = function (settings) {
    var _ = this;

    _.lottery = $(".lottery").find(".scoreboard");

    var defaults = {
      line: [20, 60, 50, 70, 30, 80, 40], // все скидки в порядке следования (как на изображении)
      // line: [20, 60, 50, 70, 80, 40], // все скидки в порядке следования (как на изображении)
      lineWidth: 2422, // ширина изображения
      // lineWidth: 2076, // ширина изображения
      containerWidth: 900, // ширина контейнера
      target: [50, 70], // должны выпасть
      circling: 5, // количество полных кругов
      transition: 5000, // в миллисекундах
      initItem: 60, // цифра в середине табло (в начале)
      itemWidth: 0,
      currentPosition: 0,
      discount: 0,
      clickCount: 5,
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

      _.itemWidth = _.lineWidth / _.line.length;

      _.currentPosition =
        (_.containerWidth - _.lineWidth) * 0.5 + _.getPosition(_.initItem);

      _.lottery
        .css({
          backgroundPosition: toEm(_.currentPosition),
        })
        .fadeTo(300, 1);
    },

    run: function (callback) {
      var _ = this;

      _.clickCount--;
      _.currentItem = _.discount ? _.discount : _.initItem;
      _.getDiscount(_.target);

      _.currentPosition +=
        _.getPosition(_.discount, _.currentItem) -
        _.circling * _.line.length * _.itemWidth;

      _.lottery.css({
        "background-position": toEm(_.currentPosition),
        transition:
          "background-position " +
          _.transition +
          "ms cubic-bezier(0.645, 0.045, 0.355, 1.1)",
      });

      if (callback) {
        setTimeout(function () {
          callback.call();
        }, _.transition);
      }
    },

    getPosition: function (target, currentItem) {
      var _ = this;
      var position = 0,
        center = currentItem
          ? _.line.indexOf(currentItem)
          : Math.floor(_.line.length / 2),
        remainder = _.line.length % 2;

      target = +target;

      if (!target) return;

      position = remainder
        ? (center - _.line.indexOf(target)) * _.itemWidth
        : currentItem
        ? (center - _.line.indexOf(target)) * _.itemWidth
        : (center - _.line.indexOf(target)) * _.itemWidth - _.itemWidth / 2;

      return position;
    },

    getDiscount: function (targetArr) {
      var _ = this;

      if (!targetArr) return;

      var numLow = 0,
        numHigh = targetArr.length - 1,
        adjustedHigh = parseFloat(numHigh) - parseFloat(numLow) + 1,
        numRand = Math.floor(Math.random() * adjustedHigh) + parseFloat(numLow);

      _.discount = targetArr[numRand];
    },
  };

  function toEm(val) {
    if (!val) return;

    return val / 16 + "em";
  }

  var lottery = JSON.parse(localStorage["Lottery2"] || "{}");

  if ($.isEmptyObject(lottery)) {
    lottery = new Lottery();
  } else if (lottery.clickCount > 0) {
    lottery = new Lottery({
      initItem: lottery.discount,
      discount: lottery.discount,
      price: lottery.price,
      clickCount: lottery.clickCount,
    });

    $(".lottery").nextUntil("script").show();
    $(".discount-val").hide().text(lottery.discount).fadeIn(0);
    $(".card-sale")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn(0);
  } else {
    $(".lottery").nextUntil("script").show();

    $(".scoreboard")
      .css({
        "background-position": toEm(lottery.currentPosition),
      })
      .fadeTo(300, 1);

    $(".discount-val").hide().text(lottery.discount).fadeIn(0);
    $(".card-sale")
      .hide()
      .text(lottery.discount + "%")
      .fadeIn(0);
  }

  var $cardClone = $(".card").eq(0).clone().addClass("card-clone").css({
    position: "absolute",
    visibility: "hidden",
    display: "block",
    zIndex: "-99",
  });

  $(".product-cards").eq(0).prepend($cardClone);
  var card = new Card(".card-clone");
  setTimeout(function () {
    cardContentMaxHeight = card.cardContent.outerHeight();
  }, 100);

  $(".lotteryBtn").on("click", function () {
    if (lottery.clickCount <= 0) return;

    lottery.run(function () {
      $(".lottery").nextUntil("script").show();

      cardContentMaxHeight = card.cardContent.outerHeight();

      setTimeout(function () {
        $("html, body").animate(
          {
            scrollTop: $(".lottery").next().offset().top,
          },
          1000
        );

        $(".discount-val").hide().text(lottery.discount).fadeIn();
        $(".card-sale")
          .hide()
          .text(lottery.discount + "%")
          .fadeIn();
        !mobile && $(".product-congrats-discount").addClass("animate");
      }, 500);
    });

    localStorage.Lottery2 = JSON.stringify(lottery.localStorage && lottery);
  });

  $(".product-congrats-discount").on(animationend, function () {
    $(this).removeClass("animate");
  });

  $(".lotteryLink").click(function () {
    var target = $(this.hash);

    if (target.length) {
      $("html,body").animate(
        {
          // scrollTop: target.offset().top - ($(window).height()/2 - target.height()/2)
          scrollTop:
            target.offset().top - ($(window).height() - target.height()),
        },
        1000
      );
      return false;
    }
  });

  var $cards = $(".card:not(.card-clone)"),
    cardQty = $cards.length;

  $cards.each(function (index) {
    new Card(this, { zIndex: cardQty - index });
  });

  var $priceActual = $(".product-categories").find(".actual-price"),
    $priceOld = $(".product-categories").find(".old-price");

  var priceOld = Math.round((lottery.price / (100 - lottery.discount)) * 100);

  $priceActual.text(lottery.price + " грн").fadeTo(300, 1);
  $priceOld.text(priceOld + " грн").fadeTo(300, 1);

  /**
   * Order Forms
   */

  var $orderForms = $(".order-form-wrap").not(".order-form__card");

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
          '<div class="btn-note btn-note__order">Вы получаете товар на почте и оплачиваете <span>только после осмотра и примерки</span></div>'
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

  /**
   * Categories Tabs
   */

  var $productTabs = $(".product-categories-nav").children("li"),
    $productTabActive = $productTabs.filter(".active"),
    $productContent = $(".product-categories").children("div");

  $productContent.hide();

  if ($productTabActive.length) {
    var loadCategory = $productTabActive.attr("data-category");

    $(".product-category")
      .filter('[data-category="' + loadCategory + '"]')
      .fadeIn();
    $productTabs
      .filter('[data-category="' + loadCategory + '"]')
      .addClass("active");
  }

  $productTabs.on("click", function () {
    var _this = $(this);

    if (!_this.hasClass("active")) {
      $productTabs.removeClass("active");
      $productContent.hide();

      var activeCategory = _this.attr("data-category");

      var $activeCategory = $(".product-category")
        .filter('[data-category="' + activeCategory + '"]')
        .fadeIn();

      $productTabs
        .filter('[data-category="' + activeCategory + '"]')
        .addClass("active");

      productTabActiveBtm = _this.attr("data-position");

      if (productTabActiveBtm) {
        $("html,body").scrollTop(
          $(".product-content").offset().top +
            $(".product-content").outerHeight() -
            $(window).height()
        );
      }
    }

    return false;
  });

  /*
   * Smooth Scroll
   */

  var $orderLink = $(".order-link").data("offset", 0);

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
});
