import { Box } from "@mui/material";
import { useEffect } from "react";
import { percent, useWorkerContext, type WorkerId } from "./WorkerContext";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { ProgressItem } from "./ProgressItem";

interface WorkerProps {
  id: WorkerId;
  count: number;
}

export function Worker({ id, count }: WorkerProps) {
  const { state, startAJob } = useWorkerContext();
  const { stats, workers } = state;
  const { currentJob } = workers[id];

  const progress = percent(state.workers[id].doneJobs.length, stats.total);

  useEffect(() => {
    if (currentJob === null) {
      startAJob(id);
    }
  }, [currentJob]);

  return (
    <ProgressItem progress={progress} color="secondary">
      <Box sx={{ minWidth: 35, textAlign: "right" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {/*[{worker.doneJobs.join(',')} : {worker.currentJob}] */}
          {count}
        </Typography>
      </Box>
    </ProgressItem>
  );
}
