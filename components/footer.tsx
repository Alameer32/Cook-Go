import Link from "next/link"
import { PhoneIcon as WhatsApp, Instagram } from "lucide-react"
export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cook&Go</h3>
            <p className="text-muted-foreground">
              Delicious Arabian food delivered straight to your doorstep. Fresh ingredients, authentic recipes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              Email:salmanalameer2@gmail.com
              <br />
              Phone: +60 11 3973 2242
            </p>
            <div className="flex space-x-4">
               <Link href="http://wa.me/601139732242" className="text-muted-foreground hover:text-primary transition-colors">
                <WhatsApp className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </Link>
              <Link href="https://www.instagram.com/cookgo2025/" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cook&Go. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
