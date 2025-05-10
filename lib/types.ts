export interface UserProfile {
  uid: string
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  address: string | null
  photoURL: string | null
  createdAt?: string
  lastLogin?: string
  favoriteItems?: string[]
}
