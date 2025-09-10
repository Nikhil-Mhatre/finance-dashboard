/**
 * Utility functions for the AI Finance Dashboard
 * Contains helper functions for styling, formatting, and common operations
 *
 * @author Finance Dashboard Team
 * @version 1.0.0
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes safely
 * Prevents class conflicts and ensures proper styling
 *
 * @param {...ClassValue[]} inputs - CSS class names or conditional classes
 * @returns {string} Merged and deduplicated class string
 *
 * @example
 * cn('px-4 py-2', 'bg-blue-500', condition && 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency values with proper locale and symbol
 *
 * @param {number} amount - The monetary amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(1000, 'EUR', 'de-DE') // Returns "1.000,00 €"
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Formats percentage values with specified decimal places
 *
 * @param {number} value - The percentage value (as decimal, e.g., 0.15 for 15%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 *
 * @example
 * formatPercentage(0.1567) // Returns "15.67%"
 * formatPercentage(0.1567, 1) // Returns "15.7%"
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats large numbers with appropriate suffixes (K, M, B)
 *
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string with suffix
 *
 * @example
 * formatLargeNumber(1500) // Returns "1.5K"
 * formatLargeNumber(1500000) // Returns "1.5M"
 */
export function formatLargeNumber(num: number, decimals: number = 1): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toString();
}

/**
 * Calculates percentage change between two values
 *
 * @param {number} oldValue - The previous value
 * @param {number} newValue - The current value
 * @returns {number} Percentage change (as decimal)
 *
 * @example
 * calculatePercentageChange(100, 120) // Returns 0.2 (20% increase)
 * calculatePercentageChange(120, 100) // Returns -0.167 (16.7% decrease)
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 1 : 0;
  return (newValue - oldValue) / oldValue;
}

/**
 * Debounces function calls to prevent excessive execution
 * Useful for search inputs and API calls
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 *
 * @example
 * const debouncedSearch = debounce((query) => searchAPI(query), 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Generates random colors for charts and visualizations
 *
 * @param {number} count - Number of colors to generate
 * @param {number} opacity - Opacity level (0-1, default: 1)
 * @returns {string[]} Array of RGBA color strings
 *
 * @example
 * generateChartColors(5) // Returns ['rgba(255,99,132,1)', ...]
 */
export function generateChartColors(
  count: number,
  opacity: number = 1
): string[] {
  const colors = [
    `rgba(255, 99, 132, ${opacity})`, // Red
    `rgba(54, 162, 235, ${opacity})`, // Blue
    `rgba(255, 205, 86, ${opacity})`, // Yellow
    `rgba(75, 192, 192, ${opacity})`, // Teal
    `rgba(153, 102, 255, ${opacity})`, // Purple
    `rgba(255, 159, 64, ${opacity})`, // Orange
    `rgba(199, 199, 199, ${opacity})`, // Grey
    `rgba(83, 102, 255, ${opacity})`, // Indigo
  ];

  // If we need more colors than predefined, generate random ones
  while (colors.length < count) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  }

  return colors.slice(0, count);
}
