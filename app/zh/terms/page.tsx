import { PolicyPage, policyMetadata } from '../../PolicyPage';
export const metadata = policyMetadata('terms', 'zh');
export default function Page() { return <PolicyPage kind="terms" locale="zh" />; }
