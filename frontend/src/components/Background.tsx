import React from "react";

interface BackgroundCircleProps {
  className: string;
}

const BackgroundCircle: React.FC<BackgroundCircleProps> = ({ className }) => {
  return (
    <div
      className={`absolute w-[1200px] h-[1200px] ${className} rounded-full`}
    ></div>
  );
};

const Background = () => {
  return (
    <div className="absolute z-[-10] w-screen h-full top-0 left-0 bg-white">
      <div className="w-screen h-full blur-3xl ">
        <BackgroundCircle className="bg-primary opacity-40 top-[-120px] left-[40%]" />
        <BackgroundCircle className="bg-secondary opacity-25 top-[80px] left-[-35%]" />
        <BackgroundCircle className="bg-primary opacity-40 bottom-[200px] right-[-30%]" />
        <BackgroundCircle className="bg-secondary opacity-15 bottom-[440px] left-[-40%]" />
        <BackgroundCircle className="bg-primary opacity-40 bottom-[680px] right-[-30%]" />
        <BackgroundCircle className="bg-secondary opacity-15 bottom-[840px] left-[-40%]" />
        <BackgroundCircle className="bg-primary opacity-40 bottom-[960px] right-[-30%]" />
      </div>
    </div>
  );
};

export default Background;