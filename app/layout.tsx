import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathMentor-NG | AI Lesson Plan Generator",
  description:
    "AI-powered lesson plan generator for Nigerian primary school mathematics teachers. CRA-structured. Culturally responsive. Developed by T-CEIPEC, Federal University of Education, Pankshin.",
  keywords: ["MathMentor-NG", "Nigerian primary school", "mathematics lesson plan", "CRA method", "T-CEIPEC"],
  authors: [
    { name: "Emmanuel Census Hemba" },
    { name: "Nanpon Gangtak" },
    { name: "Labnen Yoksina Gyitbe" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
