import Link from 'next/link';
import { pagePath, type Locale, type PageKind } from '../lib/site-config';
const labels = {
  en: { privacy: 'Privacy policy', terms: 'Terms of service', support: 'Support', deletion: 'Delete account' },
  zh: { privacy: '隐私政策', terms: '服务条款', support: '帮助与联系', deletion: '删除账号' },
};
export function SiteLinks({ locale, current }: { locale: Locale; current?: PageKind | 'deletion' }) {
  return <nav aria-label={locale === 'en' ? 'Policies and support' : '政策与帮助'} className="site-links">
    {(['privacy', 'terms', 'support'] as const).map(kind => <Link key={kind} href={pagePath(kind, locale)} aria-current={current === kind ? 'page' : undefined}>{labels[locale][kind]}</Link>)}
    <Link href="/" aria-current={current === 'deletion' ? 'page' : undefined}>{labels[locale].deletion}</Link>
  </nav>;
}
