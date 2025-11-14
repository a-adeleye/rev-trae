1.1. Overview

Product name: (placeholder)

Tagline: Unified reviews for brands, products, movies, music.

Goal: Allow users to:

Discover brands/products/movies/music.

Write reviews & ratings.

Let owners claim entities, see reviews, and respond.

Platforms: Web (responsive SPA).

1.2. User Types

Anonymous visitor

Browse entities & reviews.

Search entities.

Registered user

Sign in with:

Passwordless email link.

Google login.

Create entities (when missing).

Write, edit, delete own reviews.

Flag reviews/responses.

Owner

Everything a registered user can.

Claim entities.

View owner dashboard.

Respond to reviews for owned entities.

Admin

Moderate reviews/responses.

Review ownership claims.

Manage entity visibility.

1.3. Core Features (v1)

Auth

Sign up / sign in with:

Email link (passwordless).

Google.

Basic profile (displayName, avatar placeholder).

Logout.

Entities & Search

Entity types: brand, product, movie, music.

Public entity page with:

Name, type, description, metadata summary.

Average rating, count, rating distribution.

Reviews list.

Search / filter:

Search by name.

Filter by type.

Reviews

Write a review:

Choose entity (search) OR create new entity inline.

Rate 1–5 stars.

Title and body.

Edit/delete own review.

View review list on entity page.

Mark reviews helpful/not helpful (optional v1.1).

Entity creation during review

If entity not found:

“Create new [type]” option.

Minimal required fields: name, type, optional description.

After creation, continue review flow.

Ownership & Dashboard

Claim entity:

“Is this your [type]?” link on entity page.

Claim form (message, website, company email).

Owner dashboard:

List of owned entities.

For each entity: stats + latest reviews.

Respond to reviews:

Owners can post a single primary response per review.

Edit/hide their response.

Admin features (basic)

List of ownership claims.

Approve/reject claims.

Optionally hide/flag reviews.

1.4. Non-functional Requirements

UX: Clean, minimal, responsive, keyboard-friendly.

Performance: Core views load < 2s on decent connection.

Tech: Frontend SPA - Angular, backend Firebase (Auth, Firestore, Functions).

Data phases:

Phase 1: Fully static data (local JSON).

Phase 2: Firestore + Cloud Functions integration.