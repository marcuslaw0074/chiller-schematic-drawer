"use client";
import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import "./styles.css";

const connectPointStyle: React.CSSProperties = {
  position: "absolute",
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "yellow",
};
const connectPointOffset = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  left25: { left: 0, top: "25%", transform: "translate(-50%, -50%)" },
  left75: { left: 0, top: "75%", transform: "translate(-50%, -50%)" },

  right: { left: "100%", top: "25%", transform: "translate(-50%, -50%)" },
  right25: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  right75: { left: "100%", top: "75%", transform: "translate(-50%, -50%)" },

  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  top25: { left: "25%", top: 0, transform: "translate(-50%, -50%)" },
  top75: { left: "75%", top: 0, transform: "translate(-50%, -50%)" },

  bottom: { left: "25%", top: "100%", transform: "translate(-50%, -50%)" },
  bottom25: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
  bottom75: { left: "75%", top: "100%", transform: "translate(-50%, -50%)" },
};

export interface BoxRefProps {
  offsetTop: number;
  offsetLeft: number;
}

export type Handler = "top" | "right" | "left" | "bottom" | "left25"

export interface ConnectPointsWrapperProps {
  boxId: string;
  handler: Handler;
  dragRef: any;
  boxRef: React.MutableRefObject<HTMLDivElement>;
}

const ConnectPointsWrapper = ({
  boxId,
  handler,
  dragRef,
  boxRef,
}: ConnectPointsWrapperProps) => {
  const ref1 = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);
  return (
    <React.Fragment>
      <div
        className="connectPoint"
        style={{
          ...connectPointStyle,
          ...connectPointOffset[handler],
          ...position,
        }}
        draggable
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => {
          setBeingDragged(true);
          e.dataTransfer.setData("arrow", boxId);
        }}
        onDrag={(e) => {
          const { offsetTop, offsetLeft } = boxRef.current;
          const { x, y } = dragRef.current.state;
          setPosition({
            position: "fixed",
            left: e.clientX - x - offsetLeft,
            top: e.clientY - y - offsetTop,
            transform: "none",
            opacity: 0,
          });
        }}
        ref={ref1}
        onDragEnd={(e) => {
          setPosition({});
          setBeingDragged(false);
        }}
      >
        {/* <p style={{color: "red"}}>GAGA</p> */}
      </div>
      {beingDragged ? <Xarrow start={boxId} end={ref1} /> : null}
    </React.Fragment>
  );
};

const boxStyle: React.CSSProperties = {
  border: "1px solid black",
  position: "relative",
  padding: "20px 10px",
  textAlign: "center",
  backgroundColor: "white",
  //   height: 10,
  display: "inline-block",
  //   width: 10,
};

export interface BoxProps {
  text: string;
  handler: Handler;
  setArrows: React.Dispatch<React.SetStateAction<ArrowState[]>>;
  addArrow: ({ start, end }: ArrowState) => void;
  boxId: string;
  status?: number;
  imgType: "ch" | "ct" | "chwp" | "cdwp" | "none";
  style?: React.CSSProperties;
}

const Box = ({
  text,
  handler,
  addArrow,
  setArrows,
  boxId,
  status,
  imgType,
  style,
}: BoxProps) => {
  const dragRef = useRef() as React.MutableRefObject<Draggable>;
  const boxRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  return (
    <Draggable
      ref={dragRef}
      onDrag={(e) => {
        // console.log(e);
        setArrows((arrows) => [...arrows]);
      }}
    >
      <div
        id={boxId}
        ref={boxRef}
        style={{ ...boxStyle, ...style }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (e.dataTransfer.getData("arrow") === boxId) {
            console.log(e.dataTransfer.getData("arrow"), boxId);
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
            addArrow(refs);
            console.log("droped!", refs);
          }
        }}
      >
        {/* {text} */}
        {imgType === "none" ? null : (
          <img
            src={
              status === 1 ? "/chiller-water-on.svg" : "/chiller-water-off.svg"
            }
            alt="SVG Image"
            style={{ width: 100, height: 100, pointerEvents: "none" }}
          />
        )}
        <ConnectPointsWrapper {...{ boxId, handler, dragRef, boxRef }} />
      </div>
    </Draggable>
  );
};

export interface ArrowState {
  start: string;
  end: string;
}

function App() {
  const [arrows, setArrows] = useState([] as ArrowState[]);
  const addArrow = ({ start, end }: ArrowState) => {
    setArrows([...arrows, { start, end }]);
  };
  const deleteArrow = ({ start, end }: ArrowState) => {
    const newArr = [] as ArrowState[];
    for (let arr of arrows) {
      if (!(arr.end == end && arr.start == start)) {
        newArr.push(arr);
      }
    }
    setArrows(newArr);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      {/* two boxes */}
      <Box
        text="CH-1"
        {...{
          addArrow,
          setArrows,
          handler: "left",
          boxId: "box2_1",
          status: 1,
          imgType: "ch",
        }}
      />
      <Box
        text="CH-2"
        {...{
          addArrow,
          setArrows,
          handler: "left",
          boxId: "box2_2",
          status: 0,
          imgType: "ch",
        }}
      />
      <Box
        text="CH-3"
        {...{
          addArrow,
          setArrows,
          handler: "left25",
          boxId: "box2_3",
          status: 0,
          imgType: "ch",
          //   style: {width: 100}
        }}
      />
      <Box
        text=""
        {...{
          addArrow,
          setArrows,
          handler: "top",
          boxId: "box2_4",
          status: 0,
          imgType: "none",
          style: { width: 10, height: 10, backgroundColor: "white" },
        }}
      />
      <Box
        text=""
        {...{
          addArrow,
          setArrows,
          handler: "top",
          boxId: "box2_5",
          status: 0,
          imgType: "none",
          style: { width: 10, height: 10, backgroundColor: "white" },
        }}
      />
      {arrows.map((ar) => (
        <Xarrow
          start={ar.start}
          end={ar.end}
          key={ar.start + "-." + ar.start}
          color="blue"
          path="grid"
          gridBreak="0%"
          dashness={{ animation: true }}
          passProps={{
            onClick: () => console.log("xarrow clicked!"),
            onDoubleClick: () => {
              console.log("xarrow double clicked!");
              deleteArrow(ar);
            },
          }}
        />
      ))}
    </div>
  );
}

export default () => {
  return (
    <div>
      <div
        style={{
          margin: 20,
          border: "1px solid gray",
          padding: 10,
          // backgroundColor: "white",
        }}
      >
        <h2>Solution with draggble boxes?</h2>
        <App />
      </div>
    </div>
  );
};
