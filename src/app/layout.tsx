import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SciRouter — The Unified API for Scientific Computing",
  description:
    "One API key. Every science model. Any agent. Protein folding, molecular docking, ADME prediction, and drug-likeness scoring through a single API.",
  openGraph: {
    title: "SciRouter — The Unified API for Scientific Computing",
    description:
      "One API key. Every science model. Any agent. Protein folding, molecular docking, ADME prediction, and drug-likeness scoring through a single API.",
    type: "website",
    url: "https://scirouter.ai",
    siteName: "SciRouter",
  },
  twitter: {
    card: "summary_large_image",
    title: "SciRouter — The Unified API for Scientific Computing",
    description:
      "One API key. Every science model. Any agent. Protein folding, molecular docking, ADME prediction, and drug-likeness scoring through a single API.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fira+Code:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ backgroundColor: "#020405", margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
