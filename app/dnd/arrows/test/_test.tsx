"use client";
import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";

export type Handler = "top" | "right" | "left" | "bottom";

type ChartType = "chart" | "point";

type ChillerImageType = "ch" | "ct" | "chwp" | "cdwp" | "none";

const ColorMap: Record<string, string> = {
  blue: "red",
  red: "#6ed9ff",
  "#6ed9ff": "#ff6e6e",
  "#ff6e6e": "blue",
};

export interface DashboardProps {}

export interface DashboardChartProps {
  text: string;
  handler: Handler;
  setArrows: React.Dispatch<React.SetStateAction<ArrowState[]>>;
  addArrow: ({ start, end, id }: ArrowState) => void;
  boxId: string;
  status?: number;
  imgType: ChillerImageType;
  style?: React.CSSProperties;
  bounds: Handler[];
  chartType: ChartType;
  position?: any;
  setPosition?: (position: Coordinates) => void;
}

interface ArrowOffset {
  x?: number;
  y?: number;
}

interface Coordinates {
  x: number;
  y: number;
}

interface ArrowPositionState {
  boxId: string;
  arrowPosition: Handler;
  offset: ArrowOffset;
}

export interface ArrowState {
  start: ArrowPositionState;
  end: ArrowPositionState;
  id?: string;
  color: string;
}

const boxStyle: React.CSSProperties = {
  border: "1px solid black",
  position: "relative",
  padding: "20px 10px",
  textAlign: "center",
  // backgroundColor: "white",
  //   height: 10,
  display: "inline-block",
  //   width: 10,
};

const connectPointStyle: React.CSSProperties = {
  position: "absolute",
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "grey",
};
const connectPointOffset = {
  left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
};

export interface ConnectPointsWrapperProps {
  boxId: string;
  handler: Handler;
  dragRef: any;
  boxRef: React.MutableRefObject<HTMLDivElement>;
  chartType: ChartType;
  bound: Handler[];
}

const ConnectPointsWrapper = ({
  boxId,
  handler,
  dragRef,
  boxRef,
  chartType,
  bound,
}: ConnectPointsWrapperProps) => {
  const ref1 = useRef() as React.MutableRefObject<HTMLDivElement>;

  const [position, setPosition] = useState({} as React.CSSProperties);
  const [beingDragged, setBeingDragged] = useState(false);
  return (
    <React.Fragment>
      <div
        id={handler}
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
          e.dataTransfer.setData("arrow::boxId", boxId);
          e.dataTransfer.setData("arrow::chartType", chartType);
          e.dataTransfer.setData("arrow::bound", JSON.stringify(bound || []));
          e.dataTransfer.setData("handler", handler);
        }}
        onDrag={(e) => {
          const { offsetTop, offsetLeft } = boxRef.current;
          const { x, y } = dragRef.current.state;
          // console.log(handler, x, y);
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

function getImagePath(imgType: ChillerImageType, status?: number): string {
  switch (imgType) {
    case "ch":
      return status == 1 ? "/chiller-water-on.svg" : "/chiller-water-off.svg";
    case "ct":
      return status == 1 ? "/cooling_tower-on.svg" : "/cooling_tower-off.svg";
    case "chwp":
      return status == 1 ? "/pump-centr-on.svg" : "/pump-centr-off.svg";
    case "cdwp":
      return status == 1 ? "/pump-centr-on.svg" : "/pump-centr-off.svg";
    case "none":
      return "";
    default:
      return "";
  }
}

const DashboardChart = (props: DashboardChartProps) => {
  const dragRef = useRef() as React.MutableRefObject<Draggable>;
  const boxRef = useRef() as React.MutableRefObject<HTMLDivElement>;
// console.log(props.position)
  return (
    <Draggable
      ref={dragRef}
      defaultPosition={props.position}
      onDrag={(e) => {
        props.setArrows((arrows) => [...arrows]);
      }}
      onStop={(e, element) => {
        // console.log(element);
        if (typeof props.setPosition == "function") {
          props.setPosition(
            {
              x: (e.target as HTMLDivElement).offsetLeft + element.x,
              y: (e.target as HTMLDivElement).offsetTop + element.y,
            }
          )
        }
      }}
    >
      <div
        id={props.boxId}
        ref={boxRef}
        style={{ ...boxStyle, ...props.style }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (e.dataTransfer.getData("arrow::boxId") === props.boxId) {
            // console.log(e.dataTransfer.getData("arrow"), props.boxId);
          } else {
            const bounds = (JSON.parse(
              e.dataTransfer.getData("arrow::bound")
            ) || []) as Handler[];
            const startArrow = e.dataTransfer.getData("handler") as Handler;
            const endArrow = (e.target as HTMLDivElement).getAttribute(
              "id"
            ) as Handler;
            const offsety: ArrowOffset = {
              y:
                -20 +
                40 *
                  (props.bounds?.filter((val) => val == endArrow).length || 0),
            };
            const offsetx: ArrowOffset = {
              x:
                -20 +
                40 *
                  (props.bounds?.filter((val) => val == endArrow).length || 0),
            };
            const offsety_old: ArrowOffset = {
              y:
                -20 +
                40 * (bounds?.filter((val) => val == startArrow).length || 0),
            };
            const offsetx_old: ArrowOffset = {
              x:
                -20 +
                40 * (bounds?.filter((val) => val == startArrow).length || 0),
            };
            // console.log("start bounds: ", bounds, "end bounds: ", props.bounds);
            // console.log("x")
            // console.log(offsetx, offsetx_old)
            // console.log("y")
            // console.log(offsety, offsety_old)
            const refs: ArrowState = {
              start: {
                boxId: e.dataTransfer.getData("arrow::boxId"),
                arrowPosition: startArrow,
                offset:
                  startArrow == "left" || startArrow == "right"
                    ? offsety_old
                    : offsetx_old,
              },
              end: {
                boxId: props.boxId,
                arrowPosition: endArrow,
                offset:
                  endArrow == "left" || endArrow == "right" ? offsety : offsetx,
              },
              color: "blue",
            };
            if (props.chartType == "point") {
              refs.end.offset = {};
            }
            if (e.dataTransfer.getData("arrow::chartType") == "point") {
              refs.start.offset = {};
            }
            refs.id =
              refs.start.boxId +
              "@" +
              refs.start.arrowPosition +
              "@@" +
              refs.end.boxId +
              "@" +
              refs.end.arrowPosition;
            props.addArrow(refs);
            // console.log(props, refs);
          }
        }}
      >
        {props.chartType === "chart" ? null : props.text}
        {props.imgType === "none" ? null : (
          <img
            src={getImagePath(props.imgType, props.status)}
            alt="SVG Image"
            style={{ width: 100, height: 100, pointerEvents: "none" }}
          />
        )}
        {props.chartType === "chart" ? (
          <>
            <ConnectPointsWrapper
              {...{
                boxId: props.boxId,
                handler: "right",
                dragRef,
                boxRef,
                chartType: props.chartType,
                bound: props.bounds,
              }}
            />
            <ConnectPointsWrapper
              {...{
                boxId: props.boxId,
                handler: "left",
                dragRef,
                boxRef,
                chartType: props.chartType,
                bound: props.bounds,
              }}
            />
            <ConnectPointsWrapper
              {...{
                boxId: props.boxId,
                handler: "top",
                dragRef,
                boxRef,
                chartType: props.chartType,
                bound: props.bounds,
              }}
            />
            <ConnectPointsWrapper
              {...{
                boxId: props.boxId,
                handler: "bottom",
                dragRef,
                boxRef,
                chartType: props.chartType,
                bound: props.bounds,
              }}
            />
          </>
        ) : (
          <ConnectPointsWrapper
            {...{
              boxId: props.boxId,
              handler: props.handler,
              dragRef,
              boxRef,
              chartType: props.chartType,
              bound: props.bounds,
            }}
          />
        )}
      </div>
    </Draggable>
  );
};

function to_dict(ls: ArrowState[]): Record<string, Handler[]> {
  var m: Record<string, Handler[]> = {};
  for (let v of ls) {
    if (v.start.boxId in m) {
      m[v.start.boxId].push(v.start.arrowPosition);
    } else {
      m[v.start.boxId] = [v.start.arrowPosition];
    }
    if (v.end.boxId in m) {
      m[v.end.boxId].push(v.end.arrowPosition);
    } else {
      m[v.end.boxId] = [v.end.arrowPosition];
    }
  }
  return m;
}

const Dashboard = (props: DashboardProps) => {
  const [arrows, setArrows] = useState([] as ArrowState[]);
  const addArrow = (arr: ArrowState) => {
    setArrows((state) => {
      return [...state, arr];
    });
  };
  const updateArrowColor = (index: number) => (color: string) => {
    setArrows((state) => {
      state[index].color = color;
      return state;
    });
  };
  const [charts, setCharts] = useState([
    {
      text: "CH-1",
      // setArrows,
      // addArrow,
      handler: "left",
      boxId: "box2_1",
      status: 1,
      imgType: "ch",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 100, y:1000},
    },
    {
      text: "CH-2",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_2",
      status: 1,
      imgType: "ch",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
    {
      text: "CH-3",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_3",
      status: 1,
      imgType: "ch",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
    {
      text: "CHWS",
      // setArrows,
      // addArrow,
      handler: "top",
      boxId: "box2_4",
      status: 1,
      imgType: "none",
      style: { color: "red" },
      bounds: [],
      chartType: "point",
      position: {x: 0, y:0},
    },
    {
      text: "CHWR",
      // setArrows,
      // addArrow,
      handler: "top",
      boxId: "box2_5",
      status: 1,
      imgType: "none",
      style: { color: "red" },
      bounds: [],
      chartType: "point",
      position: {x: 0, y:0},
    },
    {
      text: "CDWS",
      // setArrows,
      // addArrow,
      handler: "top",
      boxId: "box2_6",
      status: 1,
      imgType: "none",
      style: { color: "red" },
      bounds: [],
      chartType: "point",
      position: {x: 0, y:0},
    },
    {
      text: "CDWR",
      // setArrows,
      // addArrow,
      handler: "top",
      boxId: "box2_7",
      status: 1,
      imgType: "none",
      style: { color: "red" },
      bounds: [],
      chartType: "point",
      position: {x: 0, y:0},
    },
    {
      text: "CHWP-3",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_8",
      status: 1,
      imgType: "chwp",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
    {
      text: "CHWP-4",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_9",
      status: 1,
      imgType: "chwp",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
    {
      text: "CT-1",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_10",
      status: 1,
      imgType: "ct",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
    {
      text: "CH-4",
      // setArrows,
      // addArrow,
      handler: "right",
      boxId: "box2_11",
      status: 1,
      imgType: "ch",
      style: { color: "red" },
      bounds: [],
      chartType: "chart",
      position: {x: 0, y:0},
    },
  ] as DashboardChartProps[]);
  const deleteArrow = (ar: ArrowState) => {
    const newArr = [] as ArrowState[];
    for (let arr of arrows) {
      if (!(arr.end == ar.end && arr.start == ar.start && arr.id == ar.id)) {
        newArr.push(arr);
      }
    }
    setArrows(newArr);
  };
  const updateBoxPosition = (index: number) => (position: Coordinates) => {
    setCharts((state) => {
      // console.log("position", position)
      state[index].position = position;
      return state;
    });
  };
  // console.log(charts);
  const boundary_map = to_dict(arrows);
  // console.log(boundary_map);
  return (
    <div style={{ 
      // display: "flex",
      position: "absolute"
      // justifyContent: "space-evenly"
       }}>
      {charts.map((ele, index) => {
        return (
          <DashboardChart
            key={index}
            {...ele}
            bounds={boundary_map[ele.boxId]}
            setPosition={updateBoxPosition(index)}
            setArrows={setArrows}
            addArrow={addArrow}
            // handleChartUpdate={handleChartUpdate(ele.boxId)}
          />
        );
      })}

      {arrows.map((ar, index) => (
        <Xarrow
          start={ar.start.boxId}
          end={ar.end.boxId}
          key={ar.start.boxId + "--" + ar.start.boxId + index}
          color={ar.color}
          path="grid"
          gridBreak="0%"
          startAnchor={{
            position: ar.start.arrowPosition,
            offset: ar.start.offset,
          }}
          endAnchor={{
            position: ar.end.arrowPosition,
            offset: ar.end.offset,
          }}
          dashness={{ animation: true }}
          passProps={{
            onClick: () => {
              updateArrowColor(index)(ColorMap[ar.color]);
              console.log("xarrow clicked!");
            },
            onDoubleClick: () => {
              console.log("xarrow double clicked!");
              deleteArrow(ar);
            },
          }}
        />
      ))}
    </div>
  );
};

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
        {/* <h2>Solution with draggble boxes?</h2> */}
        <Dashboard />
      </div>
    </div>
  );
};
