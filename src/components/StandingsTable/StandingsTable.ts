import type { StandingsTableConfig } from "../../config/standingsTableConfig";
import type { TeamStanding } from "../../data/TeamStanding";

export class StandingsTable {
  private config: StandingsTableConfig;
  private standings: TeamStanding[] = [];
  private container: HTMLDivElement | null = null;

  constructor(config: StandingsTableConfig) {
    this.config = config;
  }

  public setStandings(standings: TeamStanding[]): void {
    this.standings = standings;
    this.render();
  }

  public mount(container: HTMLDivElement): void {
    this.container = container;
    this.render();
  }

  private render(): void {
    if (this.container === null) {
      return;
    }

    const tableContainer = document.createElement("div");
    tableContainer.className = "standings";

    const table = this.createTableElement();
    tableContainer.append(table);

    this.container.replaceChildren(tableContainer);
  }

  private createTableElement(): HTMLTableElement {
    const table = document.createElement("table");
    table.className = "standings__table";
    const tableHead = this.createTableHead();
    const tableBody = document.createElement("tbody");

    for (const standing of this.standings) {
      tableBody.append(this.createClubRow(standing));
    }

    table.append(tableHead, tableBody);

    return table;
  }

  private createTableHead(): HTMLTableSectionElement {
    const head = document.createElement("thead");
    const row = document.createElement("tr");

    for (const column of this.config.columns) {
      const cell = document.createElement("th");

      cell.scope = "col";
      cell.textContent = column.header;

      cell.classList.add("standings__cell", "standings__header-cell");

      if (column.bold) {
        cell.classList.add("standings__cell--bold");
      }

      row.append(cell);
    }

    head.append(row);

    return head;
  }

  private createClubRow(standing: TeamStanding): HTMLTableRowElement {
    const row = document.createElement("tr");

    for (const column of this.config.columns) {
      const cell = document.createElement(column.cellType);

      cell.append(column.render(standing));
      cell.classList.add("standings__cell");

      if (column.bold) {
        cell.classList.add("standings__cell--bold");
      }

      if (standing.position === this.config.leaderPosition) {
        cell.classList.add("standings__cell--leader");
      }

      if (standing.position >= this.config.dropZone) {
        cell.classList.add("standings__cell--dropped");
      }

      if (column.cellType === "th") {
        cell.scope = "row";
      }

      row.append(cell);
    }

    return row;
  }
}
