let isSoundActive = false;
let soundStates = {
  isFirstSoundPlayed: false,
  isSecondSoundPlayed: false,
};
const MOBILE_BREAKPOINT = 767;
document.querySelector(".hero-video-wrapper").style.position = "fixed";
document.addEventListener("DOMContentLoaded", function () {
  const swiperInstances = [];
  let scrollTriggerRevalidateInstances = [];
  const splitTextInstances = [];
  let lenis;

  const isTablet = window.innerWidth < 991;
  const initialSwiperSpaceBetween = isTablet ? 16 : 17;

  function init() {
    console.log("init");
    const heroVideoWrapper = document.querySelector(".hero-video-wrapper");
    heroVideoWrapper.style.cssText = `
      position: absolute;
      z-index: 9;
    `;

    lenis = new Lenis({
      lerp: 0.18,
      duration: 1.4,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    if (isTablet) {
      ScrollTrigger.normalizeScroll(true);
    }

    lenis.stop();

    const textSplit = new SplitType("[text-split]", {
      types: "lines",
      tagName: "span",
    });
    splitTextInstances.push(textSplit);

    const charsSplit = new SplitType("[chars-split]", {
      types: "chars, words",
      tagName: "span",
    });
    splitTextInstances.push(charsSplit);

    const swiper_1 = new Swiper(".first-slider", {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: true,
      speed: 550,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: "a#slider-1-right-btn",
        prevEl: "a#slider-1-left-btn",
      },
      breakpoints: {
        991: {
          slidesPerView: "auto",
          spaceBetween: 17,
        },
      },
    });
    const swiper_2 = new Swiper("#we-deliver-slider", {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: true,
      speed: 550,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: "a#slider-2-right-btn",
        prevEl: "a#slider-2-left-btn",
      },
      breakpoints: {
        991: {
          slidesPerView: "auto",
          spaceBetween: 17,
        },
      },
    });
    const swiper_3 = new Swiper("#real-stories-slider", {
      slidesPerView: 1.1,
      spaceBetween: 16,
      loop: true,
      speed: 550,
      observer: true,
      observeParents: true,
      navigation: {
        nextEl: "a#slider-3-right-btn",
        prevEl: "a#slider-3-left-btn",
      },
      breakpoints: {
        991: {
          slidesPerView: "auto",
          spaceBetween: 16,
        },
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

    const firstSliderTimeline = firstSliderAnimation(
      gsap,
      swiper_1,
      initialSwiperSpaceBetween,
      lenis
    );
    scrollTriggerRevalidateInstances.push(firstSliderTimeline);

    aspectsAnimation(gsap);

    const weDeliverSliderTimeline = secondSliderAnimation(
      gsap,
      swiper_2,
      initialSwiperSpaceBetween,
      lenis
    );
    scrollTriggerRevalidateInstances.push(weDeliverSliderTimeline);

    weCollaborateListAnimation(gsap, showAllClients, lenis);

    realStoriesAnimation(gsap);
    const thirdSliderTimeline = thirdSliderAnimation(
      gsap,
      swiper_3,
      initialSwiperSpaceBetween,
      lenis
    );
    scrollTriggerRevalidateInstances.push(thirdSliderTimeline);

    fromHumansAnimation(gsap, lenis);

    const wePrioritizeTimeline = wePrioritizeAnimation(gsap);
    scrollTriggerRevalidateInstances.push(wePrioritizeTimeline);

    footerAnimation(gsap, lenis);

    if (!window.scrollY) {
      gsap.set(".main-widget", { width: 0, opacity: 0 });
      gsap.set("#tell-us-text", { opacity: 0 });
      gsap.set("#tell-us-btn", { opacity: 0, scale: 0.7, x: -10 });
    }

    ScrollTrigger.refresh();

    // bg sound
    const bgSound = document.getElementById("bg-sound");
    bgSound.volume = 0.2;
    bgSound.loop = true;

    const soundBtn = document.querySelectorAll(".bg-sound-widget");

    function toggleHeadingStates(isShow) {
      const headingWithSound = document.querySelectorAll(".heading-with-sound");
      const headingWithoutSound = document.querySelectorAll(
        ".heading-without-sound"
      );

      if (isShow) {
        headingWithoutSound.forEach((heading) => {
          heading.style.opacity = "0";
        });
        headingWithSound.forEach((heading) => {
          heading.style.opacity = "1";
          heading.style.display = "inline-block";
        });
        return;
      }
      headingWithoutSound.forEach((heading) => {
        heading.style.opacity = "1";
      });
      headingWithSound.forEach((heading) => {
        heading.style.opacity = "0";
        heading.style.display = "none";
      });
    }

    const toggleAudio = () => {
      console.log("toggleAudio");
      console.log("bgSound.paused", bgSound.paused);
      if (bgSound.paused) {
        bgSound.play();
        isSoundActive = true;
        toggleHeadingStates(true);
      } else {
        bgSound.pause();
        isSoundActive = false;
        toggleHeadingStates(false);
      }
    };
    soundBtn.forEach((btn) => {
      // Add click event listener to the button
      btn.addEventListener("click", toggleAudio);
    });
  }
  function reInitAll() {
    const windowWidth = window.innerWidth;
    gsap.set(
      ".form-widget-content",
      { scale: 1, opacity: 1, display: "flex" },
      "step"
    );
    gsap.set(".main-widget", {
      width: windowWidth > 767 ? 285 : "calc(100% - 24px)",
      opacity: 1,
    });
    gsap.set(".slider-btns", { opacity: 0, display: "none" });
    const previousProgressTime_1 =
      scrollTriggerRevalidateInstances[0].progress();
    const firstSliderTimeline = firstSliderAnimation(
      gsap,
      swiperInstances[0],
      initialSwiperSpaceBetween,
      lenis,
      previousProgressTime_1
    );

    const previousProgressTime_2 =
      scrollTriggerRevalidateInstances[1].progress();
    const weDeliverSliderTimeline = secondSliderAnimation(
      gsap,
      swiperInstances[1],
      initialSwiperSpaceBetween,
      lenis,
      previousProgressTime_2
    );

    const previousProgressTime_3 =
      scrollTriggerRevalidateInstances[2].progress();
    const thirdSliderTimeline = thirdSliderAnimation(
      gsap,
      swiperInstances[2],
      initialSwiperSpaceBetween,
      lenis,
      previousProgressTime_3
    );

    // fromHumansAnimation(gsap);

    const wePrioritizeTimeline = wePrioritizeAnimation(gsap);

    scrollTriggerRevalidateInstances = [
      firstSliderTimeline,
      weDeliverSliderTimeline,
      thirdSliderTimeline,
      wePrioritizeTimeline,
    ];

    ScrollTrigger.refresh();

    ScrollTrigger.refresh();
  }
  setTimeout(() => {
    window.scrollTo(0, 0);
    init();
  }, 500);

  window.addEventListener("resize", () => {
    updateHeroVideoSizeOnResize();
    handleWidgetWidth();
    splitTextInstances.forEach((instance) => {
      instance.split();
    });

    scrollTriggerRevalidateInstances.forEach((instance) => {
      instance.kill();
    });

    reInitAll();
  });
});

function showAllClients() {
  const collaborateItems = document.getElementById("collaborate-items");
  const collaborationGradient = document.getElementById(
    "collaboration-gradient"
  );

  collaborationGradient.style.opacity = 0;
  setTimeout(() => {
    collaborateItems.style.maxHeight = "500rem";
    collaborationGradient.style.display = "none";
  }, 200);
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
}

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

  // const widget = document.getElementById("form-widget");
  const widget = document.querySelector(".main-widget");
  const textarea = document.querySelector(".textarea.w-input");
  const satHellTrigger = document.querySelector("#say-hello");
  let areInputAlreadyListened = false;

  satHellTrigger.addEventListener("click", function () {
    document.getElementById(tabTriggersOptions.tab_7).click();
    if (!widget.classList.contains("open")) {
      finalTab(
        tabIds,
        tabTriggersOptions.tab_7,
        areInputAlreadyListened,
        tabTriggersOptions
      );
      areInputAlreadyListened = true;
      openWidget(widget, lenis);
    }
  });

  widgetTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      if (!widget.classList.contains("open")) {
        // Opening animation
        openWidget(widget, lenis);
      } else {
        // Closing animation
        closeWidget(widget, lenis);
      }
    });
  });
  document.addEventListener("click", function (event) {
    if (
      !widget.contains(event.target) &&
      widget.classList.contains("open") &&
      !widget.contains(event.target) &&
      !event.target.id.includes("say-hello")
    ) {
      closeWidget(widget, lenis);
    }
  });

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

  // textarea logic
  const validateTextarea = () => {
    // Trim the value to avoid spaces being counted as valid input
    if (textarea.value.trim()) {
      textarea.classList.add("valid");
    } else {
      textarea.classList.remove("valid");
    }
  };
  // Event listeners for real-time validation
  textarea.addEventListener("input", validateTextarea);
  textarea.addEventListener("blur", validateTextarea);

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
function openWidget(widget, lenis) {
  const widgetFormWrapper = widget.querySelector(".main-widget-form-wrapper");
  const formWidgetContent = widget.querySelector(".form-widget-content");
  const tellUsText = widget.querySelector("#tell-us-text");
  const windowWidth = window.innerWidth;
  widget.classList.add("open");
  gsap.fromTo(
    widget,
    { height: "60px" },
    {
      height: "auto",
      duration: 0.7,
      ease: "power2.inOut",
    }
  );
  gsap.fromTo(
    widgetFormWrapper,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: "power2.inOut" }
  );

  gsap.fromTo(
    widget,
    { width: windowWidth > 767 ? "285px" : "calc(100% - 24px)" },
    {
      width: windowWidth > 991 ? "906px" : "calc(100% - 24px)",
      duration: 0.9,
      delay: 0,
      ease: "power2.inOut",
    }
  );

  gsap.fromTo(
    formWidgetContent,
    { paddingRight: "5px", bottom: "0px" },
    {
      paddingRight: "32px",
      duration: 0.4,
      bottom: "11px",
      delay: 0,
      ease: "power2.inOut",
    }
  );

  gsap.fromTo(
    tellUsText,
    { opacity: 1 },
    { opacity: 0, duration: 0.4, delay: 0, ease: "power2.inOut" }
  );

  lenis.stop();
}
function closeWidget(widget, lenis) {
  const windowWidth = window.innerWidth;
  const widgetFormWrapper = widget.querySelector(".main-widget-form-wrapper");
  const formWidgetContent = widget.querySelector(".form-widget-content");
  const tellUsText = widget.querySelector("#tell-us-text");

  gsap.to(widget, {
    height: "60px",
    duration: 0.7,
    ease: "power2.inOut",
  });

  gsap.to(widgetFormWrapper, {
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
  });

  gsap.to(widget, {
    width: windowWidth > 767 ? "285px" : "calc(100% - 24px)",
    duration: 0.9,
    ease: "power2.inOut",
  });

  gsap.to(formWidgetContent, {
    paddingRight: "5px",
    bottom: "0px",
    duration: 0.6,
    ease: "power2.inOut",
  });

  gsap.to(tellUsText, {
    opacity: 1,
    duration: 0.4,
    delay: 0.25,
    ease: "power2.inOut",
    onComplete: () => {
      widget.classList.remove("open");
      resetForm();
    },
  });

  lenis.start();
}
function resetForm() {
  const formWrapper = document.getElementById("form-widget");
  const form = formWrapper.querySelector("form");
  form.reset();
  const firstFormStepTrigger = document.getElementById("init-step-trigger");
  formWrapper.querySelectorAll(".w--redirected-checked").forEach((el) => {
    el.classList.remove("w--redirected-checked");
  });
  firstFormStepTrigger.click();
}

function handleWidgetWidth() {
  const widgetWrapper = document.querySelector(".main-widget-form-wrapper");
  if (!widgetWrapper.classList.contains("open")) {
    return;
  }
  const windowWidth = window.innerWidth;
  if (windowWidth > 991) {
    widgetWrapper.style.width = "906px";
    return;
  }
  widgetWrapper.style.width = "calc(100% - 24px)";
}

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
    areInputAlreadyListened = true;
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

    const checkedInputId = currentTab.querySelector(inputSelector)?.id;

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

async function initPreloader(gsap) {
  const numberElement = document.getElementById("loader-counter");
  const preloaderWrapper = document.querySelector(".initial-preloader");
  const preloaderWrapperContent = document.querySelector(
    ".init-wrapper-content"
  );

  const obj = { value: 1 }; // Object to animate

  const timeline = gsap.timeline();

  timeline
    .to(preloaderWrapperContent, {
      opacity: 1,
      duration: 0.2,
      ease: "power1.out",
    })
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
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () => {
        numberElement.textContent = Math.round(obj.value);
      },
    })
    .to(obj, {
      value: 100,
      duration: 0.3,
      ease: "power1.out",
      onUpdate: () => {
        numberElement.textContent = Math.round(obj.value);
      },
    });
  timeline
    .addLabel("preloader")
    .to(
      preloaderWrapperContent,
      {
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
      },
      "preloader"
    )
    .to(
      preloaderWrapper,
      {
        opacity: 0,
        duration: 0.7,
        delay: 0.7,
        ease: "power1.out",
      },
      "preloader"
    )
    .to(
      preloaderWrapper,
      {
        display: "none",
        delay: 1.4,
        ease: "power1.out",
      },
      "preloader"
    );
}

function updateHeroVideoSizeOnResize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const onePaddingDimension = windowWidth > MOBILE_BREAKPOINT ? 16 : 12;
  const heroVideoInitialEndScale =
    (windowWidth - onePaddingDimension * 2) / windowWidth;
  const heroVideoInitialEndScaleY =
    (windowHeight - onePaddingDimension * 2) / windowHeight;

  const heroWrapper = document.querySelector(".hero-video-wrapper");
  const heroItem = document.querySelector(".hero-video-content");

  heroWrapper.style.transform = `scale(${heroVideoInitialEndScale}, ${heroVideoInitialEndScaleY})`;
  heroItem.style.transform = `scale(${1 / heroVideoInitialEndScale}, ${
    1 / heroVideoInitialEndScaleY
  })`;
}

function heroAnimation(gsap, lenis) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const onePaddingDimension = windowWidth > MOBILE_BREAKPOINT ? 16 : 12;
  const heroVideoInitialEndScale =
    (windowWidth - onePaddingDimension * 2) / windowWidth;
  const heroVideoInitialEndScaleY =
    (windowHeight - onePaddingDimension * 2) / windowHeight;

  const header = document.querySelector(".header");
  const heroWrapper = document.querySelector(".hero-video-wrapper");
  const heroItem = document.querySelector(".hero-video-content");

  gsap.set(".hero-video-wrapper", {
    borderRadius: 0,
  });

  console.log("window.isUserSawPreloader", window.isUserSawPreloader);

  gsap.set(header, { opacity: 0 });

  const heroSectionTimeline_1 = gsap.timeline({
    delay: window.isUserSawPreloader ? 0 : 4.95,
    onComplete: () => {
      lenis.start();
    },
  });

  const lastHeight = windowHeight - 44;

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
      { height: `calc(100svh - 44px)`, duration: 1, delay: 0.2 },
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
      heroItem,
      {
        height: "100svh",
        duration: 0,
        delay: 1.21,
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

    .to(
      ".main-widget",
      {
        width: windowWidth > 767 ? 285 : "calc(100% - 24px)",
        opacity: 1,
        duration: 0.8,
        delay: 0.9,
      },
      "step2"
    )
    .to(
      "#tell-us-text",
      {
        opacity: 1,
        duration: 0.4,
        delay: 1.1,
      },
      "step2"
    )
    .to(
      "#tell-us-btn",
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.25,
        delay: 1.1,
      },
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
  swiper,
  initialSwiperSpaceBetween,
  lenis,
  previousProgressTime
) {
  const endPercentage = 100;
  const welcomeSection = document.querySelector(".welcome-text");
  const firstSliderSection = document.getElementById("first-slider-sec");

  const chars = document.querySelectorAll(
    ".we-got-your-covered-absolute .char"
  );
  const sound = document.getElementById("speech-1");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: welcomeSection,
        start: "10% 60%",
        end: "bottom 60%",
        // markers: true,

        onEnter: () => {
          if (isSoundActive && !soundStates.isFirstSoundPlayed) {
            sound.volume = 0.25;
            sound.play();
            soundStates.isFirstSoundPlayed = true;
          }
        },
        onLeave: () => {
          if (isSoundActive) {
            echoAndPauseSound(sound);
          }
        },
        onLeaveBack: () => {
          if (isSoundActive) {
            echoAndPauseSound(sound);
          }
        },
      },
    })
    .to(chars, {
      color: "#09090a",
      duration: 2,
      stagger: 0.065,
    });

  const tl_slider = gsap.timeline({
    scrollTrigger: {
      trigger: firstSliderSection,
      start: `-3% 60%`,
      end: `${endPercentage}% 60%`,
      ondragleave: () => {
        swiper_1.update();
      },
      toggleActions: "play reverse play reverse",

      onEnter: async () => {
        const windowWidth = window.innerWidth;
        if (windowWidth <= 991) {
          return;
        }
        const isDefaultActive = await checkIsDefaultActive(tl_slider);
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
  const sliderButtons = document.querySelector("#first-slider-btns");

  initSliderTimelineLogic({
    stickyWrapper,
    block,
    sliderButtons,
    tl_slider,
    initialSwiperSpaceBetween,
    swiper,
  });

  if (previousProgressTime) {
    tl_slider.progress(previousProgressTime);
  }
  return tl_slider;
}

function secondSliderAnimation(
  gsap,
  swiper,
  initialSwiperSpaceBetween,
  lenis,
  previousProgressTime
) {
  const chars = document.querySelectorAll(
    ".we-deliver-section .heading-with-sound .char"
  );
  const weDeliverSection = document.querySelector(".we-deliver-section");
  const sound = document.getElementById("speech-2");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: weDeliverSection,
        start: "10% 60%",
        end: "bottom 60%",
        // markers: true,

        onEnter: () => {
          if (isSoundActive && !soundStates.isSecondSoundPlayed) {
            sound.volume = 0.25;
            sound.play();
            soundStates.isSecondSoundPlayed = true;
          }
        },
        onLeave: () => {
          if (isSoundActive) {
            echoAndPauseSound(sound);
          }
        },
        onLeaveBack: () => {
          if (isSoundActive) {
            echoAndPauseSound(sound);
          }
        },
      },
    })
    .to(chars, {
      color: "#09090a",
      duration: 1.8,
      stagger: 0.065,
    });

  const stickyWrapper = document.querySelector(".we-deliver-sticky");
  const block = document.querySelector(".deliver-slider-block");
  const sliderButtons = document.querySelector("#second-slider-btns");

  const tl_slider = gsap.timeline({
    scrollTrigger: {
      trigger: ".we-del-wrapper",
      start: `9% 80%`,
      end: "95% 80%",
      //markers: true,
      toggleActions: "play reverse play reverse",
      onEnter: async () => {
        const isActive = await checkIsDefaultActive(tl_slider);
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
  initSliderTimelineLogic({
    stickyWrapper,
    block,
    sliderButtons,
    tl_slider,
    initialSwiperSpaceBetween,
    swiper,
  });
  if (previousProgressTime) {
    tl_slider.progress(previousProgressTime);
  }
  return tl_slider;
}

function thirdSliderAnimation(
  gsap,
  swiper,
  initialSwiperSpaceBetween,
  lenis,
  previousProgressTime
) {
  const stickyWrapper = document.querySelector(".real-result-sticky-wrapper");
  const block = document.querySelector(".real-result-slider-block");
  const sliderButtons = document.querySelector("#third-slider-btns");

  const tl_slider = gsap.timeline({
    scrollTrigger: {
      trigger: ".real-story-wrapper",
      start: `9% 80%`,
      end: "90% 80%",
      toggleActions: "play reverse play reverse",
      invalidateOnRefresh: true,
      // markers: true,
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

  initSliderTimelineLogic({
    stickyWrapper,
    block,
    sliderButtons,
    tl_slider,
    initialSwiperSpaceBetween,
    swiper,
  });

  if (previousProgressTime) {
    tl_slider.progress(previousProgressTime);
  }
  return tl_slider;
}

/// full screen slider timeline animation
function initSliderTimelineLogic({
  stickyWrapper,
  block,
  sliderButtons,
  tl_slider,
  initialSwiperSpaceBetween,
  swiper,
}) {
  const initialRadius = 32;
  const fullScreenScale = sliderHelpers.calculateFullScreenSliderScale(block);
  const { x, y } = sliderHelpers.calculateSliderPosition(block, 0);

  let mm = gsap.matchMedia();

  const zoomedSpaceBetweenSlides = sliderHelpers.calculateSpaceBetweenSlides(
    fullScreenScale,
    initialSwiperSpaceBetween
  );

  gsap.set(stickyWrapper, { height: "auto" });

  const windowWidth = window.innerWidth;
  const containerWidth = block.offsetWidth;

  mm.add("(min-width: 991px)", () => {
    tl_slider
      .addLabel("step")
      .to(stickyWrapper, { height: "100vh", duration: 1 }, "step")
      .fromTo(
        block,
        {
          scale: 1,
          x: 0,
          y: 0,
          "--slider-radius": `32px`,
          "--slide-width": "75%",
        },
        {
          scale: fullScreenScale,
          x,
          y,
          "--slider-radius": `${sliderHelpers.calculateSlideBorderRadius(
            fullScreenScale,
            initialRadius
          )}`,
          "--slide-width": `${sliderHelpers.calculateScaledSliderWidth(
            fullScreenScale,
            windowWidth,
            containerWidth
          )}`,
          duration: 1,
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
      .to(sliderButtons, { display: "flex" }, 0)
      .to(
        sliderButtons,
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
      .to(sliderButtons, { display: "flex" }, 0)
      .to(
        sliderButtons,
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
  mm.add("(max-width: 767px)", () => {
    gsap.set(".main-widget", { width: "calc(100% - 24px)" });
    tl_slider
      .addLabel("step")
      .to(
        ".form-widget-content",
        { scale: 0.9, opacity: 0, duration: 0.1 },
        "step"
      )
      .to(".main-widget", { width: 114, duration: 0.2 }, "step")
      .to(".form-widget-content", { display: "none" }, "step")
      .to(sliderButtons, { display: "flex" }, 0)
      .to(
        sliderButtons,
        { opacity: 1, scale: 1, duration: 0.3, delay: 0 },
        "step"
      );
  });
}

function weCollaborateListAnimation(gsap, showAllClients, lenis) {
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
          delay: index * 0.09 + delayOffset,
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
  animateColumn(secondColumnItems, firstColumnItems.length * 0.007);

  const rollDownAutomatically = !cookieHelpers.getCookie(
    "isClientSectionVisited"
  );
  if (rollDownAutomatically) {
    gsap.timeline({
      scrollTrigger: {
        trigger: "#collaborate-items",
        start: "15% 10%",
        end: "25% 10%",
        //markers: true,
        onEnter: async () => {
          const isClientSectionVisited = cookieHelpers.getCookie(
            "isClientSectionVisited"
          );
          if (isClientSectionVisited) {
            return;
          }
          showAllClients();
          await wait(350);
          const element = document.querySelector(".carditems-columns-layout");
          const rect = element.getBoundingClientRect();
          const absoluteTop =
            rect.top + window.scrollY + rect.height - window.innerHeight;

          lenis.scrollTo(absoluteTop, {
            duration: 3.4,
            easing: (t) => 1 - Math.pow(1 - t, 2),
            lock: true,
          });
          cookieHelpers.setCookie("isClientSectionVisited", true, 365);
        },
      },
      id: "we_coll_items",
    });
  }
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
function realStoriesAnimation(gsap) {
  gsap.set(".real-stories h2", { opacity: 0, y: 20 });
  gsap.set(".real-stories h2 .real-results-span", { opacity: 0, y: 20 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".real-stories",
      start: "0% 50%",
      end: "80% 55%",
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
    )
    .fromTo(
      ".real-story-wrapper",
      {
        opacity: 0,
        y: 50,
      },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.3 },
      "step"
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
  const scene3Images = document.querySelectorAll(".scene-3-img");
  const scene4Images = document.querySelectorAll(".scene-4-img");
  const scene1FirstAnimationParams = [
    {
      xPercent: 0,
      yPercent: -25,
      duration: 2,
      delay: 0,
      z: 0,
    },
    {
      xPercent: 0,
      yPercent: -60,
      duration: 2,
      delay: 0,
      z: 0,
    },
    {
      xPercent: 0,
      yPercent: -65,
      duration: 2,
      delay: 0,
      z: 0,
    },
    {
      xPercent: 0,
      yPercent: -40,
      duration: 1.5,
      delay: 0,
      z: 0,
    },
    {
      xPercent: 0,
      yPercent: -100,
      duration: 2,
      delay: 0,
      z: 0,
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
      xPercent: 10,
      yPercent: -40,
      duration: 1,
      delay: 0,
      scale: 1,
    },
    {
      xPercent: 0,
      yPercent: -70,
      duration: 1,
      delay: 0,
      scale: 1,
    },
  ];

  const scene2animationParams = [
    {
      xPercent: -20,
      yPercent: 60,
      rotationX: 0,
      scale: 0.6,
      delay: 0.3,
      z: 3000,
      duration: 6,
    },
    {
      xPercent: 20,
      yPercent: -45,
      rotationX: 0,
      scale: 1,
      delay: 0.3,
      z: 3500,
      duration: 6,
    },
    {
      xPercent: -50,
      yPercent: 60,
      rotationX: 0,
      scale: 0.85,
      delay: 0.6,
      z: 2800,
      duration: 4.5,
    },
  ];
  const scene3animationParams = [
    {
      xPercent: 10,
      yPercent: 25,
      rotationX: 0,
      scale: 0.7,
      delay: 0.6,
      z: 4500,
      duration: 5,
    },
    {
      xPercent: 50,
      yPercent: -15,
      rotationX: 0,
      scale: 1,
      delay: 0.7,
      z: 4800,
      duration: 5.8,
    },
    {
      xPercent: -20,
      yPercent: -25,
      rotationX: 0,
      scale: 1,
      delay: 0.7,
      z: 5300,
      duration: 5.2,
    },
  ];

  const scene4animationParams = [
    {
      xPercent: -40,
      yPercent: 0,
      rotationX: 0,
      scale: 1,
      duration: 4.5,
      z: 5000,
      delay: 0.5,
    },
    {
      xPercent: -120,
      yPercent: -10,
      rotationX: 0,
      scale: 1,
      duration: 4.5,
      z: 5500,
      delay: 0.7,
    },
    // {
    //   xPercent: -50,
    //   yPercent: 120,
    //   rotationX: 0,
    //   scale: 0.6,
    //   duration: 7,
    //   z: 3500,
    //   delay: 1.75,
    // },

    {
      xPercent: 10,
      yPercent: -35,
      rotationX: 0,
      scale: 1,
      duration: 4,
      delay: 0.8,
      z: 5500,
    },
    {
      xPercent: 15,
      yPercent: -20,
      rotationX: 0,
      scale: 1,
      duration: 4,
      z: 5300,
      delay: 0.8,
    },
  ];

  followingCoreAnimation.addEventListener("DOMLoaded", function () {
    const scene1 = document.querySelector(".scrollable-screen-1");
    const scene2 = document.querySelector(".scrollable-screen-2");
    const scene3 = document.querySelector(".scrollable-screen-3");
    const scene4 = document.querySelector(".scrollable-screen-4");
    const fromHumansHeadingTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".from-humans",
        start: "-19% 45%",
        end: "110% 45%",
        defaults: { overwrite: true },
        invalidateOnRefresh: true,
        //markers: true,
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
    gsap.set(scene3Images, {
      transformOrigin: "50% 0%",
      opacity: 0,
    });
    gsap.set(scene4Images, {
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
          scrub: 1.5,
        },
        id: "tl_0",
      });

      gsap.set(scene2Images, { y: -50 });
      gsap.set(scene3Images, {
        y: -50,
        opacity: 0,
        display: "block",
      });
      gsap.set(scene4Images, {
        y: -50,
        opacity: 0,
        display: "block",
      });

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
        .to(scene1, { y: -50, duration: 3 }, "step_1")
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
          scene1,
          {
            z: 1700,
            y: -100,
            duration: 5.5,
          },
          "step_1+=2.1"
        )
        .to(
          scene2Images,
          {
            duration: 1.5,
            delay: (i) => scene2animationParams[i].delay,
            opacity: 1,
          },
          "step_1+=2"
        )

        .to(
          scene2Images,
          {
            xPercent: (i) => scene2animationParams[i].xPercent,
            yPercent: (i) => scene2animationParams[i].yPercent,
            scale: (i) => scene2animationParams[i].scale,
            duration: (i) => scene2animationParams[i].duration,
            delay: (i) => scene2animationParams[i].delay,
            z: (i) => scene2animationParams[i].z,
          },
          "step_1+=2"
        )

        .to(
          scene3Images,
          {
            duration: 1.5,
            opacity: 1,
            delay: (i) => scene3animationParams[i].delay,
          },
          "step_1+=2.6"
        )
        .to(
          scene3Images,
          {
            xPercent: (i) => scene3animationParams[i].xPercent,
            yPercent: (i) => scene3animationParams[i].yPercent,
            scale: (i) => scene3animationParams[i].scale,
            z: (i) => scene3animationParams[i].z,
            duration: (i) => scene3animationParams[i].duration,
            delay: (i) => scene3animationParams[i].delay,
          },
          "step_1+=2.6"
        )
        .to(
          scene4Images,
          {
            duration: 1.5,
            opacity: 1,
            delay: (i) => scene4animationParams[i].delay,
          },
          "step_1+=3.6"
        )

        .to(
          scene4Images,
          {
            xPercent: (i) => scene4animationParams[i].xPercent,
            yPercent: (i) => scene4animationParams[i].yPercent,
            scale: (i) => scene4animationParams[i].scale,
            duration: (i) => scene4animationParams[i].duration,
            delay: (i) => scene4animationParams[i].delay,
            z: (i) => scene4animationParams[i].z,
          },
          "step_1+=3.6"
        )
        .to(
          ".scrollable-sticky-childrens",
          { minHeight: "auto", duration: 0 },
          "step_1+=5.5"
        )
        .to(
          ".scrollable-body .normal-section",
          { opacity: 1, duration: 0.1 },
          "step_1+=5.7"
        )
        .fromTo(
          ".scrollable-body .normal-section",
          { scale: 0.45 },
          { scale: 1, duration: 1.8 },
          "step_1+=5.75"
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
          "step_1+=5.85"
        )
        .fromTo(
          ".brand-shape-wrapper",
          { opacity: 0, scale: 0.96, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5 },
          "step_1+=6.25"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".scrollable-sticky-wrapper",
            start: "bottom-=18% 10%",
            end: "bottom+=10% 10%",
            toggleActions: "play none none reverse",
          },
          id: "tl_1",
        })
        .to(
          followingCorePlayhead,
          {
            frame: followingCoreAnimation.totalFrames - 1,
            ease: "none",
            duration: 1.7,
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
          scrub: 1.5,
        },
        id: "tl_0",
      });

      gsap.set(scene2Images, { y: -50 });
      gsap.set(scene3Images, {
        y: -50,
        opacity: 0,
        display: "block",
      });
      gsap.set(scene4Images, {
        y: -50,
        opacity: 0,
        display: "block",
      });

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
        .to(scene1, { y: -50, duration: 3 }, "step_1")
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
          scene1,
          {
            z: 1700,
            y: -100,
            duration: 5.5,
          },
          "step_1+=2.1"
        )
        .to(
          scene2Images,
          {
            duration: 1.5,
            delay: (i) => scene2animationParams[i].delay,
            opacity: 1,
          },
          "step_1+=2"
        )

        .to(
          scene2Images,
          {
            xPercent: (i) => scene2animationParams[i].xPercent,
            yPercent: (i) => scene2animationParams[i].yPercent,
            scale: (i) => scene2animationParams[i].scale,
            duration: (i) => scene2animationParams[i].duration,
            delay: (i) => scene2animationParams[i].delay,
            z: (i) => scene2animationParams[i].z,
          },
          "step_1+=2"
        )

        .to(
          scene3Images,
          {
            duration: 1.5,
            opacity: 1,
            delay: (i) => scene3animationParams[i].delay,
          },
          "step_1+=2.6"
        )
        .to(
          scene3Images,
          {
            xPercent: (i) => scene3animationParams[i].xPercent,
            yPercent: (i) => scene3animationParams[i].yPercent,
            scale: (i) => scene3animationParams[i].scale,
            z: (i) => scene3animationParams[i].z,
            duration: (i) => scene3animationParams[i].duration,
            delay: (i) => scene3animationParams[i].delay,
          },
          "step_1+=2.6"
        )
        .to(
          scene4Images,
          {
            duration: 1.5,
            opacity: 1,
            delay: (i) => scene4animationParams[i].delay,
          },
          "step_1+=3.6"
        )

        .to(
          scene4Images,
          {
            xPercent: (i) => scene4animationParams[i].xPercent,
            yPercent: (i) => scene4animationParams[i].yPercent,
            scale: (i) => scene4animationParams[i].scale,
            duration: (i) => scene4animationParams[i].duration,
            delay: (i) => scene4animationParams[i].delay,
            z: (i) => scene4animationParams[i].z,
          },
          "step_1+=3.6"
        )
        .to(
          ".scrollable-sticky-childrens",
          { minHeight: "auto", duration: 0 },
          "step_1+=5.5"
        )
        .to(
          ".scrollable-body .normal-section",
          { opacity: 1, duration: 0.1 },
          "step_1+=5.1"
        )
        .fromTo(
          ".scrollable-body .normal-section",
          { scale: 0.45 },
          { scale: 1, duration: 1.8 },
          "step_1+=5.15"
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
          "step_1+=5.25"
        )
        .fromTo(
          ".brand-shape-wrapper",
          { opacity: 0, scale: 0.96, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5 },
          "step_1+=6"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".scrollable-sticky-wrapper",
            start: "bottom-=18% 10%",
            end: "bottom+=10% 10%",
            toggleActions: "play none none reverse",
          },
          id: "tl_1",
        })
        .to(
          followingCorePlayhead,
          {
            frame: followingCoreAnimation.totalFrames - 1,
            ease: "none",
            duration: 1.7,
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

  const tl = gsap
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
  return tl;
}
function footerAnimation(gsap, lenis) {
  const footer = document.querySelectorAll(".footer");
  const widget = document.querySelector(".main-widget");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: footer,
        start: "bottom-=220px bottom",
        end: "101% bottom",
        toggleActions: "play none none reverse",
        invalidateOnRefresh: true,
        //markers: true,
        onEnter: () => {
          const windowWidth = window.innerWidth;
          if (windowWidth < 991) {
            setTimeout(() => {
              openWidget(widget, lenis);
            }, 600);
            return;
          }
          lenis.stop();
          lenis.scrollTo("end", {
            duration: 0.5,
            easing: (t) => 1 - Math.pow(1 - t, 2),
            lock: true,
            force: true,
            onComplete: () => {
              openWidget(widget, lenis);
            },
          });
        },
        onLeaveBack: async () => {
          closeWidget(widget, lenis);
        },
      },
      id: "footer",
    })

    .to(widget, {
      "--main-widget-body-max-height": `calc(100svh - 530px)`,
    });
}

/// helpers
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
function calculateScaledSliderWidth(scale, windowWidth, containerWidth) {
  const oneSliderMaxScaledPercentage = 0.85;

  const oneSliderMaxWidth = windowWidth * oneSliderMaxScaledPercentage;
  const oneSliderMaxScaledWidth = oneSliderMaxWidth / scale;

  return (oneSliderMaxScaledWidth * 100) / containerWidth;
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
  calculateScaledSliderWidth,
};

async function echoAndPauseSound(audioNode) {
  const echoSoundValue = 0.25;
  const echoStepMs = 0.025;
  let currentStepMs = 0;

  while (currentStepMs < echoSoundValue) {
    await wait(100);
    audioNode.volume = echoSoundValue - currentStepMs;

    currentStepMs += echoStepMs;
  }
  audioNode.pause();
}
