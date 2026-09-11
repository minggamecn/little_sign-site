import Link from 'next/link';
import type { Metadata } from 'next';
import { contentFor } from './policy-content';
import { SiteLinks } from './SiteLinks';
import { siteConfig, policiesAreDraft, pagePath, type Locale, type PageKind } from '../lib/site-config';
export function policyMetadata(kind: PageKind, locale: Locale): Metadata {
  const content = contentFor(kind, locale);
  return {
    title: `${content.title} | Little Sign`,
    description: content.intro,
    robots: { index: !policiesAreDraft, follow: true },
    alternates: {
      canonical: siteConfig.origin + pagePath(kind, locale),
      languages: { en: siteConfig.origin + pagePath(kind, 'en'), 'zh-CN': siteConfig.origin + pagePath(kind, 'zh') },
    },
  };
}
export function PolicyPage({ kind, locale }: { kind: PageKind; locale: Locale }) {
  const page = contentFor(kind, locale);
  const zh = locale === 'zh';
  return <main lang={zh ? 'zh-CN' : 'en'} id="main-content">
    <header><Link className="brand" href="/">Little Sign</Link><Link className="language" href={pagePath(kind, zh ? 'en' : 'zh')} lang={zh ? 'en' : 'zh-CN'}>{zh ? 'English' : '简体中文'}</Link></header>
    <SiteLinks locale={locale} current={kind} />
    <article className="policy">
      <p className="eyebrow">Little Sign</p>
      <h1>{page.title}</h1>
      <p className="intro">{page.intro}</p>
      <p className="policy-date">{zh ? '更新日期：' : 'Last updated: '}{siteConfig.updatedDate}{siteConfig.effectiveDate && <> · {zh ? '生效日期：' : 'Effective: '}{siteConfig.effectiveDate}</>}</p>
      {policiesAreDraft && <aside className="draft-notice" aria-label={zh ? '草稿说明' : 'Draft notice'}>{zh ? '发布前草稿：运营者、联系邮箱和生效日期尚待填写，服务商保留规则尚待确认。' : 'Pre-publication draft: operator, contact email, and effective date are still to be supplied; provider retention arrangements remain to be confirmed.'}</aside>}
      <nav className="contents" aria-label={zh ? '本页目录' : 'On this page'}><h2>{zh ? '本页内容' : 'On this page'}</h2><ol>{page.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
      {page.sections.map(section => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}><h2 id={`${section.id}-title`}>{section.title}</h2>{section.content}</section>)}
    </article>
    <footer><SiteLinks locale={locale} current={kind} /><p>Little Sign</p></footer>
  </main>;
}
