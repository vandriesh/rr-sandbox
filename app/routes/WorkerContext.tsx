import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type PropsWithChildren,
  useCallback,
} from "react";
import { Worker } from "~/routes/Worker";

export type WorkerId = string;
export type JobId = string;

interface Worker {
  id: WorkerId;
  doneJobs: JobId[];
  currentJob: JobId | null;
}

interface State {
  phase: "init" | "running" | "finished";
  workers: Record<WorkerId, Worker>;
  newJobIndex: number;
  jobs: Record<JobId, WorkerId>;
  stats: {
    total: number;
    done: number;
    progress: number;
  };
}

type Action =
  | { type: "START" }
  | { type: "START_JOB"; workerId: WorkerId; jobId: JobId }
  | { type: "FINISH_JOB"; workerId: WorkerId; jobId: JobId }
  | { type: "ADD_WORKER" };

interface WorkerContextValue {
  state: State;
  start: () => void;
  addWorker: () => void;
  startAJob: (workerId: WorkerId, src?: string) => void;
}

const initialState: State = {
  phase: "init",
  workers: {},
  newJobIndex: 0,
  jobs: {},
  stats: {
    progress: 0,
    total: 0,
    done: 0,
  },
};

export function percent(done: number, total: number) {
  return (done / total) * 100;
}

function workerReducer(state: State, action: Action): State {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        phase: "running",
      };
    }
    case "ADD_WORKER": {
      const newWorkerId = `w${Object.keys(state.workers).length}`;

      return {
        ...state,
        workers: {
          ...state.workers,
          [newWorkerId]: {
            id: newWorkerId,
            doneJobs: [],
            currentJob: null,
          },
        },
      };
    }
    case "START_JOB": {
      const { workerId, jobId } = action;

      const worker = state.workers[workerId];
      const stats = state.stats;

      let nextState = {
        ...state,
        newJobIndex: state.newJobIndex + 1,
        workers: {
          ...state.workers,
          [workerId]: {
            ...worker,
            currentJob: jobId,
          },
        },
        jobs: {
          ...state.jobs,
          [jobId]: workerId,
        },
        stats: {
          ...stats,
        },
      };

      //      console.log("after START_JOB nextState", nextState);
      return nextState;
    }
    case "FINISH_JOB": {
      const { workerId, jobId } = action;
      const { [jobId]: _, ...jobsLeft } = state.jobs;

      const worker = state.workers[workerId];
      const done = state.stats.done + 1;

      let newState = {
        ...state,
        workers: {
          ...state.workers,
          [workerId]: {
            ...worker,
            doneJobs: [...worker.doneJobs, jobId],
            currentJob: null,
          },
        },
        jobs: jobsLeft,
        stats: {
          ...state.stats,
          done,
          progress: percent(done, state.stats.total),
        },
      };

      // console.log("nextState", newState);
      return newState;
    }
    default:
      return state;
  }
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

interface ProviderProps<T> {
  data: T[];
  handler: (item: T) => Promise<void>;
}
export function WorkerProvider<T>({
  children,
  data,
  handler,
}: PropsWithChildren<ProviderProps<T>>) {
  const [state, dispatch] = useReducer(workerReducer, {
    ...initialState,
    stats: {
      total: data.length,
      done: 0,
      progress: 0,
    },
  });
  const { stats, newJobIndex } = state;
  const { total } = stats;

  const start = useCallback(() => dispatch({ type: "START" }), []);

  const startAJob = useCallback(
    async (workerId: WorkerId, src?: string) => {
      if (newJobIndex >= data.length) {
        // console.log(
        //   `%c [src:${src}] all done ${stats.done} jobs in progress ${currentJobsInProgress} , total: ${total}`,
        //   "color:violet"
        // );
        return;
      }

      dispatch({ type: "START_JOB", workerId, jobId: `j${newJobIndex}` });
      await handler(data[newJobIndex]);
      dispatch({ type: "FINISH_JOB", workerId, jobId: `j${newJobIndex}` });
    },
    [newJobIndex, total, data, handler]
  );

  const addWorker = () => {
    dispatch({ type: "ADD_WORKER" });
  };

  const value = useMemo<WorkerContextValue>(
    () => ({
      state,
      startAJob,
      start,
      addWorker,
    }),
    [state]
  );

  return (
    <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>
  );
}

export const useWorkerContext = (): WorkerContextValue => {
  const ctx = useContext(WorkerContext);

  if (!ctx) {
    throw new Error("useWorkerContext must be used within a WorkerProvider");
  }

  return ctx;
};
