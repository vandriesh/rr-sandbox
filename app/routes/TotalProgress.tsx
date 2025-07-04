import { useWorkerContext } from "~/routes/WorkerContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import * as React from "react";
import { ProgressItem } from "~/routes/ProgressItem";

export function TotalProgress() {
  const { state } = useWorkerContext();
  const { stats } = state;
  const { progress, total, done } = stats;

  return (
    <ProgressItem progress={progress} color="primary">
      <Box sx={{ minWidth: 55, textAlign: "right" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {done} / {total}
        </Typography>
      </Box>
    </ProgressItem>
  );
}
