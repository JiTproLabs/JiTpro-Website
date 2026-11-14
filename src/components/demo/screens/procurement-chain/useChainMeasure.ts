import { useEffect, useMemo, useState } from 'react';
import { FONT, type Measure } from './chainLayout';

/** Canvas text measurement for the chain layout, re-run once the chain's fonts have loaded. */
export function useChainMeasure(): Measure {
  const [fontsLoaded, setFontsLoaded] = useState(0);
  useEffect(() => {
    let live = true;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) return;
    Promise.all(Object.values(FONT).map((f) => fonts.load(f)))
      .catch(() => undefined)
      .then(() => live && setFontsLoaded((n) => n + 1));
    return () => {
      live = false;
    };
  }, []);
  return useMemo<Measure>(() => {
    void fontsLoaded; // a new measurer once fonts arrive
    const ctx = document.createElement('canvas').getContext('2d');
    const cache = new Map<string, number>();
    return (text, font) => {
      const key = `${font}|${text}`;
      let w = cache.get(key);
      if (w === undefined) {
        if (!ctx) return text.length * 7;
        ctx.font = font;
        w = ctx.measureText(text).width;
        cache.set(key, w);
      }
      return w;
    };
  }, [fontsLoaded]);
}
