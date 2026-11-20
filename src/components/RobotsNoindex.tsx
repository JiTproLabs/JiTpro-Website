import { useEffect } from 'react';

/**
 * Marks the current route noindex, nofollow while it is mounted. The SPA
 * serves one index.html for every path, so the directive is set per route
 * (as the review pages do). Used by /faq-legacy, which renders the original
 * FAQ page unchanged.
 */
export default function RobotsNoindex() {
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);
  return null;
}
