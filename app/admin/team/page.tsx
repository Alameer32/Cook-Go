"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { teamMembers } from "@/data/team-members"
import TeamMember from "@/components/team-member"

export default function TeamManagementPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [bio, setBio] = useState("")
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=300&width=300")
  const [members, setMembers] = useState(teamMembers)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Add new team member
    const newMember = {
      name,
      role,
      bio: bio || undefined,
      imageUrl,
    }

    setMembers([...members, newMember])

    // Reset form
    setName("")
    setRole("")
    setBio("")
    setImageUrl("/placeholder.svg?height=300&width=300")

    toast({
      title: "Team member added",
      description: `${name} has been added to the team.`,
    })
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Team Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
              <CardDescription>Add a new member to your team. They will appear on the About Us page.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Chef, Manager, etc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A short bio about the team member"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL to profile image"
                  />
                  <p className="text-xs text-muted-foreground">Leave as default for a placeholder image</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Add Team Member
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Current Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {members.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageUrl={member.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
