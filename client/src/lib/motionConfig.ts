export const motionConfig = {
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  
  easing: {
    smooth: [0.25, 0.1, 0.25, 1],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    sharp: [0.4, 0, 0.2, 1],
  },
  
  variants: {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    fadeInDown: {
      hidden: { opacity: 0, y: -20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    slideInLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    slideInRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    scaleIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    cardHover: {
      rest: { scale: 1, y: 0 },
      hover: { 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      },
    },
    
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
  },
};

export const slideTransition = {
  crossfade: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
  },
  parallax: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
  },
};
