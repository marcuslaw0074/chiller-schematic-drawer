"use client";
import React from "react";
import { useDrag } from "react-dnd";

import { ItemTypes } from "./itemTypes";

const style: React.CSSProperties = {
  position: "absolute",
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  cursor: "move",
};

export interface BoxProps {
  id: any;
  left: number;
  top: number;
  hideSourceOnDrag?: boolean;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  children,
}) => {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }
  return (
    <>
      <div
        className="box"
        ref={drag}
        style={{ ...style, left, top }}
        data-testid="box"
      >
        <img
          ref={imageRef}
          src="/chiller-water-off.svg"
          alt="SVG Image"
          style={{ width: 100, height: 100 }}
          draggable
        />
      </div>
    </>
  );
};
