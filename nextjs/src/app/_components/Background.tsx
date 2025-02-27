import React from "react";


const Background: React.FC = () => {
  return (
    <div className="absolute left-0 top-0 -z-20 h-full w-full overflow-hidden bg-background/20 backdrop-blur-xl">
      <div className="relative h-full w-full">
        {/* NEW: Gradient Circles for blurry variant */}
        <div className="from-accent to-secondary absolute left-0 top-0 h-60 w-60 rounded-full bg-gradient-to-br opacity-50 blur-[300px]"></div>
        <div className="from-secondary to-accent absolute bottom-36 left-0 h-72 w-72 rounded-full bg-gradient-to-tl opacity-50 blur-[300px]"></div>
        <div className="from-secondary-accent absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gradient-to-tl to-accent opacity-50 blur-[300px]"></div>
        <div className="from-secondary-accent absolute right-0 top-72 h-72 w-72 rounded-full bg-gradient-to-tl to-accent opacity-50 blur-[300px]"></div>

        {/* You can add any additional elements or effects for the "blurry" abstraction here */}
      </div>
    </div>
  );
};
export default Background;
