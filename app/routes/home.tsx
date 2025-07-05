import { MultiStream } from "./MultiStream";

const data = Array(1097)
  .fill(0)
  .map((_, i: number) => i);

const handler = (value: number): Promise<void> => {
  // console.log(`%c            -- start the job ${value}`, "color:blue");
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log(`%c            -- done the job ${value}`, "color:blue");
      resolve();
    }, 100);
  });
};

const StreamsPage = () => {
  return <MultiStream<number> data={data} handler={handler} />;
};

export default StreamsPage;
