/** @type {import('next').nextConfig} */
const nextConfig = {
    // This tells Next.js to compile the Shared package as part of the client build
    transpilePackages: ["@treema-todo-assignment/shared"],
  };
  
  export default nextConfig;