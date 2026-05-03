export interface Coach {
  id: number
  name: string
  email: string
}

export interface JerseyColor {
  id: number
  name: string
  color: string
}

export const coaches: Coach[] = [
  { id: 1, name: "John Martinez", email: "john@academy.com" },
  { id: 2, name: "Sarah Chen", email: "sarah@academy.com" },
  { id: 3, name: "Mike Johnson", email: "mike@academy.com" },
  { id: 4, name: "Lisa Rodriguez", email: "lisa@academy.com" },
  { id: 5, name: "David Chen", email: "david@academy.com" },
  { id: 6, name: "Sarah Williams", email: "sarahw@academy.com" },
  { id: 7, name: "Emily Davis", email: "emily@academy.com" },
  { id: 8, name: "Tom Wilson", email: "tom@academy.com" },
]

export const jerseyColors: JerseyColor[] = [
  { id: 1, name: "Blue", color: "#3B82F6" },
  { id: 2, name: "Red", color: "#EF4444" },
  { id: 3, name: "Black", color: "#171717" },
]
