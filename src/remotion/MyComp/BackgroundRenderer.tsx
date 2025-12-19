import React from "react";
import { BackgroundStyleType } from "../../../types/constants";
import { SolidBackground } from "./backgrounds/SolidBackground";
import { ShootingStars } from "./backgrounds/ShootingStars";
import { IceGalaxy } from "./backgrounds/IceGalaxy";

export const BackgroundRenderer: React.FC<{
  background: BackgroundStyleType;
}> = ({ background }) => {
  switch (background) {
    case "shooting-stars":
      return <ShootingStars />;
    case "ice-galaxy":
      return <IceGalaxy />;
    case "white":
      return <SolidBackground color="white" />;
    case "black":
    default:
      return <SolidBackground color="black" />;
  }
};
