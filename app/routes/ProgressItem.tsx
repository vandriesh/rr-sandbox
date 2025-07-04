import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress, {
  type LinearProgressProps,
} from "@mui/material/LinearProgress";
import type { PropsWithChildren } from "react";

interface OwnProps {
  progress: number;
}

type Props = PropsWithChildren<Pick<LinearProgressProps, "color"> & OwnProps>;

export function ProgressItem({ progress, children, color }: Props) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 55 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {progress.toFixed(2)}%
          </Typography>
        </Box>

        <Box sx={{ minWidth: 55, textAlign: "right" }}>{children}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={color}
          />
        </Box>
      </Box>
    </>
  );
}
