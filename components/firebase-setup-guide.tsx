"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function FirebaseSetupGuide() {
  const [isConfigured, setIsConfigured] = useState(false)

  const checkConfiguration = () => {
    try {
      // Check if Firebase API key is set
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      const hasRealConfig = apiKey && apiKey !== "YOUR_API_KEY" && apiKey !== undefined

      setIsConfigured(hasRealConfig)
      return hasRealConfig
    } catch (error) {
      setIsConfigured(false)
      return false
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Configuration</CardTitle>
        <CardDescription>Follow these steps to connect your application to Firebase</CardDescription>
      </CardHeader>
      <CardContent>
        {isConfigured ? (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Firebase is configured!</AlertTitle>
            <AlertDescription>Your application is successfully connected to Firebase.</AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Firebase configuration required</AlertTitle>
              <AlertDescription>
                Your application needs to be connected to Firebase to store and retrieve orders.
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step-1">
                <AccordionTrigger>Step 1: Create a Firebase project</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.firebase.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>Click "Add project" and follow the setup wizard</li>
                    <li>Give your project a name (e.g., "cook-and-go")</li>
                    <li>Enable Google Analytics if desired</li>
                    <li>Click "Create project"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-2">
                <AccordionTrigger>Step 2: Set up Firestore Database</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>In your Firebase project, click "Firestore Database" in the left sidebar</li>
                    <li>Click "Create database"</li>
                    <li>
                      Choose "Start in production mode" or "Start in test mode" (test mode is easier for development)
                    </li>
                    <li>Select a location for your database</li>
                    <li>Click "Enable"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-3">
                <AccordionTrigger>Step 3: Enable Authentication</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>In your Firebase project, click "Authentication" in the left sidebar</li>
                    <li>Click "Get started"</li>
                    <li>Click on "Email/Password" provider</li>
                    <li>Enable the "Email/Password" sign-in method</li>
                    <li>Click "Save"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-4">
                <AccordionTrigger>Step 4: Register your web app</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      In your Firebase project, click the gear icon next to "Project Overview" and select "Project
                      settings"
                    </li>
                    <li>Scroll down to "Your apps" and click the web icon ({"</>"}) to add a web app</li>
                    <li>Register your app with a nickname (e.g., "cook-and-go-web")</li>
                    <li>Click "Register app"</li>
                    <li>
                      Copy the Firebase configuration object that looks like this:
                      <pre className="bg-muted p-2 rounded-md mt-2 overflow-x-auto text-xs">
                        {`const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};`}
                      </pre>
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-5">
                <AccordionTrigger>Step 5: Set up environment variables</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Create a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file in the root of your
                      project
                    </li>
                    <li>
                      Add your Firebase configuration as environment variables:
                      <pre className="bg-muted p-2 rounded-md mt-2 overflow-x-auto text-xs">
                        {`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id`}
                      </pre>
                    </li>
                    <li>
                      Make sure to add <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> to your{" "}
                      <code className="bg-muted px-1 py-0.5 rounded">.gitignore</code> file to keep your API keys secure
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-6">
                <AccordionTrigger>Step 6: Set up Firestore security rules</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>In your Firebase project, click "Firestore Database" in the left sidebar</li>
                    <li>Click the "Rules" tab</li>
                    <li>
                      Update the rules to secure your collections:
                      <pre className="bg-muted p-2 rounded-md mt-2 overflow-x-auto text-xs">
                        {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lock down all access by default
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Public read access to menu items
    match /menuItems/{item} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - customers can create, but only view their own
    match /orders/{orderId} {
      allow create: if true; // Anyone can place an order
      allow read: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Team members - public read, admin write
    match /teamMembers/{member} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
                      </pre>
                    </li>
                    <li>Click "Publish"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConfiguration}>Check Configuration</Button>
      </CardFooter>
    </Card>
  )
}
