window.onload = function () {
  document.body.className += " loaded";
};

var ua = window.navigator.userAgent;
var isIE = /MSIE|Trident/.test(ua);

if (isIE) {
  $(".g-text").addClass("ie");
  $(".s-item").addClass("ie");
}

// DOM ready
$(function () {
  objectFitImages();

  var typed = new Typed(".js-typed", {
    strings: [
      "Закажите Landing Page для вашей прибыли",
      "Раскройте ваш бизнес с лучшей стороны",
      "Привлечение клиентов быстрым способом",
    ],
    typeSpeed: 40,
    loop: true,
    backSpeed: 15,
    backDelay: 4000,
  });

  $(".w-item-img").each(function () {
    $(this).on("mouseenter", fn);
    $(this).on("mouseleave", fn);
    $(this).on("mouseleave", function () {
      $(this).removeClass("active");
    });
  });

  function fn(e) {
    var $wImg = $(this);
    var $wOverlay = $wImg.find(".w-item-img-overlay");
    var wiOffset = $wImg.offset();

    var relX = e.pageX - wiOffset.left;
    var relY = e.pageY - wiOffset.top;

    $wOverlay.css({ left: relX + "px" });
    $wOverlay.css({ top: relY + "px" });

    $wImg.addClass("active");
  }

  var $sItems = $(".s-item"),
    $btnServices = $(".btnServices"),
    $btnService = $(".btnService");

  $btnServices.on("click", function () {
    $sItems.toggleClass("turn");
  });

  $btnService.on("click", function () {
    $(this).closest(".s-item").toggleClass("turn");
  });

  var $iCount = $(".a-item-digit");
  $iCount.each(function () {
    var $this = $(this);
    $this.text("0" + $this.data("suffix"));
  });

  var $titleWp = $(".title"),
    $aItemsWp = $(".about-items");

  $titleWp.waypoint(
    function (direction) {
      if (direction === "down") {
        $(this.element).addClass("animate");
      }
    },
    {
      offset: function () {
        return this.context.innerHeight() - this.adapter.outerHeight() * 0.5;
      },
    }
  );

  $aItemsWp.waypoint(
    function (direction) {
      if (direction === "down") {
        if (!$(this.element).hasClass("active")) {
          aItemsAnimate();
          $(this.element).addClass("active");
        }
      }
    },
    {
      offset: function () {
        return this.context.innerHeight();
        // return this.context.innerHeight() - this.adapter.outerHeight()
      },
      // continuous: false
    }
  );

  function aItemsAnimate() {
    $iCount.each(function () {
      var $counter = $(this),
        countTo = $counter.attr("data-count"),
        countSuf = $counter.attr("data-suffix");

      $({ countNum: 0 }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: "linear",
          // easing:'swing',
          step: function (now) {
            $counter.text(Math.ceil(now) + countSuf);
          },
          complete: function () {
            // $counter.text(this.countNum + countSuf);
            //alert('finished');
          },
        }
      );
    });
  }

  /**
   ** Forms
   **/

  var $orderForms = $(".order-form-wrap").find(".order-form"),
    $feedbackForms = $(".feedback-form-wrap").find(".order-form");

  $orderForms.each(function () {
    var $orderForm = $(this);

    $orderForm.find("input[name=name_last]").parent().css({
      visibility: "hidden",
      position: "absolute",
    });

    $orderForm
      .find("button")
      .addClass("btn btn__order")
      .closest(".form-group")
      .addClass("btn-group");
    $orderForm
      .find("input")
      .addClass("input")
      .closest(".form-group")
      .addClass("input-group");
  });

  // Feedback Form

  $feedbackForms.each(function () {
    var $feedbackForm = $(this);
    var $hiddenFields = $feedbackForm.find(
      "input[name=name_last], input[name=name_first]"
    );

    $hiddenFields.parent().css({
      visibility: "hidden",
      position: "absolute",
    });

    $feedbackForm
      .find("button")
      .addClass("btn btn__feedback")
      .closest(".form-group")
      .addClass("btn-group");
    $feedbackForm
      .find("input")
      .addClass("input")
      .closest(".form-group")
      .addClass("input-group");
  });

  $(".feedbackLink").magnificPopup({
    type: "inline",
    removalDelay: 500,
    closeBtnInside: true,
    fixedContentPos: true,
    mainClass: "mfp-zoom-out",
    midClick: true,
    closeMarkup: '<button type="button" class="mfp-close"></button>',
  });

  /*
   * Smooth Scroll
   */

  var $requestLink = $(".btnRequest").data("offset", 0),
    $advantagesLink = $(".advantages-link").data("offset", -60),
    $servicesLink = $(".services-link").data("offset", 30),
    $worksLink = $(".works-link").data("offset", -60);

  $([$requestLink, $advantagesLink, $servicesLink, $worksLink]).each(
    function () {
      var $link = $(this);

      $link.on("click", function () {
        var offset = $(this).data("offset") ? $(this).data("offset") : 0;

        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
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
    }
  );

  /*
   * Popups
   */

  $('[data-fancybox="works"]').fancybox({
    loop: true,
    infobar: false,
    buttons: ["close"],
    animationEffect: "fade",
  });

  $(".policy-link").magnificPopup({
    type: "inline",
    closeBtnInside: true,
    fixedContentPos: true,
  });

  /*
   * Media Queries
   */

  // 1200px
  // on document.ready
  if (matchMedia("(max-width: 1199px)").matches) {
  } else {
    if (!isIE) {
      $(".paroller").each(function () {
        $(this).addClass("active").paroller();
      });
    }
  }
  // on window.resize
  matchMedia("(max-width: 1199px)").addListener(function (mql) {
    if (mql.matches) {
    } else {
      if (!isIE) {
        $(".paroller").each(function () {
          if (!$(this).hasClass("active")) {
            $(this).paroller();
          }
        });
      }
    }
  });

  // 768px
  // on document.ready
  if (matchMedia("(max-width: 767px)").matches) {
    $servicesLink.data({ offset: 10 });
    $worksLink.data({ offset: -85 });
  } else {
  }
  // on window.resize
  matchMedia("(max-width: 767px)").addListener(function (mql) {
    if (mql.matches) {
      $servicesLink.data({ offset: 10 });
      $worksLink.data({ offset: -85 });
    } else {
      $servicesLink.data({ offset: 30 });
      $worksLink.data({ offset: -60 });
    }
  });

  // 576px
  // on document.ready
  if (matchMedia("(max-width: 575px)").matches) {
    $advantagesLink.data({ offset: -35 });
    $worksLink.data({ offset: -35 });
  } else {
  }
  // on window.resize
  matchMedia("(max-width: 575px)").addListener(function (mql) {
    if (mql.matches) {
      $advantagesLink.data({ offset: -35 });
      $worksLink.data({ offset: -35 });
    } else {
      $advantagesLink.data({ offset: -60 });
      $worksLink.data({ offset: -85 });
    }
  });
});