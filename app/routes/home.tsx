import { MultiStream } from "./MultiStream";

const data = Array(20)
  .fill(0)
  .map((_, i: number) => i);

const handler = (value: number): Promise<void> => {
  // console.log(`%c            -- start the job ${value}`, "color:blue");
  return new Promise((resolve) => {
    setTimeout(() => {
      // console.log(`%c            -- done the job ${value}`, "color:blue");
      resolve();
    }, 1000);
  });
};

const StreamsPage = () => {
  return <MultiStream<number> data={data} handler={handler} />;
};

export default StreamsPage;
