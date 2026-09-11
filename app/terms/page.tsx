import { PolicyPage, policyMetadata } from '../PolicyPage';
export const metadata = policyMetadata('terms', 'en');
export default function Page() { return <PolicyPage kind="terms" locale="en" />; }
