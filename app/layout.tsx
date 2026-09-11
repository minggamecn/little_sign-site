import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Delete your account | Little Sign',
  description: 'Verify your email and permanently delete your Little Sign account without reinstalling the app.',
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
