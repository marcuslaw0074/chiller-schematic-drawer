"use client";
import { ContainerState } from "@/components/container";
import { MenuSlider } from "@/components/slider";
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  const loading = false;
  const [cstate, setCstate] = React.useState<ContainerState>({
    boxes: {
      a: { top: 100, left: 120, title: "Drag me around" },
      b: { top: 200, left: 120, title: "Drag me too" },
      c: { top: 300, left: 120, title: "Drag me too" },
    },
  });
  return (
    <Card
      key={"a"}
      style={{
        backgroundColor: "white",
        height: 160,
        width: 400,
        top: "50%",
        alignItems: "center",
        justifyContent: "center",
        padding: "20 20 20 20",
      }}
    >
      {/* <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
            <Avatar
              alt="Ted talk"
              src="/chiller-water-off.svg"
            />
          )
        }
        action={
          loading ? null : (
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            "Ted"
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            "5 hours ago"
          )
        }
      /> */}
      <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
      <Stack spacing={2} style={{ padding: "10 10 10 10" }}>
        <Divider></Divider>
        <MenuSlider
          cstate={cstate}
          handleCstateChange={setCstate}
          boxKey="left"
          boxName={"a"}
        ></MenuSlider>
        <MenuSlider
          cstate={cstate}
          handleCstateChange={setCstate}
          boxKey="top"
          boxName={"a"}
        ></MenuSlider>
      </Stack>
    </Card>
  );
}

export default App;
