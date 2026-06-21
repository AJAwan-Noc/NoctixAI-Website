const THREE_CLOCK_DEPRECATION =
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";
const REACT_DEVTOOLS_PROMPT = "Download the React DevTools for a better development experience";
const THREE_MULTIPLE_INSTANCES = "WARNING: Multiple instances of Three.js being imported.";
const THREE_CONTEXT_LOST = "THREE.WebGLRenderer: Context Lost.";
const SPLINE_VERSION_UPDATE = /^updating from\s+\d+\s+to\s+\d+$/;

function shouldIgnoreConsoleMessage(args: unknown[]) {
  const message = args
    .filter((arg): arg is string => typeof arg === "string")
    .join(" ")
    .trim();

  return (
    message.includes(THREE_CLOCK_DEPRECATION) ||
    message.includes(REACT_DEVTOOLS_PROMPT) ||
    message.includes(THREE_MULTIPLE_INSTANCES) ||
    message.includes(THREE_CONTEXT_LOST) ||
    SPLINE_VERSION_UPDATE.test(message)
  );
}

declare global {
  interface Window {
    __noctixConsoleFilterInstalled?: boolean;
  }
}

if (typeof window !== "undefined" && !window.__noctixConsoleFilterInstalled) {
  window.__noctixConsoleFilterInstalled = true;

  const log = console.log.bind(console);
  const info = console.info.bind(console);
  const warn = console.warn.bind(console);

  console.log = (...args: unknown[]) => {
    if (!shouldIgnoreConsoleMessage(args)) {
      log(...args);
    }
  };

  console.info = (...args: unknown[]) => {
    if (!shouldIgnoreConsoleMessage(args)) {
      info(...args);
    }
  };

  console.warn = (...args: unknown[]) => {
    if (!shouldIgnoreConsoleMessage(args)) {
      warn(...args);
    }
  };
}

export {};
