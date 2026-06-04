import { Geist, DM_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Churnfix Recover failed payments before they become churn",
  description: "Churnfix tracks failed subscription payments across your billing stack and helps you recover revenue before customers churn.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
