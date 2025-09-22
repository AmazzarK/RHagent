import React from "react";

// AnimatedBackground: Modern animated gradient blobs with Tailwind keyframes
const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
    {/* Blob 1 */}
    <div className="absolute left-[-20vw] top-[-20vw] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-500 via-blue-300 to-gray-900 opacity-30 blur-3xl animate-blob1 will-change-transform" />
    {/* Blob 2 */}
    <div className="absolute right-[-15vw] top-1/3 w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-gray-900 via-blue-700 to-blue-300 opacity-25 blur-3xl animate-blob2 will-change-transform" />
    {/* Blob 3 */}
    <div className="absolute left-1/2 bottom-[-20vw] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-blue-300 via-gray-200 to-blue-900 opacity-20 blur-2xl animate-blob3 will-change-transform" />
    {/* Optional: Add more blobs for depth */}
  </div>
);

export default AnimatedBackground;
