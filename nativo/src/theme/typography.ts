import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  display: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    color: '#FAFAFA',
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#FAFAFA',
  },

  headline: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#FAFAFA',
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#FAFAFA',
  },

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#A6A6A6',
  },

  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#1A1A1A',
  },
};