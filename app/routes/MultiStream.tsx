import { Box, Button, Container, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useWorkerContext, WorkerProvider } from "./WorkerContext";
import { TotalProgress } from "./TotalProgress";
import { Worker } from "./Worker";

interface Props<T> {
  data: T[];
  handler: (item: T) => Promise<void>;
}

const Row = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
}));

const WorkerManager = () => {
  const { state, start, addWorker } = useWorkerContext();

  const { workers } = state;

  if (state.phase === "init") {
    return (
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Row>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={start}
            >
              Start
            </Button>
          </Row>
          <Row>
            <TotalProgress />
          </Row>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Row>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={addWorker}
          >
            Add
          </Button>
        </Row>
        <Row>
          <TotalProgress />
        </Row>
        {Object.values(workers).map((w) => (
          <Row key={w.id}>
            <Worker id={w.id} count={w.doneJobs.length} />
          </Row>
        ))}
      </Stack>
    </Container>
  );
};

export function MultiStream<T>(props: Props<T>) {
  return (
    <WorkerProvider data={props.data} handler={props.handler}>
      <WorkerManager />
    </WorkerProvider>
  );
}
