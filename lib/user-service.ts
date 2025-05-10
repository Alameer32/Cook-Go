import { db, auth } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import type { UserProfile } from "@/lib/types"

// Create a new user profile in Firestore
export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  try {
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error creating user profile:", error)
    return false
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    } else {
      // If profile doesn't exist yet, create one with basic info
      const user = auth.currentUser
      if (user) {
        const newProfile: Partial<UserProfile> = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
        }
        await createUserProfile(uid, newProfile)
        return newProfile as UserProfile
      }
      return null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Update user profile in Firestore
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}
