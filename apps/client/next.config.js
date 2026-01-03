/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@treema-todo-assignment/shared"],
  // This helps if you have issues with strict ESM resolution on Render
  typescript: {
    ignoreBuildErrors: false, 
  }
};

export default nextConfig;