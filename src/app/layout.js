import "./globals.css";

export const metadata = {
  title: "Churnfix — Recover failed payments before they become churn",
  description: "Churnfix tracks failed subscription payments across your billing stack and helps you recover revenue before customers churn.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
