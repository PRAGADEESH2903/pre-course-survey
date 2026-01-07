import "./globals.css";

export const metadata = {
  title: "Pre-Course Survey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
