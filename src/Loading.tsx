import { useId } from "react";

interface LoadingProps {
  progress: number;
  total: number;
}

export default function Loading({ progress, total }: LoadingProps) {
  const progressId = useId();
  return (
    <>
      <div className="text-2xl">
        <label htmlFor={progressId}>Loading</label>...
        <span className="ml-3 inline-block animate-spin">🍝</span>
      </div>
      <progress id={progressId} max={total > 0 ? total : undefined} value={progress} />
    </>
  );
}
