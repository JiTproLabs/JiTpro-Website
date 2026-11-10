/**
 * THE PROCUREMENT CHAIN'S DRAWING VOCABULARY (Design System Section 51).
 *
 * One definition of how an activity family is coloured and iconised and how
 * a milestone is shaped, shared by every renderer of a procurement chain: the
 * interactive figure (`ProcurementChain`) and the homepage Plan preview
 * (Section 54.4.2). Values are token NAMES, never colours (Section 51.7).
 */

import { Factory, FileText, Handshake, Network, RefreshCw, Search, Truck, type LucideIcon } from 'lucide-react';
import type { PhaseFamily } from '../procurement-schedule/scheduleModel';

export const FAMILY_TOKEN: Partial<Record<PhaseFamily, string>> = {
  buyout: '--jpd-chain-buyout',
  coordination: '--jpd-chain-coordination',
  preparation: '--jpd-chain-preparation',
  review: '--jpd-chain-review',
  revision: '--jpd-chain-revision',
  production: '--jpd-chain-production',
  logistics: '--jpd-chain-logistics',
};
export const tokenFor = (f: PhaseFamily) => FAMILY_TOKEN[f] ?? '--jpd-chain-milestone';

/** One lucide icon per activity family (Section 51.6). */
export const FAMILY_ICON: Partial<Record<PhaseFamily, LucideIcon>> = {
  buyout: Handshake,
  coordination: Network,
  preparation: FileText,
  review: Search,
  revision: RefreshCw,
  production: Factory,
  logistics: Truck,
};

/** Legend copy, per family, for this chain. */
export const FAMILY_LEGEND: Partial<Record<PhaseFamily, { title: string; body: string }>> = {
  buyout: { title: 'Buyout', body: 'Contracting and award' },
  coordination: { title: 'Submittal Coordination', body: 'Align scope, schedule and responsibilities' },
  preparation: { title: 'Submittal Preparation', body: 'Build and compile the submittal package' },
  review: { title: 'Review', body: 'Review the submittal and return comments' },
  revision: { title: 'Revision', body: 'Revise and resubmit against comments' },
  production: { title: 'Fabrication', body: 'Manufacture the custom units' },
  logistics: { title: 'Shipping & Delivery', body: 'Transport and deliver to site' },
};

export const v = (token: string) => `var(${token})`;

/** The segment gradient's bottom stop: the family token darkened 12% (Section 51.4). */
export const gradientBottom = (f: PhaseFamily) => `color-mix(in srgb, ${v(tokenFor(f))} 88%, var(--jpd-text))`;

export const diamond = (x: number, y: number, size: number) => {
  const r = size / 2;
  return `M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`;
};
