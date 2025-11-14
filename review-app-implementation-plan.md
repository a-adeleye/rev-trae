Phase 0 – Foundations (Docs + Skeleton)

Create repository + basic structure

Setup frontend project - Angular.

Write the docs above (stubs)

review-app.prd.md

review-app.data-model.md

review-app.architecture.md

review-app.ux-ui-spec.md

review-app.functions-spec.md

Define routing structure

/ (home)

/login

/entities

/entities/:id

/write-review

/owner/dashboard

/admin


Phase 1 – Static UI with Mock Data (no Firebase)

Goal: End-to-end flows with static JSON/local state.

1. Static data setup

Create mock/entities.json, mock/reviews.json, mock/users.json.

Create utility layer for querying mocks (search, filters).

2. Layout & navigation

Build base layout: header (logo + login button), footer.

Add navigation: Home, Explore, Dashboard (only for “logged in” mock state).

3. Auth (mocked)

Simple in-memory auth store:

“Log in as regular user”.

“Log in as owner”.

“Log in as admin”.

Show appropriate menus based on role.

4. Public flows (mocked)

Home & search

Hook search bar to filter over mock/entities.

Entity list & detail

List cards from mock/entities.

Entity detail page:

Display data from mock/entities.

Show reviews from mock/reviews by entityId.

Show mock rating average.

5. Write Review flow (mocked)

/write-review or modal on entity page:

Step 1: select entity (search over mocks) or “create new”.

Step 2: rating + title + body.

On submit:

Append to local reviews state.

Update local entities rating metrics.

6. Ownership + owner dashboard (mocked)

Mock entityOwners and ownershipClaims in JSON.

Owner dashboard:

List owned entities from mocks.

For each, show reviews & allow adding a mock “response” (local state).

Claim entity:

On entity page, show claim form (writes to local claims state).

7. Admin (mocked)

Claim moderation:

List pending claims.

Approve/reject (update mock data state; reflect in entityOwners).

8. UI polish

Implement consistent typography & spacing.

Ensure responsiveness.

Add loading/skeleton states (even if no real loading yet).

Phase 2 – Firebase Integration (replace mocks)
1. Firebase setup

Create Firebase project.

Enable:

Firestore.

Authentication:

Email link (passwordless).

Google provider.

Add Firebase SDK to frontend.

2. Auth integration (real)

Implement email link flow:

Email form → call sendSignInLinkToEmail.

Handle callback page reading oobCode → sign user in.

Implement Google login:

Sign in with popup/redirect.

On first login:

Ensure users/{userId} doc exists (cloud function or client-side).

Replace mock auth store:

Use Firebase auth state for current user + role from users doc.

3. Firestore data integration

Replace all mock data reads with Firestore queries:

Home/Explore: query entities.

Entity detail: entities/{id} + reviews for entityId.

Owner dashboard: query entityOwners by userId then fetch entities.

Replace mock writes:

Write review → reviews collection.

Create entity → entities.

Claim entity → ownershipClaims.

Respond to review → reviewResponses.

4. Cloud Functions

Implement review aggregate triggers (onCreate/Update/Delete on reviews).

Implement (optional) callable approveClaim/rejectClaim that:

Updates ownershipClaims.

Creates entityOwners.

5. Security rules

Implement rules enforcing:

Auth-only writes.

Users can only modify their own reviews.

Only owners/admins can create review responses.

Only admins can modify ownershipClaims status and entityOwners.

Test rules with the Firebase emulator.

6. Replace any remaining mock behavior

Remove mock JSON and in-memory hacks.

Ensure all flows work against Firestore:

Anonymous user browse.

Auth flows.

Write review (with optional entity creation).

Claim entity.

Owner dashboard & responses.

Admin claim moderation.

7. Testing & hardening

Add basic unit/integration tests (if applicable).

Test edge cases:

Deleting reviews.

Updating ratings.

Multiple owners for one entity.

Failed auth, expired email links.