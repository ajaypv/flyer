import React from "react";
import { BackgroundStyleType } from "../../../types/constants";
import { SolidBackground } from "./backgrounds/SolidBackground";
import { ShootingStars } from "./backgrounds/ShootingStars";
import { IceGalaxy } from "./backgrounds/IceGalaxy";
import { HyperspeedBackground } from "./backgrounds/HyperspeedBackground";

export const BackgroundRenderer: React.FC<{
  background: BackgroundStyleType;
  speedMultiplier?: number;
}> = ({ background, speedMultiplier = 1 }) => {
  switch (background) {
    case "shooting-stars":
      return <ShootingStars />;
    case "ice-galaxy":
      return <IceGalaxy />;
    case "hyperspeed":
      return <HyperspeedBackground speedMultiplier={speedMultiplier} />;
    case "white":
      return <SolidBackground color="white" />;
    case "black":
    default:
      return <SolidBackground color="black" />;
  }
};
