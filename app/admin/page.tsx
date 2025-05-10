import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Access the order management system to view all orders, update their status, and manage customer requests.
            </p>
            <Button asChild>
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Statistics</CardTitle>
            <CardDescription>View website performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Check visitor statistics, popular menu items, and other performance metrics.</p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
