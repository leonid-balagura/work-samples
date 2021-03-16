$(function () {
  // fake loading
  setTimeout(function () {
    $(".page-content").addClass("loaded");
  }, 2400);

  $(".big-brother-logo").on("webkitAnimationEnd animationend", function () {
    $(".page-preloader").hide();
  });

  objectFitImages();

  var scenesParallax = [];
  var $offerSlider = $(".offers-slider");

  mQ(
    "(max-width: 1199px)",
    function () {
      if ($offerSlider.hasClass("slick-initialized")) {
        $offerSlider.slick("unslick");
      }

      $offerSlider.children("div").each(function () {
        $(".offer", this)
          .slice(-2)
          .appendTo($offerSlider)
          .wrapAll("<div></div>");
      });

      $offerSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 1000,
        fade: true,
        arrows: true,
        dots: false,
        prevArrow: ".offers-arrow-prev",
        nextArrow: ".offers-arrow-next",
      });

      if (!scenesParallax.length) return;

      scenesParallax.forEach(function (scene) {
        scene.disable();
        $(scene.element).children().removeAttr("style");
      });
    },
    function () {
      if ($offerSlider.hasClass("slick-initialized")) {
        $offerSlider.slick("unslick");
        var $slides = $offerSlider.children("div");

        $slides.slice(-2).each(function (i) {
          var $slide = $(this);
          $slide.children(".offer").appendTo($slides.eq(i));
          $slide.remove();
        });
      }

      $offerSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 1000,
        fade: true,
        arrows: true,
        dots: false,
        prevArrow: ".offers-arrow-prev",
        nextArrow: ".offers-arrow-next",
      });

      if (scenesParallax.length === 0) {
        $(".offer-img", $offerSlider).each(function (i) {
          var offerImg = this;

          scenesParallax.push(
            new Parallax(
              $("img", offerImg).attr("data-depth", 0.2).end().get(0),
              {
                frictionX: 0.1,
                frictionY: 0.1,
                limitX: false,
                limitY: false,
                relativeInput: true,
                hoverOnly: true,
                inputElement: offerImg.parentElement,
              }
            )
          );
        });

        $(".need-items")
          .find(".need-img")
          .each(function (i) {
            var needImg = this;

            scenesParallax.push(
              new Parallax(
                $("div", needImg).attr("data-depth", 0.2).end().get(0),
                {
                  frictionX: 0.08,
                  frictionY: 0.08,
                  limitX: false,
                  limitY: false,
                  relativeInput: true,
                  hoverOnly: true,
                  inputElement: needImg.parentElement,
                }
              )
            );
          });

        $(".spots")
          .children("div")
          .each(function (i) {
            var spot = this;

            scenesParallax.push(
              new Parallax(spot, {
                frictionX: 0.03,
                frictionY: 0.03,
                limitX: false,
                limitY: [1, 2].indexOf(i + 1) > -1 ? 1 : false,
                invertX: [1].indexOf(i + 1) > -1 ? true : false,
                invertY: [3].indexOf(i + 1) > -1 ? true : false,
              })
            );
          });
      } else {
        scenesParallax.forEach(function (scene) {
          scene.enable();
        });
      }
    }
  );

  mQ(
    "(max-width: 767px)",
    function () {
      if ($offerSlider.hasClass("slick-initialized")) {
        $offerSlider.slick("unslick");
      }

      $offerSlider.children("div").each(function () {
        $(".offer", this).appendTo($offerSlider).wrap("<div></div>");
        $(this).remove();
      });

      $offerSlider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 0,
        speed: 1000,
        fade: true,
        arrows: true,
        dots: false,
        prevArrow: ".offers-arrow-prev",
        nextArrow: ".offers-arrow-next",
        responsive: [
          {
            breakpoint: 576,
            settings: {
              speed: 500,
            },
          },
        ],
      });
    },
    function (onLoad) {
      if ($offerSlider.hasClass("slick-initialized") && !onLoad) {
        $offerSlider.slick("unslick");

        var $slides = $offerSlider.children("div");

        $slides.each(function (i) {
          if (!((i + 1) % 2)) {
            $(".offer", this).appendTo($slides.eq(i - 1));
            $(this).remove();
          }
        });

        $offerSlider.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 0,
          speed: 1000,
          fade: true,
          arrows: true,
          dots: false,
          prevArrow: ".offers-arrow-prev",
          nextArrow: ".offers-arrow-next",
        });
      }
    }
  );

  $(".advantage-item").waypoint(
    function (direction) {
      if (direction === "down") {
        $(this.element).addClass("animate");
      }
    },
    {
      offset: function () {
        return this.context.innerHeight() * 0.9;
      },
    }
  );

  $(".advantage-item").waypoint(
    function (direction) {
      if (direction === "up") {
        $(this.element).addClass("animate");
      }
    },
    {
      offset: function () {
        return -this.adapter.outerHeight() * 0.1;
      },
    }
  );

  $(".advantage-item, .contact-form-wrap").each(function (index, element) {
    var inview = new Waypoint.Inview({
      element: element,
      exited: function (direction) {
        if (direction === "down") {
          $(element).removeClass("animate");
        }
      },
    });
  });

  $(".contact-form-wrap").waypoint(
    function (direction) {
      if (direction === "down") {
        var $element = $(this.element);
        if (!$element.hasClass("animate")) {
          $element.addClass("animate");
        }
      }
    },
    {
      offset: function () {
        return this.context.innerHeight() - this.adapter.outerHeight() * 0.68;
      },
    }
  );

  /**
   * Tariff
   */

  var $contactSection = $("#contact-us"),
    $formTitle = $(".contact-form-title", $contactSection).hide(),
    $chosenTariff = $(".chosen-tariff", $formTitle),
    isFirstClick = true;

  $(".tariff").each(function () {
    var _ = $(this),
      tariff = $(".tariff-title", _).text(),
      $link = $(".tariff-link", _);

    $link.on("click", function () {
      $chosenTariff.hide().text(tariff).fadeIn(500);

      if (isFirstClick) {
        $formTitle.animate(
          {
            opacity: "toggle",
            height: "toggle",
          },
          500,
          function () {
            scrollToBottomOfContactUs(500);
            isFirstClick = false;
          }
        );
      } else {
        scrollToBottomOfContactUs(500);
      }
    });

    function scrollToBottomOfContactUs(duration) {
      $("html, body").animate(
        {
          scrollTop:
            $contactSection.offset().top -
            $(window).height() +
            $contactSection.height(),
        },
        duration
      );
    }
  });

  /**
   * Scrolling
   */

  $(".contactUs").on("click", function () {
    var $target = $(this.hash);

    if ($target.length) {
      $("html, body").animate(
        {
          scrollTop: $target.offset().top,
        },
        1000
      );

      return false;
    }
  });

  $(".header-arrow").on("click", function () {
    var $nextSection = $(this).closest("header").next();

    $("html, body").animate(
      {
        scrollTop: $nextSection.offset().top - 10,
      },
      1000
    );
  });

  /**
   * Media Queries
   */

  function mQ(mqStr, match, mismatch) {
    var mq = matchMedia(mqStr);

    mq.addListener(widthChange);
    widthChange(mq, true);

    function widthChange(mq, onLoad) {
      if (mq.matches) {
        match(onLoad);
      } else {
        mismatch(onLoad);
      }
    }
  }
});