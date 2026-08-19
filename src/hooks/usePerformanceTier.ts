type PerformanceTier = "full" | "reduced" | "minimal";

const detectWebGLRenderer = (): string => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";
    const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
    if (!ext) return "";
    return (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
  } catch {
    return "";
  }
};

const SOFTWARE_RENDERERS = ["swiftshader", "llvmpipe", "softpipe", "microsoft basic render driver"];

const isTouchPrimary = (): boolean =>
  window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;

const detectTier = (): PerformanceTier => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "minimal";
  }

  // Touch-primary devices (phones/tablets) can't be trusted by hardwareConcurrency/
  // deviceMemory/WebGL-renderer heuristics: Safari never exposes deviceMemory or the
  // WEBGL_debug_renderer_info extension, and modern phone chips report enough cores
  // to dodge the cores check too, so every heuristic below reads as "full power" even
  // though mobile compositors choke on stacked backdrop-filter blur + scroll-linked
  // animation. Cap touch devices at "reduced" regardless of what the score says.
  const touchCeiling: PerformanceTier = isTouchPrimary() ? "reduced" : "full";

  let score = 0;

  const cores = navigator.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 2) score += 2;
  else if (cores <= 4) score += 1;

  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 0;
  if (memory > 0 && memory <= 2) score += 2;
  else if (memory <= 4) score += 1;

  const renderer = detectWebGLRenderer().toLowerCase();
  if (renderer && SOFTWARE_RENDERERS.some((sw) => renderer.includes(sw))) {
    score += 3;
  }

  const scoredTier: PerformanceTier = score >= 3 ? "reduced" : "full";

  return touchCeiling === "reduced" && scoredTier === "full" ? "reduced" : scoredTier;
};

let cachedTier: PerformanceTier | null = null;

const getTier = (): PerformanceTier => {
  if (cachedTier === null) cachedTier = detectTier();
  return cachedTier;
};

const usePerformanceTier = (): PerformanceTier => getTier();

const useIsLowPerformance = (): boolean => getTier() !== "full";

export default usePerformanceTier;
export { useIsLowPerformance };
export type { PerformanceTier };
