import { theme, THEMES } from '../stores/theme';

export const getThemeClass = (lightClass, darkClass) => {
  return `${lightClass} dark:${darkClass}`;
};

export const getThemeColor = (lightColor, darkColor) => {
  return `text-${lightColor} dark:text-${darkColor}`;
};

export const getThemeBg = (lightBg, darkBg) => {
  return `bg-${lightBg} dark:bg-${darkBg}`;
};

export const getThemeBorder = (lightBorder, darkBorder) => {
  return `border-${lightBorder} dark:border-${darkBorder}`;
};

export const isDarkMode = () => {
  return $theme === THEMES.DARK || ($theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
}; 