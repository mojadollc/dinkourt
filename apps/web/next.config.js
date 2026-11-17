/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@dinkourt/db", "@dinkourt/shared"],
  images: { domains: ["res.cloudinary.com"] },
};

module.exports = nextConfig;
