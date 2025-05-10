import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  quote: string
  rating: number
}

export default function TestimonialCard({ name, quote, rating }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating
                  ? "text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        <p className="mb-4 italic">"{quote}"</p>
        <p className="font-semibold">{name}</p>
      </CardContent>
    </Card>
  )
}
