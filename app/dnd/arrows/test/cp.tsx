"use client";
import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import Draggable from "react-draggable";
import ChartData from "@/assets/json/charts.json";
import ArrowsData from "@/assets/json/arrows.json";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Card,
  Divider,
  Grid,
  Paper,
  Slider,
  Stack,
  Tab,
  Tabs,
  TextField,
  styled,
} from "@mui/material";

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

export interface DashboardChartState {
  text: string;
  handler: Handler;
  boxId: string;
  status?: number;
  imgType: ChillerImageType;
  style?: React.CSSProperties;
  bounds: Handler[];
  chartType: ChartType;
  position?: any;
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
  return (
    <>
      <Draggable
        ref={dragRef}
        defaultPosition={props.position}
        onDrag={(e) => {
          props.setArrows((arrows) => [...arrows]);
        }}
        onStop={(e, element) => {
          // console.log(element);
          if (typeof props.setPosition == "function") {
            props.setPosition({
              x: element.x,
              y: element.y,
            });
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
                    (props.bounds?.filter((val) => val == endArrow).length ||
                      0),
              };
              const offsetx: ArrowOffset = {
                x:
                  -20 +
                  40 *
                    (props.bounds?.filter((val) => val == endArrow).length ||
                      0),
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
                    endArrow == "left" || endArrow == "right"
                      ? offsety
                      : offsetx,
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
            <div
              onClick={(e) => {
                console.log(e);
              }}
            >
              <img
                src={getImagePath(props.imgType, props.status)}
                alt="SVG Image"
                style={{ width: 100, height: 100, pointerEvents: "none" }}
              />
            </div>
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
    </>
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface EditDialogProps {
  charts: DashboardChartState[];
  arrows: ArrowState[];
  addCharts: (chart: DashboardChartState) => void;
}

function EditDialog(props: EditDialogProps) {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("md");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAddChart = (imgType: ChillerImageType, chartType: ChartType) => {
    props.addCharts({
      text: "",
      handler: "top",
      boxId: "",
      status: 1,
      imgType: imgType,
      style: {
        color: "red",
      },
      bounds: [],
      chartType: chartType,
      position: {
        x: 0,
        y: 0,
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFullWidth(event.target.checked);
  };

  return (
    <div style={{}}>
      <Stack>
        <Button variant="outlined" onClick={handleClickOpen}>
          <AddIcon></AddIcon>
          Add Equipments
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            console.log(JSON.stringify(props.charts));
            console.log(JSON.stringify(props.arrows));
          }}
        >
          <SaveIcon></SaveIcon>
          Save
        </Button>
      </Stack>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          style={
            {
              // backgroundColor: "rgb(29, 84, 79)"
            }
          }
        >
          Edit
        </DialogTitle>
        <Divider />
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Equipment" {...a11yProps(0)} />
          {/* <Tab label="Data" {...a11yProps(1)} /> */}
        </Tabs>
        <DialogContent
          style={
            {
              // backgroundColor: "rgb(29, 84, 79)"
            }
          }
        >
          <Card>
            <Box sx={{ m: 2, ml: 10 }} />
            <Stack direction="row">
              <Grid container>
                <Grid item xs={3}>
                  Chiller
                </Grid>
                <Grid item xs={3}>
                  Cooling Tower
                </Grid>
                <Grid item xs={3}>
                  CHWP & CDWP
                </Grid>
                <Grid item xs={3}>
                  Node
                </Grid>
              </Grid>
            </Stack>
            {/* <Box sx={{ m: 2 }} /> */}
            <Stack direction="row" style={{ height: 200 }}>
              <Grid container>
                <Grid item xs={3}>
                  <Button
                    onClick={() => {
                      handleAddChart("ch", "chart");
                      handleClose();
                    }}
                  >
                    <img
                      src={"/chiller-water-on.svg"}
                      alt="SVG Image"
                      style={{ width: 200, height: 200, pointerEvents: "none" }}
                    />
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={() => {
                      handleAddChart("ct", "chart");
                      handleClose();
                    }}
                  >
                    <img
                      src={"/cooling_tower-on.svg"}
                      alt="SVG Image"
                      style={{ width: 200, height: 200, pointerEvents: "none" }}
                    />
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={() => {
                      handleAddChart("chwp", "chart");
                      handleClose();
                    }}
                  >
                    <img
                      src={"/pump-centr-on.svg"}
                      alt="SVG Image"
                      style={{ width: 200, height: 200, pointerEvents: "none" }}
                    />
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    onClick={() => {
                      handleAddChart("none", "point");
                      handleClose();
                    }}
                  >
                    <div
                      style={{ ...connectPointStyle, alignContent: "center" }}
                    ></div>
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Card>
          {/* <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: "max-width",
                  id: "max-width",
                }}
              >
                <MenuItem value={false as any}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              sx={{ mt: 1 }}
              control={
                <Switch checked={fullWidth} onChange={handleFullWidthChange} />
              }
              label="Full width"
            />
          </Box> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Dashboard = (props: DashboardProps) => {
  const [arrows, setArrows] = useState(ArrowsData as ArrowState[]);
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
  const [charts, setCharts] = useState(ChartData as DashboardChartState[]);
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
  const addCharts = (chart: DashboardChartState) => {
    setCharts((state) => {
      chart.boxId = "box2_" + (state.length + 1);
      return [...state, chart];
    });
  };
  // console.log(JSON.stringify(charts));
  // console.log(JSON.stringify(arrows));
  const boundary_map = to_dict(arrows);
  // console.log(boundary_map);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          // display: "flex",
          position: "absolute",
          // justifyContent: "space-evenly"
        }}
      >
        {charts.map((ele, index) => {
          return (
            <DashboardChart
              key={index}
              {...ele}
              bounds={boundary_map[ele.boxId]}
              setPosition={updateBoxPosition(index)}
              setArrows={setArrows}
              addArrow={addArrow}
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
            animateDrawing
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
      <EditDialog {...{ charts, arrows, addCharts }}></EditDialog>
    </div>
  );
};

export default () => {
  return (
    <Stack direction="row">
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
    </Stack>
  );
};
