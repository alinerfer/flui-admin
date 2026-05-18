import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pontos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
