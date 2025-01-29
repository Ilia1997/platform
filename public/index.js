document.addEventListener("DOMContentLoaded", function () {
  const swiperInstances = [];
  let lenis;

  const isMobile = window.innerWidth < 991;
  const initialSwiperSpaceBetween = isMobile ? 16 : 17;

  function init() {
    console.log("init");
    lenis = new Lenis({
      prevent: (node) => node.classList.contains("widget-form-step-body"),
      lerp: 0.075,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // stop lenis before first animation finishes
    lenis.stop();

    new SplitType("[text-split]", {
      types: "lines",
      tagName: "span",
    });
    new SplitType("[chars-split]", {
      types: "chars, words",
      tagName: "span",
    });

    const swiper_1 = new Swiper(".first-slider", {
      slidesPerView: isMobile ? 1.1 : 1.8,
      spaceBetween: initialSwiperSpaceBetween,
      loop: true,
      speed: 550,
      navigation: {
        nextEl: "a#slider-1-right-btn",
        prevEl: "a#slider-1-left-btn",
      },
    });
    const swiper_2 = new Swiper("#we-deliver-slider", {
      slidesPerView: 1.1,
      spaceBetween: initialSwiperSpaceBetween,
      loop: true,
      speed: 550,
      navigation: {
        nextEl: "a#slider-2-right-btn",
        prevEl: "a#slider-2-left-btn",
      },
    });
    const swiper_3 = new Swiper("#real-stories-slider", {
      slidesPerView: isMobile ? 1.1 : 1.3,
      spaceBetween: initialSwiperSpaceBetween,
      loop: true,
      speed: 550,
      navigation: {
        nextEl: "a#slider-3-right-btn",
        prevEl: "a#slider-3-left-btn",
      },
    });

    swiperInstances.push(swiper_1, swiper_2, swiper_3);

    const collaborationClickTrigger = document.getElementById(
      "collaborations-click-trigger"
    );

    collaborationClickTrigger.addEventListener("click", showAllClients);

    initFormLogic(lenis);

    initPreloader(gsap);

    heroAnimation(gsap, lenis);

    firstSliderAnimation(
      gsap,
      swiper_1,
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    aspectsAnimation(gsap);

    weDeliverSliderAnimation(
      gsap,
      swiper_2,
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    weCollaborateAnimation(gsap, showAllClients);

    realStoriesAnimation(
      gsap,
      swiper_3,
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    fromHumansAnimation(gsap, lenis);

    wePrioritizeAnimation(gsap);

    if (!window.scrollY) {
      gsap.set(".main-widget", { width: 0, opacity: 0 });
      gsap.set("#tell-us-text", { opacity: 0 });
      gsap.set("#tell-us-btn", { opacity: 0, scale: 0.7, x: -10 });
    }

    ScrollTrigger.refresh();
  }
  function reInitAll() {
    gsap.set(
      ".form-widget-content",
      { scale: 1, opacity: 1, display: "flex" },
      "step"
    );
    gsap.set(".main-widget", { width: 285, opacity: 1 });
    gsap.set(".slider-btns", { opacity: 0, display: "none" });

    firstSliderAnimation(
      gsap,
      swiperInstances[0],
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    aspectsAnimation(gsap);

    weDeliverSliderAnimation(
      gsap,
      swiperInstances[1],
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    weCollaborateAnimation(gsap, showAllClients);

    realStoriesAnimation(
      gsap,
      swiperInstances[2],
      isMobile,
      initialSwiperSpaceBetween,
      lenis
    );

    fromHumansAnimation(gsap);

    wePrioritizeAnimation(gsap);

    ScrollTrigger.refresh();
  }
  setTimeout(() => {
    window.scrollTo(0, 0);
    init();
  }, 500);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      ScrollTrigger.killAll();
      reInitAll();
    }, 200);
  });
});

function showAllClients() {
  const collaborateItems = document.getElementById("collaborate-items");
  const collaborationGradient = document.getElementById(
    "collaboration-gradient"
  );

  collaborationGradient.style.opacity = 0;
  setTimeout(() => {
    collaborateItems.style.maxHeight = "200rem";
    collaborationGradient.style.display = "none";
  }, 200);
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
}

function calculateFullScreenSliderScale(block) {
  block.style.transform = "translate(0, 0) scale(1)";
  const blockRect = block.getBoundingClientRect();

  const targetHeight = window.innerHeight - 32;
  const scaleY = targetHeight / blockRect.height;

  return scaleY;
}

function calculateSliderPosition(block, startPosition) {
  const blockRect = block.getBoundingClientRect();
  const padding = 16;

  return {
    x: -blockRect.left + padding,
    y: startPosition - padding,
  };
}
function calculateSpaceBetweenSlides(scale, initialSwiperSpaceBetween) {
  return initialSwiperSpaceBetween / scale;
}
function calculateSlideBorderRadius(scale, initialRadius) {
  return initialRadius / scale;
}
function getStepProgress(nextLabelDelay, timeline, stepLabel, nextLabel) {
  const stepStartTime = timeline.labels[stepLabel]; // Start time of the step
  const timelineDuration = timeline.duration();

  const stepEndTime = nextLabel ? timeline.labels[nextLabel] : timelineDuration;

  const timelineTime = timeline.time(); // Current time in the timeline

  // If the current time is outside the step range, return 0
  if (timelineTime < stepStartTime || timelineTime > stepEndTime) {
    return 0;
  }

  const stepDuration =
    stepEndTime - stepStartTime - (nextLabel ? nextLabelDelay : 0);

  // Progress calculation (normalize timeline time to step duration)
  const stepProgress = (timelineTime - stepStartTime) / stepDuration;

  // Return normalized progress, clamped between 0 and 1
  return Math.max(0, Math.min(1, stepProgress));
}

function updateSliderSpaceBetween(
  slider,
  progress,
  originalValue,
  newMaxValue,
  duration = "top"
) {
  if (progress > 1) {
    return;
  }

  // Interpolate between originalValue and newMaxValue based on progress
  const interpolatedValueTop =
    originalValue + (newMaxValue - originalValue) * progress;
  const interpolatedValueBottom =
    originalValue + (newMaxValue - originalValue) * (1 - progress);

  const space =
    duration === "top" ? interpolatedValueTop : interpolatedValueBottom;

  // Update the slider's spaceBetween
  slider.params.spaceBetween = space;

  // Trigger Swiper to reinitialize its layout
  slider.update();
}

const sliderHelpers = {
  calculateFullScreenSliderScale,
  calculateSliderPosition,
  calculateSpaceBetweenSlides,
  calculateSlideBorderRadius,
  updateSliderSpaceBetween,
  getStepProgress,
};

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const cookieHelpers = {
  getCookie,
  setCookie,
};

const initFormLogic = (lenis) => {
  const tabTriggersOptions = {
    tab_1: "init-step-trigger",
    tab_2: "i-need-to-step-trigger",
    tab_3: "expert-tab-trigger",
    tab_4: "stage-tab-trigger",
    tab_5: "primary-goal-tab-trigger",
    tab_6: "prototype-tab-trigger",
    tab_7: "final-form-tab-trigger",
  };
  const tabIds = {
    tab_1: "initial-tab",
    tab_2: "i-need-to-step",
    tab_3: "expert-tab",
    tab_4: "stage-tab",
    tab_5: "primary-goal-tab",
    tab_6: "prototype-tab",
    tab_7: "final-form-tab",
  };

  const iNeedInputOptions = {
    "hire-a-dedicated-designer-or-developer": tabTriggersOptions.tab_3,
    "build-a-new-product-MVP": tabTriggersOptions.tab_4,
    "give-my-website-or-app-a-fresh-redesign": tabTriggersOptions.tab_5,
    "turn-my-idea-into-a-clickable-prototype": tabTriggersOptions.tab_6,
    "help-with-something-else": tabTriggersOptions.tab_7,
  };

  const widgetTriggers = document.querySelectorAll(".open-close-btn");

  const widget = document.getElementById("form-widget");
  const widgetTrigger = document.querySelector(".main-widget");

  widgetTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      widget.classList.toggle("open");

      if (widget.classList.contains("open")) {
        // Stop Lenis scrolling when the div has the 'open' class
        lenis.stop();
      } else {
        // Start Lenis scrolling otherwise
        lenis.start();
      }
    });
  });
  document.addEventListener("click", function (event) {
    // Check if the click is outside the form widget

    if (
      !widget.contains(event.target) &&
      widget.classList.contains("open") &&
      !widgetTrigger.contains(event.target)
    ) {
      widget.classList.remove("open");
      lenis.start();
    }
  });

  const areInputAlreadyListened = false;

  const tab_2 = document.getElementById(tabIds.tab_2);
  const widgetBackBtn = tab_2.querySelector(".widget-back-btn");

  widgetBackBtn.addEventListener("click", () => {
    document.getElementById(tabTriggersOptions.tab_1).click();
  });

  const firstFormBtn = document.querySelector(
    ".widget-greetings-wrapper .primary-cta"
  );

  firstFormBtn.addEventListener("click", function () {
    document.querySelector("#i-need-to-step-trigger").click();
  });

  // i-need step
  iNeedStep(
    tabIds,
    iNeedInputOptions,
    areInputAlreadyListened,
    tabTriggersOptions
  );

  // which expert step
  goToThirdTab(tabIds.tab_3, tabTriggersOptions);

  // what stage step
  goToThirdTab(tabIds.tab_4, tabTriggersOptions, true);

  // primary goal step
  goToThirdTab(tabIds.tab_5, tabTriggersOptions);

  // prototype step
  goToThirdTab(tabIds.tab_6, tabTriggersOptions);
};

const iNeedStep = (
  tabIds,
  iNeedInputOptions,
  areInputAlreadyListened,
  tabTriggersOptions
) => {
  const currentTab = document.getElementById(tabIds.tab_2);
  const currentTabButton = currentTab.querySelector(".widget-next-btn");

  currentTabButton.addEventListener("click", function () {
    const checkedInputId = document.querySelector(
      'input[name="i-need"]:checked'
    )?.id;
    if (!checkedInputId) {
      return;
    }

    const goToTNextTabId = iNeedInputOptions[checkedInputId];
    const nextThirdTabTrigger = document.getElementById(goToTNextTabId);
    nextThirdTabTrigger.click();
    // final form step
    finalTab(
      tabIds,
      goToTNextTabId,
      areInputAlreadyListened,
      tabTriggersOptions
    );
  });
};

const goToThirdTab = (tabId, tabTriggersOptions, isRadioInputs) => {
  const currentTab = document.getElementById(tabId);
  const currentTabButton = currentTab.querySelector(".widget-next-btn");

  const widgetBackBtn = currentTab.querySelector(".widget-back-btn");
  widgetBackBtn.addEventListener("click", function () {
    const secondStepTabTrigger = document.getElementById(
      tabTriggersOptions.tab_2
    );

    secondStepTabTrigger.click();
  });

  currentTabButton.addEventListener("click", function () {
    const inputSelector = isRadioInputs
      ? `input[type="radio"]:checked`
      : `input[type="checkbox"]:checked`;
    console.log("🚀 ~ inputSelector:", inputSelector);
    const checkedInputId = currentTab.querySelector(inputSelector)?.id;

    console.log("🚀 ~ checkedInputId:", checkedInputId);

    if (!checkedInputId) {
      return;
    }

    const lastStepTabTrigger = document.getElementById(
      tabTriggersOptions.tab_7
    );
    lastStepTabTrigger.click();
  });
};

const finalTab = (
  tabIds,
  iNeedSelectedStepTrigger,
  areInputAlreadyListened,
  tabTriggersOptions
) => {
  const currentTab = document.getElementById(tabIds.tab_7);
  const currentTabButton = currentTab.querySelector(
    `#${tabIds.tab_7} #send-form-mock-btn`
  );
  const finalFormSubmitBtn = document.getElementById("submit-form-btn");

  const onWidgetBackBtnClick = () => {
    const secondStepTabTrigger = document.getElementById(
      iNeedSelectedStepTrigger
    );
    if (tabTriggersOptions.tab_7 === iNeedSelectedStepTrigger) {
      const secondStepTabTrigger = document.getElementById(
        tabTriggersOptions.tab_2
      );
      secondStepTabTrigger.click();
      removeEventListener("click", onWidgetBackBtnClick);
      return;
    }

    secondStepTabTrigger.click();
    removeEventListener("click", onWidgetBackBtnClick);
  };

  const widgetBackBtn = currentTab.querySelector(".widget-back-btn");
  widgetBackBtn.addEventListener("click", onWidgetBackBtnClick);

  if (areInputAlreadyListened) {
    return;
  }
  const fullName = document.querySelector('input[name="Full-name"]');
  const email = document.querySelector('input[name="Email-address"]');

  fullName.addEventListener("input", function () {
    fullName.parentElement.classList.remove("error");
  });
  email.addEventListener("input", function () {
    email.parentElement.classList.remove("error");
  });

  currentTabButton.addEventListener("click", function () {
    const fullName = document.querySelector('input[name="Full-name"]');
    const email = document.querySelector('input[name="Email-address"]');
    const tellUsMore = document.querySelector(
      'textarea[name="Tell-us-more"]'
    ).value;

    if (!fullName.value.trim()) {
      fullName.parentElement.classList.add("error");
    }
    if (!email.value.trim()) {
      email.parentElement.querySelector(".input-error-text").textContent =
        "Required";
      email.parentElement.classList.add("error");
      return;
    }
    if (email.value.trim() && !validateEmail(email.value)) {
      email.parentElement.querySelector(".input-error-text").textContent =
        "Incorrect email format.";
      email.parentElement.classList.add("error");
      return;
    }

    finalFormSubmitBtn.click();
  });
  areInputAlreadyListened = true;
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function initPreloader(gsap) {
  const numberElement = document.getElementById("loader-counter");

  const obj = { value: 1 }; // Object to animate

  const timeline = gsap.timeline();

  timeline
    .to(obj, {
      value: 50,
      duration: 1.6, // Duration to reach 50
      ease: "power1.out",
      onUpdate: () => {
        numberElement.textContent = Math.round(obj.value);
      },
    })
    .to(obj, {
      value: 99,
      duration: 1.5, // Duration to reach 100
      ease: "power1.out",
      onUpdate: () => {
        numberElement.textContent = Math.round(obj.value);
      },
    })
    .to(obj, {
      value: 100,
      duration: 0.3, // Duration to reach 100
      ease: "power1.out",
      onUpdate: () => {
        numberElement.textContent = Math.round(obj.value);
      },
    });
}

function heroAnimation(gsap, lenis) {
  const heroVideoInitialEndScale = (window.innerWidth - 32) / window.innerWidth;
  const heroVideoInitialEndScaleY =
    (window.innerHeight - 32) / window.innerHeight;

  const header = document.querySelector(".header");
  const heroWrapper = document.querySelector(".hero-video-wrapper");
  const heroItem = document.querySelector(".hero-video-content");

  gsap.set(".hero-video-wrapper", {
    borderRadius: 0,
  });

  gsap.set(header, { opacity: 0 });

  const heroSectionTimeline_1 = gsap.timeline({
    delay: 4.85,
    onComplete: () => {
      lenis.start();
    },
  });

  const lastHeight = window.innerHeight - 44;

  heroSectionTimeline_1
    .addLabel("step")

    .to(
      heroWrapper,
      {
        transform: `scale(${heroVideoInitialEndScale}, ${heroVideoInitialEndScaleY})`,
        duration: 0.6,
        delay: 0,
        ease: "none",
      },
      "step"
    )
    .to(
      heroItem,
      {
        transform: `scale(${1 / heroVideoInitialEndScale}, ${
          1 / heroVideoInitialEndScaleY
        })`,
        duration: 0.6,
        delay: 0,
        ease: "none",
      },
      "step"
    )

    .addLabel("step2")
    .to(
      heroWrapper,
      { height: `${lastHeight}px`, duration: 1, delay: 0.2 },
      "step2"
    )
    .to(
      heroItem,
      {
        height: `${lastHeight + 44}px`,
        duration: 1,
        delay: 0.2,
        ease: "none",
      },
      "step2"
    )
    .to(
      heroWrapper,
      {
        borderRadius: "20px",
        duration: 1,
        delay: 0.2,
      },
      "step2"
    )
    .to(header, { opacity: 1, duration: 0.7, delay: 0.9 }, "step2")
    .to(".main-widget", { width: 285, opacity: 1, duration: 0.8 }, "step2")
    .to("#tell-us-text", { opacity: 1, duration: 0.4, delay: 0.4 }, "step2")
    .to(
      "#tell-us-btn",
      { opacity: 1, scale: 1, x: 0, duration: 0.25, delay: 0.4 },
      "step2"
    );
}

async function checkIsDefaultActive(timeline) {
  let status = false;
  let counter = 0;
  while (counter < 10) {
    status = timeline.isActive();
    if (status) {
      break;
    }
    await await wait(10);
    counter++;
  }
  return status;
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function firstSliderAnimation(
  gsap,
  swiper_1,
  isMobile,
  initialSwiperSpaceBetween,
  lenis
) {
  const endPercentage = 100;
  const firstSliderSection = document.getElementById("first-slider-sec");
  const firstSliderTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: firstSliderSection,
      start: `-3% 60%`,
      end: `${endPercentage}% 60%`,
      ondragleave: () => {
        swiper_1.update();
      },
      // markers: true,
      toggleActions: "play reverse play reverse",

      onEnter: async () => {
        const isDefaultActive = await checkIsDefaultActive(firstSliderTimeline);
        if (!isDefaultActive) {
          return;
        }

        lenis.scrollTo(firstSliderSection, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 2),
          lock: true,
        });
      },
    },
    id: "first_slider",
  });
  const stickyWrapper = document.querySelector(".welcome-slider-sec");
  const block = document.querySelector(".awards-slider-wrapper");
  const initialRadius = 32;

  const fullScreenScale = sliderHelpers.calculateFullScreenSliderScale(block);
  const { x, y } = sliderHelpers.calculateSliderPosition(block, 0);

  const zoomedSpaceBetweenSlides = sliderHelpers.calculateSpaceBetweenSlides(
    fullScreenScale,
    initialSwiperSpaceBetween
  );

  let mm = gsap.matchMedia();

  mm.add("(min-width: 991px)", () => {
    firstSliderTimeline
      .addLabel("step")
      .to(stickyWrapper, { height: "100vh", duration: 1.1 }, "step")
      .to(
        block,
        {
          scale: fullScreenScale,
          x,
          y,
          "--slider-radius": `${sliderHelpers.calculateSlideBorderRadius(
            fullScreenScale,
            initialRadius
          )}`,
          duration: 1.1,
          delay: 0,
          onUpdate: function () {
            const progress = sliderHelpers.getStepProgress(
              1.5,
              firstSliderTimeline,
              "step"
            );
            sliderHelpers.updateSliderSpaceBetween(
              swiper_1,
              progress,
              initialSwiperSpaceBetween,
              zoomedSpaceBetweenSlides
            );
          },
          onComplete: function () {
            swiper_1.params.spaceBetween = zoomedSpaceBetweenSlides;
            swiper_1.update();
          },
          onReverseComplete: () => {
            swiper_1.params.spaceBetween = initialSwiperSpaceBetween;
            swiper_1.update();
          },
        },
        "step"
      )

      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#first-slider-btns", { display: "flex" }, 0)
      .to(
        "#first-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
  mm.add("(max-width: 991px)", () => {
    firstSliderTimeline
      .addLabel("step")
      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#first-slider-btns", { display: "flex" }, 0)
      .to(
        "#first-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
}
function aspectsAnimation(gsap) {
  const parent = document.querySelector(".our-benefits .carditems-wrapper");
  let mm = gsap.matchMedia();
  const allItems = parent.querySelectorAll(".carditem");
  const firstColumnItems = parent.querySelectorAll(
    ".collumn:nth-child(1) .carditem"
  );
  const secondColumnItems = parent.querySelectorAll(
    ".collumn:nth-child(2) .carditem"
  );

  function animateColumn(items, delayOffset) {
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: index * 0.11 + delayOffset,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".carditems-columns",
            start: "top 70%",
            //markers: true,
          },
        }
      );
    });
  }

  mm.add("(min-width: 991px)", () => {
    animateColumn(firstColumnItems, 0);
    animateColumn(secondColumnItems, firstColumnItems.length * 0.13);
  });

  mm.add("(max-width: 991px)", () => {
    animateColumn(allItems, 0);
  });
}
function weDeliverSliderAnimation(
  gsap,
  swiper,
  isMobile,
  initialSwiperSpaceBetween,
  lenis
) {
  const stickyWrapper = document.querySelector(".we-deliver-sticky");
  const block = document.querySelector(".deliver-slider-block");
  const initialRadius = 32;

  const fullScreenScale = sliderHelpers.calculateFullScreenSliderScale(block);
  const { x, y } = sliderHelpers.calculateSliderPosition(block, 0);

  let mm = gsap.matchMedia();

  const zoomedSpaceBetweenSlides = sliderHelpers.calculateSpaceBetweenSlides(
    fullScreenScale,
    initialSwiperSpaceBetween
  );

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".we-del-wrapper",
      start: `9% 80%`,
      end: "95% 80%",
      //markers: true,
      toggleActions: "play reverse play reverse",
      onEnter: async () => {
        const isActive = await checkIsDefaultActive(tl);
        if (!isActive) {
          return;
        }

        lenis.scrollTo(".we-del-wrapper", {
          duration: 1.4,
          easing: (t) => 1 - Math.pow(1 - t, 2),
          lock: true,
        });
      },
    },
    id: "we_deliver_slider",
  });

  mm.add("(min-width: 991px)", () => {
    tl.addLabel("step")
      .to(stickyWrapper, { height: "100vh", duration: 1 }, "step")
      .to(
        block,
        {
          scale: fullScreenScale,
          x,
          y,
          "--slider-radius": `${sliderHelpers.calculateSlideBorderRadius(
            fullScreenScale,
            initialRadius
          )}`,
          duration: 1,
          // ease: "power2.out",
          onUpdate: function () {
            const progress = sliderHelpers.getStepProgress(1.5, tl, "step");
            sliderHelpers.updateSliderSpaceBetween(
              swiper,
              progress,
              initialSwiperSpaceBetween,
              zoomedSpaceBetweenSlides
            );
          },
          onComplete: function () {
            swiper.params.spaceBetween = zoomedSpaceBetweenSlides;
            swiper.update();
          },
          onReverseComplete: () => {
            swiper.params.spaceBetween = initialSwiperSpaceBetween;
            swiper.update();
          },
        },
        "step"
      )

      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#second-slider-btns", { display: "flex" }, 0)
      .to(
        "#second-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
  mm.add("(max-width: 991px)", () => {
    tl.addLabel("step")
      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#first-slider-btns", { display: "flex" }, 0)
      .to(
        "#first-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
}

function weCollaborateAnimation(gsap, showAllClients) {
  weCollaborateListAnimation(gsap, showAllClients);
}

function weCollaborateListAnimation(gsap, showAllClients) {
  const parent = document.querySelector(".collaborate-items");

  const allItems = parent.querySelectorAll(".carditem");

  const mediumItemIndex = Math.floor(allItems.length / 2);

  const firstColumnItems = Array.from(allItems).filter(
    (_, index) => index < mediumItemIndex
  );
  const secondColumnItems = Array.from(allItems).filter(
    (_, index) => index >= mediumItemIndex
  );

  function animateColumn(items, delayOffset) {
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1 + delayOffset,
          ease: "power2.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 60%",
          },
          id: `collaborate-item-${index}`,
        }
      );
    });
  }

  animateColumn(firstColumnItems, 0);
  animateColumn(secondColumnItems, firstColumnItems.length * 0.03);

  const rollDownAutomatically = !cookieHelpers.getCookie(
    "isClientSectionVisited"
  );
  if (rollDownAutomatically) {
    gsap.timeline({
      scrollTrigger: {
        trigger: "#collaborate-items",
        start: "20% 10%",
        end: "25% 10%",
        //markers: true,
        onEnter: () => {
          showAllClients();
          cookieHelpers.setCookie("isClientSectionVisited", true, 365);
        },
      },
      id: "we_coll_items",
    });
  }
}

function thirdSliderAnimation(
  gsap,
  swiper,
  isMobile,
  initialSwiperSpaceBetween,
  lenis
) {
  const stickyWrapper = document.querySelector(".real-result-sticky-wrapper");
  const block = document.querySelector(".real-result-slider-block");
  const initialRadius = 32;

  const fullScreenScale = sliderHelpers.calculateFullScreenSliderScale(block);
  const { x, y } = sliderHelpers.calculateSliderPosition(block, 0);

  let mm = gsap.matchMedia();

  const zoomedSpaceBetweenSlides = sliderHelpers.calculateSpaceBetweenSlides(
    fullScreenScale,
    initialSwiperSpaceBetween
  );

  const tl_slider = gsap.timeline({
    scrollTrigger: {
      trigger: ".real-story-wrapper",
      start: `9% 80%`,
      end: "90% 80%",
      toggleActions: "play reverse play reverse",
      invalidateOnRefresh: true,
      onUpdate: function () {
        swiper.update();
      },
      onEnter: async () => {
        const isActive = await checkIsDefaultActive(tl_slider);
        if (!isActive) {
          return;
        }
        lenis.scrollTo(".real-story-wrapper", {
          duration: 1.4,
          easing: (t) => 1 - Math.pow(1 - t, 2),
          lock: true,
        });
      },
    },
    id: "third_slider",
  });

  mm.add("(min-width: 991px)", () => {
    tl_slider
      .addLabel("step")
      .to(stickyWrapper, { height: "100vh", duration: 1 }, "step")
      .to(
        block,
        {
          scale: fullScreenScale,
          x,
          y,
          "--slider-radius": `${sliderHelpers.calculateSlideBorderRadius(
            fullScreenScale,
            initialRadius
          )}`,
          duration: 1,
          //  ease: "power2.out",
          onUpdate: function () {
            const progress = sliderHelpers.getStepProgress(
              1.5,
              tl_slider,
              "step"
            );
            sliderHelpers.updateSliderSpaceBetween(
              swiper,
              progress,
              initialSwiperSpaceBetween,
              zoomedSpaceBetweenSlides
            );
          },
          onComplete: function () {
            swiper.params.spaceBetween = zoomedSpaceBetweenSlides;
            swiper.update();
          },
          onReverseComplete: () => {
            swiper.params.spaceBetween = initialSwiperSpaceBetween;
            swiper.update();
          },
        },
        "step"
      )
      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#third-slider-btns", { display: "flex" }, 0)
      .to(
        "#third-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
  mm.add("(max-width: 991px)", () => {
    tl_slider
      .addLabel("step")
      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to("#first-slider-btns", { display: "flex" }, 0)
      .to(
        "#first-slider-btns",
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
}
function realStoriesAnimation(
  gsap,
  swiper_3,
  isMobile,
  initialSwiperSpaceBetween,
  sliderHelpers,
  lenis
) {
  gsap.set(".real-stories h2", { opacity: 0, y: 20 });
  gsap.set(".real-stories h2 .real-results-span", { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".real-stories",
      start: "0% 50%",
      end: "80% 10%",
      // markers: true,
      invalidateOnRefresh: true,
      //delay: 1,
    },
    id: "real_stories",
  });
  tl.addLabel("step")
    .to(".real-stories h2", { opacity: 1, y: 0, duration: 0.6 }, "step")
    .to(
      ".real-stories h2 .real-results-span",
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1 },
      "step"
    )
    .to(
      ".real-result-slider-wrapper",
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 },
      "step"
    );

  thirdSliderAnimation(
    gsap,
    swiper_3,
    isMobile,
    initialSwiperSpaceBetween,
    sliderHelpers,
    lenis
  );
}
async function fromHumansAnimation(gsap) {
  let mm = gsap.matchMedia();

  gsap.set(".from-humans h2", { opacity: 0, y: 20 });
  gsap.set(".from-humans h2 .to-humans-span", { opacity: 0, y: 20 });
  gsap.set(".scrollable-body .normal-section", { opacity: 0 });

  const teamLottieWrapper = document.querySelector(".scroll-image-3");
  const followingCoreLottieWrapper = document.querySelector(
    ".brand-shape-wrapper"
  );

  if (teamLottieWrapper.children.length) {
    teamLottieWrapper.removeChild(teamLottieWrapper.firstChild);
  }
  if (followingCoreLottieWrapper.children.length) {
    followingCoreLottieWrapper.removeChild(
      followingCoreLottieWrapper.firstChild
    );
  }

  const teamLottiePath =
    "https://cdn.prod.website-files.com/6753439d3da31c3534ed228c/6765c5c0c295811d38e88964_text%20lottie%201%20-%20normal%20resolution.json";
  const followingCoreLottiePath =
    "https://cdn.prod.website-files.com/6753439d3da31c3534ed228c/6793bd01fe414877791598cd_vectors%202.json";

  let teamLottiePlayhead = { frame: 0 },
    followingCorePlayhead = { frame: 0 };

  const teamLottieAnimation = lottie.loadAnimation({
    container: teamLottieWrapper,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: teamLottiePath,
  });

  const followingCoreAnimation = lottie.loadAnimation({
    container: followingCoreLottieWrapper,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: followingCoreLottiePath,
  });

  const scene1Images = document.querySelectorAll(".scene-1-img");
  const scene2Images = document.querySelectorAll(".scene-2-img");

  const scene1FirstAnimationParams = [
    {
      xPercent: 0,
      yPercent: -25,
      duration: 2,
      delay: 0,
    },
    {
      xPercent: 0,
      yPercent: -60,
      duration: 2,
      delay: 0,
    },
    {
      xPercent: 0,
      yPercent: -65,
      duration: 2,
      delay: 0,
    },
    {
      xPercent: 0,
      yPercent: -40,
      duration: 1.5,
      delay: 0,
    },
    {
      xPercent: 0,
      yPercent: -80,
      duration: 2,
      delay: 0,
    },
  ];
  const scene1SecondAnimationParams = [
    {
      xPercent: 0,
      yPercent: -25,
      duration: 1,
      delay: 0,
      scale: 1,
    },
    {
      xPercent: -10,
      yPercent: -60,
      duration: 1,
      delay: 0,
      scale: 1,
    },
    {
      xPercent: -45,
      yPercent: 15,
      duration: 1.5,
      delay: 0,
      scale: 0.7,
    },
    {
      xPercent: 30,
      yPercent: -40,
      duration: 1,
      delay: 0,
      scale: 1,
    },
    {
      xPercent: 10,
      yPercent: -60,
      duration: 1,
      delay: 0,
      scale: 1,
    },
  ];

  const scene2animationParams = [
    {
      xPercent: -50,
      yPercent: -50,
      rotationX: 0,
      scale: 0.7,
    },
    {
      xPercent: 50,
      yPercent: -50,
      rotationX: 0,
      scale: 0.7,
    },
    {
      xPercent: 0,
      yPercent: 70,
      rotationX: 0,
      scale: 0.7,
    },
  ];

  followingCoreAnimation.addEventListener("DOMLoaded", function () {
    const fromHumansHeadingTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".from-humans",
        start: "-19% 20%",
        end: "95% 10%",
        defaults: { overwrite: true },
        invalidateOnRefresh: true,
        // markers: true,
      },
      id: "from_humans",
    });
    fromHumansHeadingTl
      .addLabel("step")
      .to(".from-humans h2", { opacity: 1, y: 0, duration: 0.6 }, "step")
      .to(
        ".from-humans h2 .to-humans-span",
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1 },
        "step"
      );
    fromHumansHeadingTl
      .addLabel("step_2")
      .to("#from-humans-text-mob", { opacity: 1, y: 0, duration: 0.6 }, "step");

    gsap.set(scene1Images, {
      transformOrigin: "50% 0%",
    });
    gsap.set(scene2Images, {
      transformOrigin: "50% 0%",
      opacity: 0,
    });

    const h2_lines = document.querySelectorAll(".scrollable-h-1 .line");
    const lines = document.querySelectorAll("#from-humans-text .line");

    mm.add("(min-width: 600px)", () => {
      fromHumansHeadingTl.addLabel("lines_animation");

      lines.forEach((line, index) => {
        fromHumansHeadingTl.fromTo(
          line,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          `lines_animation+=${index * 0.1}`
        );
      });

      const timeline_0 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollable-sticky-wrapper",
          start: "-10% 10%",
          end: "bottom+=20% 10%",
          //  markers: true,
          scrub: 2,
        },
        id: "tl_0",
      });

      gsap.set(".scrollable-screen-2", { z: -3000, y: -50 });

      timeline_0
        .addLabel("step_1")
        .to(
          teamLottiePlayhead,
          {
            frame: teamLottieAnimation.totalFrames - 1,
            ease: "none",
            duration: 7,
            onUpdate: () =>
              teamLottieAnimation.goToAndStop(teamLottiePlayhead.frame, true),
          },
          0
        )
        .to(".scrollable-screen-1", { y: -50, duration: 3 }, "step_1")
        .to(
          scene1Images,
          {
            xPercent: (i) => scene1FirstAnimationParams[i].xPercent,
            yPercent: (i) => scene1FirstAnimationParams[i].yPercent,
            duration: (i) => scene1FirstAnimationParams[i].duration,
          },
          "step_1"
        )
        .to(
          scene1Images,
          {
            xPercent: (i) => scene1SecondAnimationParams[i].xPercent,
            yPercent: (i) => scene1SecondAnimationParams[i].yPercent,
            duration: (i) => scene1SecondAnimationParams[i].duration,
            scale: (i) => scene1SecondAnimationParams[i].scale,
          },
          "step_1+=2.1"
        )
        .to(
          ".scrollable-screen-1",
          {
            z: 1500,
            y: -100,
            duration: 5.5,
          },
          "step_1+=2.1"
        )
        .to(
          scene2Images,
          {
            duration: 4,
            opacity: 1,
          },
          "step_1+=2.5"
        )
        .to(
          ".scrollable-screen-2",
          {
            z: 2300,
            y: 150,
            duration: 6.5,
          },
          "step_1+=2.4"
        )
        .to(
          scene2Images,
          {
            xPercent: (i) => scene2animationParams[i].xPercent,
            yPercent: (i) => scene2animationParams[i].yPercent,
            scale: (i) => scene2animationParams[i].scale,
            duration: 7,
          },
          "step_1+=2.45"
        )
        .to(
          ".scrollable-body .normal-section",
          { opacity: 1, duration: 0.1 },
          "step_1+=4.8"
        )
        .fromTo(
          ".scrollable-body .normal-section",
          { scale: 0.45 },
          { scale: 1, duration: 1.9 },
          "step_1+=4.9"
        )
        .fromTo(
          h2_lines,
          { opacity: 0, yPercent: 60 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 2,
            delay: (i) => (i ? 0.15 : 0),
            ease: "power2.out",
          },
          "step_1+=5"
        )
        .fromTo(
          ".brand-shape-wrapper",
          { opacity: 0, scale: 0.96, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5 },
          "step_1+=5.8"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".scrollable-sticky-wrapper",
            start: "bottom-=28% 10%",
            end: "bottom+=10% 10%",
            toggleActions: "play none none reverse",
            // markers: true,
          },
          id: "tl_1",
        })
        .to(
          followingCorePlayhead,
          {
            frame: followingCoreAnimation.totalFrames - 1,
            ease: "none",
            duration: 4,
            onUpdate: () =>
              followingCoreAnimation.goToAndStop(
                followingCorePlayhead.frame,
                true
              ),
          },
          0
        );
    });
    // mobile animation
    mm.add("(max-width: 600px)", () => {
      const timeline_0 = gsap.timeline({
        scrollTrigger: {
          trigger: ".scrollable-sticky-wrapper",
          start: "-10% 10%",
          end: "bottom+=20% 10%",
          // markers: true,
          scrub: 2,
        },
        id: "tl_0",
      });

      gsap.set(".scrollable-screen-2", { z: -3000, y: -50 });

      timeline_0
        .addLabel("step_1")
        .to(
          teamLottiePlayhead,
          {
            frame: teamLottieAnimation.totalFrames - 1,
            ease: "none",
            duration: 7,
            onUpdate: () =>
              teamLottieAnimation.goToAndStop(teamLottiePlayhead.frame, true),
          },
          0
        )
        .to(".scrollable-screen-1", { y: -50, duration: 3 }, "step_1")
        .to(
          scene1Images,
          {
            xPercent: (i) => scene1FirstAnimationParams[i].xPercent,
            yPercent: (i) => scene1FirstAnimationParams[i].yPercent,
            duration: (i) => scene1FirstAnimationParams[i].duration,
          },
          "step_1"
        )
        .to(
          scene1Images,
          {
            xPercent: (i) => scene1SecondAnimationParams[i].xPercent,
            yPercent: (i) => scene1SecondAnimationParams[i].yPercent,
            duration: (i) => scene1SecondAnimationParams[i].duration,
            scale: (i) => scene1SecondAnimationParams[i].scale,
          },
          "step_1+=2.1"
        )
        .to(
          ".scrollable-screen-1",
          {
            z: 1500,
            y: -100,
            duration: 5.5,
          },
          "step_1+=2.1"
        )
        .to(
          scene2Images,
          {
            duration: 4,
            opacity: 1,
          },
          "step_1+=2.5"
        )
        .to(
          ".scrollable-screen-2",
          {
            z: 2300,
            y: 150,
            duration: 6.5,
          },
          "step_1+=2.4"
        )
        .to(
          scene2Images,
          {
            xPercent: (i) => scene2animationParams[i].xPercent,
            yPercent: (i) => scene2animationParams[i].yPercent,
            scale: (i) => scene2animationParams[i].scale,
            duration: 7,
          },
          "step_1+=2.45"
        )
        .to(
          ".scrollable-body .normal-section",
          { opacity: 1, duration: 0 },
          "step_1+=4.8"
        )
        .fromTo(
          ".scrollable-body .normal-section",
          { scale: 0.45 },
          { scale: 1, duration: 1.7 },
          "step_1+=4.9"
        )
        .fromTo(
          h2_lines,
          { opacity: 0, yPercent: 60 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 2,
            delay: (i) => (i ? 0.15 : 0),
            ease: "power2.out",
          },
          "step_1+=5"
        )
        .fromTo(
          ".brand-shape-wrapper",
          { opacity: 0, scale: 0.96, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5 },
          "step_1+=5.8"
        );
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".scrollable-sticky-wrapper",
            start: "bottom-=28% 10%",
            end: "bottom+=10% 10%",
            toggleActions: "play none none reverse",
            // markers: true,
          },
          id: "tl_1",
        })
        .to(
          followingCorePlayhead,
          {
            frame: followingCoreAnimation.totalFrames - 1,
            ease: "none",
            duration: 4,
            onUpdate: () =>
              followingCoreAnimation.goToAndStop(
                followingCorePlayhead.frame,
                true
              ),
          },
          0
        );
    });
  });
}
function wePrioritizeAnimation(gsap) {
  const chars = document.querySelectorAll("#prioritize-text .char");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#we-prioritize-text-section",
        start: "top 60%",
        end: "80% 60%",
        scrub: 1,
        // markers: true,
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
      },
      id: "we-prioritize-section",
    })
    .to(chars, {
      color: "#929296",
      duration: 0.7,
      ease: "power1.out",
      stagger: 0.05,
    });
}
