import type { TeamStanding } from "../data/TeamStanding";

type StandingsColumn = {
  key: keyof TeamStanding;
  header: string;
  cellType: "th" | "td";
  bold: boolean;
  render: (standing: TeamStanding) => Node | string;
};

export type StandingsTableConfig = {
  leaderPosition: number;
  dropZone: number;
  columns: StandingsColumn[];
};

const columns: StandingsColumn[] = [
  {
    key: "position",
    header: "Position",
    cellType: "th",
    bold: false,
    render: (standing) => String(standing.position),
  },
  {
    key: "club",
    header: "Club",
    cellType: "th",
    bold: true,
    render: (standing) => {
      const link = document.createElement("a");

      link.href = standing.url;
      link.textContent = standing.club;

      return link;
    },
  },
  {
    key: "matchesPlayed",
    header: "Matches played",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.matchesPlayed),
  },
  {
    key: "wins",
    header: "Wins",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.wins),
  },
  {
    key: "draws",
    header: "Draws",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.draws),
  },
  {
    key: "losses",
    header: "Losses",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.losses),
  },
  {
    key: "goalsScored",
    header: "Goals scored",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.goalsScored),
  },
  {
    key: "goalsAgainst",
    header: "Goals against",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.goalsAgainst),
  },
  {
    key: "goalDifference",
    header: "Goal difference",
    cellType: "td",
    bold: false,
    render: (standing) => String(standing.goalDifference),
  },
  {
    key: "points",
    header: "Points",
    cellType: "td",
    bold: true,
    render: (standing) => String(standing.points),
  },
  {
    key: "lastFive",
    header: "Last 5",
    cellType: "td",
    bold: false,
    render: (standing) => {
      const fiveColumn = document.createElement("ul");

      fiveColumn.classList.add("standings__last-five");

      standing.lastFive.forEach((match) => {
        const element = document.createElement("li");

        element.textContent = match;

        fiveColumn.append(element);
      });

      return fiveColumn;
    },
  },
];

export const standingsTableConfig: StandingsTableConfig = {
  leaderPosition: 1,
  dropZone: 18,
  columns: columns,
};
