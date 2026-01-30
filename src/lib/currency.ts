import { useTranslation } from "react-i18next";

/**
 * Format currency amount with proper EGP formatting
 * Handles both English (en-EG) and Arabic (ar-EG) locales
 * @param amount - The numeric amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  options: {
    showSymbol?: boolean;
    locale?: string;
    currencyCode?: string;
  } = {},
): string => {
  const { showSymbol = true, locale = "en-EG", currencyCode = "EGP" } = options;

  // Use Intl.NumberFormat for proper locale-aware formatting
  // This ensures correct thousands and decimal separators
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // Enable thousands separator
  });

  const formattedNumber = formatter.format(amount);

  // Manually add the currency symbol/code to avoid formatting issues
  if (showSymbol) {
    // For Arabic, place currency code after the number
    if (locale.includes("ar")) {
      return `${formattedNumber} ${currencyCode}`;
    }
    // For English, place currency code before the number
    return `${currencyCode} ${formattedNumber}`;
  }

  return formattedNumber;
};

/**
 * Hook to get currency formatting based on current locale
 */
export const useCurrencyFormat = () => {
  const { t, i18n } = useTranslation();

  const currentLocale = i18n.language === "ar" ? "ar-EG" : "en-EG";
  const currencyCode = t("currency.code"); // Get currency code from i18n

  return (amount: number, showSymbol = true) =>
    formatCurrency(amount, { showSymbol, locale: currentLocale, currencyCode });
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatCurrency or useCurrencyFormat hook instead
 */
export const formatPrice = formatCurrency;
