import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Music Inquiry Store",
  description: "Browse music equipment and place inquiries with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
