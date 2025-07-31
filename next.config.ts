import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'openapi.animal.go.kr',
        port: '',
        pathname: '/openapi/service/rest/fileDownloadSrvc/files/**',
      },
    ],
  },
};

export default nextConfig;
