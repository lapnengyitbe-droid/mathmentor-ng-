import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // pure static HTML/CSS/JS — hosts free on Vercel, GitHub Pages, Netlify
  reactStrictMode: true,
};

export default nextConfig;
