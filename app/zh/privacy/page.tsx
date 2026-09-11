import { PolicyPage, policyMetadata } from '../../PolicyPage';
export const metadata = policyMetadata('privacy', 'zh');
export default function Page() { return <PolicyPage kind="privacy" locale="zh" />; }
