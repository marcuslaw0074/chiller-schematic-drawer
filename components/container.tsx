import update from "immutability-helper";
import React from "react";
import type { XYCoord } from "react-dnd";
import { useDrop } from "react-dnd";

import { Box } from "./box";
import type { DragItem } from "./interfaces";
import { ItemTypes } from "./itemTypes";

const styles: React.CSSProperties = {
  width: 2000,
  height: 600,
  border: "1px solid black",
  position: "relative",
  backgroundColor: "grey",
  flexDirection: "row",
};

export interface ContainerProps {
  hideSourceOnDrag: boolean;
  cstate: ContainerState;
  handleCstateChange: React.Dispatch<React.SetStateAction<ContainerState>>;
}

export interface ContainerStateBox {
  [key: string]: { top: number; left: number; title: string };
}

export interface ContainerState {
  boxes: ContainerStateBox;
}

export const Container: React.FC<ContainerProps> = ({
  hideSourceOnDrag,
  cstate,
  handleCstateChange,
}) => {
  // const [boxes, setBoxes] = React.useState<ContainerStateBox>({
  //   a: { top: 20, left: 80, title: "Drag me around" },
  //   b: { top: 180, left: 20, title: "Drag me too" },
  // });

  // const moveBox = React.useCallback(
  //   (id: string, left: number, top: number) => {
  //     setBoxes(
  //       update(boxes, {
  //         [id]: {
  //           $merge: { left, top },
  //         },
  //       })
  //     );
  //   },
  //   [boxes, setBoxes]
  // );

  const moveBox = React.useCallback(
    (id: string, left: number, top: number) => {
      handleCstateChange((state) => {
        return update(cstate, {
          boxes: {
            [id]: {
              $merge: { left, top },
            },
          },
        });
      });
    },
    [cstate, handleCstateChange]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );
  return (
    <div ref={drop} style={styles}>
      {Object.keys(cstate.boxes).map((key) => {
        const { left, top, title } = cstate.boxes[key] as {
          top: number;
          left: number;
          title: string;
        };
        return (
          <Box
            key={key}
            id={key}
            left={left}
            top={top}
            hideSourceOnDrag={hideSourceOnDrag}
          >
            {title}
          </Box>
        );
      })}
    </div>
  );
};
