import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TestimonialCard from "@/components/testimonial-card"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-700 dark:to-orange-900 py-20 text-white">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Authentic Arabian Cuisine Delivered To Your Door</h1>
            <p className="text-lg md:text-xl">
              Experience the rich flavors of Arabian cuisine with our freshly prepared meals delivered straight to your
              doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link href="/menu">Order Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-orange-600 hover:bg-white/20">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src="/arabian cuisine.webp?height=400&width=600"
              alt="Delicious Arabian Food"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Signature Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src="/kabsa.jpg?height=300&width=500" alt="Kabsa" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Kabsa</h3>
                <p className="text-muted-foreground mb-4">
                  A flavorful rice dish made with aromatic spices, tender meat, and garnished with nuts and raisins.
                </p>
                <Button asChild>
                  <Link href="/menu">Order Now</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src="/pist.jpg?height=300&width=500" alt="Pastitsio" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">Pastitsio</h3>
                <p className="text-muted-foreground mb-4">
                  A delicious baked pasta dish with seasoned ground meat and a creamy béchamel sauce.
                </p>
                <Button asChild>
                  <Link href="/menu">Order Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Choose Your Package</h3>
              <p className="text-muted-foreground">Select your favorite main dish, sides, and drinks from our menu.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Place Your Order</h3>
              <p className="text-muted-foreground">Enter your delivery address and any special instructions.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Enjoy Your Meal</h3>
              <p className="text-muted-foreground">We'll deliver your freshly prepared meal straight to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Salem M."
              quote="The Kabsa was absolutely delicious! Authentic flavors and generous portions. Will definitely order again!"
              rating={5}
            />
            <TestimonialCard
              name="Ahmed K."
              quote="Fast delivery and the food was still hot when it arrived. The Pastitsio was amazing and the garlic sauce was perfect."
              rating={5}
            />
            <TestimonialCard
              name="J T."
              quote="Great value for money. The food is fresh and tasty, and I love that I can customize my sides and drinks."
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary dark:bg-primary/80 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the authentic taste of Arabian cuisine delivered to your doorstep.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
            <Link href="/menu">Order Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
