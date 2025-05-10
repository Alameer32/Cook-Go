import Image from "next/image"

export interface TeamMemberProps {
  name: string
  role: string
  bio?: string
  imageUrl: string
}

export default function TeamMember({ name, role, bio, imageUrl }: TeamMemberProps) {
  return (
    <div className="text-center group">
      <div className="relative h-80 w-full rounded-lg overflow-hidden mb-4 transition-all duration-300 group-hover:shadow-lg">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`${name} - ${role}`}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-muted-foreground">{role}</p>
      {bio && <p className="text-sm text-muted-foreground mt-2">{bio}</p>}
    </div>
  )
}
