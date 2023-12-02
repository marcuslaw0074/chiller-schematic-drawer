"use client";
import React from "react";
import type { ContainerState } from "./container";
import { Stack, Container, Card, Typography, Divider } from "@mui/material";
import { MenuSlider } from "@/components/slider";

const styles: React.CSSProperties = {
  //   backgroundColor: "white",
  flexDirection: "row",
  width: 900,
};

export interface MenuProps {
  cstate: ContainerState;
  handleCstateChange: React.Dispatch<React.SetStateAction<ContainerState>>;
}

export const Menu: React.FC<MenuProps> = (props) => {
  React.useEffect(() => {
    // console.log(props.cstate.boxes["a"].top);
  }, [props.cstate.boxes]);
  return (
    <>
      <div style={styles}>
        <Stack spacing={2}>
          {Object.keys(props.cstate.boxes).map((ele, _) => {
            return (
              <Card
                key={ele}
                style={{
                  backgroundColor: "white",
                  height: 120,
                  top: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20 20 20 20",
                }}
              >
                <Typography
                  sx={{ fontSize: 18, pl: 2 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {ele}
                </Typography>
                <Divider></Divider>
                <MenuSlider {...props} boxKey="left" boxName={ele}></MenuSlider>
                <MenuSlider {...props} boxKey="top" boxName={ele}></MenuSlider>
              </Card>
            );
          })}
        </Stack>
      </div>
    </>
  );
};
