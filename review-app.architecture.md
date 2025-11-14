3.1. High-Level Architecture

Frontend: SPA- Angular

Routes, Components, State (static first).

Backend: Firebase:

Auth: Email link + Google.

Firestore: collections above.

Cloud Functions:

Review aggregate updates.

Notifications (optional).

Admin actions if needed server-side.

3.2. Authentication Flows
3.2.1. Passwordless Email (Email Link)

User enters email.

App calls Firebase sendSignInLinkToEmail.

User clicks link in email → app verifies link → signs in.

On first sign-in:

Create users/{userId} doc if missing.

3.2.2. Google Login

signInWithPopup/signInWithRedirect using Google provider.

On success:

Create/merge user in users collection.

3.3. Main User Flows (end-to-end, with Firebase in phase 2)

Browse/search entities → view entity page → read reviews.

Sign in (email link / Google) → write review on existing entity.

Create entity during review → submit review.

Owner claim an entity → admin approves → owner sees it in dashboard.

Owner responds to a review → response appears under review.