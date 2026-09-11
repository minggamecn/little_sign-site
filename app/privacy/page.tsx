import { PolicyPage, policyMetadata } from '../PolicyPage';
export const metadata = policyMetadata('privacy', 'en');
export default function Page() { return <PolicyPage kind="privacy" locale="en" />; }
