import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image hosts currently returned by the Cybersoft location API.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "airbnbnew.cybersoft.edu.vn",
        port: "",
        pathname: "/images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/images",
        // Google thumbnail URLs include a dynamic query string.
      },
      {
        protocol: "https",
        hostname: "airbnbnew.cybersoft.edu.vn",
        port: "",
        pathname: "/avatar/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
