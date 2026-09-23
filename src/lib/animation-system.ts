export type AnimationType =
  | "none"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "float"
  | "reveal";

export type AnimationTrigger = "on-scroll" | "on-load" | "on-hover" | "always";

export interface WidgetAnimationConfig {
  type: AnimationType;
  duration: number; // in milliseconds (e.g. 300, 500, 800)
  delay: number;    // in milliseconds (e.g. 0, 100, 200)
  trigger: AnimationTrigger;
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
}

export const DEFAULT_ANIMATION_CONFIG: WidgetAnimationConfig = {
  type: "fade",
  duration: 400,
  delay: 0,
  trigger: "on-scroll",
  easing: "ease-out",
};

export const ANIMATION_TYPES_LIST: { id: AnimationType; name: string; description: string }[] = [
  { id: "none", name: "No Animation", description: "Static rendering with zero motion delay" },
  { id: "fade", name: "Smooth Fade In", description: "Gradually increases opacity from 0 to 100%" },
  { id: "slide-up", name: "Slide In from Bottom", description: "Rises smoothly upward into view" },
  { id: "slide-down", name: "Slide In from Top", description: "Descends smoothly into viewport" },
  { id: "slide-left", name: "Slide In from Left", description: "Enters from left margin" },
  { id: "slide-right", name: "Slide In from Right", description: "Enters from right margin" },
  { id: "scale", name: "Subtle Scale Zoom", description: "Scales smoothly from 94% to 100%" },
  { id: "float", name: "Continuous Floating Motion", description: "Subtle rhythmic vertical hover wave" },
  { id: "reveal", name: "Curtain Reveal", description: "Expands height from top to bottom" },
];

/**
 * Computes CSS styles and Tailwind utility classes for the configured animation
 */
export function getAnimationStyles(config?: Partial<WidgetAnimationConfig>): {
  className: string;
  style: React.CSSProperties;
} {
  const active = { ...DEFAULT_ANIMATION_CONFIG, ...config };
  if (active.type === "none") {
    return { className: "", style: {} };
  }

  const animationClassMap: Record<AnimationType, string> = {
    none: "",
    fade: "animate-fadeIn",
    "slide-up": "animate-slideUp",
    "slide-down": "animate-slideDown",
    "slide-left": "animate-slideLeft",
    "slide-right": "animate-slideRight",
    scale: "animate-scaleUp",
    float: "animate-bounce",
    reveal: "animate-reveal",
  };

  const selectedClass = animationClassMap[active.type] || "animate-fadeIn";

  return {
    // Note: motion-reduce:transition-none motion-reduce:animate-none ensures prefers-reduced-motion compliance
    className: `transition-all motion-reduce:animate-none motion-reduce:transition-none ${selectedClass}`,
    style: {
      animationDuration: `${active.duration}ms`,
      animationDelay: `${active.delay}ms`,
      animationTimingFunction: active.easing === "spring" ? "cubic-bezier(0.175, 0.885, 0.32, 1.275)" : active.easing,
    },
  };
}
