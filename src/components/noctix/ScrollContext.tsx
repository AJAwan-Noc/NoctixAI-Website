"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type Lenis from "lenis";

const ScrollContext = createContext<Lenis | null>(null);

export function ScrollProvider({ lenis, children }: { lenis: Lenis | null; children: ReactNode }) {
  return <ScrollContext.Provider value={lenis}>{children}</ScrollContext.Provider>;
}

export function useLenis() {
  return useContext(ScrollContext);
}
