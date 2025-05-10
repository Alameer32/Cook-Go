"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Check, AlertCircle, CheckCircle } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

type MainDish = "kabsa" | "pastitsio"
type Side = "garlic" | "tomato" | "salad"
type Drink = "water" | "coke" | "apple"

// Menu items with prices
const menuItems = {
  mainDishes: {
    kabsa: { name: "Kabsa", price: 100 },
    pastitsio: { name: "Pastitsio", price: 120 },
  },
  sides: {
    garlic: { name: "Garlic Sauce", price: 3 },
    tomato: { name: "Tomato Sauce", price: 3 },
    salad: { name: "Salad", price: 5 },
  },
  drinks: {
    water: { name: "Water", price: 1.5 },
    coke: { name: "Coca Cola", price: 3 },
    apple: { name: "Apple Juice", price: 3 },
  },
}

export default function MenuPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedDish, setSelectedDish] = useState<MainDish>("kabsa")
  const [selectedSides, setSelectedSides] = useState<Side[]>([])
  const [selectedDrink, setSelectedDrink] = useState<Drink>("water")
  const [notes, setNotes] = useState("")
  const [address, setAddress] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Load user data if logged in
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser
      if (user) {
        // Try to get user profile data
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            if (userData) {
              setName(userData.displayName || "")
              setPhone(userData.phoneNumber || "")
              setAddress(userData.address || "")
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    }

    loadUserData()
  }, [])

  const toggleSide = (side: Side) => {
    if (selectedSides.includes(side)) {
      setSelectedSides(selectedSides.filter((s) => s !== side))
    } else {
      setSelectedSides([...selectedSides, side])
    }
  }

  // Calculate order total
  const calculateTotal = () => {
    let total = menuItems.mainDishes[selectedDish].price

    // Add sides
    selectedSides.forEach((side) => {
      total += menuItems.sides[side].price
    })

    // Add drink
    total += menuItems.drinks[selectedDrink].price

    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setOrderId(null)

    if (!address || !name || !phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create order items array
      const items = [
        {
          name: menuItems.mainDishes[selectedDish].name,
          price: menuItems.mainDishes[selectedDish].price,
          quantity: 1,
        },
        ...selectedSides.map((side) => ({
          name: menuItems.sides[side].name,
          price: menuItems.sides[side].price,
          quantity: 1,
        })),
        {
          name: menuItems.drinks[selectedDrink].name,
          price: menuItems.drinks[selectedDrink].price,
          quantity: 1,
        },
      ]

      // Calculate total
      const total = calculateTotal()

      // Create order object
      const orderData = {
        customerName: name,
        phone,
        address,
        items,
        notes,
        total,
        status: "pending",
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid || null, // Add user ID if logged in
      }

      // Save to Firebase
      try {
        const ordersCollectionRef = collection(db, "orders")
        const docRef = await addDoc(ordersCollectionRef, orderData)
        console.log("Order saved with ID:", docRef.id)
        setOrderId(docRef.id)
        setSuccess(true)

        // Reset form completely
        setSelectedDish("kabsa")
        setSelectedSides([])
        setSelectedDrink("water")
        setNotes("")

        // Don't reset user info if they're logged in
        if (!auth.currentUser) {
          setAddress("")
          setName("")
          setPhone("")
        }

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" })

        toast({
          title: "Order placed successfully!",
          description: "Your delicious meal will be on its way soon.",
        })
      } catch (error: any) {
        console.error("Error adding order: ", error)

        if (error.code === "permission-denied") {
          setError("Permission denied. Please check your Firebase security rules.")
        } else {
          setError(`Error placing order: ${error.message}`)
        }
      }
    } catch (error: any) {
      console.error("Error processing order: ", error)
      setError(`Error processing order: ${error.message}`)

      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>

      {success && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Order Placed Successfully!</AlertTitle>
          <AlertDescription>
            Your order (ID: {orderId?.substring(0, 8)}) has been placed successfully. You can track your order in your
            profile.
            <div className="mt-4">
              <Button onClick={() => router.push("/profile?tab=orders")} variant="outline" size="sm">
                View Order History
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">1. Choose Your Main Dish</h2>
            <Tabs defaultValue="kabsa" onValueChange={(value) => setSelectedDish(value as MainDish)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kabsa">Kabsa</TabsTrigger>
                <TabsTrigger value="pastitsio">Pastitsio</TabsTrigger>
              </TabsList>
              <TabsContent value="kabsa">
                <Card>
                  <div className="relative h-48 w-full">
                    <Image
                      src="/kabsa.jpg?height=300&width=500"
                      alt="Kabsa"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Kabsa</CardTitle>
                    <CardDescription>
                      A traditional Arabian rice dish made with basmati rice, meat, vegetables, and a blend of spices.
                      enough for 5-6 pax.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg">{menuItems.mainDishes.kabsa.price.toFixed(2)} MYR</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pastitsio">
                <Card>
                  <div className="relative h-48 w-full">
                    <Image
                      src="/pist.jpg?height=300&width=500"
                      alt="Pastitsio"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Pastitsio</CardTitle>
                    <CardDescription>
                      A delicious baked pasta dish with seasoned ground meat and a creamy béchamel sauce. enough for 6-7 pax.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg">{menuItems.mainDishes.pastitsio.price.toFixed(2)} MYR</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">2. Choose Your Sides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer ${selectedSides.includes("garlic") ? "ring-2 ring-primary" : ""} hover:bg-accent/50 transition-colors`}
                onClick={() => toggleSide("garlic")}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Garlic Sauce</CardTitle>
                    {selectedSides.includes("garlic") && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </CardHeader>
                <div className="relative h-24 w-full">
                  <Image src="/garlic.jpg?height=100&width=200" alt="Garlic Sauce" fill className="object-cover" />
                </div>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm font-medium">{menuItems.sides.garlic.price.toFixed(2)} MYR</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedSides.includes("tomato") ? "ring-2 ring-primary" : ""} hover:bg-accent/50 transition-colors`}
                onClick={() => toggleSide("tomato")}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Tomato Sauce</CardTitle>
                    {selectedSides.includes("tomato") && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </CardHeader>
                <div className="relative h-24 w-full">
                  <Image src="/tomato.jpg?height=100&width=200" alt="Tomato Sauce" fill className="object-cover" />
                </div>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm font-medium">{menuItems.sides.tomato.price.toFixed(2)} MYR</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer ${selectedSides.includes("salad") ? "ring-2 ring-primary" : ""} hover:bg-accent/50 transition-colors`}
                onClick={() => toggleSide("salad")}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Salad</CardTitle>
                    {selectedSides.includes("salad") && <Check className="h-5 w-5 text-primary" />}
                  </div>
                </CardHeader>
                <div className="relative h-24 w-full">
                  <Image src="/salad.jpg?height=100&width=200" alt="Salad" fill className="object-cover" />
                </div>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm font-medium">{menuItems.sides.salad.price.toFixed(2)} MYR</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-6">3. Choose Your Drink</h2>
            <RadioGroup defaultValue="water" onValueChange={(value) => setSelectedDrink(value as Drink)}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="water" id="water" />
                  <Label htmlFor="water">Water ({menuItems.drinks.water.price.toFixed(2)} MYR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coke" id="coke" />
                  <Label htmlFor="coke">Coca Cola ({menuItems.drinks.coke.price.toFixed(2)} MYR)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple">Apple Juice ({menuItems.drinks.apple.price.toFixed(2)} MYR)</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
            <CardDescription>Let us know if you have any special requests or dietary requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any special instructions here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
            <CardDescription>Please provide your delivery details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="cash">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="online" id="online" disabled />
                <Label htmlFor="online" className="text-muted-foreground">
                  Online Payment (Coming Soon)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-lg font-bold">Total: {calculateTotal().toFixed(2)} MYR</div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
