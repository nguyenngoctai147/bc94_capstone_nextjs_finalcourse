import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      },
      {
        protocol: "https",
        hostname: "airbnbnew.cybersoft.edu.vn",
        port: "",
        pathname: "/avatar/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "acihome.vn",
        port: "",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
