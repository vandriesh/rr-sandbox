import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type PropsWithChildren,
  useCallback,
  useEffect,
} from "react";
import { Worker } from "~/routes/Worker";

export type WorkerId = number;

interface Worker {
  id: WorkerId;
  doneJobs: number[];
  currentJob: number | null;
}

interface State {
  phase: "init" | "running" | "finished";
  workers: Record<WorkerId, Worker>;
  lastWorkerToFinishAJob: WorkerId | null;
  stats: {
    total: number;
    done: number;
    // inprogress: number;
    progress: number;
  };
}

type Action =
  | { type: "START" }
  | { type: "START_JOB"; workerId: WorkerId; jobId: number }
  | { type: "FINISH_JOB"; workerId: WorkerId; jobId: number }
  | { type: "ADD_WORKER" };

interface WorkerContextValue {
  state: State;
  start: () => void;
  addWorker: () => void;
  startAJob: (workerId: WorkerId) => void;
}

const initialState: State = {
  phase: "init",
  workers: [],
  lastWorkerToFinishAJob: null,
  stats: {
    progress: 0,
    total: 0,
    // inprogress: 0,
    done: 0,
  },
};

export function percent(done: number, total: number) {
  return (done / total) * 100;
}

function workerReducer(state: State, action: Action): State {
  console.log("action", action);

  switch (action.type) {
    case "START": {
      return {
        ...state,
        phase: "running",
      };
    }
    case "ADD_WORKER": {
      const newWorkerId = Object.keys(state.workers).length;

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
      const { workerId } = action;

      const newJobId = state.stats.done + 1;
      const worker = state.workers[workerId];
      const stats = state.stats

      let nextState = {
        ...state,
        workers: {
          ...state.workers,
          [workerId]: {
            ...worker,
            currentJob: newJobId,
          },
        },
        stats: {
          ...stats,
          // inprogress: stats.inprogress + 1,
        }
      };

      console.log("nextState", nextState);
      return nextState;
    }
    case "FINISH_JOB": {
      const { workerId, jobId } = action;

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
        stats: {
          ...state.stats,
          done,
          // inprogress: state.stats.inprogress - 1,
          progress: percent(done, state.stats.total),
        },
        lastWorkerToFinishAJob: workerId,
      };

      console.log("nextState", newState);
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
      // inprogress: 0,
      done: 0,
      progress: 0,
    },
  });
  const { stats, lastWorkerToFinishAJob } = state;
  // const { done, total, inprogress } = stats;
  const { done, total } = stats;

  const start = () => dispatch({ type: "START" });

  const startAJob = useCallback(
    async (workerId: WorkerId) => {
      let newJobIndex = done + 1;
      // let newJobIndex = done + inprogress + 1;
      const nextJob = data[newJobIndex];
      if (!nextJob) {
        console.log(`%c all done ${stats.done} (BACK 1)`, "color:violet");
        return;
      }
      console.log("nextJob", newJobIndex);
      dispatch({ type: "START_JOB", workerId, jobId: newJobIndex });
      await handler(data[newJobIndex]);
      dispatch({ type: "FINISH_JOB", workerId, jobId: newJobIndex });
    },
    [done, total, data, handler]
    // [done, total, data, handler, inprogress]
  );

  useEffect(() => {
    if (lastWorkerToFinishAJob === null) {
      return;
    }
/*

    if (done >= total) {
      console.log(`%c all done ${stats.done} (EFFECT 1)`, "color:violet");
      return;
    }

    console.log(`%c current done ${stats.done}`, "color:violet");
*/
    async function runNextJob(freeWorker: WorkerId) {
      await startAJob(freeWorker);
    }

    void runNextJob(lastWorkerToFinishAJob);
  }, [lastWorkerToFinishAJob, startAJob]);

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
