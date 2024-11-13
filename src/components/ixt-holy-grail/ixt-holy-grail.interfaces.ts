// src/components/ixt-holy-grail/ixt-holy-grail.interfaces.ts

export type HolyGrailArea = 'H' | 'L' | 'C' | 'R' | 'F';
export type HolyGrailRow = [HolyGrailArea, HolyGrailArea, HolyGrailArea];
export type HolyGrailTemplate = [HolyGrailRow, HolyGrailRow, HolyGrailRow];

export interface HolyGrailConfig {
  template?: HolyGrailTemplate;
  /* We can add more config options later like:
   * - gap sizes
   * - column/row proportions
   * - responsive breakpoints
   */
}
