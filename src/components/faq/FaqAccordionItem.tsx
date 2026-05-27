import { ChevronDown } from 'lucide-react';
import type { AnswerBlock } from '../../content/faqData';

interface FaqAccordionItemProps {
  itemId: string;
  question: string;
  answer: AnswerBlock[];
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export default function FaqAccordionItem({ itemId, question, answer, isOpen, onToggle, isLast }: FaqAccordionItemProps) {
  return (
    <div id={itemId} className={!isLast ? 'border-b border-slate-100' : ''}>
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-start justify-between w-full py-5 px-6 text-left group"
        >
          <span className="text-base font-semibold text-slate-900 pr-4 leading-snug group-hover:text-slate-700 transition-colors">
            {question}
          </span>
          <ChevronDown
            size={18}
            className={`mt-0.5 flex-shrink-0 text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 space-y-4">
            {answer.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i} className="list-disc pl-5 space-y-1.5">
                  {block.map((item, j) => (
                    <li key={j} className="text-slate-600 leading-relaxed">{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="text-slate-600 leading-relaxed">{block}</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
