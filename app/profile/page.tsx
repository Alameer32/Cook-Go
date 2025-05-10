"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Package } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserProfile {
  uid: string
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  address: string | null
  createdAt?: any
}

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerName: string
  phone: string
  address: string
  date: any
  status: string
  total: number
  items: OrderItem[]
  notes: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  useEffect(() => {
    // Set a cookie for middleware authentication
    const setAuthCookie = (token: string) => {
      document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set auth cookie for middleware
        user.getIdToken().then(setAuthCookie)

        setLoading(true)
        try {
          // Try to get existing profile
          const userRef = doc(db, "users", user.uid)
          const userSnap = await getDoc(userRef)

          let userProfile: UserProfile

          if (userSnap.exists()) {
            // Use existing profile
            userProfile = userSnap.data() as UserProfile
          } else {
            // Create new profile
            userProfile = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              address: null,
              createdAt: serverTimestamp(),
            }

            // Save new profile to Firestore
            await setDoc(userRef, userProfile)
          }

          setProfile(userProfile)
          setDisplayName(userProfile.displayName || "")
          setPhoneNumber(userProfile.phoneNumber || "")
          setAddress(userProfile.address || "")

          // Fetch user orders
          fetchUserOrders(user.uid)
        } catch (error) {
          console.error("Error fetching profile:", error)
          toast({
            title: "Error loading profile",
            description: "There was an error loading your profile. Please try again.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        // Not logged in, redirect to login
        router.push("/login?callbackUrl=/profile")
      }
    })

    return () => unsubscribe()
  }, [router, toast])

  const fetchUserOrders = async (userId: string) => {
    setOrdersLoading(true)
    try {
      // Query orders where userId matches the current user
      // Note: We're removing the orderBy to avoid requiring a composite index
      const ordersRef = collection(db, "orders")
      const q = query(ordersRef, where("userId", "==", userId))

      const querySnapshot = await getDocs(q)
      const userOrders: Order[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        userOrders.push({
          id: doc.id,
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          date: data.date,
          status: data.status,
          total: data.total,
          items: data.items,
          notes: data.notes || "",
        })
      })

      // Sort orders by date manually (newest first)
      userOrders.sort((a, b) => {
        const dateA = a.date?.toDate?.() ? a.date.toDate().getTime() : 0
        const dateB = b.date?.toDate?.() ? b.date.toDate().getTime() : 0
        return dateB - dateA
      })

      setOrders(userOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error loading orders",
        description: "There was an error loading your order history.",
        variant: "destructive",
      })
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!auth.currentUser) {
      toast({
        title: "Not authenticated",
        description: "Please log in to update your profile.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const userRef = doc(db, "users", auth.currentUser.uid)

      await updateDoc(userRef, {
        displayName,
        phoneNumber,
        address,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Update local state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName,
              phoneNumber,
              address,
            }
          : null,
      )
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Format date for display
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "N/A"

    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue)

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Preparing
          </Badge>
        )
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Out for Delivery
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <Tabs defaultValue={tabParam || "profile"} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and delivery details</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Loading your orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Order Details",
                                  description: (
                                    <div className="mt-2 space-y-2">
                                      <p className="font-semibold">Items:</p>
                                      <ul className="list-disc pl-4 space-y-1">
                                        {order.items.map((item, idx) => (
                                          <li key={idx}>
                                            {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                          </li>
                                        ))}
                                      </ul>
                                      {order.notes && (
                                        <>
                                          <p className="font-semibold">Notes:</p>
                                          <p>{order.notes}</p>
                                        </>
                                      )}
                                    </div>
                                  ),
                                })
                              }}
                            >
                              View Items
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <a href="/menu">Browse Menu</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">Preference settings coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
