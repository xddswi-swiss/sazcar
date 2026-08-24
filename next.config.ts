import type { NextConfig } from 'next';

const nextConfig = {
  // Add allowedDevOrigins as a top-level config option for HMR cross-origin connections
  allowedDevOrigins: ['192.168.1.141', '192.168.1.8', 'localhost:3000', '127.0.0.1:3000'],
} as any;

export default nextConfig as NextConfig;
