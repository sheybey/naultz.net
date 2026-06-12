import {
  prepareWithSegments,
  layoutNextLineRange,
  type LayoutCursor,
} from "@chenglou/pretext";
import { useCallback, useMemo, useState, type MouseEvent } from "react";
import type { Pasta } from "./pasta";
import { useDebounce, useWidth } from "./hooks";
import CopyPasta from "./CopyPasta";
import Dialog from "./Dialog";

interface PastasProps {
  pastas: Pasta[];
}

export default function Pastas({ pastas }: PastasProps) {
  const width = useWidth();
  const nColumns = width >= 1280 ? 3 : width >= 800 ? 2 : 1;

  // const [searchFocused, setSearchFocused] = useState(false);

  const [search, setSearch] = useState("");

  // combobox support code. see below
  // const categories = useMemo(() => {
  //   return new Set(pastas.map(p => p.category.trim()))
  // }, [pastas]);
  // const matchingCategories = useMemo(() => {
  //   if (lower) {
  //     const matches = [...categories].filter(c => c.toLowerCase().includes(lower));
  //     matches.sort();
  //     return matches;
  //   }
  //   return [];
  // }, [lower, categories]);

  const [linked, setLinked] = useState(() => {
    const fragment = window.location.hash;
    if (fragment.startsWith("#pasta-")) {
      return parseInt(fragment.substring(7));
    }
    return undefined;
  });

  const pastaLengths = useMemo(() => {
    const style = getComputedStyle(document.body);
    let lineHeight = parseFloat(style.lineHeight);
    if (!style.lineHeight.endsWith("px")) {
      lineHeight *= 14;
    }

    const WIDTH = 340;
    const lengths = [];
    for (const pasta of pastas) {
      const prepared = prepareWithSegments(pasta.pasta, "14px Inter");
      // height of initial line plus padding (category label, p-3, mb-4)
      let height = lineHeight + 16 + 24 + 16;
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      // first line - compensate for name and badges
      const width = WIDTH - 134.75;
      let range = layoutNextLineRange(prepared, cursor, width);
      while (range !== null) {
        // remaining lines - full width
        cursor = range.end;
        height += lineHeight;
        range = layoutNextLineRange(prepared, cursor, WIDTH);
      }
      lengths.push(height);
    }
    return lengths;
  }, [pastas]);

  const [matchingPastas, setMatchingPastas] = useState<Pasta[]>(pastas);
  const updateMatchingPastas = useCallback(
    (filter: string) => {
      setLinked(undefined);
      const lower = filter.trim().toLowerCase();
      setMatchingPastas(
        pastas.filter(
          (p) =>
            p.category.toLowerCase() === lower || p.pasta.toLowerCase().includes(lower),
        ),
      );
    },
    [pastas, setMatchingPastas, setLinked],
  );
  const updateMatchingPastasDebounced = useDebounce(250, updateMatchingPastas);

  const setSearchToCategory = useCallback(
    (category: string) => {
      setSearch(category);
      updateMatchingPastas(category);
    },
    [setSearch, updateMatchingPastas],
  );

  const columns = useMemo(() => {
    if (nColumns === 1) {
      return [matchingPastas];
    }

    const lengths: number[] = [];
    const lanes: Pasta[][] = [];

    for (let i = 0; i < nColumns; i += 1) {
      lengths.push(0);
      lanes.push([]);
    }

    for (const pasta of matchingPastas) {
      const i = lengths.indexOf(Math.min(...lengths));
      lanes[i].push(pasta);
      lengths[i] += pastaLengths[pasta.key];
    }

    return lanes;
  }, [pastaLengths, matchingPastas, nColumns]);

  const onLinkClicked = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, key: number) => {
      event.preventDefault();
      setLinked(key);
    },
    [setLinked],
  );

  return (
    <div className="py-8 px-2 w-full flex flex-col items-center justify-start gap-6">
      <div>
        <Dialog />
      </div>
      <div className="w-full max-w-4xl relative">
        <input
          type="text"
          className="rounded outline-current outline-1 p-2 w-full"
          placeholder="Search..."
          value={search}
          onInput={useCallback(
            (e) => {
              setSearch(e.currentTarget.value);
              updateMatchingPastasDebounced(e.currentTarget.value);
            },
            [setSearch, updateMatchingPastasDebounced],
          )}
          // onFocus={useCallback(() => setSearchFocused(true), [setSearchFocused])}
          // onBlur={useCallback(() => setSearchFocused(false), [setSearchFocused])}
        />
        {/*combobox for clicking on categories - borked because it hides before the click event happens*/}
        {/*matchingCategories.length > 0 && searchFocused && <div
          className="absolute flex flex-col top-full w-full bg-gray-900 rounded-md p-2 shadow-xl translate-y-2 z-10 outline-1 outline-gray-600"
        >
          {matchingCategories.map(c => <button
            key={c}
            className="rounded text-left py-2 px-3 cursor-pointer hover:bg-black"
            onClick={setSearchToCategory}
          >
            {c}
          </button>)}
        </div>*/}
      </div>

      <div className="flex gap-6">
        {columns.map((col, idx) => (
          <div key={idx}>
            {col.map((p) => (
              <div className="mb-4" key={p.key}>
                <CopyPasta
                  data={p}
                  onCategoryClicked={setSearchToCategory}
                  onLinkClicked={onLinkClicked}
                  linked={p.key === linked}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
