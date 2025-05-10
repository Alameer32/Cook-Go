# Cook&Go - Arabian Food Delivery

A Next.js application for an Arabian food delivery service with user authentication, admin dashboard, and order management.

## Features

- User authentication (login/signup)
- User profiles
- Menu browsing and ordering
- Shopping cart
- Order management for admins
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/cook-and-go.git
cd cook-and-go
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a `.env.local` file in the root directory with your Firebase configuration:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Set up the security rules as defined in `firebase-security-rules.txt`

## Deployment

The application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your environment variables
4. Deploy

## Admin Access

To create an admin account:
1. Sign up with the email specified in `lib/constants.ts` (ADMIN_EMAIL)
2. This account will have access to the admin dashboard and order management

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utility functions and Firebase setup
- `/public` - Static assets
- `/data` - Data files (menu items, team members)

## License

This project is licensed under the MIT License.
\`\`\`

Let's add the team member images to the public folder:
