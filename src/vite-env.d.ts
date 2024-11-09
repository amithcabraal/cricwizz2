/// <reference types="vite/client" />

interface Match {
  id: number;
  localteam: Team;
  visitorteam: Team;
  venue?: Venue;
  status: string;
  note?: string;
  round?: string;
  starting_at?: string;
  type?: string;
  live?: boolean;
  result?: string;
  scoreboards?: Scoreboard[];
  batting?: BattingScore[];
  bowling?: BowlingScore[];
  balls?: Ball[];
  runs?: number;
  wickets?: number;
}

interface Team {
  id: number;
  name: string;
  code?: string;
  image_path?: string;
  country_id?: number;
  national_team?: boolean;
  updated_at?: string;
}

interface Venue {
  id: number;
  name: string;
  city?: string;
  country_id?: number;
  image_path?: string;
  capacity?: number;
  updated_at?: string;
}

interface Scoreboard {
  id: number;
  type: string;
  total: number;
  wickets: number;
  overs: number;
  team_id: number;
}

interface BattingScore {
  player_id: number;
  batsman: {
    fullname: string;
    id: number;
  };
  score: number;
  ball: number;
  four_x: number;
  six_x: number;
  rate: number;
  out_str?: string;
}

interface BowlingScore {
  player_id: number;
  bowler: {
    fullname: string;
    id: number;
  };
  overs: number;
  medians: number;
  runs: number;
  wickets: number;
  wide: number;
  noball: number;
  rate: number;
}

interface Ball {
  ball: number;
  score: number;
  batsman_id?: number;
  bowler_id?: number;
  team_id?: number;
  is_wicket?: boolean;
  is_boundary?: boolean;
}

interface OverData {
  over: number;
  runs: number;
  balls: number[];
}