import Logo from "@/app/_icons/Logo2";
import Image from "next/image";

export const MainImage = ({ loading }: { loading: boolean }) => (
  <div className="relative w-3/4 pl-10 pt-10 sm:w-full md:w-full">
    <div className="absolute left-[-20px] top-[-20px] z-20">
    <Logo className="h-40 w-40" />
  </div>
  <div className="overflow-hidden rounded-[1.5rem] border-8 border-primary box-decoration-slice">
    <Image
      className={`scale-110 ${loading ? "mx-auto w-40" : "mx-auto w-80"}`}
      src={loading ? "/images/drkThinking.png" : "/images/drkStaring.png"}
      alt={loading ? "Dr. K thinking" : "Dr. K staring"}
      width={720}
      height={720}
    />
    </div>
  </div>
);
