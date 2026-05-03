export type PlayerStatus = "active" | "archived"

export interface Player {
  id: number
  firstName: string
  lastName: string
  group: string
  status: PlayerStatus
}

export const groups = ["U8", "U10", "U12", "U14", "U16"]

export const players: Player[] = [
  // U8
  { id: 1, firstName: "Ethan", lastName: "Miller", group: "U8", status: "active" },
  { id: 2, firstName: "Sophia", lastName: "Garcia", group: "U8", status: "active" },
  { id: 3, firstName: "Liam", lastName: "Johnson", group: "U8", status: "active" },
  { id: 4, firstName: "Olivia", lastName: "Brown", group: "U8", status: "active" },
  { id: 5, firstName: "Noah", lastName: "Davis", group: "U8", status: "archived" },
  
  // U10
  { id: 6, firstName: "Emma", lastName: "Wilson", group: "U10", status: "active" },
  { id: 7, firstName: "James", lastName: "Taylor", group: "U10", status: "active" },
  { id: 8, firstName: "Ava", lastName: "Anderson", group: "U10", status: "active" },
  { id: 9, firstName: "Oliver", lastName: "Thomas", group: "U10", status: "active" },
  { id: 10, firstName: "Isabella", lastName: "Jackson", group: "U10", status: "active" },
  { id: 11, firstName: "Lucas", lastName: "White", group: "U10", status: "archived" },
  
  // U12
  { id: 12, firstName: "Mia", lastName: "Harris", group: "U12", status: "active" },
  { id: 13, firstName: "Benjamin", lastName: "Martin", group: "U12", status: "active" },
  { id: 14, firstName: "Charlotte", lastName: "Thompson", group: "U12", status: "active" },
  { id: 15, firstName: "Elijah", lastName: "Moore", group: "U12", status: "active" },
  { id: 16, firstName: "Amelia", lastName: "Clark", group: "U12", status: "active" },
  { id: 17, firstName: "Mason", lastName: "Lewis", group: "U12", status: "active" },
  
  // U14
  { id: 18, firstName: "Harper", lastName: "Robinson", group: "U14", status: "active" },
  { id: 19, firstName: "Alexander", lastName: "Walker", group: "U14", status: "active" },
  { id: 20, firstName: "Evelyn", lastName: "Hall", group: "U14", status: "active" },
  { id: 21, firstName: "William", lastName: "Allen", group: "U14", status: "active" },
  { id: 22, firstName: "Sofia", lastName: "Young", group: "U14", status: "archived" },
  
  // U16
  { id: 23, firstName: "Henry", lastName: "King", group: "U16", status: "active" },
  { id: 24, firstName: "Luna", lastName: "Wright", group: "U16", status: "active" },
  { id: 25, firstName: "Sebastian", lastName: "Scott", group: "U16", status: "active" },
  { id: 26, firstName: "Scarlett", lastName: "Green", group: "U16", status: "active" },
  { id: 27, firstName: "Jack", lastName: "Baker", group: "U16", status: "active" },
]

export function formatPlayerName(player: Player): string {
  return `${player.firstName} ${player.lastName.charAt(0)}.`
}

export function getPlayersByGroup(group: string, includeArchived: boolean = false): Player[] {
  return players.filter(p => p.group === group && (includeArchived || p.status === "active"))
}

export function getActivePlayerCount(): number {
  return players.filter(p => p.status === "active").length
}

export function getArchivedPlayerCount(): number {
  return players.filter(p => p.status === "archived").length
}
