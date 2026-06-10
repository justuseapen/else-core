<<<<<<< HEAD
import { appendStatusLinesSection, appendStatusTableSection } from "./status-all/text-report.js";

export async function buildStatusCommandReportLines(params: {
  heading: (text: string) => string;
  muted: (text: string) => string;
  renderTable: (input: {
    width: number;
    columns: Array<Record<string, unknown>>;
    rows: Array<Record<string, string>>;
  }) => string;
=======
// Renders the standard `openclaw status` report from prebuilt section data.
// Report data assembly stays separate so tests can validate rows without terminal formatting.

import type { RenderTableOptions, TableColumn } from "../../packages/terminal-core/src/table.js";
import {
  buildStatusChannelsTableSection,
  buildStatusHealthSection,
  buildStatusOverviewSection,
  buildStatusSessionsSection,
  buildStatusSystemEventsSection,
  buildStatusUsageSection,
} from "./status-all/report-sections.js";
import { appendStatusReportSections } from "./status-all/text-report.js";

/** Builds terminal lines for the standard status report. */
export async function buildStatusCommandReportLines(params: {
  heading: (text: string) => string;
  muted: (text: string) => string;
  renderTable: (input: RenderTableOptions) => string;
>>>>>>> upstream/main
  width: number;
  overviewRows: Array<{ Item: string; Value: string }>;
  showTaskMaintenanceHint: boolean;
  taskMaintenanceHint: string;
<<<<<<< HEAD
  pluginCompatibilityLines: string[];
  pairingRecoveryLines: string[];
  securityAuditLines: string[];
  channelsColumns: Array<Record<string, unknown>>;
  channelsRows: Array<Record<string, string>>;
  sessionsColumns: Array<Record<string, unknown>>;
  sessionsRows: Array<Record<string, string>>;
  systemEventsRows?: Array<Record<string, string>>;
  systemEventsTrailer?: string | null;
  healthColumns?: Array<Record<string, unknown>>;
=======
  retainedLostTaskLine?: string | null;
  pluginCompatibilityLines: string[];
  pairingRecoveryLines: string[];
  modelSelectionLines: string[];
  securityAuditLines: string[];
  channelsColumns: readonly TableColumn[];
  channelsRows: Array<Record<string, string>>;
  sessionsColumns: readonly TableColumn[];
  sessionsRows: Array<Record<string, string>>;
  systemEventsRows?: Array<Record<string, string>>;
  systemEventsTrailer?: string | null;
  healthColumns?: readonly TableColumn[];
>>>>>>> upstream/main
  healthRows?: Array<Record<string, string>>;
  usageLines?: string[];
  footerLines: string[];
}) {
  const lines: string[] = [];
  lines.push(params.heading("OpenClaw status"));

<<<<<<< HEAD
  appendStatusTableSection({
    lines,
    heading: params.heading,
    title: "Overview",
    width: params.width,
    renderTable: params.renderTable,
    columns: [
      { key: "Item", header: "Item", minWidth: 12 },
      { key: "Value", header: "Value", flex: true, minWidth: 32 },
    ],
    rows: params.overviewRows,
  });

  if (params.showTaskMaintenanceHint) {
    lines.push("");
    lines.push(params.muted(params.taskMaintenanceHint));
  }

  if (params.pluginCompatibilityLines.length > 0) {
    appendStatusLinesSection({
      lines,
      heading: params.heading,
      title: "Plugin compatibility",
      body: params.pluginCompatibilityLines,
    });
  }

  if (params.pairingRecoveryLines.length > 0) {
    lines.push("");
    lines.push(...params.pairingRecoveryLines);
  }

  appendStatusLinesSection({
    lines,
    heading: params.heading,
    title: "Security audit",
    body: params.securityAuditLines,
  });

  appendStatusTableSection({
    lines,
    heading: params.heading,
    title: "Channels",
    width: params.width,
    renderTable: params.renderTable,
    columns: params.channelsColumns,
    rows: params.channelsRows,
  });

  appendStatusTableSection({
    lines,
    heading: params.heading,
    title: "Sessions",
    width: params.width,
    renderTable: params.renderTable,
    columns: params.sessionsColumns,
    rows: params.sessionsRows,
  });

  if (params.systemEventsRows && params.systemEventsRows.length > 0) {
    appendStatusTableSection({
      lines,
      heading: params.heading,
      title: "System events",
      width: params.width,
      renderTable: params.renderTable,
      columns: [{ key: "Event", header: "Event", flex: true, minWidth: 24 }],
      rows: params.systemEventsRows,
    });
    if (params.systemEventsTrailer) {
      lines.push(params.systemEventsTrailer);
    }
  }

  if (params.healthColumns && params.healthRows) {
    appendStatusTableSection({
      lines,
      heading: params.heading,
      title: "Health",
      width: params.width,
      renderTable: params.renderTable,
      columns: params.healthColumns,
      rows: params.healthRows,
    });
  }

  if (params.usageLines && params.usageLines.length > 0) {
    appendStatusLinesSection({
      lines,
      heading: params.heading,
      title: "Usage",
      body: params.usageLines,
    });
  }

  lines.push("");
  lines.push(...params.footerLines);
=======
  appendStatusReportSections({
    lines,
    heading: params.heading,
    sections: [
      {
        ...buildStatusOverviewSection({
          width: params.width,
          renderTable: params.renderTable,
          rows: params.overviewRows,
        }),
      },
      {
        kind: "raw",
        body:
          params.showTaskMaintenanceHint || params.retainedLostTaskLine
            ? [
                "",
                // Raw section keeps maintenance hints directly below the overview table.
                ...(params.showTaskMaintenanceHint
                  ? [params.muted(params.taskMaintenanceHint)]
                  : []),
                ...(params.retainedLostTaskLine ? [params.retainedLostTaskLine] : []),
              ]
            : [],
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Plugin compatibility",
        body: params.pluginCompatibilityLines,
        skipIfEmpty: true,
      },
      {
        kind: "raw",
        body: params.pairingRecoveryLines.length > 0 ? ["", ...params.pairingRecoveryLines] : [],
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Model selection",
        body: params.modelSelectionLines,
        skipIfEmpty: true,
      },
      {
        kind: "lines",
        title: "Security audit",
        body: params.securityAuditLines,
      },
      params.channelsRows.length === 0
        ? {
            kind: "lines",
            title: "Channels",
            body: [params.muted("No channels configured")],
          }
        : {
            ...buildStatusChannelsTableSection({
              width: params.width,
              renderTable: params.renderTable,
              columns: params.channelsColumns,
              rows: params.channelsRows,
            }),
          },
      params.sessionsRows.length === 0
        ? {
            kind: "lines",
            title: "Sessions",
            body: [params.muted("No sessions")],
          }
        : {
            ...buildStatusSessionsSection({
              width: params.width,
              renderTable: params.renderTable,
              columns: params.sessionsColumns,
              rows: params.sessionsRows,
            }),
          },
      {
        ...buildStatusSystemEventsSection({
          width: params.width,
          renderTable: params.renderTable,
          rows: params.systemEventsRows,
          trailer: params.systemEventsTrailer,
        }),
      },
      {
        ...buildStatusHealthSection({
          width: params.width,
          renderTable: params.renderTable,
          columns: params.healthColumns,
          rows: params.healthRows,
        }),
      },
      {
        ...buildStatusUsageSection({ usageLines: params.usageLines }),
      },
      {
        kind: "raw",
        body: ["", ...params.footerLines],
      },
    ],
  });
>>>>>>> upstream/main
  return lines;
}
