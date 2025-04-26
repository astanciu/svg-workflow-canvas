import React from "react";

type CanvasBackgroundProps = Record<string, never>;

/**
 * Component for rendering the canvas background
 * Includes gradient and background rectangle
 */
const CanvasBackground: React.FC<CanvasBackgroundProps> = () => {
  return (
    <>
      <defs>
        <radialGradient
          cx="10.7991175%"
          cy="11.7361177%"
          fx="10.7991175%"
          fy="11.7361177%"
          r="148.107834%"
          gradientTransform="translate(0.107991,0.117361),scale(0.750000,1.000000),rotate(36.579912),translate(-0.107991,-0.117361)"
          id="canvasGradient"
        >
          <stop stopColor="#EFEFEF" offset="0%" />
          <stop stopColor="#CCCCCC" offset="100%" />
        </radialGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        style={{ fill: "url(#canvasGradient)" }}
        data-testid="canvas-background"
      />
    </>
  );
};

export default React.memo(CanvasBackground);
