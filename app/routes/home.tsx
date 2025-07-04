import { MultiStream } from "./MultiStream";

const data = Array(10)
  .fill(0)
  .map((_, i: number) => i);

const handler = (value: number): Promise<void> => {
  console.log("start the job", value);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("done the job", value);
      resolve()
    }, 2000);
  });
};

const StreamsPage = () => {
  return <MultiStream<number> data={data} handler={handler} />;
};

export default StreamsPage;
