import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copperway Car Wash - Professional Car Care Services',
  description: 'Book professional car wash services with Copperway Car Wash. Quality service, easy booking, and excellent customer care.',
  keywords: 'car wash, car cleaning, vehicle service, booking system, Zambia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
