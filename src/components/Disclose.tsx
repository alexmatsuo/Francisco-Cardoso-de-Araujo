import { ImgHTMLAttributes, useState } from "react";

import { cn } from "@/lib/utils";

export default function DiscloseImage({
  className,
  doorClassName,
  vertical = false,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  doorClassName?: string;
  vertical?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const baseClassName =
    "ease-slow duration-mid absolute bg-black transition-all animate-out fill-mode-forwards";

  return (
    <div className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        onLoad={() => setImageLoaded(true)}
        {...props}
        className={cn("h-full w-full object-cover", className)}
      />

      {imageLoaded && (
        <>
          {/* First door: left (horizontal) or top (vertical) */}
          <div
            className={cn(baseClassName, doorClassName, {
              "slide-out-to-top-full": vertical,
              "slide-out-to-left-full": !vertical,
            })}
            style={
              vertical
                ? { top: 0, left: 0, right: 0, height: "calc(50% + 1px)" }
                : { top: "-1px", bottom: "-1px", left: 0, width: "50%" }
            }
          />
          {/* Second door: right (horizontal) or bottom (vertical) */}
          <div
            className={cn(baseClassName, doorClassName, {
              "slide-out-to-bottom-full": vertical,
              "slide-out-to-right-full": !vertical,
            })}
            style={
              vertical
                ? { bottom: 0, left: 0, right: 0, height: "calc(50% + 1px)", top: "calc(50% - 1px)" }
                : { top: "-1px", bottom: "-1px", right: 0, width: "50%" }
            }
          />
        </>
      )}
    </div>
  );
}