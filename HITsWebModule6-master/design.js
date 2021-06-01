let navigation = {
    // Variables
    $navTrigger: document.querySelector(".nav__trigger"),
    $nav: document.querySelector(".nav"),
    $navItems: document.querySelectorAll(".nav__item a"),
    $mainPart: document.querySelector(".mainPart"),
    transitionEnd:
      "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
    isOpeningNav: false,
  
    init() {
      let self = this;
      // Reset overflow and height on load
      self.$mainPart.style.overflow = "auto";
      self.$mainPart.style.height = "auto";
  
      // Handle scroll events
      window.addEventListener("scroll", (e) => {
        if (window.scrollY == 0 && self.isOpeningNav) {
          self.isOpeningNav = false;
          // Add a small delay
          setTimeout(function () {
            self.openNavigation();
          }, 150);
        }
      });
  
      // Handle .nav__trigger click event
      self.$navTrigger.addEventListener("click", (e) => {
        e.preventDefault();
  
        if (!self.$navTrigger.classList.contains("is-active")) {
          if (window.scrollY !== 0) {
            // Scroll to top
            window.scroll({ top: 0, left: 0, behavior: "smooth" });
  
            // Enable opening nav
            self.isOpeningNav = true;
          } else {
            self.openNavigation();
          }
        } else {
          self.closeNavigation();
        }
      });
  
      // Handle .nav__item click events
      self.$navItems.forEach((navLink) => {
        navLink.addEventListener("click", function (e) {
          e.preventDefault();
  
          // Remove is-active from all .nav__items
          self.$navItems.forEach((el) => {
            el.classList.remove("is-active");
          });
  
          // Ad is-active to clicked .nav__item
          this.classList.add("is-active");
  
          // Transition the page
          self.transitionPage();
        });
      });
    },
  
    openNavigation() {
      let self = this;
  
      // .nav--trigger active
      self.$navTrigger.classList.add("is-active");
  
      // body froze
      document.body.classList.add("is-froze");
  
      // Remove old inline styles
      if (self.$mainPart.style.removeProperty) {
        self.$mainPart.style.removeProperty("overflow");
        self.$mainPart.style.removeProperty("height");
      } else {
        self.$mainPart.style.removeAttribute("overflow");
        self.$mainPart.style.removeAttribute("height");
      }
  
      // .mainPart active
      self.$mainPart.classList.add("is-active");
    },
  
    closeNavigation() {
      let self = this;
  
      // .nav--trigger inactive
      self.$navTrigger.classList.remove("is-active");
  
      // .mainPart inactive
      self.$mainPart.classList.remove("is-active");
      self.$mainPart.addEventListener("transitionend", (e) => {
        if (
          e.propertyName == "transform" &&
          !self.$navTrigger.classList.contains("is-active")
        ) {
          // Reset overflow and height
          self.$mainPart.style.overflow = "auto";
          self.$mainPart.style.height = "auto";
  
          // body unfroze
          document.body.classList.remove("is-froze");
        }
      });
  
      // no-csstransitions fallback
      if (document.documentElement.classList.contains("no-csstransitions")) {
        // .mainPart inactive
        self.$mainPart.classList.remove("is-active");
  
        // body unfroze
        document.body.classList.remove("is-froze");
      }
    },
  
    transitionPage() {
      let self = this;
  
      // .mainPart transitioning
      self.$mainPart.classList.add("is-transition-out");
      self.$mainPart.addEventListener("transitionend", (e) => {
        if (e.propertyName == "clip-path") {
          if (self.$mainPart.classList.contains("is-transition-in")) {
            self.$mainPart.classList.remove("is-transition-in");
            self.$mainPart.classList.remove("is-transition-out");
            self.closeNavigation();
          }
  
          if (self.$mainPart.classList.contains("is-transition-out")) {
            self.$mainPart.classList.remove("is-transition-out");
  
            // Add new content to .mainPart
  
            setTimeout(function () {
              self.$mainPart.classList.add("is-transition-in");
            }, 500);
          }
        }
      });
    },
  };
  
  navigation.init();
  