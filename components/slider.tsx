"use client";
import update from "immutability-helper";
import React from "react";
import {
  Grid,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";

import { ContainerState } from "@/components/container";

export type MenuBoxKey = "top" | "left";
export type MenuBoxKeyAxis = "X" | "Y";

export interface MenuSliderProps {
  style?: React.CSSProperties;
  boxKey: MenuBoxKey;
  boxName: string;
  cstate: ContainerState;
  handleCstateChange: React.Dispatch<React.SetStateAction<ContainerState>>;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const MenuSlider: React.FC<MenuSliderProps> = (props) => {
//   console.log(props);
  return (
    <>
      <Stack direction="row" sx={{ pl:2, pr: 2 }} >
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Item>{props.boxKey == "top" ? "Y" : "X"}</Item>
          </Grid>
          <Grid item xs={7}>
            <Slider
              value={props.cstate.boxes[props.boxName][props.boxKey]}
              aria-label="Default"
              max={1000}
              // valueLabelDisplay="auto"
              style={
                props.style ||
                {
                  //   padding: "50 50 20 20",
                  //   border: "3px solid green",
                  //   margin: "50 50 20 20",
                }
              }
              onChange={(_, value) => {
                if (typeof value === "number") {
                  props.handleCstateChange(() => {
                    return update(props.cstate, {
                      boxes: {
                        [props.boxName]: {
                          $merge: { [props.boxKey]: value },
                        },
                      },
                    });
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="outlined-basic"
              size="small"
              style={{ backgroundColor: "white", padding: "20 20 20 20" }}
              value={props.cstate.boxes[props.boxName][props.boxKey]}
              onChange={(event) => {
                props.handleCstateChange(() => {
                  return update(props.cstate, {
                    boxes: {
                      [props.boxName]: {
                        $merge: { [props.boxKey]: Number(event.target.value) },
                      },
                    },
                  });
                });
              }}
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};
