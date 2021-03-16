(!navigator.platform.match(/ip(hone|od|ad)/i) ||
  !navigator.userAgent.match(/android/i)) &&
  document.documentElement.style.setProperty("--sw", "17px");

/**
 * Loading the IFrame Player API code
 */

var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

switch (document.body.getAttribute("data-page")) {
  case "index":
    // homePageScripts(); break;
    document.addEventListener("DOMContentLoaded", homePageScripts);
    break;
  default:
    // signInScripts();
    document.addEventListener("DOMContentLoaded", signInScripts);
}

function homePageScripts() {
  /**
   * Loader
   */

  window.addEventListener(
    "load",
    function () {
      var loader = document.querySelector(".loader");
      var progress = loader.querySelector(".loader-progress");

      progress.style.maxWidth = "100%";

      setTimeout(function () {
        document.body.classList.remove("loading");
        setTimeout(function () {
          loader.style.opacity = 0;
          loader.style.zIndex = -1000;
        }, 1100);
      }, 1000);
    },
    false
  );

  function resize() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  }

  window.addEventListener("resize", resize, false);
  resize();

  // jQuery
  $(function () {
    var animationend = "webkitAnimationEnd animationend";
    objectFitImages();

    /**
     * YouTube
     */

    (function youtube() {
      var $videos = $(".video");
      var isMobile = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

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

    var $aboutSlider = $(".about-slider");

    $aboutSlider.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      rows: 0,
      speed: 0,
      fade: true,
      arrows: true,
      dots: true,
      prevArrow: ".about-arrow-prev",
      nextArrow: ".about-arrow-next",
    });

    // Tariffs

    var $tariff = $(".tariff");

    $tariff.each(function () {
      var $tariff = $(this),
        $btn = $tariff.find(".btn"),
        $btnText = $btn.children("span");

      $btn.on("click", function (e) {
        if (!$tariff.hasClass("active")) {
          $btnText.hide().text($btn.data("text")).fadeIn();
          $tariff.addClass("active");

          return false;
        }

        var $target = $(this.hash);
        var offset = $(e.target).data("offset") || 0;

        if ($target.length) {
          var targetTop = $target.offset().top;

          $("html, body").animate(
            {
              scrollTop: targetTop + offset,
            },
            1000
          );

          return false;
        }
      });
    });

    $(document).on("mouseup touchend", function (e) {
      var target = e.target;

      if (
        !$tariff.is(target) &&
        $tariff.has(target).length === 0 &&
        $tariff.hasClass("active")
      ) {
        $tariff.each(function () {
          var $curTariff = $(this);
          if ($curTariff.hasClass("active")) {
            $curTariff
              .removeClass("active")
              .find(".btn")
              .children("span")
              .hide()
              .text("подробнее")
              .fadeIn();
          }
        });
      }
    });

    $(".fade-in").waypoint(
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

    var scenesParallax = [];

    function runTopScenes() {
      $(".circle").each(function (i) {
        var circle = this;
        scenesParallax.push(
          new Parallax(
            $(".circle-border", circle).attr("data-depth", 0.9).end().get(0),
            {
              frictionX: 0.05,
              frictionY: 0.05,
              limitX: false,
              limitY: false,
            }
          )
        );
      });
      $(".cross").each(function (i) {
        var cross = this;
        scenesParallax.push(
          new Parallax(
            $(".cross-border", cross).attr("data-depth", 0.3).end().get(0),
            {
              frictionX: 0.05,
              frictionY: 0.05,
              limitX: false,
              limitY: false,
            }
          )
        );
      });
    }

    mediaQuery(
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
          $(".circle-border").on(animationend, runTopScenes);

          $(".video-blobs")
            .children()
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  invertX: Math.random() >= 0.5,
                  invertY: Math.random() >= 0.5,
                })
              );
            });

          scenesParallax.push(
            new Parallax(document.querySelector(".about-blob"), {
              frictionX: 0.05,
              frictionY: 0.05,
              invertX: Math.random() >= 0.5,
              invertY: Math.random() >= 0.5,
            })
          );

          $(".decor-strips")
            .children()
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  invertX: Math.random() >= 0.5,
                  invertY: Math.random() >= 0.5,
                })
              );
            });
          $(".features-blobs")
            .children()
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  invertX: Math.random() >= 0.5,
                  invertY: Math.random() >= 0.5,
                })
              );
            });
          $(".partners-decor")
            .children()
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  invertX: Math.random() >= 0.5,
                  invertY: Math.random() >= 0.5,
                })
              );
            });
          $(".use-blob").each(function (i) {
            scenesParallax.push(
              new Parallax(this, {
                frictionX: 0.05,
                frictionY: 0.05,
                invertX: Math.random() >= 0.5,
                invertY: Math.random() >= 0.5,
              })
            );
          });
          $(".bb-blob-1, .bb-blob-2, .square").each(function (i) {
            scenesParallax.push(
              new Parallax(this, {
                frictionX: 0.05,
                frictionY: 0.05,
                invertX: Math.random() >= 0.5,
                invertY: Math.random() >= 0.5,
              })
            );
          });
          $(".prices-decor")
            .children()
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  limitX: [2].indexOf(i + 1) > -1 ? 1 : false,
                  limitY: [1, 3].indexOf(i + 1) > -1 ? 1 : false,
                  invertX: Math.random() >= 0.5,
                  invertY: Math.random() >= 0.5,
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

    mediaQuery(
      "(max-width: 767px)",
      function () {
        $(".about-arrow-prev").prependTo(".slick-dots");
        $(".about-arrow-next").appendTo(".slick-dots");
      },
      function (load) {
        if (!load) {
          $(".about-arrow-next, .about-arrow-prev").insertAfter(
            ".about-slider"
          );
        }
      }
    );

    /**
     * Nav Menu
     */

    var overlayNav = $(".nav-overlay"),
      overlayContent = $(".nav-overlay-content"),
      navigation = $(".nav"),
      toggleNav = $(".nav-trigger");

    layerInit();

    $(window).on("resize", function () {
      window.requestAnimationFrame(layerInit);
    });

    toggleNav.on("click", function () {
      if (!toggleNav.hasClass("close-nav")) {
        toggleNav.addClass("close-nav");
        document.body.style.overflow = "hidden";
        overlayNav.children("span").velocity(
          {
            translateZ: 0,
            scaleX: 1,
            scaleY: 1,
          },
          500,
          "easeInCubic",
          function () {
            navigation.addClass("fade-in");
          }
        );
      } else {
        toggleNav.removeClass("close-nav");
        document.body.style.overflow = "";
        overlayContent.children("span").velocity(
          {
            translateZ: 0,
            scaleX: 1,
            scaleY: 1,
          },
          500,
          "easeInCubic",
          function () {
            navigation.removeClass("fade-in");
            overlayNav.children("span").velocity(
              {
                translateZ: 0,
                scaleX: 0,
                scaleY: 0,
              },
              0
            );
            overlayContent
              .addClass("is-hidden")
              .one(
                "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                function () {
                  overlayContent.children("span").velocity(
                    {
                      translateZ: 0,
                      scaleX: 0,
                      scaleY: 0,
                    },
                    0,
                    function () {
                      overlayContent.removeClass("is-hidden");
                    }
                  );
                }
              );
            if ($("html").hasClass("no-csstransitions")) {
              overlayContent.children("span").velocity(
                {
                  translateZ: 0,
                  scaleX: 0,
                  scaleY: 0,
                },
                0,
                function () {
                  overlayContent.removeClass("is-hidden");
                }
              );
            }
          }
        );
      }
    });

    function layerInit() {
      var diameterValue =
        Math.sqrt(
          Math.pow($(window).height(), 2) + Math.pow($(window).width(), 2)
        ) * 2;
      overlayNav
        .children("span")
        .velocity(
          {
            scaleX: 0,
            scaleY: 0,
            translateZ: 0,
          },
          50
        )
        .velocity(
          {
            height: diameterValue + "px",
            width: diameterValue + "px",
            top: -(diameterValue / 2) + "px",
            left: -(diameterValue / 2) + "px",
          },
          0
        );
      overlayContent
        .children("span")
        .velocity(
          {
            scaleX: 0,
            scaleY: 0,
            translateZ: 0,
          },
          50
        )
        .velocity(
          {
            height: diameterValue + "px",
            width: diameterValue + "px",
            top: -(diameterValue / 2) + "px",
            left: -(diameterValue / 2) + "px",
          },
          0
        );
    }

    mediaQuery(
      "(max-width: 575px)",
      function () {
        $(".menu a, .footer-menu a").each(function () {
          switch (this.hash) {
            case "#features":
              $(this).data("offset", -10);
              break;
            case "#video":
              $(this).data("offset", -10);
              break;
            case "#tariffs":
              $(this).data("offset", 40);
              break;
            case "#contact":
              $(this).data("offset", -45);
          }
        });
      },
      function () {
        mediaQuery(
          "(min-width: 1260px)",
          function () {
            $(".menu a, .footer-menu a").each(function () {
              switch (this.hash) {
                case "#features":
                  $(this).data("offset", -120);
                  break;
                case "#video":
                  $(this).data("offset", -30);
                  break;
                case "#tariffs":
                  $(this).data("offset", 80);
                  break;
                case "#contact":
                  $(this).data("offset", 0);
              }
            });
          },
          function () {
            $(".menu a, .footer-menu a").each(function () {
              switch (this.hash) {
                case "#features":
                  $(this).data("offset", -30);
                  break;
                case "#video":
                  $(this).data("offset", -20);
                  break;
                case "#tariffs":
                  $(this).data("offset", 95);
                  break;
                case "#contact":
                  $(this).data("offset", 0);
              }
            });
          }
        );
      }
    );

    /**
     * Scrolling
     */

    $(".menu a, .footer-menu a, .btn__about, .btn__tb, .tb-arrow").on(
      "click",
      function (e) {
        e.preventDefault();

        var $target = $(this.hash);
        var offset = $(e.target).data("offset") || 0;
        var speed = 1000;

        if (
          toggleNav.hasClass("close-nav") &&
          window.matchMedia("(max-width: 1259px)").matches
        ) {
          speed = 0;
          toggleNav.trigger("click");
        }

        if ($target.length) {
          var targetTop = $target.offset().top;

          $("html, body").animate(
            {
              scrollTop: targetTop + offset,
            },
            speed
          );

          return false;
        }
      }
    );
  });
}

function signInScripts() {
  $(function () {
    var $select = $(".select-arrow").closest(".select");

    if ($select.length !== 0) {
      $select.on("click", function () {
        $(this).toggleClass("open");
      });

      $("select", $select).on("blur", function () {
        $(this).parent().removeClass("open");
      });
    }

    var scenesParallax = [];

    mediaQuery(
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
          $(".form-decor")
            .children('[class^="form-blob"]')
            .each(function (i) {
              scenesParallax.push(
                new Parallax(this, {
                  frictionX: 0.05,
                  frictionY: 0.05,
                  invertX: [1, 3].indexOf(i + 1) > -1 ? true : false,
                  invertY: [1, 3].indexOf(i + 1) > -1 ? true : false,
                })
              );
            });
          $(".square").each(function (i) {
            scenesParallax.push(
              new Parallax(this, {
                frictionX: 0.05,
                frictionY: 0.05,
              })
            );
          });
          $(".form-decor-2").each(function (i) {
            scenesParallax.push(
              new Parallax(this, {
                frictionX: 0.05,
                frictionY: 0.05,
                invertX: true,
                invertY: false,
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
  });
}

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
