import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDuration,
  minutesToTime,
  scheduleWithTimes,
  shotProgress,
  timeToMinutes,
  todayISO,
  totalSectionDuration,
} from "./format";
import {
  calibrate,
  clamp,
  conePath,
  distance,
  fovFromLens,
  lightColor,
  roomScaleLabel,
} from "./room";

describe("room geometry", () => {
  it("computes a 50 mm field of view on a 36 mm sensor", () => {
    expect(fovFromLens(36, 50)).toBeCloseTo(39.6, 1);
  });

  it("falls back to the default when inputs are invalid", () => {
    expect(fovFromLens(0, 50)).toBe(60);
    expect(fovFromLens(36, 0)).toBe(60);
  });

  it("measures distances and calibrates a plan", () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(calibrate(200, 2)).toBe(100);
    expect(calibrate(0, 2)).toBeNull();
  });

  it("clamps values and builds a cone path", () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-2, 0, 10)).toBe(0);
    const path = conePath(100, 100, 50, 90, 0);
    expect(path.startsWith("M 100 100")).toBe(true);
    expect(path).toContain("A 50 50");
  });

  it("labels light temperature and scale", () => {
    expect(lightColor("warm")).toBe("#E8A33D");
    expect(lightColor("cool")).toBe("#6FB6C9");
    expect(roomScaleLabel(197)).toBe("1 m = 197 px");
    expect(roomScaleLabel(null)).toBe("Échelle non calibrée");
  });
});

describe("time and progress helpers", () => {
  it("formats durations", () => {
    expect(formatDuration(0)).toBe("0 min");
    expect(formatDuration(60)).toBe("1 h");
    expect(formatDuration(75)).toBe("1 h 15");
  });

  it("converts times both ways", () => {
    expect(timeToMinutes("09:30")).toBe(570);
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(1440)).toBe("00:00");
  });

  it("stacks schedule blocks from the day start", () => {
    const timed = scheduleWithTimes(
      [{ durationMin: 45 }, { durationMin: 20 }, { durationMin: 15 }],
      "09:00",
    );
    expect(timed.map((entry) => [entry.start, entry.end])).toEqual([
      [540, 585],
      [585, 605],
      [605, 620],
    ]);
  });

  it("ignores abandoned shots in progress", () => {
    expect(
      shotProgress([
        { status: "tourne" },
        { status: "a_tourner" },
        { status: "abandonne" },
      ]),
    ).toEqual({ done: 1, total: 2, percent: 50 });
  });

  it("sums section and question durations", () => {
    expect(
      totalSectionDuration([
        { plannedMinutes: 5, questions: [{ plannedMinutes: 2 }, { plannedMinutes: 3 }] },
        { plannedMinutes: 10, questions: [] },
      ]),
    ).toBe(20);
  });

  it("handles an empty date and a valid ISO date", () => {
    expect(formatDate("")).toBe("Date à définir");
    expect(formatDate("2026-10-27")).toContain("2026");
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
