"use client";
import React from "react";

import { Container } from "./container";
import type { ContainerState } from "./container";
import { Menu } from "./menu";

export const Example: React.FC = () => {
  const [cstate, setCstate] = React.useState<ContainerState>({
    boxes: {
      'CH-01': { top: 100, left: 120, title: "Drag me around" },
      'CH-02': { top: 200, left: 120, title: "Drag me too" },
      'CH-03': { top: 300, left: 120, title: "Drag me too" },
    },
  });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: 1000,
      }}
    >
      <Container
        hideSourceOnDrag={false}
        cstate={cstate}
        handleCstateChange={setCstate}
      />
      <Menu cstate={cstate} handleCstateChange={setCstate} />
    </div>
  );
};
