'use client';
import { useEffect, useRef, useState } from 'react';
import { SiteLinks } from './SiteLinks';

const copy = {
  en: {
    title: 'Delete your Little Sign account', intro: 'You can delete your account here without installing the app.',
    removes: 'Your account, sign-in sessions and account-linked service records will be permanently deleted.',
    local: 'Cards and notes are stored on your devices. This website cannot erase those local copies. Use “Clear my data on this device” in Little Sign on each device to remove them.',
    retention: 'Deletion removes active account records. Security logs and backups may remain under the hosting and AI providers’ retention rules. No new account record is retained to track this deletion.',
    email: 'Account email address', code: 'Email verification code', send: 'Send a verification code', verify: 'Verify email',
    sent: 'Check your inbox and spam folder. Enter the code sent to', warning: 'This cannot be undone. Once sent, closing this page will not cancel deletion.',
    confirm: 'Permanently delete my account', retry: 'Check and retry deletion', back: 'Use a different email',
    busy: 'Please wait…', deleting: 'Deleting your account…', done: 'Your account is deleted', doneBody: 'Your Little Sign account and its account-linked service records have been removed. You can still use the app as a guest.',
    error: 'We could not confirm completion. Check your connection and try again. If deletion was sent, it may already have finished; checking again is safe.',
    expired: 'Verification expired and the account still exists. Verify your email again to continue.',
    authRequired: 'Verification is no longer valid. Verify your email again. If a deletion request was already sent, it may have completed.',
    invalid: 'That code could not be verified. Check it or request a new one.', wait: 'Please wait before requesting another code.',
    unavailable: 'Account deletion is not available here yet. Please try again later.', cancel: 'Cancel', verified: 'Email verified. You can now delete your account.',
    resume: 'A previous deletion request needs confirmation. Check its result below.', details: 'What deletion means', providers: 'Provider retention information', resend: 'Send another code', countdown: 'Send again in', seconds: 'seconds',
  },
  zh: {
    title: '删除你的 Little Sign 账号', intro: '无需安装应用，就能在这里删除账号。',
    removes: '你的账号、登录状态和账号相关的服务记录将被永久删除。',
    local: '卡牌和笔记保存在你的设备上，本网站无法清除这些本地副本。请在每台设备的 Little Sign 中使用“清除本机数据”移除它们。',
    retention: '删除会移除正在使用的账号记录。安全日志和备份可能按托管与 AI 服务商的规则继续保存。我们不会另外保留账号记录来跟踪这次删除。',
    email: '账号邮箱', code: '邮箱验证码', send: '发送验证码', verify: '验证邮箱', sent: '请查看收件箱和垃圾邮件，输入发送到以下邮箱的验证码',
    warning: '此操作无法撤回。请求发出后，关闭网页也不会取消删除。', confirm: '永久删除我的账号', retry: '查看并重试删除', back: '使用其他邮箱',
    busy: '请稍等……', deleting: '正在删除账号……', done: '账号已删除', doneBody: '你的 Little Sign 账号及相关服务记录已移除。你仍可以以访客身份使用应用。',
    error: '暂时无法确认结果，请检查网络后重试。若已发送删除请求，删除可能已经完成，再次查看不会重复操作。',
    expired: '验证已过期，账号仍然存在。请重新验证邮箱。', authRequired: '验证已失效，请重新验证邮箱。若已发送删除请求，删除可能已经完成。', invalid: '验证码未能通过验证，请核对或重新获取。', wait: '请稍等后再获取验证码。',
    unavailable: '账号删除服务尚未开放，请稍后再试。', cancel: '取消', verified: '邮箱已验证，现在可以删除账号。',
    resume: '上一次删除请求的结果尚未确认，请在下方查看。', details: '删除的范围', providers: '服务商保留规则', resend: '重新发送验证码', countdown: '重新发送还需', seconds: '秒',
  },
};
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const pendingKey = 'little-sign.deletion-ticket.v1';
type Pending = { accountId: string; ticket: string; expiresAt: number; projectUrl: string };
function pending(): Pending | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(pendingKey) ?? 'null');
    return value?.projectUrl === url && typeof value?.ticket === 'string' && typeof value?.accountId === 'string' ? value : null;
  } catch { return null; }
}
export default function DeletionPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const t = copy[language];
  const [stage, setStage] = useState<'email' | 'code' | 'confirm' | 'done'>('email');
  const [email, setEmail] = useState(''); const [code, setCode] = useState('');
  const [token, setToken] = useState(''); const [ticket, setTicket] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false); const active = useRef(false);
  const [error, setError] = useState<keyof typeof copy.en | null>(null);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    // Browser-only preferences and recovery storage are read after hydration.
    const timer = setTimeout(() => {
      if (navigator.language.startsWith('zh')) setLanguage('zh');
      const saved = pending(); if (saved) { setTicket(saved); setStage('confirm'); }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'; }, [language]);
  useEffect(() => {
    if (!remaining) return;
    const timer = setTimeout(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);
  const request = async (path: string, body: unknown, bearer?: string) => {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(`${url}${path}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: anonKey, ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) },
        body: JSON.stringify(body), signal: controller.signal,
      });
      const result = await response.json() as Record<string, unknown>;
      if (!result || typeof result !== 'object') throw new Error('error');
      if (!response.ok) throw new Error(response.status === 429 ? 'wait' : result.error === 'expired' ? 'expired' : result.error === 'authRequired' ? 'authRequired' : path.includes('/verify') ? 'invalid' : 'error');
      return result;
    } finally { clearTimeout(timer); }
  };
  const run = async (work: () => Promise<void>) => {
    if (active.current) return;
    active.current = true; setBusy(true); setError(null);
    try { await work(); } catch (e) {
      const key = e instanceof Error ? e.message : '';
      if (key === 'expired' || key === 'authRequired') { sessionStorage.removeItem(pendingKey); setTicket(null); setToken(''); setCode(''); setStage('email'); }
      setError(key === 'expired' || key === 'authRequired' || key === 'invalid' || key === 'wait' ? key : 'error');
    } finally { active.current = false; setBusy(false); }
  };
  const send = () => run(async () => {
    if (remaining) return;
    await request('/auth/v1/otp', { email: email.trim(), create_user: false });
    setStage('code'); setRemaining(60); setCode('');
  });
  const verify = () => run(async () => {
    const session = await request('/auth/v1/verify', { email: email.trim(), token: code.trim(), type: 'email' });
    const user = session.user as Record<string, unknown> | undefined;
    if (typeof session.access_token !== 'string' || !user?.email_confirmed_at || user.is_anonymous) throw new Error('invalid');
    setToken(session.access_token); setCode(''); setStage('confirm');
  });
  const remove = () => run(async () => {
    let receipt = ticket;
    if (!receipt) {
      const value = await request('/functions/v1/delete-account', { action: 'prepare' }, token);
      if (typeof value.ticket !== 'string' || typeof value.accountId !== 'string' || typeof value.expiresAt !== 'number') throw new Error('error');
      receipt = { ticket: value.ticket, accountId: value.accountId, expiresAt: value.expiresAt, projectUrl: url };
      // Persist before sending the destructive request. If storage fails, do not send it.
      sessionStorage.setItem(pendingKey, JSON.stringify(receipt)); setTicket(receipt);
    }
    const result = await request('/functions/v1/delete-account', { action: 'delete', ticket: receipt!.ticket, confirm: 'DELETE' });
    if (result.deleted !== true || result.accountId !== receipt!.accountId) throw new Error('error');
    sessionStorage.removeItem(pendingKey); setTicket(null); setToken(''); setEmail(''); setStage('done');
  });
  const cancel = () => {
    if (token) void request('/auth/v1/logout?scope=local', {}, token).catch(() => {});
    setToken(''); setCode(''); setStage('email'); setError(null);
  };
  const configured = url.startsWith('https://') && anonKey.length > 0;
  return <main>
    <header><span>Little Sign</span><button className="language" onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}>{language === 'en' ? '简体中文' : 'English'}</button></header>
    <SiteLinks locale={language} current="deletion" />
    <article>
      <p className="eyebrow">{language === 'en' ? 'ACCOUNT & DATA' : '账号与数据'}</p>
      <h1>{stage === 'done' ? t.done : t.title}</h1>
      <p className="intro">{stage === 'done' ? t.doneBody : t.intro}</p>
      {stage !== 'done' && <section aria-labelledby="deletion-details"><h2 id="deletion-details">{t.details}</h2><p>{t.removes}</p><p>{t.local}</p></section>}
      {!configured ? <p role="alert">{t.unavailable}</p> : <div className="form-area">
        {stage === 'email' && <form onSubmit={event => { event.preventDefault(); void send(); }}>
          <label htmlFor="email">{t.email}</label><input id="email" type="email" autoComplete="email" maxLength={254} required value={email} disabled={busy} onChange={event => setEmail(event.target.value)} />
          <button type="submit" disabled={busy || remaining > 0}>{busy ? t.busy : remaining ? `${t.countdown} ${remaining} ${t.seconds}` : t.send}</button>
        </form>}
        {stage === 'code' && <form onSubmit={event => { event.preventDefault(); void verify(); }}>
          <p>{t.sent} <strong>{email.trim()}</strong>.</p><label htmlFor="code">{t.code}</label><input id="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" minLength={6} maxLength={8} required value={code} disabled={busy} onChange={event => setCode(event.target.value)} />
          <button type="submit" disabled={busy}>{busy ? t.busy : t.verify}</button><button type="button" className="secondary" disabled={busy || remaining > 0} onClick={() => void send()}>{remaining ? `${t.countdown} ${remaining} ${t.seconds}` : t.resend}</button>
          <button type="button" className="text-button" disabled={busy} onClick={cancel}>{t.back}</button>
        </form>}
        {stage === 'confirm' && <div><p>{ticket ? t.resume : t.verified}</p><p className="warning">{t.warning}</p><button className="destructive" disabled={busy} onClick={() => void remove()}>{busy ? t.deleting : ticket ? t.retry : t.confirm}</button>{!ticket && <button className="text-button" disabled={busy} onClick={cancel}>{t.cancel}</button>}</div>}
        {error && <p role="alert" className="error">{t[error]}</p>}
        {busy && <output>{t.busy}</output>}
        {stage === 'done' && <output>{t.local}</output>}
      </div>}
      <footer><SiteLinks locale={language} current="deletion" /><p>{t.retention}</p><p>{t.providers}: <a href="https://supabase.com/privacy">Supabase</a> · <a href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html">DeepSeek</a></p></footer>
    </article>
  </main>;
}
