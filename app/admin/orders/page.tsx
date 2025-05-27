"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, MapPin, User, Phone, FileText, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

type OrderItem = {
  name: string
  price: number
  quantity: number
}

type OrderStatus = "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"

type Order = {
  id: string
  customerName: string
  phone: string
  address: string
  date: Timestamp | string
  status: OrderStatus
  total: number
  items: OrderItem[]
  notes: string
}

export default function OrdersAdminPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch orders from Firebase
  useEffect(() => {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, orderBy("date", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ordersData: Order[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          ordersData.push({
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
        setOrders(ordersData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching orders: ", error)
        toast({
          title: "Error fetching orders",
          description: "Please check your connection and try again.",
          variant: "destructive",
        })
        setLoading(false)

        // If Firebase is not configured, show mock data
        // if (error.code === "permission-denied" || error.code === "app-deleted") {
        //   setOrders(getMockOrders())
        // }
      },
    )

    return () => unsubscribe()
  }, [toast])

  // Filter orders based on search term, status, and date
  useEffect(() => {
    let result = orders

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (dateFilter) {
      result = result.filter((order) => {
        if (typeof order.date === "string") {
          return new Date(order.date).toISOString().split("T")[0] === dateFilter
        } else if (order.date instanceof Timestamp) {
          return order.date.toDate().toISOString().split("T")[0] === dateFilter
        }
        return false
      })
    }

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter, dateFilter])

  // Update order status in Firebase
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
      })

      toast({
        title: "Order status updated",
        description: `Order ${orderId} has been updated to ${newStatus}.`,
      })

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      console.error("Error updating order status: ", error)
      toast({
        title: "Error updating order",
        description: "Please try again later.",
        variant: "destructive",
      })

      // If Firebase is not configured, update local state
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      setOrders(updatedOrders)

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    }
  }

  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  // Format date for display
  const formatDate = (dateValue: Timestamp | string | undefined) => {
    if (!dateValue) return "N/A"

    const date = dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue)

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateValue: Timestamp | string | undefined) => {
    if (!dateValue) return "N/A"

    const date = dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue)

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge color
  const getStatusBadge = (status: OrderStatus) => {
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

  // Get counts for dashboard
  const getOrderCounts = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      inProgress: orders.filter((o) => ["preparing", "out-for-delivery"].includes(o.status)).length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    }
  }

  const counts = getOrderCounts()

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Order Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.inProgress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.delivered}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage customer orders and update their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name or address..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{order.total.toFixed(2)} MYR</TableCell>
                      <TableCell>{getStatusBadge(order.status as OrderStatus)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                            View
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id.substring(0, 8)}</DialogTitle>
            <DialogDescription>
              {formatDate(selectedOrder?.date)} at {formatTime(selectedOrder?.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{selectedOrder.address}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Special Instructions</h3>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{selectedOrder.notes}</span>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Order Status</h3>
                  <div className="flex items-center gap-2">{getStatusBadge(selectedOrder.status as OrderStatus)}</div>

                  <div className="mt-4">
                    <Label htmlFor="update-status">Update Status</Label>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)} MYR</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{selectedOrder.total.toFixed(2)} MYR</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data for when Firebase is not configured
// function getMockOrders() {
//   return [
//     {
//       id: "ORD-001",
//       customerName: "Ahmed Ali",
//       phone: "+123-456-7890",
//       address: "123 Main St, Apartment 4B, City",
//       date: new Date("2023-05-08T14:30:00").toISOString(),
//       status: "pending",
//       total: 27.98,
//       items: [
//         { name: "Kabsa", price: 12.99, quantity: 1 },
//         { name: "Garlic Sauce", price: 1.5, quantity: 1 },
//         { name: "Salad", price: 3.5, quantity: 1 },
//         { name: "Coca Cola", price: 1.99, quantity: 2 },
//       ],
//       notes: "Please make it spicy and include extra napkins.",
//     },
//     {
//       id: "ORD-002",
//       customerName: "Sarah Johnson",
//       phone: "+123-555-1234",
//       address: "456 Oak Avenue, Suite 7, Town",
//       date: new Date("2023-05-08T15:45:00").toISOString(),
//       status: "preparing",
//       total: 32.47,
//       items: [
//         { name: "Pastitsio", price: 14.99, quantity: 1 },
//         { name: "Tomato Sauce", price: 1.5, quantity: 1 },
//         { name: "Salad", price: 3.5, quantity: 1 },
//         { name: "Apple Juice", price: 2.49, quantity: 2 },
//       ],
//       notes: "No onions in the salad please.",
//     },
//     {
//       id: "ORD-003",
//       customerName: "Mohammed Hassan",
//       phone: "+123-789-4561",
//       address: "789 Pine Street, Building C, Village",
//       date: new Date("2023-05-08T16:15:00").toISOString(),
//       status: "delivered",
//       total: 41.96,
//       items: [
//         { name: "Kabsa", price: 12.99, quantity: 2 },
//         { name: "Garlic Sauce", price: 1.5, quantity: 2 },
//         { name: "Tomato Sauce", price: 1.5, quantity: 1 },
//         { name: "Water", price: 0.99, quantity: 2 },
//       ],
//       notes: "",
//     },
//     {
//       id: "ORD-004",
//       customerName: "Emily Chen",
//       phone: "+123-321-6547",
//       address: "101 Maple Road, Apartment 12D, City",
//       date: new Date("2023-05-08T17:30:00").toISOString(),
//       status: "out-for-delivery",
//       total: 29.97,
//       items: [
//         { name: "Pastitsio", price: 14.99, quantity: 1 },
//         { name: "Garlic Sauce", price: 1.5, quantity: 1 },
//         { name: "Salad", price: 3.5, quantity: 1 },
//         { name: "Coca Cola", price: 1.99, quantity: 1 },
//         { name: "Apple Juice", price: 2.49, quantity: 1 },
//       ],
//       notes: "Please ring doorbell twice.",
//     },
//     {
//       id: "ORD-005",
//       customerName: "John Smith",
//       phone: "+123-852-9637",
//       address: "222 Cedar Lane, House 5, Suburb",
//       date: new Date("2023-05-08T18:00:00").toISOString(),
//       status: "pending",
//       total: 55.95,
//       items: [
//         { name: "Kabsa", price: 12.99, quantity: 2 },
//         { name: "Pastitsio", price: 14.99, quantity: 1 },
//         { name: "Garlic Sauce", price: 1.5, quantity: 2 },
//         { name: "Tomato Sauce", price: 1.5, quantity: 1 },
//         { name: "Salad", price: 3.5, quantity: 2 },
//         { name: "Coca Cola", price: 1.99, quantity: 1 },
//       ],
//       notes: "This is for a birthday celebration.",
//     },
//   ] as Order[]
// }
