'use client';
import { useEffect, useState } from 'react';
import { SiteLinks } from './SiteLinks';
import { siteConfig } from '../lib/site-config';

const days = siteConfig.deletionResponseDays;
const copy = {
  en: {
    eyebrow: 'ACCOUNT & DATA', title: 'Request deletion of your Little Sign account',
    intro: 'You can request deletion here by email without installing the app. Deletion is permanent.',
    inApp: 'Fastest route: in the app, open Settings → Delete my account. After email verification the account is deleted immediately.',
    details: 'What deletion means',
    removes: 'Your account, sign-in sessions and account-linked service records are permanently deleted.',
    local: 'Cards and notes are stored on your devices. Deletion cannot erase those local copies. Use “Clear my data on this device” in Little Sign on each device to remove them.',
    how: 'How to request deletion by email',
    step1a: 'Send an email from the address you use to sign in to Little Sign to ', step1b: ' with the subject ',
    subject: 'Delete my Little Sign account',
    step2: 'We verify ownership by the sending address and may reply to confirm the request. We never ask for a verification code or password.',
    step3: `We delete the account and its account-linked service records within ${days} days of receiving a verifiable request, then reply to confirm. This cannot be undone.`,
    noAccess: 'If you can no longer send from the account address, explain this in your message. We need to establish ownership and cannot delete an account based only on an address someone else supplies.',
    open: 'Open my email app with the request', fallback: 'If the button does not open an email app, copy this message:',
    body: 'Please permanently delete my Little Sign account.\nAccount email: (the address you sign in with — send this message from that address)\n',
    retention: 'Deletion removes active account records. Security logs and backups may remain under the hosting and AI providers’ retention rules. No new account record is retained to track this deletion.',
    providers: 'Provider retention information',
  },
  zh: {
    eyebrow: '账号与数据', title: '申请删除你的 Little Sign 账号',
    intro: '无需安装应用，你可以在这里通过邮件申请删除账号。删除后无法恢复。',
    inApp: '最快的方式：在应用中打开“设置 → 删除账号”，验证邮箱后立即删除。',
    details: '删除的范围',
    removes: '你的账号、登录状态和账号相关的服务记录将被永久删除。',
    local: '卡牌和笔记保存在你的设备上，删除账号无法清除这些本地副本。请在每台设备的 Little Sign 中使用“清除本机数据”移除它们。',
    how: '如何通过邮件申请删除',
    step1a: '使用你登录 Little Sign 的邮箱，发送邮件至 ', step1b: '，主题填写',
    subject: '删除我的 Little Sign 账号',
    step2: '我们通过发件邮箱确认账号归属，并可能回信确认你的请求。我们不会索要验证码或密码。',
    step3: `收到可核实的请求后，我们会在 ${days} 天内删除账号及相关服务记录，并回信确认。此操作无法撤回。`,
    noAccess: '如果你已无法使用该账号邮箱发信，请在邮件中说明。我们需要确认账号归属，不能仅凭他人提供的邮箱地址删除账号。',
    open: '打开邮件应用并填好申请', fallback: '如果按钮无法打开邮件应用，请复制以下内容：',
    body: '请永久删除我的 Little Sign 账号。\n账号邮箱：（你登录所用的邮箱——请使用该邮箱发送本邮件）\n',
    retention: '删除会移除正在使用的账号记录。安全日志和备份可能按托管与 AI 服务商的规则继续保存。我们不会另外保留账号记录来跟踪这次删除。',
    providers: '服务商保留规则',
  },
};

export default function DeletionRequestPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const t = copy[language];
  useEffect(() => {
    // Browser-only language preference is read after hydration.
    const timer = setTimeout(() => { if (navigator.language.startsWith('zh')) setLanguage('zh'); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'; }, [language]);
  const mailto = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
  return <main>
    <header><span>Little Sign</span><button className="language" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>{language === 'en' ? '简体中文' : 'English'}</button></header>
    <SiteLinks locale={language} current="deletion" />
    <article>
      <p className="eyebrow">{t.eyebrow}</p>
      <h1>{t.title}</h1>
      <p className="intro">{t.intro}</p>
      <p>{t.inApp}</p>
      <section aria-labelledby="deletion-details"><h2 id="deletion-details">{t.details}</h2><p>{t.removes}</p><p>{t.local}</p></section>
      <section aria-labelledby="deletion-how"><h2 id="deletion-how">{t.how}</h2>
        <ol>
          <li>{t.step1a}<a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>{t.step1b}<strong>“{t.subject}”</strong>.</li>
          <li>{t.step2}</li>
          <li>{t.step3}</li>
        </ol>
        <p className="form-area"><a className="button" href={mailto}>{t.open}</a></p>
        <p>{t.fallback}</p>
        <pre className="template">{`${t.subject}\n\n${t.body}`}</pre>
        <p className="warning">{t.noAccess}</p>
      </section>
      <footer><SiteLinks locale={language} current="deletion" /><p>{t.retention}</p><p>{t.providers}: <a href="https://supabase.com/privacy">Supabase</a> · <a href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html">DeepSeek</a></p></footer>
    </article>
  </main>;
}
