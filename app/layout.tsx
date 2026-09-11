import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Request account deletion | Little Sign',
  description: 'Request permanent deletion of your Little Sign account by email, without reinstalling the app.',
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
