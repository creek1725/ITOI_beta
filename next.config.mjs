// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: "/api/patent/:path*",  // 클라이언트가 호출할 경로
          destination: `http://plus.kipris.or.kr/kipo-api/kipi/:path*`,  // 실제 KIPRIS API 서버로 경로를 전달
        },
      ];
    },
  };
  
  
 export default nextConfig;
  