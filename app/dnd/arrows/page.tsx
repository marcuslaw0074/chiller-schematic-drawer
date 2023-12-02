"use client";
import { Box } from "@/components/box";
import { ItemTypes } from "@/components/itemTypes";
import type { DragItem } from "@/components/interfaces";
import { ArcherContainer, ArcherElement } from "react-archer";
import { DndProvider, XYCoord, useDrop } from "react-dnd";
import React from "react";
import update from "immutability-helper";
import { ContainerState } from "@/components/container";
import { HTML5Backend } from "react-dnd-html5-backend";

const rootStyle = { display: "flex", justifyContent: "center" };
const rowStyle = {
  margin: "200px 0",
  display: "flex",
  justifyContent: "space-between",
};
const boxStyle = { padding: "10px", border: "1px solid black" };

const App = () => {
  const [cstate, setCstate] = React.useState<ContainerState>({
    boxes: {
      "CH-01": { top: 100, left: 120, title: "Drag me around" },
      "CH-02": { top: 200, left: 120, title: "Drag me too" },
      "CH-03": { top: 300, left: 120, title: "Drag me too" },
    },
  });
  const moveBox = React.useCallback(
    (id: string, left: number, top: number) => {
      setCstate((state) => {
        return update(cstate, {
          boxes: {
            [id]: {
              $merge: { left, top },
            },
          },
        });
      });
    },
    [cstate, setCstate]
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
    <div style={{ height: "500px", margin: "50px", width: 1000 }}>
      <ArcherContainer strokeColor="red">
        <div style={rootStyle}>
          <ArcherElement
            id="root"
            relations={[
              {
                targetId: "element2",
                targetAnchor: "top",
                sourceAnchor: "bottom",
                style: { strokeDasharray: "5,5" },
              },
            ]}
          >
            <div style={boxStyle}>Root</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement
            id="element2"
            relations={[
              {
                targetId: "element3",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: { strokeColor: "blue", strokeWidth: 1 },
                label: <div style={{ marginTop: "-20px" }}>Arrow 2</div>,
              },
            ]}
          >
            <div ref={drop} style={boxStyle}>
              <Box
                key={"element2"}
                id={""}
                left={10}
                top={10}
                hideSourceOnDrag={false}
              ></Box>
            </div>

            {/* <div style={boxStyle}>Element 2</div> */}
          </ArcherElement>

          <ArcherElement id="element3">
            <div style={boxStyle}>Element 3</div>
          </ArcherElement>

          <ArcherElement
            id="element4"
            relations={[
              {
                targetId: "root",
                targetAnchor: "right",
                sourceAnchor: "left",
                label: "Arrow 3",
              },
            ]}
          >
            <div style={boxStyle}>Element 4</div>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default () => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </div>
  );
};
