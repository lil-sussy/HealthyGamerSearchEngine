import React from "react";

interface BackgroundCircleProps {
  color: string;
  opacity: string;
  top: string;
  left?: string;
  right?: string;
}

const BackgroundCircle: React.FC<BackgroundCircleProps> = ({ color, opacity, top, left, right }) => {
  return (
    <div
      className={`absolute w-[1200px] h-[1200px] ${color} ${opacity} rounded-full`}
      style={{ top, left, right }}
    ></div>
  );
};

const Background = () => {
  return (
    <div className="absolute z-[-10] w-screen h-full top-0 left-0">
      <BackgroundCircle color="bg-green-500" opacity="bg-opacity-40" top="-120" right="-10%" />
      <BackgroundCircle color="bg-purple-500" opacity="bg-opacity-15" top="80" left="-35%" />
      <BackgroundCircle color="bg-green-500" opacity="bg-opacity-40" top="200" right="-30%" />
      <BackgroundCircle color="bg-purple-500" opacity="bg-opacity-15" top="440" left="-40%" />
      <BackgroundCircle color="bg-green-500" opacity="bg-opacity-40" top="680" right="-30%" />
      <BackgroundCircle color="bg-purple-500" opacity="bg-opacity-15" top="840" left="-40%" />
      <BackgroundCircle color="bg-green-500" opacity="bg-opacity-40" top="960" right="-30%" />
    </div>
  );
};

export default Background;