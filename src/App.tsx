import { useEffect, useState } from "react";
import type { Pasta } from "./pasta";
import { parseCsv } from "./csv";
import Loading from "./Loading";
import Pastas from "./Pastas";

export default function App() {
  const [pasta, setPasta] = useState<Pasta[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/pasta.csv", { signal: controller.signal })
      .then((response) => response.text())
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
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("unknown error :(");
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
          {error ? <span>error: {error}</span> : <Loading />}
        </div>
      )}
    </div>
  );
}
