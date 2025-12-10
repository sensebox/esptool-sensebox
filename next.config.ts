import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: '/api/ota',
        destination: 'https://firmware.sensebox.de/mcu-s2/merged-hello.bin',
      },
    ]
  },
}

export default nextConfig
