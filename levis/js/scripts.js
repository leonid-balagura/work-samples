// IFrame Player API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Device Detection
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
  objectFitImages();
  $("select").niceSelect();

  /**
   * Price
   */

  var getPrice = (function fn(price, discount) {
    // selectors
    var globalSettingsSelector = "body",
      priceContainer = ".price",
      oldPriceSelector = ".old-price",
      actualPriceSelector = ".actual-price";

    // init
    var $globEl = $(globalSettingsSelector),
      globalDiscount = $globEl.attr("data-discount") || 50,
      currency = $globEl.attr("data-currency") || "грн";

    if (!arguments.length) {
      $(priceContainer).each(function () {
        var $price = $(this),
          $oldPrice = $price.find(oldPriceSelector),
          $actualPrice = $price.find(actualPriceSelector);

        var localDiscount = $price.attr("data-discount")
            ? $price.attr("data-discount")
            : globalDiscount,
          actualPrice = parseFloat($actualPrice.text());

        var oldPrice = Math.round((actualPrice / (100 - localDiscount)) * 100);

        $oldPrice.text(oldPrice + " " + currency).fadeTo(1000, 1);
        $actualPrice.fadeTo(1000, 1);
      });

      return fn;
    } else {
      var discount = discount ? discount : globalDiscount;

      return Math.round((price / (100 - discount)) * 100);
    }
  })();

  /**
   * YouTube
   */

  (function youtubePopup() {
    var $videoLinks = $(".videoLink"),
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
      .addClass("btn btn--blue btn__order-form")
      .closest(".form-group")
      .addClass("btn-group");

    $form.find("input#name_last").parent().css({
      visibility: "hidden",
      position: "absolute",
      left: 0,
      top: 0,
    });
  });

  /**
   * Gallery
   */

  $(".gallery").each(function () {
    var $gallery = $(this);

    var $titles = $gallery.find(".title__gallery"),
      $titleContainer = $gallery.find(".gallery-title-wrap"),
      $navItems = $gallery.find(".gallery-nav-item"),
      $items = $gallery.find(".gallery-items"),
      $itemsContainer = $gallery.find(".gallery-items-wrap"),
      $shoes = $gallery.find(".gallery-shoe"),
      index = 1;

    $navItems.on("click", function () {
      var $navItem = $(this);

      if ($navItem.hasClass("active")) return;

      index = $navItem.attr("data-item");

      changeItem(index);
      $navItems.removeClass("active");
      $navItem.addClass("active");
    });

    function changeItem(index) {
      $shoes
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");
      $items
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");
      $titles
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");
    }

    $items.each(function () {
      var $item = $(this).find(".gallery-item");

      $item.on("mouseenter", function () {
        $(this).addClass("gi active");
      });
      $item.on("mouseleave", function () {
        $(this).removeClass("active");
      });
    });

    var galleryTitleId;
    mQ(
      "(max-width: 991px)",
      function () {
        resizeTitle();

        $(window).on("resize.galleryTitle", function () {
          clearTimeout(galleryTitleId);
          galleryTitleId = setTimeout(resizeTitle, 500);
        });

        $navItems.on("click.galleryTitle", resizeTitle);
      },
      function () {
        $(window).off("resize.galleryTitle");
        $navItems.off("click.galleryTitle");
        clearTimeout(galleryTitleId);
        $titleContainer.css({ height: "" });
      }
    );

    function resizeTitle() {
      var containerTitleHeight = $titleContainer.outerHeight(),
        currentTitleHeight = $titles.eq(index - 1).outerHeight();

      if (containerTitleHeight !== currentTitleHeight) {
        $titleContainer.css({ height: currentTitleHeight + "px" });
      }
    }

    var galleryItemsId;
    mQ(
      "(max-width: 767px)",
      function () {
        resizeItems();

        $(window).on("resize.galleryItems", function () {
          clearTimeout(galleryItemsId);
          galleryItemsId = setTimeout(resizeItems, 500);
        });

        $navItems.on("click.galleryItems", resizeItems);
      },
      function () {
        $(window).off("resize.galleryItems");
        $navItems.off("click.galleryItems");
        clearTimeout(galleryItemsId);
        $itemsContainer.css({ height: "" });
      }
    );

    function resizeItems() {
      var containerItemsHeight = $itemsContainer.outerHeight(),
        currentItemsHeight = $items.eq(index - 1).outerHeight();

      if (containerItemsHeight !== currentItemsHeight) {
        $itemsContainer.css({ height: currentItemsHeight + "px" });
      }
    }
  });

  /**
   * Product
   */

  $(".product").each(function () {
    var $product = $(this);

    var $titles = $product.find(".title__product"),
      $titleContainer = $product.find(".product-title-wrap");
    ($lists = $product.find(".product-list")),
      ($items = $product.find(".product-item")),
      ($btn = $product.find(".btn__product")),
      ($dots = $product.find(".pi-dots").children("li")),
      ($counterPrev = $product.find(".pi-counter-prev")),
      ($counterNext = $product.find(".pi-counter-next")),
      (itemsCount = $items.length),
      (index = 1),
      (circleRadius = $product.find(".product-items-in").outerWidth() / 2);
    animating = false;

    $items.eq(0).animate(
      {
        path: new $.path.arc({
          center: [circleRadius, circleRadius],
          radius: circleRadius,
          start: 360,
          end: 180,
          dir: -1,
        }),
        opacity: "1",
      },
      0
    );

    $(".pi-dots li").on("click", function () {
      index = $(this).attr("data-item");
      changeItem(index, 800, 1, circleRadius);
    });

    $(".pi-arrow-next").on("click", function () {
      index = index >= 1 && index < itemsCount ? ++index : 1;
      changeItem(index, 800, 1, circleRadius);
    });

    $(".pi-arrow-prev").on("click", function () {
      index = index > 1 ? --index : itemsCount;
      changeItem(index, 800, 1, circleRadius, 1);
    });

    function changeItem(index, speed, turns, rad, dir) {
      if (animating) return;

      animating = true;
      setTimeout(function () {
        animating = false;
      }, speed);

      var $curItem = $items.filter('[data-item="' + index + '"]');

      if ($curItem.hasClass("active")) return;

      var dir = dir === undefined ? 1 : -1;

      refreshCounter(index);
      mQ(
        "(max-width: 575px)",
        function () {
          resizeTitle();
        },
        function () {}
      );

      $items.removeClass("active");
      $curItem.addClass("active");

      $dots
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");
      $titles
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");
      $lists
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("active");

      $items.each(function (i) {
        var $item = $(this);

        if ($item.css("opacity") == 1) {
          $item.stop().animate(
            {
              path: new $.path.arc({
                center: [rad, rad],
                radius: rad,
                start: 180,
                end: 0,
                dir: dir,
              }),
              opacity: "0",
            },
            1500
          );
        } else {
          $item.stop().animate({ opacity: "0" }, 200);
        }
      });

      // make the circle appear in a circular movement
      var end = 90 - 360 * (turns - 1);
      $curItem.stop().animate(
        {
          path: new $.path.arc({
            center: [rad, rad],
            radius: rad,
            start: 360,
            end: 180,
            dir: dir,
          }),
          opacity: "1",
        },
        speed
      );
    }

    function refreshCounter(index) {
      var next = index < itemsCount ? +index + 1 : 1;
      var prev = +index == 1 ? itemsCount : +index - 1;

      $counterPrev.text("0" + prev);
      $counterNext.text("0" + next);
    }

    $btn.on("click", function () {
      $(".og-nav-item")
        .eq(index - 1)
        .trigger("click");
    });

    var orderTitleId;
    mQ(
      "(max-width: 575px)",
      function () {
        resizeTitle();

        $(window).on("resize.orderTitle", function () {
          clearTimeout(orderTitleId);
          orderTitleId = setTimeout(resizeTitle, 500);
        });
      },
      function () {
        $(window).off("resize.orderTitle");
        clearTimeout(orderTitleId);
        $titleContainer.css({ height: "" });
      }
    );

    function resizeTitle() {
      var containerTitleHeight = $titleContainer.outerHeight();
      // currentTitleHeight = $titles.eq(index-1).outerHeight();

      currentTitleHeight = $titles.eq(0).height();

      for (i = 0; i < $titles.length - 1; i++) {
        currentTitleHeight =
          currentTitleHeight < $titles.eq(i + 1).height()
            ? $titles.eq(i + 1).height()
            : currentTitleHeight;
      }

      if (containerTitleHeight !== currentTitleHeight) {
        $titleContainer.css({ height: currentTitleHeight + "px" });
      }
    }

    var resizeId;
    var windowWidth = $(window).width(),
      windowHeight = $(window).height();

    $(window).resize(function () {
      if (
        $(window).width() != windowWidth ||
        $(window).height() != windowHeight
      ) {
        clearTimeout(resizeId);
        resizeId = setTimeout(doneResizing, 500);
      }
    });

    function doneResizing() {
      circleRadius = $product.find(".product-items-in").outerWidth() / 2;
      $items.removeClass("active").attr("style", "");
      changeItem(index, 800, 1, circleRadius, 1);
    }
  });

  /**
   * Orders
   */

  var $orders = $(".order");

  $orders.each(function () {
    var $order = $(this),
      $titleContainer = $order.find(".order-title-wrap"),
      $titles = $titleContainer.children(".title-order"),
      $oldPrice = $order.find(".old-price"),
      $actualPrice = $order.find(".actual-price"),
      $orderSliders = $order.find(".og-slider"),
      $orderNavItems = $order.find(".og-nav-item"),
      $orderSlidersTrack = $order.find(".og-sliders-track"),
      $orderForm = $order.find(".order-form-wrap"),
      $select = $order.find(".order-select"),
      arrowOpacity = 0;

    mQ(
      "(max-width: 991px)",
      function () {
        $(".price__order")
          .clone(true)
          .addClass("price__order-clone")
          .appendTo(".order-in")
          .children()
          .css({ opacity: 1 });
        $(".order-title-wrap")
          .clone(true)
          .addClass("order-title-wrap-clone")
          .appendTo(".order-in");
        $titleContainer = $order.find(".order-title-wrap-clone");
        $titles = $titleContainer.children(".title-order");
        $oldPrice = $order.find(".old-price");
        $actualPrice = $order.find(".actual-price");
      },
      function () {
        $(".order-title-wrap-clone").remove();
        $(".price__order-clone").remove();
        $titleContainer = $order.find(".order-title-wrap");
        $titles = $titleContainer.children(".title-order");
        $oldPrice = $order.find(".old-price");
        $actualPrice = $order.find(".actual-price");
      }
    );

    // orderSliders

    $orderSliders.each(function () {
      var $orderSlider = $(this);

      $orderSlider.on(
        "beforeChange",
        function (event, slick, currentSlide, nextSlide) {
          var $slickDots = $(slick.$dots).children();
          $slickDots.removeClass("backward");
          if (
            (currentSlide > nextSlide &&
              (nextSlide !== 0 || currentSlide === 1)) ||
            (currentSlide === 0 && nextSlide === slick.slideCount - 1)
          ) {
            $slickDots.eq(nextSlide).addClass("backward");
          }
        }
      );

      $orderSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 300,
        fade: false,
        arrows: true,
        dots: true,
        prevArrow: $orderSlider.siblings(".og-slider-arrow-prev"),
        nextArrow: $orderSlider.siblings(".og-slider-arrow-next"),
      });

      $orderSlider.magnificPopup({
        delegate: "a",
        type: "image",
        gallery: {
          enabled: true,
          navigateByImgClick: true,
        },
        mainClass: "mfp-fade",
      });
    });

    $orderNavItems.on("click", function () {
      var $orderNavItem = $(this);

      if ($orderNavItem.hasClass("active")) return;

      if (parseInt($orderNavItem.attr("data-item")) === 1) {
        updateSelect({
          "40 (26см)  ": "40",
          "41 (27см)  ": "41",
          "42 (27,5см)": "42",
          "43 (28см)  ": "43",
          "44 (28,5см)": "44",
          "45 (29см)  ": "45",
        });
      } else {
        updateSelect({
          "40 (26,5см)": "40",
          "41 (27,5см)": "41",
          "42 (28см)  ": "42",
          "43 (28,5см)": "43",
          "44 (29см)  ": "44",
          "45 (29,5см)": "45",
        });
      }

      function updateSelect(obj) {
        $select.empty();

        $.each(obj, function (key, value) {
          $select.append($("<option></option>").attr("value", value).text(key));
        });

        $select.niceSelect("update");
      }

      changeItem($orderNavItem.attr("data-item"));
      $orderNavItems.removeClass("active");
      $orderNavItem.addClass("active");
    });

    function changeItem(index) {
      clearTimeout(arrowOpacity);
      $orderSlidersTrack.attr("data-item", index).addClass("active");
      arrowOpacity = setTimeout(function () {
        $orderSlidersTrack.removeClass("active");
      }, 800);

      $titles
        .removeClass("active")
        .filter('[data-item="' + index + '"]')
        .addClass("anim active");
      var $activeTitle = $titles.filter(".active");

      mQ(
        "(max-width: 767px)",
        function () {
          var containerTitleHeight = $titleContainer.outerHeight(),
            currentTitleHeight = $titles.eq(index - 1).outerHeight();

          if (containerTitleHeight !== currentTitleHeight) {
            $titleContainer.css({ height: currentTitleHeight + "px" });
          }
          // $titles.removeClass('active').filter('[data-item="'+index+'"]').addClass('anim active');
          // $titleContainer = $order.find('.order-title-wrap');
          // $titles = $titleContainer.children('.title-order');
        },
        function () {
          // $titles.removeClass('active').filter('[data-item="'+index+'"]').addClass('anim active');
          $titleContainer.css({ height: "" });
        }
      );

      var actualPrice = $activeTitle.attr("data-price"),
        discount = $activeTitle.attr("data-discount");
      oldPrice = getPrice(actualPrice, discount);

      $oldPrice
        .hide()
        .text(oldPrice + " грн")
        .fadeTo(1000, 1);
      $actualPrice
        .hide()
        .text(actualPrice + " грн")
        .fadeTo(1000, 1);
    }

    // orderQty

    var $orderQty = $order.find(".order-qty");

    $orderQty.each(function () {
      var $orderQtyInput = $(this).find("input"),
        $orderQtyControls = $(this).siblings("a");

      $orderQtyControls.click(function (e) {
        e.preventDefault();
        _this = $(this);

        var orderQty = $orderQtyInput.val();
        var qtyAction = _this.attr("class");

        if (qtyAction.indexOf("up") !== -1) {
          orderQty++;
        } else {
          orderQty--;
        }

        orderQty = orderQty < 1 ? 1 : orderQty;
        $orderQtyInput.val(orderQty).change();
      });

      $orderQtyInput.on("keydown", function (e) {
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

      $orderQtyInput.on("keydown keyup", function () {
        var _this = $(this);
        var maxChars = 5;

        if (_this.val().length >= maxChars) {
          _this.val(_this.val().substr(0, maxChars));
        }
      });

      $orderQtyInput.on("change keyup", function (e) {
        var _this = $(this);
        if (_this.val() < 1) {
          _this.val(1);
        }
        $(this).attr(
          "size",
          $(this).val().length-- ? $(this).val().length-- : 1
        );
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
}); // DOM is ready
