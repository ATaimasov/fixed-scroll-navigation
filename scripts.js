class FixedScrollNavigation {
  constructor(options) {
    // use this.options in other methods
    this.options = options || {};

    this.header = document.querySelector(`header`) || null;
    this.checkHeaderExist();

    this.cssClassesInit();

    // what will prevent class toggle
    this.preventParams = options.preventParams || false;

    // track the scroll position
    this.tempScrollTop = window.scrollY;

    // preserve the class context for the event handlers
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.throttleDelay = options.throttleDelay || 200;

    // use throttle for both scroll and resize
    this.throttledHandleScroll = this.throttle(
      this.handleScroll,
      this.throttleDelay
    );

    this.throttledHandleResize = this.throttle(
      this.handleResize,
      this.throttleDelay
    );

    // Initial padding setup
    this.updatePaddingOnTop();

    // Add event listeners
    window.addEventListener("scroll", this.throttledHandleScroll, {
      passive: true,
    });

    window.addEventListener("resize", this.throttledHandleResize, {
      passive: true,
    });
  }

  cssClassesInit() {
    this.fixedClass = this.options.fixedClass || "fixed";
    this.hiddenClass = this.options.hiddenClass || "hidden";
    this.visibleClass = this.options.visibleClass || "visible";

    this.header.classList.add(this.fixedClass);
  }

  handleScroll() {
    if (this.preventParams) return; // for example prevent scrolling when clicking on links , or open burger

    this.currentScrollTop = window.scrollY;

    if (this.currentScrollTop > this.tempScrollTop) {
      this.header.classList.remove(this.visibleClass);
      this.header.classList.add(this.hiddenClass);
    } else {
      this.header.classList.add(this.visibleClass);
      this.header.classList.remove(this.hiddenClass);
    }

    this.tempScrollTop = this.currentScrollTop;
  }

  // New method to handle resize events
  handleResize() {
    this.updatePaddingOnTop();
  }

  checkHeaderExist() {
    if (!this.header) {
      throw new Error("No header element found");
    }
  }

  updatePaddingOnTop() {
    // Recalculate header height
    this.headerHeight = this.header.offsetHeight;

    // Update padding on body
    document.body.style.paddingTop = `${this.headerHeight}px`;

    // Optional: log for debugging
    if (this.options.debug) {
      console.log(`Header height updated to: ${this.headerHeight}px`);
    }
  }

  throttle(func, timeout) {
    let timer = null;
    return function perform(...args) {
      if (timer) return;

      timer = setTimeout(() => {
        func(...args);
        clearTimeout(timer);
        timer = null;
      }, timeout);
    };
  }

  destroy() {
    // Remove all event listeners
    window.removeEventListener("scroll", this.throttledHandleScroll);
    window.removeEventListener("resize", this.throttledHandleResize);

    // Reset body padding
    document.body.style.paddingTop = "";

    // Remove classes from header
    this.header.classList.remove(this.fixedClass);
    this.header.classList.remove(this.hiddenClass);
    this.header.classList.remove(this.visibleClass);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const fixedScrollNavigationInstance = new FixedScrollNavigation({
    throttleDelay: 200,
    debug: true, // Set to true to see header height updates in console
  });

  // Example of how to update preventParams when needed
  // document.querySelector('.burger-button').addEventListener('click', () => {
  //   fixedScrollNavigationInstance.preventParams = true;
  //  , // Reset when burger menu closes
  //  , // fixedScrollNavigationInstance.preventParams = false;
  // });
});
