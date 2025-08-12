import React from "react";
import FluidCanvas from "./FluidCanvas.jsx";

interface FluidCanvas2Props {
  width?: string;
  height?: string;
}

// Thin wrapper to allow swapping in an alternative implementation later
const FluidCanvas2: React.FC<FluidCanvas2Props> = ({ width = "100%", height = "100%" }) => {
  return <FluidCanvas width={width} height={height} />;
};

export default FluidCanvas2;
