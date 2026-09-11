import { PolicyPage, policyMetadata } from '../PolicyPage';
export const metadata = policyMetadata('support', 'en');
export default function Page() { return <PolicyPage kind="support" locale="en" />; }
