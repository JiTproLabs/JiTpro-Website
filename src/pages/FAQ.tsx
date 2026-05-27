import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { faqSections } from '../content/faqData';
import FaqAccordionItem from '../components/faq/FaqAccordionItem';

function generateStructuredData() {
  const items = faqSections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer
          .map((block) =>
            Array.isArray(block) ? block.map((b) => `• ${b}`).join('\n') : block
          )
          .join('\n\n'),
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  };
}

interface OpenItem {
  sectionId: string;
  itemIndex: number;
}

export default function FAQ() {
  const [activeSection, setActiveSection] = useState(faqSections[0].id);
  const [openItem, setOpenItem] = useState<OpenItem | null>(null);

  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleToggle = useCallback((sectionId: string, index: number) => {
    setOpenItem((prev) => {
      const isClosing = prev?.sectionId === sectionId && prev?.itemIndex === index;
      return isClosing ? null : { sectionId, itemIndex: index };
    });
  }, []);

  useEffect(() => {
    if (!openItem) return;
    const el = document.getElementById(`faq-${openItem.sectionId}-${openItem.itemIndex}`);
    if (!el) return;

    const stickyHeight = 148;
    const start = performance.now();
    const duration = 800;
    let rafId: number;

    const step = () => {
      const elapsed = performance.now() - start;
      const rect = el.getBoundingClientRect();
      const offset = rect.top - stickyHeight;

      if (Math.abs(offset) > 1) {
        window.scrollBy(0, offset * 0.12);
      }

      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      rafId = requestAnimationFrame(step);
    }, 10);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [openItem]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 148;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const updateScrollIndicators = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollIndicators();
    window.addEventListener('resize', updateScrollIndicators);
    return () => window.removeEventListener('resize', updateScrollIndicators);
  }, [updateScrollIndicators]);

  const scrollNav = useCallback((direction: 'left' | 'right') => {
    const el = navRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-160px 0px -55% 0px' }
    );

    faqSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pill = document.getElementById(`nav-${activeSection}`);
    if (pill) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeSection]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      {/* Hero */}
      <section className="px-6 py-16 md:py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6">
            Understanding JiTpro's procurement control philosophy, operational model, software platform, and margin protection approach.
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Procurement instability is the leading cause of schedule disruption and margin erosion in construction. These questions are organized by category to help contractors, owners, and project teams understand how JiTpro establishes operational control before procurement failures compound.
          </p>
        </div>
      </section>

      {/* Sticky Category Nav */}
      <nav className="sticky top-20 z-40 bg-white border-b border-slate-200" aria-label="FAQ categories">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white/80 to-transparent pr-4">
                <button
                  onClick={() => scrollNav('left')}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}

            <div
              ref={navRef}
              onScroll={updateScrollIndicators}
              className="flex gap-2 py-3 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {faqSections.map((section) => (
                <button
                  key={section.id}
                  id={`nav-${section.id}`}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-amber-50 text-slate-900 border border-amber-200'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-transparent'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white/80 to-transparent pl-4">
                <button
                  onClick={() => scrollNav('right')}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Scroll categories right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* FAQ Sections */}
      <div className="pb-24">
        {faqSections.map((section, sectionIndex) => (
          <section
            key={section.id}
            id={section.id}
            className={`px-6 py-16 ${sectionIndex % 2 === 1 ? 'bg-slate-50' : ''}`}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                {section.title}
              </h2>
              <p className="text-base text-slate-500 leading-relaxed mb-10">
                {section.intro}
              </p>

              <div className="bg-white rounded-lg border border-slate-200">
                {section.items.map((item, itemIndex) => (
                  <FaqAccordionItem
                    key={itemIndex}
                    itemId={`faq-${section.id}-${itemIndex}`}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItem?.sectionId === section.id && openItem?.itemIndex === itemIndex}
                    onToggle={() => handleToggle(section.id, itemIndex)}
                    isLast={itemIndex === section.items.length - 1}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
