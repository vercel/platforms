export type PlayerStatus = "active" | "archived"

export interface Player {
  id: number
  firstName: string
  lastName: string
  pool: string
  status: PlayerStatus
}

export const pools = ["U8", "U10", "U12", "U14", "U16"]

export const players: Player[] = [
  // U8
  { id: 1, firstName: "Ethan", lastName: "Miller", pool: "U8", status: "active" },
  { id: 2, firstName: "Sophia", lastName: "Garcia", pool: "U8", status: "active" },
  { id: 3, firstName: "Liam", lastName: "Johnson", pool: "U8", status: "active" },
  { id: 4, firstName: "Olivia", lastName: "Brown", pool: "U8", status: "active" },
  { id: 5, firstName: "Noah", lastName: "Davis", pool: "U8", status: "archived" },
  
  // U10
  { id: 6, firstName: "Emma", lastName: "Wilson", pool: "U10", status: "active" },
  { id: 7, firstName: "James", lastName: "Taylor", pool: "U10", status: "active" },
  { id: 8, firstName: "Ava", lastName: "Anderson", pool: "U10", status: "active" },
  { id: 9, firstName: "Oliver", lastName: "Thomas", pool: "U10", status: "active" },
  { id: 10, firstName: "Isabella", lastName: "Jackson", pool: "U10", status: "active" },
  { id: 11, firstName: "Lucas", lastName: "White", pool: "U10", status: "archived" },
  
  // U12
  { id: 12, firstName: "Mia", lastName: "Harris", pool: "U12", status: "active" },
  { id: 13, firstName: "Benjamin", lastName: "Martin", pool: "U12", status: "active" },
  { id: 14, firstName: "Charlotte", lastName: "Thompson", pool: "U12", status: "active" },
  { id: 15, firstName: "Elijah", lastName: "Moore", pool: "U12", status: "active" },
  { id: 16, firstName: "Amelia", lastName: "Clark", pool: "U12", status: "active" },
  { id: 17, firstName: "Mason", lastName: "Lewis", pool: "U12", status: "active" },
  
  // U14
  { id: 18, firstName: "Harper", lastName: "Robinson", pool: "U14", status: "active" },
  { id: 19, firstName: "Alexander", lastName: "Walker", pool: "U14", status: "active" },
  { id: 20, firstName: "Evelyn", lastName: "Hall", pool: "U14", status: "active" },
  { id: 21, firstName: "William", lastName: "Allen", pool: "U14", status: "active" },
  { id: 22, firstName: "Sofia", lastName: "Young", pool: "U14", status: "archived" },
  
  // U16
  { id: 23, firstName: "Henry", lastName: "King", pool: "U16", status: "active" },
  { id: 24, firstName: "Luna", lastName: "Wright", pool: "U16", status: "active" },
  { id: 25, firstName: "Sebastian", lastName: "Scott", pool: "U16", status: "active" },
  { id: 26, firstName: "Scarlett", lastName: "Green", pool: "U16", status: "active" },
  { id: 27, firstName: "Jack", lastName: "Baker", pool: "U16", status: "active" },
]

export function formatPlayerName(player: Player): string {
  return `${player.firstName} ${player.lastName.charAt(0)}.`
}

export function getPlayersByPool(pool: string, includeArchived: boolean = false): Player[] {
  return players.filter(p => p.pool === pool && (includeArchived || p.status === "active"))
}

export function getActivePlayerCount(): number {
  return players.filter(p => p.status === "active").length
}

export function getArchivedPlayerCount(): number {
  return players.filter(p => p.status === "archived").length
}
