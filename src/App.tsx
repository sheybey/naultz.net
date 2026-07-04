import { useEffect, useState } from "react";
import type { Pasta } from "./pasta";
import { parseCsv } from "./csv";
import Loading from "./Loading";
import Pastas from "./Pastas";

export default function App() {
  const [pasta, setPasta] = useState<Pasta[]>();
  const [error, setError] = useState<string>();

  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/pasta.csv", { signal: controller.signal })
      .then(async (response) => {
        const lengthHeader = response.headers.get("content-length");
        const length = lengthHeader ? parseInt(lengthHeader, 10) : 0;
        if (length < 1) {
          throw new Error("Rotten pasta - try refreshing!");
        }
        const bytes = new Uint8Array(length);
        setTotal(length);
        let p = 0;
        for await (const chunk of response.body!) {
          if (controller.signal.aborted) return "";
          bytes.set(chunk, p);
          p += chunk.length;
          setProgress(p);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
      })
      .then((csv) => {
        if (controller.signal.aborted) return;
        setPasta(
          parseCsv(csv).map((r, i) => ({
            key: i,
            category: r[0],
            pasta: r[1],
          })),
        );
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError("unknown error :(");
          }
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="container m-auto h-full">
      {pasta ? (
        <Pastas pastas={pasta} />
      ) : (
        <div className="my-8 text-center">
          {error ? (
            <span>error: {error}</span>
          ) : (
            <Loading progress={progress} total={total} />
          )}
        </div>
      )}
    </div>
  );
}
