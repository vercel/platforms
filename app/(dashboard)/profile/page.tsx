import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Award } from "lucide-react"

const achievements = [
  { title: "First Win", icon: Trophy, description: "Won your first game" },
  { title: "Sharp Shooter", icon: Target, description: "High accuracy achievement" },
  { title: "Rising Star", icon: Star, description: "Top 10% of players" },
  { title: "Champion", icon: Award, description: "Tournament winner" },
]

const recentGames = [
  { opponent: "Team Alpha", result: "Won", score: "3-1", date: "Today" },
  { opponent: "Team Beta", result: "Lost", score: "2-3", date: "Yesterday" },
  { opponent: "Team Gamma", result: "Won", score: "4-0", date: "2 days ago" },
]

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your player profile
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="size-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
              <AvatarFallback className="text-2xl">PG</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">Pro Gamer</CardTitle>
            <CardDescription>player@academypoolpro.com</CardDescription>
            <div className="flex gap-2 pt-2">
              <Badge>Level 42</Badge>
              <Badge variant="secondary">Elite</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Games</p>
              </div>
              <div>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Trophies</p>
              </div>
            </div>
            <Button className="mt-6 w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your unlocked achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.title}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <achievement.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
              <CardDescription>Your latest match history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {recentGames.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">vs {game.opponent}</p>
                      <p className="text-xs text-muted-foreground">{game.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{game.score}</span>
                      <Badge
                        variant={game.result === "Won" ? "default" : "secondary"}
                        className={game.result === "Won" ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                      >
                        {game.result}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
