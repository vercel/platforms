export type GameDayStatus = "live" | "upcoming" | "completed"

export interface Game {
  id: number
  day?: string
  time: string
  homeTeam: string
  awayTeam: string
  location: string
  facility: string
  field: string
  coach: string
  jersey: string
  format: string
}

export type RosterStatus = "draft" | "published"

export interface PoolGames {
  poolName: string
  poolLead: string
  rosterStatus: RosterStatus
  publishedAt?: string
  publishedBy?: string
  games: Game[]
}

export interface GameDay {
  id: number
  name: string
  date: string
  status: GameDayStatus
  teamCount: number
  playerCount: number
  location?: string
  description?: string
  poolGames: PoolGames[]
}

export const gameDays: GameDay[] = [
  {
    id: 1,
    name: "Spring Tournament Qualifier",
    date: "May 1, 2026",
    status: "completed",
    teamCount: 8,
    playerCount: 48,
    location: "Central Park Arena",
    description: "Spring tournament qualifier round",
    poolGames: [
      {
        poolName:"U10",
        poolLead:"Mike Johnson",
        rosterStatus: "published",
        publishedAt: "Apr 30, 2026 at 2:15 PM",
        publishedBy: "Mike Johnson",
        games: [
          { id: 1, time: "9:00 AM", homeTeam: "Red Dragons", awayTeam: "Blue Hawks", location: "Central Park Arena", facility: "Central Park Arena", field: "Field 1", coach: "Mike Johnson", jersey: "Blue", format: "7v7" },
          { id: 2, time: "10:30 AM", homeTeam: "Green Vipers", awayTeam: "Yellow Tigers", location: "Central Park Arena", facility: "Central Park Arena", field: "Field 1", coach: "Sarah Williams", jersey: "Red", format: "7v7" },
        ],
      },
      {
        poolName:"U12",
        poolLead:"David Chen",
        rosterStatus: "published",
        publishedAt: "Apr 30, 2026 at 3:45 PM",
        publishedBy: "David Chen",
        games: [
          { id: 3, time: "9:00 AM", homeTeam: "Storm Chasers", awayTeam: "Night Owls", location: "Central Park Arena", facility: "Central Park Arena", field: "Field 2", coach: "David Chen", jersey: "Black", format: "9v9" },
          { id: 4, time: "11:00 AM", homeTeam: "Thunder Wolves", awayTeam: "Ice Bears", location: "Central Park Arena", facility: "Central Park Arena", field: "Field 2", coach: "Mike Johnson", jersey: "Blue", format: "9v9" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Regional Championship Weekend",
    date: "Apr 28 - Apr 30, 2026",
    status: "completed",
    teamCount: 16,
    playerCount: 96,
    location: "Downtown Sports Complex",
    description: "Regional championship weekend event",
    poolGames: [
      {
        poolName:"U8",
        poolLead:"Emily Davis",
        rosterStatus: "published",
        publishedAt: "Apr 27, 2026 at 10:00 AM",
        publishedBy: "Emily Davis",
        games: [
          { id: 5, day: "Apr 28, 2026", time: "8:00 AM", homeTeam: "Little Stars", awayTeam: "Mini Thunder", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field A", coach: "Emily Davis", jersey: "Red", format: "5v5" },
          { id: 6, day: "Apr 29, 2026", time: "9:30 AM", homeTeam: "Tiny Tigers", awayTeam: "Small Hawks", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field A", coach: "Emily Davis", jersey: "Blue", format: "5v5" },
        ],
      },
      {
        poolName:"U10",
        poolLead:"Mike Johnson",
        rosterStatus: "published",
        publishedAt: "Apr 27, 2026 at 11:30 AM",
        publishedBy: "Mike Johnson",
        games: [
          { id: 7, day: "Apr 28, 2026", time: "8:00 AM", homeTeam: "Fire Foxes", awayTeam: "Shadow Panthers", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field B", coach: "Mike Johnson", jersey: "Black", format: "7v7" },
          { id: 8, day: "Apr 30, 2026", time: "10:00 AM", homeTeam: "Iron Eagles", awayTeam: "Silver Sharks", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field B", coach: "Sarah Williams", jersey: "Red", format: "7v7" },
        ],
      },
      {
        poolName:"U14",
        poolLead:"David Chen",
        rosterStatus: "published",
        publishedAt: "Apr 27, 2026 at 1:00 PM",
        publishedBy: "David Chen",
        games: [
          { id: 9, day: "Apr 29, 2026", time: "12:00 PM", homeTeam: "Alpha Squad", awayTeam: "Beta Force", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field C", coach: "David Chen", jersey: "Blue", format: "11v11" },
          { id: 10, day: "Apr 30, 2026", time: "2:00 PM", homeTeam: "Gamma Unit", awayTeam: "Delta Team", location: "Downtown Sports Complex", facility: "Downtown Sports Complex", field: "Field C", coach: "David Chen", jersey: "Black", format: "11v11" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Friday Night Showdown",
    date: "May 2, 2026",
    status: "live",
    teamCount: 12,
    playerCount: 72,
    location: "Riverside Stadium",
    description: "Friday night showdown - currently in progress",
    poolGames: [
      {
        poolName:"U10",
        poolLead:"Mike Johnson",
        rosterStatus: "published",
        publishedAt: "May 1, 2026 at 4:30 PM",
        publishedBy: "Mike Johnson",
        games: [
          { id: 11, time: "6:00 PM", homeTeam: "Crimson Knights", awayTeam: "Ocean Waves", location: "Riverside Stadium", facility: "Riverside Stadium", field: "Field 1", coach: "Mike Johnson", jersey: "Red", format: "7v7" },
          { id: 12, time: "7:30 PM", homeTeam: "Mountain Lions", awayTeam: "Desert Hawks", location: "Riverside Stadium", facility: "Riverside Stadium", field: "Field 1", coach: "Sarah Williams", jersey: "Blue", format: "7v7" },
        ],
      },
      {
        poolName:"U12",
        poolLead:"David Chen",
        rosterStatus: "draft",
        games: [
          { id: 13, time: "6:00 PM", homeTeam: "Forest Rangers", awayTeam: "Valley Stars", location: "Riverside Stadium", facility: "Riverside Stadium", field: "Field 2", coach: "David Chen", jersey: "Black", format: "9v9" },
          { id: 14, time: "7:30 PM", homeTeam: "River Runners", awayTeam: "Sky Blazers", location: "Riverside Stadium", facility: "Riverside Stadium", field: "Field 2", coach: "David Chen", jersey: "Red", format: "9v9" },
        ],
      },
      {
        poolName:"U16",
        poolLead:"Sarah Williams",
        rosterStatus: "draft",
        games: [
          { id: 15, time: "8:00 PM", homeTeam: "Elite Warriors", awayTeam: "Prime Strikers", location: "Riverside Stadium", facility: "Riverside Stadium", field: "Main Field", coach: "Mike Johnson", jersey: "Blue", format: "11v11" },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Midweek Casual Competition",
    date: "May 5, 2026",
    status: "upcoming",
    teamCount: 8,
    playerCount: 40,
    location: "Eastside Community Center",
    description: "Midweek casual competition",
    poolGames: [
      {
        poolName:"U10",
        poolLead:"Emily Davis",
        rosterStatus: "draft",
        games: [
          { id: 16, time: "5:00 PM", homeTeam: "Blazing Comets", awayTeam: "Lunar Legends", location: "Eastside Community Center", facility: "Eastside Community Center", field: "Field 1", coach: "Emily Davis", jersey: "Black", format: "7v7" },
          { id: 17, time: "6:30 PM", homeTeam: "Solar Flares", awayTeam: "Cosmic Rays", location: "Eastside Community Center", facility: "Eastside Community Center", field: "Field 1", coach: "Sarah Williams", jersey: "Red", format: "7v7" },
        ],
      },
      {
        poolName:"U12",
        poolLead:"David Chen",
        rosterStatus: "draft",
        games: [
          { id: 18, time: "5:00 PM", homeTeam: "Meteor Shower", awayTeam: "Nebula Stars", location: "Eastside Community Center", facility: "Eastside Community Center", field: "Field 2", coach: "David Chen", jersey: "Blue", format: "9v9" },
          { id: 19, time: "6:30 PM", homeTeam: "Galaxy Riders", awayTeam: "Planet Crushers", location: "Eastside Community Center", facility: "Eastside Community Center", field: "Field 2", coach: "Mike Johnson", jersey: "Black", format: "9v9" },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Major League Qualifier",
    date: "May 10 - May 12, 2026",
    status: "upcoming",
    teamCount: 24,
    playerCount: 144,
    location: "Grand Arena Convention Center",
    description: "Major league qualifier weekend",
    poolGames: [
      {
        poolName:"U10",
        poolLead:"Mike Johnson",
        rosterStatus: "draft",
        games: [
          { id: 20, day: "May 10, 2026", time: "8:00 AM", homeTeam: "Alpha Squad", awayTeam: "Beta Force", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field A", coach: "Mike Johnson", jersey: "Red", format: "7v7" },
          { id: 21, day: "May 11, 2026", time: "9:30 AM", homeTeam: "Gamma Unit", awayTeam: "Delta Team", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field A", coach: "Sarah Williams", jersey: "Blue", format: "7v7" },
          { id: 22, day: "May 12, 2026", time: "11:00 AM", homeTeam: "Epsilon Group", awayTeam: "Zeta Crew", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field A", coach: "Emily Davis", jersey: "Black", format: "7v7" },
        ],
      },
      {
        poolName:"U12",
        poolLead:"David Chen",
        rosterStatus: "draft",
        games: [
          { id: 23, day: "May 10, 2026", time: "8:00 AM", homeTeam: "Eta Division", awayTeam: "Theta Battalion", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field B", coach: "David Chen", jersey: "Red", format: "9v9" },
          { id: 24, day: "May 11, 2026", time: "9:30 AM", homeTeam: "Iota Faction", awayTeam: "Kappa League", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field B", coach: "David Chen", jersey: "Blue", format: "9v9" },
          { id: 25, day: "May 12, 2026", time: "11:00 AM", homeTeam: "Lambda Order", awayTeam: "Mu Alliance", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field B", coach: "Mike Johnson", jersey: "Black", format: "9v9" },
        ],
      },
      {
        poolName:"U14",
        poolLead:"Sarah Williams",
        rosterStatus: "draft",
        games: [
          { id: 26, day: "May 10, 2026", time: "1:00 PM", homeTeam: "Nu Brigade", awayTeam: "Xi Corps", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field C", coach: "Sarah Williams", jersey: "Red", format: "11v11" },
          { id: 27, day: "May 11, 2026", time: "2:30 PM", homeTeam: "Omicron Force", awayTeam: "Pi Division", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field C", coach: "David Chen", jersey: "Blue", format: "11v11" },
        ],
      },
      {
        poolName:"U16",
        poolLead:"Emily Davis",
        rosterStatus: "draft",
        games: [
          { id: 28, day: "May 10, 2026", time: "1:00 PM", homeTeam: "Rho Squad", awayTeam: "Sigma Team", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field D", coach: "Mike Johnson", jersey: "Black", format: "11v11" },
          { id: 29, day: "May 12, 2026", time: "2:30 PM", homeTeam: "Tau Unit", awayTeam: "Upsilon Crew", location: "Grand Arena Convention Center", facility: "Grand Arena Convention Center", field: "Field D", coach: "Emily Davis", jersey: "Red", format: "11v11" },
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Local Practice Match",
    date: "Apr 15, 2026",
    status: "completed",
    teamCount: 4,
    playerCount: 24,
    location: "Northside Gym",
    description: "Practice match between local teams",
    poolGames: [
      {
        poolName:"U12",
        poolLead:"David Chen",
        rosterStatus: "published",
        publishedAt: "Apr 14, 2026 at 9:00 AM",
        publishedBy: "David Chen",
        games: [
          { id: 30, time: "10:00 AM", homeTeam: "Home Team A", awayTeam: "Visitors A", location: "Northside Gym", facility: "Northside Gym", field: "Main Field", coach: "David Chen", jersey: "Blue", format: "9v9" },
          { id: 31, time: "11:30 AM", homeTeam: "Home Team B", awayTeam: "Visitors B", location: "Northside Gym", facility: "Northside Gym", field: "Main Field", coach: "Mike Johnson", jersey: "Red", format: "9v9" },
        ],
      },
    ],
  },
]

export function getGameDayById(id: number): GameDay | undefined {
  return gameDays.find((gd) => gd.id === id)
}
