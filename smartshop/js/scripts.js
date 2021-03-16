window.onload = function () {
  document.body.className += " loaded";
};

/*
 * Device Detection
 */

var isApple = !!navigator.platform.match(/(Mac)/i),
  isMac = !!navigator.platform.match(/(Mac)/i),
  isAndroid = /Android/i.test(navigator.userAgent),
  mobile = isAndroid || (isApple && !isMac);

/*
 * Youtube
 */

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function createPlayer(playerId) {
  var player = new YT.Player(playerId, {
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

// DOM is ready
$(function () {
  objectFitImages();

  /*
   * Banner Images
   */

  var pause = false,
    item = $(".select-item"),
    $tbPhone = $(".tb-phone"),
    k = 1;

  setInterval(function () {
    if (!pause) {
      var aaIsSet = false;
      !aaIsSet && $tbPhone.filter(".active").addClass("aa");
      $tbPhone.removeClass("active").eq(k).addClass("active");
      k++;

      if (k >= $tbPhone.length) {
        k = 0;
        aaIsSet = true;
      }
    }
  }, 5600);

  /*
   * Menu
   */

  var $menu = $(".menu").data("clicked", false),
    $menuToggle = $menu.find(".hamburger"),
    $menuNav = $menu.find("nav"),
    $menuNavLi = $menuNav.find("li");

  // on document.ready
  if (matchMedia("(max-width: 767px)").matches) {
    $menu.addClass("collapsed");
  }
  // on window.resize
  matchMedia("(max-width: 767px)").addListener(function (mql) {
    if (mql.matches) {
      $menu.addClass("collapsed");
    } else {
      $menu.removeClass("collapsed");
      if ($menu.hasClass("open")) {
        $menuToggle.removeClass("is-active");
        $menuNav.stop().slideUp(0);
        $menu.removeClass("open");
      }
    }
  });

  $(window).on("load", Menu);

  function Menu() {
    var menuCollapsed,
      bbOffsetTop,
      bbOffsetBottom,
      windowHeight,
      scrollBottom,
      menuOffsetTop,
      menuHeight,
      menuOffsetBottom;

    var menuOffsetTop = $menu.offset().top;
    var $bottomBanner = $(".bottom-banner"),
      bottomBannerHeight;

    var lastId,
      fakeId,
      bottomFlag,
      $menuItems = $(".menu-nav-link"),
      $scrollItems = $menuItems.map(function () {
        var $item = $($(this).attr("href"));
        if ($item.length) {
          return $item;
        }
      });

    function menuInit() {
      menuCollapsed = $menu.hasClass("collapsed");
      bbOffsetTop = $bottomBanner.offset().top;
      bbOffsetBottom = bbOffsetTop + $bottomBanner.outerHeight();
      menuHeight = $menu.outerHeight();
      menuOffsetBottom = menuOffsetTop + menuHeight;

      var bbHeight = 0;

      $bottomBanner.add($bottomBanner.nextAll()).each(function () {
        bbHeight += $(this).outerHeight();
      });
      bottomBannerHeight = bbHeight;
    }

    /*
     * Menu Position
     */

    menuInit();
    menuSetPosition();

    $(window).on("scroll", menuSetPosition);
    $(window).on("resize", function () {
      menuInit();
      menuSetPosition();
    });

    function menuSetPosition() {
      var scroll = $(window).scrollTop(),
        windowHeight = $(window).height(),
        scrollBottom = scroll + windowHeight;

      if (windowHeight > bottomBannerHeight) {
        if (scroll >= menuOffsetBottom) {
          !$menu.hasClass("fixed") && $menu.addClass("fixed");

          if (scrollBottom >= bbOffsetBottom) {
            var menuPositionAtBottom = bbOffsetTop - scroll;

            $(window).off("scroll.highlightMenu");
            $menu.css({ top: menuPositionAtBottom + "px" });
            bottomFlag = true;
            fakeId = true;
            $menuItems.removeClass("active");
            $menuItems.eq($menuItems.length - 1).addClass("active");
          } else if (bottomFlag) {
            bottomFlag = false;
            $menu.css({ top: "0px" });
            if (!$menu.data("clicked")) {
              $(window).on("scroll.highlightMenu", highlightMenu);
              $menu.data("clicked", false);
            }
          }
        } else if (scroll <= menuOffsetTop && $menu.hasClass("fixed")) {
          $menu.css({ top: "" });
          $menu.removeClass("fixed");
        }
      } else {
        if (scroll >= menuOffsetBottom) {
          $menu.addClass("fixed");
          $menu.css({ top: "" });
        } else if (scroll <= menuOffsetTop && $menu.hasClass("fixed")) {
          $menu.css({ top: "" });
          $menu.removeClass("fixed");
        }
      }
    }

    /*
     * Menu Highlight
     */
    !menuCollapsed && $(window).on("scroll.highlightMenu", highlightMenu);

    $menuItems.click(function (e) {
      e.preventDefault();

      var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - menuHeight + 1;
      $(window).off("scroll.highlightMenu");
      fakeId = false;
      if (!menuCollapsed) {
        $menuItems.removeClass("active");
        $(this).addClass("active");
        $menu.data("clicked", true);
      }

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: offsetTop,
          },
          850,
          function () {
            highlightMenu();
            $(window).on("scroll.highlightMenu", highlightMenu);
            $menu.data("clicked", false);
            if (!menuCollapsed) {
            }
          }
        );
    });

    function highlightMenu() {
      var fromTop = $(this).scrollTop() + menuHeight + 1;

      var curItems = $scrollItems.map(function () {
        if ($(this).offset().top < fromTop) return this;
      });

      curItem = curItems[curItems.length - 1];
      var id = curItem && curItem.length ? curItem[0].id : "";

      if ((lastId !== id || fakeId) && !bottomFlag) {
        lastId = id;

        fakeId = false;
        $menuItems.removeClass("active");
        $menuItems.filter('[href="#' + id + '"]').addClass("active");
      }
    }

    /*
     * Menu Toggle
     */

    $menuToggle.on("click", function (e) {
      var target = e.target;

      if ($menu.hasClass("collapsed")) {
        $menuToggle.toggleClass("is-active");
        $menuNav.stop().slideToggle(500);
        $menu.toggleClass("open");
      }
    });

    $(document).on("mouseup touchend", function (e) {
      var target = e.target;

      if (
        ($menu.hasClass("collapsed") &&
          ($menuNavLi.is(target) || $menuNavLi.has(target).length)) ||
        ($menu.hasClass("collapsed") &&
          !$menu.is(target) &&
          $menu.has(target).length === 0)
      ) {
        $menuToggle.removeClass("is-active");
        $menuNav.stop().slideUp(500);
        $menu.removeClass("open");
      }
    });
  }

  /*
   * Order
   */

  var $orders = $(".order");

  $orders.each(function () {
    var $order = $(this);

    //order-gallery

    $order.find(".order-slider-wrap").each(function () {
      var $orderSlider = $(this);

      $orderSlider.find(".order-slider").on("init", function (event, slick) {
        objectFitImages($(this).find("img"));
      });

      $orderSlider.find(".order-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 300,
        fade: true,
        arrows: false,
        asNavFor: $orderSlider.find(".order-slider-nav"),
      });

      $orderSlider
        .find(".order-slider-nav")
        .on("init", function (event, slick) {
          objectFitImages($(this).find("img"));
        });

      $orderSlider.find(".order-slider-nav").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        rows: 0,
        speed: 300,
        dots: false,
        slide: "div:not(.video-thumb)",
        vertical: true,
        asNavFor: $orderSlider.find(".order-slider"),
        focusOnSelect: true,
        responsive: [
          {
            breakpoint: 576,
            settings: {
              vertical: true,
            },
          },
        ],
      });

      $orderSlider.magnificPopup({
        delegate: ".order-slide a",
        type: "image",
        gallery: {
          enabled: true,
          navigateByImgClick: true,
        },
        mainClass: "mfp-fade",
      });
    });

    // order-color

    var $colors = $order.find(".order-color"),
      $colorActive = $colors.filter(".active"),
      $orderSliders = $order.find(".order-slider-wrap");

    $orderSliders.hide();

    if ($colorActive.length) {
      var $loadSlider = $orderSliders.filter(
        "[data-color=" + $colorActive.attr("data-color") + "]"
      );
      $loadSlider.fadeIn();
      $loadSlider.find(".order-slider-nav").slick("setPosition");
      $loadSlider.find(".order-slider").slick("setPosition");
    }

    $colors.each(function () {
      var $color = $(this);

      $color.on("click", function () {
        var _this = $(this);

        if (!_this.hasClass("active")) {
          $colors.removeClass("active");
          $orderSliders.hide();

          var $activeSlider = $orderSliders.filter(
            "[data-color=" + _this.attr("data-color") + "]"
          );
          $activeSlider.fadeIn();
          $activeSlider.find(".order-slider").slick("setPosition");
          $activeSlider.find(".order-slider-nav").slick("setPosition");
          _this.addClass("active");
        } else {
          return false;
        }
        return false;
      });
    });

    // order-qty

    var $orderQtyInput = $order.find(".order-qty"),
      $orderQtyControls = $order.find(".order-qty-arrows a"),
      $orderQtyDown = $(".order-qty-down");

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

    checkQtyLimit();
    $orderQtyInput.on("change keyup", function () {
      checkQtyLimit();
    });

    function checkQtyLimit() {
      var orderQty = $orderQtyInput.val();
      if (orderQty <= 1) {
        $orderQtyDown.addClass("llimit");
      } else if ($orderQtyDown.hasClass("llimit")) {
        $orderQtyDown.removeClass("llimit");
      }
    }

    // Prevent negative value
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

    $orderQtyInput.on("change keyup", function (e) {
      var _this = $(this);
      if (_this.val() < 1) {
        _this.val(1);
      }
    });

    //video
    $videoThumbs = $order.find(".video-thumb");

    $videoThumbs.each(function () {
      var $videoThumb = $(this),
        videoId = $videoThumb.data("videoId"),
        playerId = "player-" + videoId,
        $videoContainer = $("#video"),
        $iframeContainer = $videoContainer.find(".iframe-fluid");

      $videoThumb.append(
        '<div class="iframe-fluid">' +
          '<a class="video-link" href="https://www.youtube.com/watch?v=' +
          videoId +
          '">' +
          '<picture class="video-poster">' +
          '<source srcset="https://i.ytimg.com/vi_webp/' +
          videoId +
          '/default.webp" type="image/webp">' +
          '<img src="https://i.ytimg.com/vi/' +
          videoId +
          '/default.jpg" alt="">' +
          "</picture>" +
          "</a>" +
          '<button class="video-button" type="button" aria-label="Запустить видео">' +
          '<svg width="100%" height="100%" viewBox="0 0 68 48" preserveAspectRatio="none">' +
          '<path class="video-button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path>' +
          '<path class="video-button-icon" d="M 45,24 27,14 27,34"></path>' +
          "</svg>" +
          "</button>" +
          "</div>"
      );

      $videoThumb.magnificPopup({
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
            var $createdIframes = $iframeContainer.find("iframe");
            mobile
              ? $videoContainer.addClass("active mobile")
              : $videoContainer.addClass("active");

            var $curIframe = $createdIframes.filter("#" + playerId);

            if ($curIframe.length) {
              $curIframe
                .attr({
                  allow: "autoplay",
                  src: generateURL(videoId),
                })
                .show();
              // mobile && createPlayer(playerId)
            } else {
              var iframe = createIframe(videoId, playerId);
              $iframeContainer.append(iframe);
              mobile && createPlayer(playerId);
            }
          },

          close: function () {
            $videoContainer.removeClass("active mobile");
            $iframeContainer
              .find("#" + playerId)
              .attr({
                allow: "",
                src: generateURL(videoId, false),
              })
              .hide();
          },
        },
      });

      function createIframe(videoId, playerId) {
        var iframe = document.createElement("iframe");

        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("id", playerId);
        iframe.setAttribute("allow", "autoplay");
        iframe.setAttribute("src", generateURL(videoId));

        return iframe;
      }

      function generateURL(videoId, autoplay) {
        if (autoplay === undefined) autoplay = true;

        if (autoplay) {
          var query = mobile
            ? "?rel=0&showinfo=0&enablejsapi=1"
            : "?rel=0&showinfo=0&autoplay=1";
        } else {
          var query = mobile
            ? "?rel=0&showinfo=0&enablejsapi=1"
            : "?rel=0&showinfo=0";
        }

        return "https://www.youtube.com/embed/" + videoId + query;
      }

      $videoThumb.on("click", function () {
        $(this).magnificPopup("open");
      });
    });
  });

  /*
   * Order Form
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
          '<div class="btn-descr btn-descr__order">Более подробную информацию о телефоне,<br> вы можете узнать у оператора.</div>'
        )
        .closest(".form-group")
        .addClass("btn-group btn-group-descr");
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

    if ($orderForm.hasClass("order-form__bb")) {
      $orderForm.find("button").addClass("btn__banner");
    }
  });

  /*
   * Smooth Scroll
   */

  var $galleryLink = $(".galleryLink").data("offset", $(".menu").outerHeight()),
    $orderLink = $(".orderLink").data("offset", 0);

  $([$galleryLink, $orderLink]).each(function () {
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