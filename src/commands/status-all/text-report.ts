<<<<<<< HEAD
type HeadingFn = (text: string) => string;

=======
// Generic text-report primitives for status command output.
// Callers assemble typed sections; this file owns heading insertion and table rendering order.

import type { RenderTableOptions, TableColumn } from "../../../packages/terminal-core/src/table.js";

type HeadingFn = (text: string) => string;
type TableRenderer = (input: RenderTableOptions) => string;

export type StatusReportSection =
  | {
      kind: "lines";
      title: string;
      body: string[];
      skipIfEmpty?: boolean;
    }
  | {
      kind: "table";
      title: string;
      width: number;
      renderTable: TableRenderer;
      columns: readonly TableColumn[];
      rows: Array<Record<string, string>>;
      trailer?: string | null;
      skipIfEmpty?: boolean;
    }
  | {
      kind: "raw";
      body: string[];
      skipIfEmpty?: boolean;
    };

/** Appends a blank-line-separated section heading. */
>>>>>>> upstream/main
export function appendStatusSectionHeading(params: {
  lines: string[];
  heading: HeadingFn;
  title: string;
}) {
  if (params.lines.length > 0) {
    params.lines.push("");
  }
  params.lines.push(params.heading(params.title));
}

<<<<<<< HEAD
export function appendStatusLinesSection(params: {
=======
function appendStatusLinesSection(params: {
>>>>>>> upstream/main
  lines: string[];
  heading: HeadingFn;
  title: string;
  body: string[];
}) {
  appendStatusSectionHeading(params);
  params.lines.push(...params.body);
}

<<<<<<< HEAD
export function appendStatusTableSection<Row extends Record<string, string>>(params: {
=======
function appendStatusTableSection<Row extends Record<string, string>>(params: {
>>>>>>> upstream/main
  lines: string[];
  heading: HeadingFn;
  title: string;
  width: number;
<<<<<<< HEAD
  renderTable: (input: {
    width: number;
    columns: Array<Record<string, unknown>>;
    rows: Row[];
  }) => string;
  columns: Array<Record<string, unknown>>;
=======
  renderTable: (input: { width: number; columns: TableColumn[]; rows: Row[] }) => string;
  columns: readonly TableColumn[];
>>>>>>> upstream/main
  rows: Row[];
}) {
  appendStatusSectionHeading(params);
  params.lines.push(
    params
      .renderTable({
        width: params.width,
<<<<<<< HEAD
        columns: params.columns,
=======
        columns: [...params.columns],
>>>>>>> upstream/main
        rows: params.rows,
      })
      .trimEnd(),
  );
}
<<<<<<< HEAD
=======

/** Appends all non-empty report sections in display order. */
export function appendStatusReportSections(params: {
  lines: string[];
  heading: HeadingFn;
  sections: StatusReportSection[];
}) {
  for (const section of params.sections) {
    if (section.kind === "raw") {
      if (section.skipIfEmpty && section.body.length === 0) {
        continue;
      }
      params.lines.push(...section.body);
      continue;
    }
    if (section.kind === "lines") {
      if (section.skipIfEmpty && section.body.length === 0) {
        continue;
      }
      appendStatusLinesSection({
        lines: params.lines,
        heading: params.heading,
        title: section.title,
        body: section.body,
      });
      continue;
    }
    if (section.skipIfEmpty && section.rows.length === 0) {
      continue;
    }
    appendStatusTableSection({
      lines: params.lines,
      heading: params.heading,
      title: section.title,
      width: section.width,
      renderTable: section.renderTable,
      columns: section.columns,
      rows: section.rows,
    });
    if (section.trailer) {
      params.lines.push(section.trailer);
    }
  }
}
>>>>>>> upstream/main
