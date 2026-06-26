import { useScrollHeight } from "./hooks";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function ScrollToTop() {
  const visible = useScrollHeight() !== 0;
  const classes = visible ? "opacity-60" : "opacity-0 pointer-events-none";

  return (
    <button
      title="Scroll to top"
      className={`fixed bottom-3 right-3 w-8 h-8 outline-current outline-1 cursor-pointer rounded-sm transition-opacity ${classes}`}
      onClick={scrollToTop}
    >
      ↑
    </button>
  );
}
