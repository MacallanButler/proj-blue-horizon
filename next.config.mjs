/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/blue-horizon',
    images: {
        unoptimized: true
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;