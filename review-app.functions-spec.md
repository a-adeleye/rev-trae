6.1. Triggers

onCreate(review)

Recalculate entity aggregates: ratingCount, ratingSum, ratingAverage, lastReviewAt.

onUpdate(review)

If rating or status changed: adjust aggregates.

onDelete(review)

Decrement aggregates.

onCreate(ownershipClaim)

Send email/notification to admins (optional).

onWrite(reviewResponses)

Optional: notify review author.

Optional callable functions for admin actions (if you want server-only flows):

approveClaim(claimId)

rejectClaim(claimId)