import { TOUR_STEPS } from './steps';

const DONE_KEY = 'netclics-tour-done';
export const tour = $state({ active: false, index: 0 });
export function isTourDone(): boolean {
  try { return localStorage.getItem(DONE_KEY) === '1'; } catch { return false; }
}
export function startTour(): void { tour.index = 0; tour.active = true; }
export function endTour(): void {
  tour.active = false;
  try { localStorage.setItem(DONE_KEY, '1'); } catch { /* Storage may be unavailable. */ }
}
export function nextStep(): void {
  if (tour.index === TOUR_STEPS.length - 1) endTour();
  else tour.index += 1;
}
export function backStep(): void { if (tour.index > 0) tour.index -= 1; }
