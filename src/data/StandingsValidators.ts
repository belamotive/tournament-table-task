import { MatchResultEnum, type MatchResultType } from "./MatchResultEnum";
import type { TeamStanding } from "./TeamStanding";

export function isMatchResult(value: unknown): value is MatchResultType {
  const matchResultValues = Object.values(MatchResultEnum);

  return (
    typeof value === "string" &&
    matchResultValues.includes(value as MatchResultType)
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isValidUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.length > 0
    );
  } catch {
    return false;
  }
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return isInteger(value) && value > 0;
}

function getStandingValidationErrors(value: unknown): string[] {
  if (!isObject(value)) {
    return ["expected an object"];
  }

  const errors: string[] = [];

  if (!isPositiveInteger(value.position)) {
    errors.push("position must be a positive integer");
  }

  if (!isNonEmptyString(value.club)) {
    errors.push("club must be a non-empty string");
  }

  if (!isValidUrl(value.url)) {
    errors.push("url must be a valid absolute http(s) URL");
  }

  if (!isNonNegativeInteger(value.matchesPlayed)) {
    errors.push("matchesPlayed must be a non-negative integer");
  }

  if (!isNonNegativeInteger(value.wins)) {
    errors.push("wins must be a non-negative integer");
  }

  if (!isNonNegativeInteger(value.draws)) {
    errors.push("draws must be a non-negative integer");
  }

  if (!isNonNegativeInteger(value.losses)) {
    errors.push("losses must be a non-negative integer");
  }

  if (!isNonNegativeInteger(value.goalsScored)) {
    errors.push("goalsScored must be a non-negative integer");
  }

  if (!isNonNegativeInteger(value.goalsAgainst)) {
    errors.push("goalsAgainst must be a non-negative integer");
  }

  if (!isInteger(value.goalDifference)) {
    errors.push("goalDifference must be an integer");
  }

  if (!isNonNegativeInteger(value.points)) {
    errors.push("points must be a non-negative integer");
  }

  if (!Array.isArray(value.lastFive)) {
    errors.push("lastFive must be an array");
  } else {
    if (value.lastFive.length !== 5) {
      errors.push("lastFive must contain exactly five results");
    }

    value.lastFive.forEach((result, resultIndex) => {
      if (!isMatchResult(result)) {
        errors.push(`lastFive[${resultIndex}] must be win, draw, or loss`);
      }
    });
  }

  return errors;
}

export function isValidStanding(value: unknown): value is TeamStanding {
  return getStandingValidationErrors(value).length === 0;
}

export function validateStanding(
  value: unknown,
  index?: number,
): TeamStanding {
  const location = index === undefined ? "standing" : `standings[${index}]`;

  const club =
    isObject(value) && typeof value.club === "string"
      ? value.club
      : "unknown club";
  const errors = getStandingValidationErrors(value);

  if (errors.length > 0) {
    throw new Error(`Invalid ${location} for "${club}": ${errors.join("; ")}`);
  }

  return value as TeamStanding;
}

export function validateStandings(value: unknown): TeamStanding[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid standings data: expected an array");
  }

  const errors = value.flatMap((standing, index) => {
    const club =
      isObject(standing) && typeof standing.club === "string"
        ? standing.club
        : "unknown club";

    return getStandingValidationErrors(standing).map(
      (error) => `standings[${index}] for "${club}": ${error}`,
    );
  });

  if (errors.length > 0) {
    throw new Error(`Invalid standings data:\n- ${errors.join("\n- ")}`);
  }

  return value as TeamStanding[];
}
