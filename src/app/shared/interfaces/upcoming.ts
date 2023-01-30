import {PlayerInterface} from "src/app/shared/interfaces/player";
import {ShortTournamentInterface} from "src/app/shared/interfaces/tournament";

export interface UpcomingInterface {
  tournament: ShortTournamentInterface;
  roundId: number;
  player1: PlayerInterface;
  player2: PlayerInterface;
  h2h: string;
  type?: string;
  date?: string;
}

export interface UpcomingMatchesInterface {
  count: number;
  matches: UpcomingInterface[];
}