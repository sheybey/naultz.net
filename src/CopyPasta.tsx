import { useCallback, useEffect, useRef, useState } from "react";
import type { Pasta } from "./pasta";

interface CopyPastaProps {
  data: Pasta;
  onCategoryClicked?: (category: string) => void;
  linked?: boolean;
}

export default function CopyPasta({
  data,
  onCategoryClicked,
  linked = false,
}: CopyPastaProps) {
  const [copied, setCopied] = useState<number>();
  const ref = useRef<HTMLAnchorElement>(null);

  const clearCopied = useCallback(() => {
    setCopied(undefined);
  }, [setCopied]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(data.pasta).then(() => {
      if (copied !== undefined) {
        window.clearTimeout(copied);
      }
      setCopied(window.setTimeout(clearCopied, 2000));
    });
  }, [data, copied, setCopied, clearCopied]);

  useEffect(() => {
    if (copied !== undefined) {
      return () => window.clearTimeout(copied);
    }
  }, [copied]);

  let classNames =
    "text-[14px] w-91 p-3 rounded-xl bg-gray-900 outline-blue-400 relative";
  if (linked) {
    classNames += " outline-1";
  }

  useEffect(() => {
    if (linked && ref.current) {
      ref.current.scrollIntoView();
    }
  }, [linked]);

  return (
    <>
      <div className="text-xs px-3 mb-1 flex justify-between">
        <button
          className="cursor-pointer"
          onClick={useCallback(() => {
            onCategoryClicked?.(data.category);
          }, [onCategoryClicked, data])}
        >
          {data.category}
        </button>
        <a id={`pasta-${data.key}`} href={`#pasta-${data.key}`} ref={ref}>
          link
        </a>
      </div>
      <div className={classNames}>
        <span className="text-red-600 font-bold">
          <img
            className="inline mr-1 mb-.5 align-middle"
            alt="Moderator"
            srcSet="https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1 1x, https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2 2x, https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3 4x"
          />
          <img
            className="inline mr-1 mb-.5 align-middle"
            alt="cheer 1000"
            srcSet="https://static-cdn.jtvnw.net/badges/v1/c85036c4-c45a-4992-9458-c288362a2ef8/1 1x, https://static-cdn.jtvnw.net/badges/v1/c85036c4-c45a-4992-9458-c288362a2ef8/2 2x, https://static-cdn.jtvnw.net/badges/v1/c85036c4-c45a-4992-9458-c288362a2ef8/3 4x"
          />
          <img
            className="inline mr-1 mb-.5 align-middle"
            alt="3-year subscriber"
            srcSet="https://static-cdn.jtvnw.net/badges/v1/1120e5f1-3d25-4386-bb87-ef2acce9e45a/1 1x, https://static-cdn.jtvnw.net/badges/v1/1120e5f1-3d25-4386-bb87-ef2acce9e45a/2 2x, https://static-cdn.jtvnw.net/badges/v1/1120e5f1-3d25-4386-bb87-ef2acce9e45a/3 4x"
          />
          naultz24
        </span>
        {": "}
        {data.pasta}
        <button
          className="text-xl rounded-xl cursor-pointer transition-all absolute w-full h-full left-0 top-0 bg-transparent text-transparent outline-1 hover:outline-gray-300 hover:text-inherit hover:bg-black/70"
          onClick={copy}
        >
          {copied === undefined ? "Copy" : "Copied!"}
        </button>
      </div>
    </>
  );
}
