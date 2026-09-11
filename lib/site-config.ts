/** Fill these public details before publishing the policies for Google Play. */
export const siteConfig = {
  appName: 'Little Sign',
  operatorName: '',
  supportEmail: '',
  // Set the effective date after reviewing the final policies and live services.
  effectiveDate: '',
  updatedDate: '2026-09-10',
  origin: 'https://minggamecn.github.io/little_sign-site',
};
export const policiesAreDraft = !siteConfig.operatorName || !siteConfig.supportEmail || !siteConfig.effectiveDate;
export type Locale = 'en' | 'zh';
export type PageKind = 'privacy' | 'terms' | 'support';
export const pagePath = (kind: PageKind, locale: Locale) => `${locale === 'zh' ? '/zh' : ''}/${kind}`;
