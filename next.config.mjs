/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Match all requests to /api/*
                destination: 'http://localhost:8080/api/:path*', // Proxy to backend on localhost:8080
            },
        ];
    },
};

export default nextConfig;
