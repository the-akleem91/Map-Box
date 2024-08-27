import { Image } from "expo-image";
import React from "react";

export default function HeaderLogo() {
  return (
    <Image
      source={require("@/assets/images/ip-logo2.svg")}
      style={{
        width: 56,
        height: 32,
        marginRight: 12,
      }}
      contentFit="fill"
    />
  );
}
