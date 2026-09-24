import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL("https://www.dontsignthisyet.com"),
  title: "Don't Sign This Yet",
  description: "Understand your vehicle deal before you sign."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
