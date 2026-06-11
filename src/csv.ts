import { parse } from "csv-parse/browser/esm/sync";

export function parseCsv(csv: string) {
  return parse(csv, {
    columns: false,
    skipEmptyLines: true,
  });
}
