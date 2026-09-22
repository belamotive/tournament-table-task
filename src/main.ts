import "./styles/main.scss";
import { StandingsTable } from "./components/StandingsTable/StandingsTable";
import { Standings } from "./data/Standings";
import { validateStandings } from "./data/StandingsValidators";
import { standingsTableConfig } from "./config/standingsTableConfig";

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
  throw new Error("App element not found!");
}

const standingsTable = new StandingsTable(standingsTableConfig);
const validStandings = validateStandings(Standings);
standingsTable.setStandings(
  [...validStandings].sort((a, b) => a.position - b.position),
);
standingsTable.mount(app);
