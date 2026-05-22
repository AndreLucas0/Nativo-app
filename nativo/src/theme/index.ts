import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radii } from './radii';
import { shadows } from './shadows';

export const theme = {
  colors,
  spacing,
  typography,
  radii,
  shadows,
};

export type Theme = typeof theme;