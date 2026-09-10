export const metadata = {
  title: "Don't Sign This Yet",
  description: "Understand your vehicle deal before you sign."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
