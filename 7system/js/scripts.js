function random(min, max) {
  return Math.random() * (max - min) + min;
}

// IFrame Player API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * Loader
 */

(function loader(window, loader) {
  var elapsed = false;
  var loaded = false;

  setTimeout(function () {
    elapsed = true;
    loaded && hideLoader();
  }, 3200);

  var sevensystem = document.querySelector(".loader-logo-sevensystem").children;
  for (var i = 0; i < sevensystem.length; i++) {
    initTweenMax(sevensystem[i], 1);
  }

  var s7 = document.querySelector(".loader-logo-7s").children;
  for (var i = 0; i < s7.length; i++) {
    initTweenMax(s7[i], 1, { y: -200, z: 1000 });
  }

  function initTweenMax(target, duration, fromVars, toVars) {
    TweenMax.fromTo(
      target,
      duration,
      Object.assign(
        {
          opacity: 0,
          x: 0,
          y: random(-200, 200),
          z: random(500, 1000),
          rotation: 0.01,
        },
        fromVars
      ),
      Object.assign(
        {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotation: 0.01,
          delay: random(0.2, 0.4),
          yoyo: true,
          repeat: 1,
          repeatDelay: duration,
          ease: Power1.easeOut,
        },
        toVars
      )
    );
  }

  function hideLoader() {
    document.body.classList.remove("loading");
    setTimeout(function () {
      loader.style.opacity = 0;
      loader.style.zIndex = -1000;
    }, 1200);
  }

  window.onload = function () {
    loaded = true;
    elapsed && hideLoader();
  };
})(window, document.querySelector(".loader"));

// DOM ready
$(function () {
  var animationend = "webkitAnimationEnd animationend";

  /**
   * YouTube
   */

  (function youtube() {
    var $videos = $(".video");
    var isMobile =
      !!navigator.platform.match(/ip(hone|od|ad)/i) ||
      !!navigator.userAgent.match(/android/i);

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

  $(".prj-item").waypoint(
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

  $(".prj-item").waypoint(
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

  $(".prj-item").each(function (index, element) {
    var inview = new Waypoint.Inview({
      element: element,
      exited: function (direction) {
        if (direction === "down") {
          $(element).removeClass("animate");
        }
      },
    });
  });

  /**
   * Select arrow
   */

  var $select = $(".select-arrow").closest(".select");

  if ($select.length !== 0) {
    $select.on("click", function () {
      $(this).toggleClass("open");
    });
    $("select", $select).on("blur", function () {
      $(this).parent().removeClass("open");
    });
  }

  /**
   * Scrolling
   */

  $('a[href*="#"]:not([href="#"])').click(function () {
    var $target = $(this.hash);

    if ($target.length) {
      $("html, body").animate(
        {
          scrollTop:
            $target.offset().top + $target.height() - $(window).height() + 45,
        },
        1000
      );
      return false;
    }
  });

  $('[class^="tb-img-icon"]').click(function () {
    var $target = $($(this).data("id"));

    if ($target.length) {
      $("html, body").animate(
        {
          scrollTop:
            $target.offset().top -
            ($(window).height() / 2 - $target.outerHeight() / 2),
        },
        1000
      );
      return false;
    }
  });
});

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
