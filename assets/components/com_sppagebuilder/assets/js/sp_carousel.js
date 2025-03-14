"use strict";
/**
 * @package SP Page Builder
 * @author JoomShaper http://www.joomshaper.com
 * @copyright Copyright (c) 2010 - 2023 JoomShaper
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or later
 */ !(function (t, i, e, s) {
  function n(e, s) {
    (this.element = e),
      (this.elementWidth = 0),
      (this._name = "spCarousel"),
      (this.item = null),
      (this.delta = 1),
      (this.isAnimating = !1),
      (this.isDragging = !1),
      (this.timer = 0),
      (this._timeoutId1 = 0),
      (this._timeoutId2 = 0),
      (this.resizeTimer = 0),
      (this._dotControllerTimeId = 0),
      (this._lastViewPort = 0),
      (this.viewPort = null),
      (this.responsiveRefreshRate = 200),
      (this.itemWidth = 0),
      (this._clones = 0),
      (this._items = 0),
      (this.windowWidth = t(i).width()),
      (this._itemCoordinate = []),
      (this.coordinate = { x: 0, y: 0 }),
      (this.prevCoordinate = { x: 0, y: 0, diff: 0, dragPointer: -1 }),
      (this._defaults = t.fn.spCarousel.defaults),
      (this.options = t.extend({}, this._defaults, s)),
      2 !== this.options.nav_text.length &&
        (console.warn("nav text must be need two control element!"),
        (this.options.nav_text = ["<", ">"])),
      this.options.speed > this.options.interval &&
        (this.options.speed = this.options.interval),
      this.init();
  }
  t.extend(n.prototype, {
    init: function () {
      this.buildCache(),
        this.createHtmlDom(),
        this.applyBasicStyle(),
        this.bindEvents(),
        this.triggerOnStart(),
        this.options.autoplay && !this.isResizing && this.startLoop();
    },
    animationType: function (t) {
      return (
        void 0 !== this.options.animationType &&
        this.options.animationType === t
      );
    },
    triggerOnStart: function () {
      if (this.options.dot_indicator && this.options.dots) {
        var t = this.$dotContainer.find("li.active");
        this.animateDotIndicator(t, "start");
      }
    },
    destroy: function () {
      this.unbindEvents(),
        this.$outerStage.children(".clone").remove(),
        this.$outerStage.unwrap(),
        this.$outerStage.children().unwrap(),
        this.$sliderList.unwrap(),
        this.options.dots &&
          this.$dotContainer.parent(".sppb-carousel-extended-dots").remove(),
        this.options.nav &&
          this.$nextBtn.parent(".sppb-carousel-extended-nav-control").remove(),
        this.$element.removeData(this._name);
    },
    buildCache: function () {
      this.$element = t(this.element);
    },
    unbindEvents: function () {
      this.$element.off("." + this._name);
    },
    createHtmlDom: function () {
      this.createOuterStage(),
        void 0 !== this.options.responsive && this.parseResponsiveViewPort(),
        this.itemProfessor(),
        this.options.nav && this.createNavigationController(),
        this.options.dots && this.createDotsController(),
        this.cloneItems();
    },
    itemProfessor: function () {
      this._numberOfItems = this.$element.find(
        ".sppb-carousel-extended-item"
      ).length;
      var t = this.options.centerPadding;
      null !== this.viewPort &&
        ((this.options.items =
          void 0 === this.viewPort.items
            ? this.options.items
            : this.viewPort.items),
        (t =
          void 0 === this.viewPort.centerPadding
            ? this.options.centerPadding
            : this.viewPort.centerPadding)),
        (this.elementWidth =
          (this.$element.outerWidth() || 1048) + this.options.margin),
        (this.itemWidth = this.options.center
          ? Math.abs((this.elementWidth - 2 * t) / this.options.items)
          : Math.abs(this.elementWidth / this.options.items)),
        (this._clones =
          this._numberOfItems > this.options.items
            ? Math.ceil(this._numberOfItems / 2)
            : this.options.items),
        (this._maxL =
          this.itemWidth * (this._numberOfItems + (this._clones - 1))),
        (this._minL =
          !1 === this.options.center
            ? this.itemWidth * this._clones
            : this.itemWidth * this._clones - t);
    },
    cloneItems: function () {
      for (
        var t = [],
          i = [],
          e = this.animationType("fadeIn") ? { opacity: 1 } : {},
          s = 0;
        s < this._clones;
        s++
      )
        s < this.options.items &&
          this.$element
            .find(".sppb-carousel-extended-item:nth-child(" + (s + 1) + ")")
            .addClass("active")
            .css(e),
          t.push(
            this.$element
              .find(
                ".sppb-carousel-extended-item:nth-child(" +
                  (this._numberOfItems - s) +
                  ")"
              )
              .clone(!0)
              .addClass("clone")
              .removeClass("active")
          ),
          i.push(
            this.$element
              .find(".sppb-carousel-extended-item:nth-child(" + (s + 1) + ")")
              .clone(!0)
              .addClass("clone")
              .removeClass("active")
          );
      this.options.center && this.applyCenterMode(0, this.options.items - 1),
        this.appendBefore(t),
        this.appendAfter(i),
        this.calculateItemCoordinate();
    },
    appendBefore: function (t) {
      var i = this;
      t.map(function (t) {
        i.$outerStage.prepend(t);
      });
    },
    appendAfter: function (t) {
      var i = this;
      t.map(function (t) {
        i.$outerStage.append(t);
      });
    },
    calculateItemCoordinate: function () {
      var t = this;
      this.$outerStage.children().each(function (i, e) {
        t._itemCoordinate.push((i + 1) * t.itemWidth);
      });
    },
    createOuterStage: function () {
      (this.sliderList = e.createElement("div")),
        this.sliderList.setAttribute("class", "sppb-carousel-extended-list"),
        (this.outerStage = e.createElement("div")),
        this.outerStage.setAttribute(
          "class",
          "sppb-carousel-extended-outer-stage"
        ),
        (this.outerStage.innerHTML = this.$element.html()),
        !0 === this.options.center &&
          this.$element.addClass("sppb-carousel-extended-center"),
        this.animationType("fadeIn") &&
          this.$element.addClass("sppb-carousel-fadeIn"),
        this.animationType("fadeOut") &&
          this.$element.addClass("sppb-carousel-fadeOut"),
        this.sliderList.append(this.outerStage),
        this.$element.html(this.sliderList),
        (this.$outerStage = t(this.outerStage)),
        (this.$sliderList = t(this.sliderList));
    },
    createNavigationController: function () {
      var i = e.createElement("div");
      i.setAttribute("class", "sppb-carousel-extended-nav-control"),
        this.$element.append(i),
        (this.nextBtn = e.createElement("span")),
        this.nextBtn.setAttribute("class", "next-control nav-control"),
        (this.prevBtn = e.createElement("span")),
        this.prevBtn.setAttribute("class", "prev-control nav-control"),
        i.append(this.nextBtn),
        i.append(this.prevBtn),
        (this.nextBtn.innerHTML = this.options.nav_text[1]),
        (this.prevBtn.innerHTML = this.options.nav_text[0]),
        (this.$nextBtn = t(this.nextBtn)),
        (this.$prevBtn = t(this.prevBtn));
    },
    createDotsController: function () {
      var i = e.createElement("div");
      i.setAttribute("class", "sppb-carousel-extended-dots"),
        this.$element.append(i);
      var s = e.createElement("ul"),
        n = null;
      void 0 !== this.options.responsive &&
        (n = this.parseResponsiveViewPort());
      var a = null === n || void 0 === n.items ? this.options.items : n.items,
        o = Math.ceil(this._numberOfItems / a);
      if (o > 1)
        for (var r = 0; r < o; r++) {
          var h = e.createElement("li");
          if (
            (h.setAttribute("class", "sppb-carousel-extended-dot-" + r),
            t(h).css({
              "-webkit-transition": "all 0.5s ease 0s",
              transition: "all 0.5s ease 0s",
            }),
            0 === r && t(h).addClass("active"),
            this.options.dot_indicator)
          ) {
            var d = e.createElement("span");
            d.setAttribute("class", "sppb-carousel-extended-dot-indicator"),
              h.append(d);
          }
          s.append(h);
        }
      i.append(s), this.$element.append(i), (this.$dotContainer = t(s));
    },
    applyBasicStyle: function () {
      var i = 0,
        e = {};
      if (
        ((e.width = this.itemWidth - this.options.margin + "px"),
        this.options.margin > 0 && (e.marginRight = this.options.margin + "px"),
        this.animationType("fadeIn") &&
          (e.transition = "opacity " + this.options.speed + "ms"),
        this.$element.find(".sppb-carousel-extended-item").each(function () {
          i++, t(this).css(e);
        }),
        (this._currentPosition = this._clones * this.itemWidth),
        !0 === this.options.center)
      ) {
        var s =
          void 0 === this.viewPort.centerPadding
            ? this.options.centerPadding
            : this.viewPort.centerPadding;
        this._currentPosition = this._clones * this.itemWidth - s;
      }
      this.$outerStage.css({
        "-webkit-transition-duration": "0s",
        "-webkit-transform":
          "translate3D(-" + this._currentPosition + "px,0px,0px)",
        width: i * this.itemWidth + "px",
      }),
        (this._items = i),
        this.updateResponsiveView();
    },
    startLoop: function () {
      var t = this;
      this.timer = setInterval(function () {
        this.isResizing ||
          (clearInterval(this.timer), !1 === t.isAnimating && t.Next());
      }, this.options.interval);
    },
    stopLoop: function () {
      clearInterval(this.timer), (this.timer = 0);
    },
    Next: function () {
      -1 === this.delta && (this.delta = 1), this.updateItemStyle();
    },
    Prev: function () {
      1 === this.delta && (this.delta = -1), this.updateItemStyle();
    },
    slideFromPosition: function (t, i) {
      var e = this.itemWidth * (this.options.items * t),
        s = 0 === t ? this._minL : this._minL + e,
        n = this.animationType("fadeIn")
          ? "0s"
          : "all " + this.options.speed + "ms ease 0s";
      this.$outerStage.css({
        "-webkit-transition": n,
        transition: n,
        "-webkit-transform": "translate3D(-" + s + "px,0px,0px)",
        transform: "translate3D(-" + s + "px,0px,0px)",
      }),
        (this._currentPosition = s),
        (this.delta = i),
        this.processActivationWorker();
    },
    updateDotsFromPosition: function (t) {
      var i = this,
        e = this.$dotContainer.find("li.active").removeClass("active"),
        s = this.$dotContainer
          .find("li:nth-child(" + t + ")")
          .addClass("active");
      this.options.dot_indicator &&
        (this.animateDotIndicator(e, "stop"),
        this._dotControllerTimeId > 0 &&
          (clearTimeout(this._dotControllerTimeId),
          (this._dotControllerTimeId = 0)),
        (this._dotControllerTimeId = setTimeout(function () {
          i.animateDotIndicator(s, "start");
        }, this.options.speed))),
        s.css({
          "-webkit-transition": "all 0.5s ease 0s",
          transition: "all 0.5s ease 0s",
        });
    },
    animateDotIndicator: function (t, i) {
      if (
        ("stop" === i &&
          t
            .find(".sppb-carousel-extended-dot-indicator")
            .removeClass("active")
            .css({
              "-webkit-transition-duration": "0s",
              "transition-duration": "0s",
            }),
        "start" === i)
      ) {
        var e = Math.abs(this.options.interval - this.options.speed);
        t.find(".sppb-carousel-extended-dot-indicator")
          .addClass("active")
          .css({
            "-webkit-transition-duration": e + "ms",
            "transition-duration": e + "ms",
          });
      }
    },
    updateItemStyle: function () {
      var t = this;
      this._timeoutId1 > 0 &&
        (clearTimeout(this._timeoutId1), (this._timeoutId1 = 0));
      var i =
          -1 === this.prevCoordinate.dragPointer
            ? 0
            : this.prevCoordinate.dragPointer,
        e = this._currentPosition,
        s = this.itemWidth;
      this.options.items > 1 && (s += parseInt(i));
      var n = 1 === this.delta ? e + s : e - s;
      if (
        (n > this._maxL &&
          (this.$outerStage.css({
            "-webkit-transition": "0s",
            transition: "0s",
            "-webkit-transform":
              "translate3D(-" + (this._minL - this.itemWidth) + "px,0px,0px)",
            transform:
              "translate3D(-" + (this._minL - this.itemWidth) + "px,0px,0px)",
          }),
          (n = this._minL)),
        e < this._minL &&
          (this.$outerStage.css({
            transition: "0s",
            "-webkit-transform": "translate3D(-" + this._maxL + "px,0px,0px)",
            transform: "translate3D(-" + this._maxL + "px,0px,0px)",
          }),
          (n = this._maxL - this.itemWidth)),
        this.isDragging && this.options.items > 1)
      )
        for (
          var a = this._itemCoordinate,
            o =
              void 0 === this.viewPort.centerPadding
                ? this.options.centerPadding
                : this.viewPort.centerPadding,
            r = !1,
            h = 0;
          h < a.length &&
          (a[h] > n &&
            ((n = !0 === this.options.center ? a[h] - o : a[h]), (r = !0)),
          !0 !== r);
          h++
        );
      var d = function () {
        var i = t.animationType("fadeIn")
          ? "0s"
          : "all " + t.options.speed + "ms ease 0s";
        t.$outerStage.css({
          "-webkit-transition": i,
          transition: i,
          "-webkit-transform": "translate3D(-" + n + "px,0px,0px)",
          transform: "translate3D(-" + n + "px,0px,0px)",
        }),
          t.$outerStage.bind("transitionend", function () {
            t.checkTransitionEndCallback.call(t);
          });
      };
      this.animationType("fadeIn")
        ? d()
        : (this._timeoutId1 = setTimeout(d, 100)),
        (this._currentPosition = n),
        this.processActivationWorker(),
        this.options.autoplay && 0 === this.timer && this.startLoop();
    },
    getNextActiveItems: function () {
      return this.$outerStage.find(".active");
    },
    getStartAndEndIndex: function () {
      var t = this._currentPosition,
        i = Math.floor(t / this.itemWidth);
      return {
        startIndex: (i = this.options.center ? i + 1 : i),
        endIndex: Math.floor(Math.abs(this.options.items + i)),
      };
    },
    resetFadeState: function () {
      this.$outerStage
        .children(":not(.active)")
        .css({ left: 0, transition: "", opacity: 0, zIndex: "" });
    },
    processActivationWorker: function () {
      this.animationType("fadeIn") && this.resetFadeState();
      var t = this.getStartAndEndIndex(),
        i = t.startIndex,
        e = t.endIndex,
        s = this.getNextActiveItems();
      s.removeClass("active");
      for (var n = i; n < e; n++) {
        var a = this.$outerStage.children(":eq(" + n + ")");
        if ((a.addClass("active"), this.animationType("fadeIn"))) {
          var o = s.index(),
            r = Math.abs(o - n);
          r =
            o + 1 === Math.abs(this._clones - this._items) && 1 === this.delta
              ? -1 * r
              : r;
          var h = {
            left: this.delta * (this.itemWidth * r) + "px",
            transition: "",
            zIndex: 1,
            opacity: 1,
          };
          s.css(h),
            a.css({
              transition: "opacity " + this.options.speed + "ms ease",
              zIndex: 2,
              opacity: 1,
            }),
            a.bind("transitionend", this.resetFadeState.bind(this));
        }
      }
      this.options.center && this.applyCenterMode(i, e);
      var d = Math.floor((i - this._clones) / this.options.items) + 1;
      this.options.dots &&
        (this.$dotContainer.find(".active").removeClass("active"),
        this.$dotContainer.find("li:nth-child(" + d + ")").addClass("active"));
    },
    applyCenterMode: function (t, i) {
      var e = Math.floor((t + i) / 2);
      this.$outerStage
        .find(".sppb-carousel-extended-item-center")
        .removeClass("sppb-carousel-extended-item-center"),
        this.$outerStage
          .children(":eq(" + e + ")")
          .addClass("sppb-carousel-extended-item-center");
    },
    dragoverActionToNextItem: function (t) {
      var i = this,
        e = this._currentPosition + parseInt(t);
      e > this._maxL && (e = this._minL - this.itemWidth + parseInt(t)),
        this._timeoutId2 > 0 &&
          (clearTimeout(this._timeoutId2), (this._timeoutId2 = 0)),
        (this._timeoutId2 = setTimeout(function () {
          i.$outerStage.css({
            "-webkit-transition": "0s",
            transition: "0s",
            "-webkit-transform": "translate3D(-" + e + "px,0px,0px)",
            transform: "translate3D(-" + e + "px,0px,0px)",
          });
        }, 0));
    },
    dragoverActionToPrevItem: function (t) {
      var i = this,
        e = this._currentPosition - parseInt(t);
      e < this._minL - this.itemWidth && (e = this._maxL - parseInt(t)),
        this._timeoutId2 > 0 &&
          (clearTimeout(this._timeoutId2), (this._timeoutId2 = 0)),
        (this._timeoutId2 = setTimeout(function () {
          i.$outerStage.css({
            "-webkit-transition": "0s",
            transition: "0s",
            "-webkit-transform": "translate3D(-" + e + "px,0px,0px)",
            transform: "translate3D(-" + e + "px,0px,0px)",
          });
        }, 0));
    },
    resetCoordiante: function () {
      (this.prevCoordinate = { x: 0, y: 0, diff: 0, dragPointer: -1 }),
        (this.coordinate = { x: 0, y: 0 }),
        this.options.autoplay && 0 === this.timer && this.startLoop();
    },
    backToStage: function () {},
    bindEvents: function () {
      var e = this;
      e.options.nav &&
        (e.$nextBtn.on("click." + e._name, function (t) {
          !1 === e.isAnimating &&
            (e.options.autoplay && e.stopLoop(),
            e.Next(),
            e.checkCallBackMethod.call(e));
        }),
        e.$prevBtn.on("click." + e._name, function (t) {
          !1 === e.isAnimating &&
            (e.Prev(),
            e.options.autoplay && e.stopLoop(),
            e.checkCallBackMethod.call(e));
        })),
        e.options.dots &&
          e.$dotContainer.find("li").each(function (i) {
            t(this).on("click." + e._name, function (s) {
              if (t(this).hasClass("active") || !0 === e.isAnimating) return !1;
              e.options.autoplay && e.stopLoop();
              var n = t(this).parent().find("li.active"),
                a = e.$dotContainer.find("li").index(n) > i ? -1 : 1;
              e.slideFromPosition(i, a),
                e.updateDotsFromPosition(i + 1),
                e.checkCallBackMethod.call(e);
            });
          }),
        e.$outerStage.on("mousedown." + e._name, t.proxy(e.onDragStart, e)),
        e.$outerStage.on(
          "mouseup." + e._name + " touchend." + e._name,
          t.proxy(e.onDragEnd, e)
        ),
        e.$outerStage.on("touchstart." + e._name, t.proxy(e.onDragStart, e)),
        e.$outerStage.on("touchcancel." + e._name, t.proxy(e.onDragEnd, e)),
        t(i).focus(function () {
          e.options.autoplay && 0 === e.timer && e.startLoop();
        }),
        t(i).blur(function () {
          e.options.autoplay && e.stopLoop();
        }),
        t(i).on("resize." + e._name, t.proxy(e.windowResize, e));
    },
    windowResize: function (t) {
      void 0 !== t &&
        ((this.isResizing = !0),
        this.options.responsive &&
          (clearTimeout(this.resizeTimer),
          (this.resizeTimer = setTimeout(
            this.onResize.bind(this),
            this.responsiveRefreshRate
          ))));
    },
    onResize: function () {
      this.destroy(), this.init(), (this.isResizing = !1);
    },
    parseResponsiveViewPort: function () {
      var t = this.options.responsive;
      if (void 0 !== t) {
        for (var e = null, s = i.innerWidth, n = 0; n < t.length; n++)
          if (s > t[n].viewport) {
            e = t[n];
            break;
          }
        return null === e && (e = t[t.length - 1]), (this.viewPort = e), e;
      }
    },
    updateResponsiveView: function () {
      if (void 0 !== this.options.responsive) {
        var t = i.innerHeight,
          e = this.parseResponsiveViewPort();
        if ("full" === e.height) {
          if (
            (this.$outerStage.css({ height: t + "px" }),
            this._lastViewPort === t)
          )
            return;
          this._lastViewPort = t;
        } else {
          if (
            (this.$outerStage.css({ height: e.height }),
            this._lastViewPort === e.height)
          )
            return;
          this._lastViewPort = e.height;
        }
      }
    },
    getPosition: function (t) {
      var e = { x: null, y: null };
      return (
        (t =
          (t = t.originalEvent || t || i.event).touches && t.touches.length
            ? t.touches[0]
            : t.changedTouches && t.changedTouches.length
            ? t.changedTouches[0]
            : t).pageX
          ? ((e.x = t.pageX), (e.y = t.pageY))
          : ((e.x = t.clientX), (e.y = t.clientY)),
        e
      );
    },
    onDragStart: function (i) {
      if (3 === i.which || 2 === i.which || this.animationType("fadeIn"))
        return !1;
      var s = this,
        n = s.getPosition(i);
      (s.coordinate.x = n.x),
        (s.coordinate.y = n.y),
        t(e).one(
          "mousemove." + s._name + " touchmove." + s._name,
          t.proxy(function (i) {
            t(e).on(
              "mousemove." + s._name + " touchmove." + s._name,
              t.proxy(s.onDragMove, s)
            ),
              i.preventDefault();
          }, this)
        ),
        (s.isDragging = !0);
    },
    onDragMove: function (t) {
      if (!1 !== this.isDragging) {
        this.options.autoplay && this.stopLoop();
        var i = this.getPosition(t),
          e = this.coordinate;
        if (this.prevCoordinate.x !== i.x) {
          var s = e.x - i.x,
            n = (1 * Math.abs(s)).toFixed(0);
          (this.prevCoordinate = { x: i.x, y: i.y, diff: s, dragPointer: n }),
            s > 0 && this.dragoverActionToNextItem(n),
            s < 0 && this.dragoverActionToPrevItem(n);
        }
        t.preventDefault();
      }
    },
    onDragEnd: function (t) {
      if (this.isDragging) {
        var i = this.prevCoordinate.diff;
        Math.abs(i) > 100
          ? (i > 0 && this.Next(), i < 0 && this.Prev())
          : this.backToStage(),
          (this.isDragging = !1);
      }
      this.resetCoordiante();
    },
    checkCallBackMethod: function () {
      this.callback();
    },
    checkTransitionEndCallback: function () {
      var t = this.options.transitionEnd;
      if ("function" == typeof t) {
        var i = this.$element.find(".sppb-carousel-extended-item").length,
          e = { item: this.item, items: i, element: this.$element };
        t.call(this.element, e);
      }
    },
    callback: function () {
      var t = this.options.onChange;
      if ("function" == typeof t) {
        var i = this.$element.find(".sppb-carousel-extended-item").length,
          e = { item: this.item, items: i, element: this.$element };
        t.call(this.element, e);
      }
    },
  }),
    (t.fn.spCarousel = function (i) {
      return (
        this.each(function () {
          t.data(this, "spCarousel") ||
            t.data(this, "spCarousel", new n(this, i));
        }),
        this
      );
    }),
    (t.fn.spCarousel.defaults = {
      animationType: "slide",
      items: 4,
      autoplay: !1,
      center: !1,
      centerPadding: 50,
      margin: 10,
      speed: 800,
      interval: 4500,
      onChange: null,
      dots: !0,
      dot_indicator: !1,
      nav: !0,
      nav_text: ["<", ">"],
    });
})(jQuery, window, document),
  (function (t) {
    t(document).ready(function () {
      t(".sppb-carousel-extended").each(function () {
        var i = t(this),
          e = i.data("image-layout"),
          s = i.data("item-number-xl"),
          n = i.data("item-number-lg"),
          a = i.data("item-number-md"),
          o = i.data("item-number-sm"),
          r = i.data("item-number-xs"),
          h = i.data("autoplay");
        h = 1 === h;
        var d = i.data("speed"),
          p = i.data("interval"),
          l = i.data("margin"),
          c = !1,
          m = 180,
          u = 180,
          v = 180,
          f = 90,
          g = 50,
          x = i.data("fade"),
          _ = "slide";
        ("layout3" !== e && "layout4" !== e) || (c = !0),
          "layout3" === e && ((s = 1), (n = 1), (a = 1), (o = 1), (r = 1)),
          c &&
            ((m = i.data("padding-xl")),
            (u = i.data("padding-lg")),
            (v = i.data("padding-md")),
            (f = i.data("padding-sm")),
            (g = i.data("padding-xs"))),
          "layout1" === e &&
            ((s = 1),
            (n = 1),
            (a = 1),
            (o = 1),
            (r = 1),
            (l = 0),
            x && (_ = "fadeIn"));
        var b = i.data("height-xl"),
          y = i.data("height-lg"),
          w = i.data("height-md"),
          C = i.data("height-sm"),
          P = i.data("height-xs"),
          I = i.data("testi-layout"),
          $ = i.data("team-layout");
        ((I && !e) || $) &&
          ((b = "auto"),
          (y = "auto"),
          (w = "auto"),
          (C = "auto"),
          (P = "auto"));
        var S = i.data("arrow");
        S = !!S;
        var T = i.data("dots");
        T = !!T;
        var k = i.data("left-arrow"),
          D = i.data("right-arrow");
        i.spCarousel({
          autoplay: h,
          items: s,
          speed: d,
          interval: p,
          margin: l,
          center: c,
          centerPadding: m,
          dots: T,
          dot_indicator: T,
          nav: S,
          nav_text: [
            '<i class="fa ' + k + '" aria-hidden="true"></i>',
            '<i class="fa ' + D + '" aria-hidden="true"></i>',
          ],
          animationType: _,
          responsive: [
            { viewport: 1920, height: b, items: s, centerPadding: m },
            { viewport: 1140, height: b, items: s, centerPadding: m },
            { viewport: 960, height: y, items: n, centerPadding: u },
            { viewport: 720, height: w, items: a, centerPadding: v },
            { viewport: 540, height: C, items: o, centerPadding: f },
            { viewport: 320, height: P, items: r, centerPadding: g },
          ],
        });
      });
      new MutationObserver(function (i) {
        i.forEach(function (i) {
          var e = i.addedNodes;
          null !== e &&
            t(e).each(function () {
              t(this)
                .find(".sppb-carousel-extended")
                .each(function () {
                  var i = t(this),
                    e = i.data("image-layout"),
                    s = i.data("item-number-xl"),
                    n = i.data("item-number-lg"),
                    a = i.data("item-number-md"),
                    o = i.data("item-number-sm"),
                    r = i.data("item-number-xs"),
                    h = i.data("autoplay");
                  h = 1 === h;
                  var d = i.data("speed"),
                    p = i.data("interval"),
                    l = i.data("margin"),
                    c = !1,
                    m = i.data("fade"),
                    u = "slide";
                  ("layout3" !== e && "layout4" !== e) || (c = !0);
                  var v = 180,
                    f = 180,
                    g = 180,
                    x = 90,
                    _ = 50;
                  c &&
                    ((v = i.data("padding-xl")),
                    (f = i.data("padding-lg")),
                    (g = i.data("padding-md")),
                    (x = i.data("padding-sm")),
                    (_ = i.data("padding-xs"))),
                    "layout3" === e &&
                      ((s = 1), (n = 1), (a = 1), (o = 1), (r = 1)),
                    "layout1" === e &&
                      ((s = 1),
                      (n = 1),
                      (a = 1),
                      (o = 1),
                      (r = 1),
                      (l = 0),
                      m && (u = "fadeIn"));
                  var b = i.data("height-xl"),
                    y = i.data("height-lg"),
                    w = i.data("height-md"),
                    C = i.data("height-sm"),
                    P = i.data("height-xs"),
                    I = i.data("testi-layout"),
                    $ = i.data("team-layout");
                  ((I && !e) || $) &&
                    ((b = "auto"),
                    (y = "auto"),
                    (w = "auto"),
                    (C = "auto"),
                    (P = "auto"));
                  var S = i.data("arrow");
                  S = !!S;
                  var T = i.data("dots");
                  T = !!T;
                  var k = i.data("left-arrow"),
                    D = i.data("right-arrow");
                  i.spCarousel({
                    autoplay: h,
                    items: s,
                    speed: d,
                    interval: p,
                    margin: l,
                    center: c,
                    centerPadding: v,
                    dots: T,
                    dot_indicator: T,
                    nav: S,
                    nav_text: [
                      '<i class="fa ' + k + '" aria-hidden="true"></i>',
                      '<i class="fa ' + D + '" aria-hidden="true"></i>',
                    ],
                    animationType: u,
                    responsive: [
                      { viewport: 1920, height: b, items: s, centerPadding: v },
                      { viewport: 1140, height: b, items: s, centerPadding: v },
                      { viewport: 960, height: y, items: n, centerPadding: f },
                      { viewport: 720, height: w, items: a, centerPadding: g },
                      { viewport: 540, height: C, items: o, centerPadding: x },
                      { viewport: 320, height: P, items: r, centerPadding: _ },
                    ],
                  });
                });
            });
        });
      }).observe(document.body, { childList: !0, subtree: !0 });
    });
  })(jQuery);
