<<<<<<< HEAD
import { afterEach, describe, expect, it } from "vitest";
import {
  _private,
  _resetWindowsInstallRootsForTests,
=======
// Covers Windows install-root normalization and discovery.
import { afterEach, describe, expect, it } from "vitest";
import {
  privateTestApi,
  resetWindowsInstallRootsForTests,
>>>>>>> upstream/main
  getWindowsInstallRoots,
  getWindowsProgramFilesRoots,
  normalizeWindowsInstallRoot,
} from "./windows-install-roots.js";

afterEach(() => {
<<<<<<< HEAD
  _resetWindowsInstallRootsForTests();
=======
  resetWindowsInstallRootsForTests();
>>>>>>> upstream/main
});

describe("normalizeWindowsInstallRoot", () => {
  it("normalizes validated local Windows roots", () => {
    expect(normalizeWindowsInstallRoot(" D:/Apps/Program Files/ ")).toBe("D:\\Apps\\Program Files");
  });

  it("rejects invalid or overly broad values", () => {
    expect(normalizeWindowsInstallRoot("relative\\path")).toBeNull();
    expect(normalizeWindowsInstallRoot("\\\\server\\share\\Program Files")).toBeNull();
    expect(normalizeWindowsInstallRoot("D:\\")).toBeNull();
    expect(normalizeWindowsInstallRoot("D:\\Apps;E:\\Other")).toBeNull();
  });
});

describe("getWindowsInstallRoots", () => {
  it("prefers HKLM registry roots over process environment values", () => {
<<<<<<< HEAD
    _resetWindowsInstallRootsForTests({
=======
    resetWindowsInstallRootsForTests({
>>>>>>> upstream/main
      queryRegistryValue: (key, valueName) => {
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" &&
          valueName === "SystemRoot"
        ) {
          return "D:\\Windows";
        }
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion" &&
          valueName === "ProgramFilesDir"
        ) {
          return "E:\\Programs";
        }
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion" &&
          valueName === "ProgramFilesDir (x86)"
        ) {
          return "F:\\Programs (x86)";
        }
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion" &&
          valueName === "ProgramW6432Dir"
        ) {
          return "E:\\Programs";
        }
        return null;
      },
    });

    const originalEnv = process.env;
    let roots;
    try {
      process.env = {
        ...originalEnv,
        SystemRoot: "C:\\PoisonedWindows",
        ProgramFiles: "C:\\Poisoned Programs",
        "ProgramFiles(x86)": "C:\\Poisoned Programs (x86)",
        ProgramW6432: "C:\\Poisoned Programs",
      };
      roots = getWindowsInstallRoots();
    } finally {
      process.env = originalEnv;
    }

    expect(roots).toEqual({
      systemRoot: "D:\\Windows",
      programFiles: "E:\\Programs",
      programFilesX86: "F:\\Programs (x86)",
      programW6432: "E:\\Programs",
    });
  });

  it("uses explicit env roots without consulting HKLM", () => {
<<<<<<< HEAD
    _resetWindowsInstallRootsForTests({
=======
    resetWindowsInstallRootsForTests({
>>>>>>> upstream/main
      queryRegistryValue: (key, valueName) => {
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" &&
          valueName === "SystemRoot"
        ) {
          return "D:\\Windows";
        }
        if (
          key === "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion" &&
          valueName === "ProgramFilesDir"
        ) {
          return "E:\\Programs";
        }
        return null;
      },
    });

    const roots = getWindowsInstallRoots({
      SystemRoot: "G:\\Windows",
      ProgramFiles: "H:\\Programs",
      "ProgramFiles(x86)": "I:\\Programs (x86)",
      ProgramW6432: "H:\\Programs",
    });

    expect(roots).toEqual({
      systemRoot: "G:\\Windows",
      programFiles: "H:\\Programs",
      programFilesX86: "I:\\Programs (x86)",
      programW6432: "H:\\Programs",
    });
  });

  it("falls back to validated env roots when registry lookup is unavailable", () => {
<<<<<<< HEAD
    _resetWindowsInstallRootsForTests({
=======
    resetWindowsInstallRootsForTests({
>>>>>>> upstream/main
      queryRegistryValue: () => null,
    });

    const roots = getWindowsInstallRoots({
      systemroot: "D:\\Windows\\",
      programfiles: "E:\\Programs",
      "PROGRAMFILES(X86)": "F:\\Programs (x86)\\",
      programw6432: "E:\\Programs",
    });

    expect(roots).toEqual({
      systemRoot: "D:\\Windows",
      programFiles: "E:\\Programs",
      programFilesX86: "F:\\Programs (x86)",
      programW6432: "E:\\Programs",
    });
  });

  it("falls back to defaults when registry and env roots are invalid", () => {
<<<<<<< HEAD
    _resetWindowsInstallRootsForTests({
=======
    resetWindowsInstallRootsForTests({
>>>>>>> upstream/main
      queryRegistryValue: () => "relative\\path",
    });

    const roots = getWindowsInstallRoots({
      SystemRoot: "relative\\Windows",
      ProgramFiles: "\\\\server\\share\\Program Files",
      "ProgramFiles(x86)": "D:\\",
      ProgramW6432: "C:\\Programs;D:\\Other",
    });

    expect(roots).toEqual({
      systemRoot: "C:\\Windows",
      programFiles: "C:\\Program Files",
      programFilesX86: "C:\\Program Files (x86)",
      programW6432: null,
    });
  });
});

describe("getWindowsProgramFilesRoots", () => {
  it("prefers ProgramW6432 and dedupes roots case-insensitively", () => {
<<<<<<< HEAD
    _resetWindowsInstallRootsForTests({
=======
    resetWindowsInstallRootsForTests({
>>>>>>> upstream/main
      queryRegistryValue: () => null,
    });

    expect(
      getWindowsProgramFilesRoots({
        ProgramW6432: "D:\\Programs",
        ProgramFiles: "d:\\Programs\\",
        "ProgramFiles(x86)": "E:\\Programs (x86)",
      }),
    ).toEqual(["D:\\Programs", "E:\\Programs (x86)"]);
  });
});

describe("locateWindowsRegExe", () => {
<<<<<<< HEAD
  it("prefers SystemRoot and WINDIR candidates over arbitrary drive scans", () => {
    expect(
      _private.getWindowsRegExeCandidates({
        SystemRoot: "D:\\Windows",
        WINDIR: "E:\\Windows",
      }),
    ).toEqual([
      "D:\\Windows\\System32\\reg.exe",
      "E:\\Windows\\System32\\reg.exe",
      "C:\\Windows\\System32\\reg.exe",
    ]);
  });

  it("dedupes equivalent roots case-insensitively", () => {
    expect(
      _private.getWindowsRegExeCandidates({
        SystemRoot: "D:\\Windows\\",
        windir: "d:\\windows",
      }),
    ).toEqual(["D:\\Windows\\System32\\reg.exe", "C:\\Windows\\System32\\reg.exe"]);
=======
  it("uses the fixed Windows system reg.exe candidate", () => {
    expect(privateTestApi.getWindowsRegExeCandidates()).toEqual(["C:\\Windows\\System32\\reg.exe"]);
  });

  it("does not resolve readable reg.exe files from env-derived roots", () => {
    resetWindowsInstallRootsForTests({
      isReadableFile: (filePath) => filePath === "D:\\Windows\\System32\\reg.exe",
    });

    const originalEnv = process.env;
    try {
      process.env = {
        ...originalEnv,
        SystemRoot: "D:\\Windows",
        WINDIR: "E:\\Windows",
      };
      expect(privateTestApi.locateWindowsRegExe()).toBeNull();
    } finally {
      process.env = originalEnv;
    }
>>>>>>> upstream/main
  });
});
