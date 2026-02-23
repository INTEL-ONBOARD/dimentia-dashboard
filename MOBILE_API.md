# Dimentia Mobile App — API Integration Guide

This document covers every API endpoint the mobile app must call to push data into MongoDB,
which the Dimentia dashboard then reads and aggregates.

**Data flow:**
```
Mobile App  →  POST/PUT/DELETE /api/mobile/*  →  MongoDB  ←  Dashboard reads & aggregates
```

---

## Table of Contents

1. [Base URL & Conventions](#1-base-url--conventions)
2. [Authentication](#2-authentication)
   - [Register](#21-register)
   - [Login](#22-login)
3. [User Profile](#3-user-profile)
   - [Get My Profile](#31-get-my-profile)
   - [Update My Profile](#32-update-my-profile)
4. [Sessions](#4-sessions)
   - [Log a Session](#41-log-a-session)
5. [Symptoms](#5-symptoms)
   - [Log Symptoms](#51-log-symptoms)
   - [Get Symptom History](#52-get-symptom-history)
6. [Moods](#6-moods)
   - [Log a Mood](#61-log-a-mood)
   - [Get Mood History](#62-get-mood-history)
7. [Reminders](#7-reminders)
   - [Create a Reminder](#71-create-a-reminder)
   - [List Reminders](#72-list-reminders)
   - [Update a Reminder](#73-update-a-reminder)
   - [Delete a Reminder](#74-delete-a-reminder)
8. [Articles](#8-articles)
   - [Record an Article Interaction](#81-record-an-article-interaction)
9. [Activity](#9-activity)
   - [Log a Custom Activity](#91-log-a-custom-activity)
10. [Points System](#10-points-system)
11. [Error Responses](#11-error-responses)
12. [Integration Checklist](#12-integration-checklist)

---

## 1. Base URL & Conventions

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000` |
| Production  | `https://your-dashboard-domain.com` |

All mobile endpoints are prefixed with `/api/mobile`.

### Request headers

```
Content-Type: application/json
Authorization: Bearer <token>    ← required on all endpoints except register & login
```

### Response envelope

Every response follows the same shape:

```json
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Human-readable error description"
}
```

### Dates

All dates must be sent as **ISO 8601 strings** (e.g. `"2025-08-15T09:30:00.000Z"`).
All dates returned by the API are also ISO 8601 strings.

---

## 2. Authentication

Tokens are **JWT** with a **7-day expiry**. Store the token securely (e.g. Keychain on iOS,
EncryptedSharedPreferences on Android) and attach it to every subsequent request.

---

### 2.1 Register

Create a new patient or caregiver account.

```
POST /api/mobile/auth/register
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullName` | string | yes | |
| `email` | string | yes | Used as login username. Stored lowercase. |
| `password` | string | yes | Minimum 6 characters |
| `age` | number | yes | |
| `gender` | string | yes | `"Male"` \| `"Female"` \| `"Other"` |
| `role` | string | yes | `"Patient"` \| `"Caregiver"` |

**Example request**

```json
{
  "fullName": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securePass1",
  "age": 68,
  "gender": "Female",
  "role": "Patient"
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "fullName": "Alice Johnson",
      "email": "alice@example.com",
      "role": "Patient",
      "age": 68,
      "gender": "Female",
      "totalPoints": 0,
      "totalSessions": 0,
      "status": "Active",
      "registeredDate": "2025-08-15T09:30:00.000Z"
    }
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `fullName, email, password, age, gender, and role are required` |
| 400 | `Password must be at least 6 characters` |
| 400 | `gender must be Male, Female, or Other` |
| 400 | `role must be Patient or Caregiver` |
| 409 | `An account with this email already exists` |

---

### 2.2 Login

Authenticate an existing user and receive a fresh JWT.

```
POST /api/mobile/auth/login
```

**Request body**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | yes |
| `password` | string | yes |

**Example request**

```json
{
  "email": "alice@example.com",
  "password": "securePass1"
}
```

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "fullName": "Alice Johnson",
      "email": "alice@example.com",
      "role": "Patient",
      "age": 68,
      "gender": "Female",
      "totalPoints": 45,
      "totalSessions": 7,
      "status": "Active",
      "registeredDate": "2025-08-15T09:30:00.000Z",
      "lastActive": "2025-08-20T14:22:00.000Z"
    }
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `email and password are required` |
| 401 | `Invalid email or password` |

---

## 3. User Profile

---

### 3.1 Get My Profile

Returns the full profile of the currently authenticated user.

```
GET /api/mobile/users
Authorization: Bearer <token>
```

**No request body.**

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Alice Johnson",
    "email": "alice@example.com",
    "role": "Patient",
    "age": 68,
    "gender": "Female",
    "totalPoints": 45,
    "totalSessions": 7,
    "status": "Active",
    "registeredDate": "2025-08-15T09:30:00.000Z",
    "lastActive": "2025-08-20T14:22:00.000Z"
  }
}
```

---

### 3.2 Update My Profile

Update mutable fields on the authenticated user's profile.
Call this to update `lastActive` each time the app is opened.

```
PUT /api/mobile/users/:id
Authorization: Bearer <token>
```

> `:id` must match the `id` from the login/register response. Users can only update their own profile.

**Request body** — all fields optional, send only what changed

| Field | Type | Notes |
|-------|------|-------|
| `fullName` | string | |
| `age` | number | |
| `gender` | string | `"Male"` \| `"Female"` \| `"Other"` |
| `status` | string | `"Active"` \| `"Inactive"` |
| `lastActive` | string (ISO date) | Send on every app open to keep the dashboard accurate |

**Example request**

```json
{
  "lastActive": "2025-08-21T08:00:00.000Z"
}
```

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "fullName": "Alice Johnson",
    "email": "alice@example.com",
    "role": "Patient",
    "age": 68,
    "gender": "Female",
    "totalPoints": 45,
    "totalSessions": 7,
    "status": "Active",
    "lastActive": "2025-08-21T08:00:00.000Z"
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `No updatable fields provided` |
| 403 | `Forbidden` |
| 404 | `User not found` |

---

## 4. Sessions

---

### 4.1 Log a Session

Call this **when the user closes or backgrounds the app** to record the completed session.
Automatically increments the user's `totalSessions` counter on the dashboard.

```
POST /api/mobile/sessions
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `startedAt` | string (ISO date) | yes | When the session began |
| `endedAt` | string (ISO date) | yes | When the session ended |
| `durationSeconds` | number | yes | Total seconds the app was active |
| `featuresUsed` | string[] | no | e.g. `["reminders", "articles", "mood"]` |

**Example request**

```json
{
  "startedAt": "2025-08-21T08:00:00.000Z",
  "endedAt": "2025-08-21T08:18:35.000Z",
  "durationSeconds": 1115,
  "featuresUsed": ["reminders", "mood", "articles"]
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "sessionId": "64f1a2b3c4d5e6f7a8b9c0d2"
  }
}
```

**Suggested feature name strings** (used for dashboard feature-usage chart):

| Feature | String to send |
|---------|----------------|
| Reminder list | `"reminders"` |
| Article reading | `"articles"` |
| Mood tracking | `"mood"` |
| Symptom logging | `"symptoms"` |
| Exercise / activities | `"exercises"` |
| Profile / settings | `"settings"` |

---

## 5. Symptoms

---

### 5.1 Log Symptoms

Record a symptom entry for the authenticated user. Awards **+5 points**.

```
POST /api/mobile/symptoms
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `symptoms` | string[] | yes | One or more symptom strings |
| `notes` | string | no | Free-text notes from the user |
| `loggedAt` | string (ISO date) | no | Defaults to current server time |

**Example request**

```json
{
  "symptoms": ["headache", "fatigue", "memory difficulty"],
  "notes": "Worse in the morning",
  "loggedAt": "2025-08-21T09:15:00.000Z"
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "logId": "64f1a2b3c4d5e6f7a8b9c0d3",
    "pointsEarned": 5
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `symptoms must be a non-empty array of strings` |

---

### 5.2 Get Symptom History

Retrieve the authenticated user's past symptom entries, newest first.

```
GET /api/mobile/symptoms?limit=20&page=1
Authorization: Bearer <token>
```

**Query parameters**

| Param | Type | Default | Max |
|-------|------|---------|-----|
| `limit` | number | `20` | `100` |
| `page` | number | `1` | — |

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "symptoms": ["headache", "fatigue"],
        "notes": "Worse in the morning",
        "loggedAt": "2025-08-21T09:15:00.000Z",
        "createdAt": "2025-08-21T09:15:01.000Z"
      }
    ],
    "total": 24,
    "page": 1,
    "limit": 20
  }
}
```

---

## 6. Moods

---

### 6.1 Log a Mood

Record a mood check-in for the authenticated user. Awards **+5 points**.

```
POST /api/mobile/moods
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `mood` | string | yes | See valid values below |
| `notes` | string | no | Optional free-text |
| `loggedAt` | string (ISO date) | no | Defaults to current server time |

**Valid mood values**

`"Happy"` `"Calm"` `"Okay"` `"Tired"` `"Anxious"` `"Sad"` `"Irritable"` `"Upset"`

**Example request**

```json
{
  "mood": "Anxious",
  "notes": "Busy day, struggling to concentrate",
  "loggedAt": "2025-08-21T14:00:00.000Z"
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "logId": "64f1a2b3c4d5e6f7a8b9c0d4",
    "pointsEarned": 5
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `mood must be one of: Happy, Calm, Okay, Tired, Anxious, Sad, Irritable, Upset` |

---

### 6.2 Get Mood History

Retrieve the authenticated user's past mood entries, newest first.

```
GET /api/mobile/moods?limit=20&page=1
Authorization: Bearer <token>
```

**Query parameters**

| Param | Type | Default | Max |
|-------|------|---------|-----|
| `limit` | number | `20` | `100` |
| `page` | number | `1` | — |

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
        "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "mood": "Anxious",
        "notes": "Busy day",
        "loggedAt": "2025-08-21T14:00:00.000Z",
        "createdAt": "2025-08-21T14:00:01.000Z"
      }
    ],
    "total": 31,
    "page": 1,
    "limit": 20
  }
}
```

---

## 7. Reminders

---

### 7.1 Create a Reminder

Create a new medication, voice, appointment, or custom reminder.

```
POST /api/mobile/reminders
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | e.g. `"Take morning medication"` |
| `scheduledTime` | string (ISO date) | yes | When the reminder should fire |
| `type` | string | no | `"medication"` \| `"voice"` \| `"appointment"` \| `"other"` — default `"other"` |
| `isVoice` | boolean | no | `true` if this is a voice reminder — default `false` |

**Example request**

```json
{
  "title": "Take Donepezil 10mg",
  "scheduledTime": "2025-08-22T08:00:00.000Z",
  "type": "medication",
  "isVoice": false
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "reminderId": "64f1a2b3c4d5e6f7a8b9c0d5"
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `title and scheduledTime are required` |
| 400 | `type must be one of: medication, voice, appointment, other` |

---

### 7.2 List Reminders

Fetch all reminders for the authenticated user, ordered by scheduled time ascending.

```
GET /api/mobile/reminders?status=Active&limit=50
Authorization: Bearer <token>
```

**Query parameters**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `status` | string | no | Filter by status. Omit to get all. |
| `limit` | number | no | Default `50`, max `200` |

**Valid status filter values:** `Active` `Inactive` `Completed` `Missed`

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "reminders": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
        "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
        "title": "Take Donepezil 10mg",
        "scheduledTime": "2025-08-22T08:00:00.000Z",
        "type": "medication",
        "isVoice": false,
        "status": "Active",
        "createdAt": "2025-08-21T10:00:00.000Z",
        "updatedAt": "2025-08-21T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 7.3 Update a Reminder

Update a reminder's status, title, time, or voice flag.
Call this when a user acknowledges, snoozes, or completes a reminder.

```
PUT /api/mobile/reminders/:id
Authorization: Bearer <token>
```

**Request body** — all fields optional, send only what changed

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `"Active"` \| `"Inactive"` \| `"Completed"` \| `"Missed"` |
| `title` | string | |
| `scheduledTime` | string (ISO date) | |
| `isVoice` | boolean | |

**Example — mark as completed**

```json
{
  "status": "Completed"
}
```

**Example — mark as missed**

```json
{
  "status": "Missed"
}
```

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Take Donepezil 10mg",
    "scheduledTime": "2025-08-22T08:00:00.000Z",
    "type": "medication",
    "isVoice": false,
    "status": "Completed",
    "createdAt": "2025-08-21T10:00:00.000Z",
    "updatedAt": "2025-08-22T08:02:10.000Z"
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `No updatable fields provided` |
| 400 | `status must be one of: Active, Inactive, Completed, Missed` |
| 403 | `Forbidden` |
| 404 | `Reminder not found` |

---

### 7.4 Delete a Reminder

Permanently delete a reminder. Only the owner can delete it.

```
DELETE /api/mobile/reminders/:id
Authorization: Bearer <token>
```

**No request body.**

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 403 | `Forbidden` |
| 404 | `Reminder not found` |

---

## 8. Articles

---

### 8.1 Record an Article Interaction

Track when a user views, completes, bookmarks, or removes a bookmark from an article.
If the article does not yet exist in the database, it is created automatically on the first interaction.

```
POST /api/mobile/articles/interact
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `articleId` | string | yes | MongoDB ObjectId of the article |
| `action` | string | yes | `"view"` \| `"complete"` \| `"bookmark"` \| `"unbookmark"` |
| `title` | string | yes (first time only) | Required only when the article does not exist yet |
| `category` | string | yes (first time only) | Required only when the article does not exist yet |

**Actions and their effects**

| Action | Dashboard metric updated | Points earned |
|--------|--------------------------|---------------|
| `view` | `article.views + 1` | +1 |
| `complete` | `article.completions + 1`, completion rate recalculated | +10 |
| `bookmark` | `article.bookmarks + 1` | +2 |
| `unbookmark` | `article.bookmarks - 1` | 0 |

**Example — first view of a new article**

```json
{
  "articleId": "64f1a2b3c4d5e6f7a8b9c0d6",
  "action": "view",
  "title": "Understanding Memory Changes in Dementia",
  "category": "Education"
}
```

**Example — marking as completed (article already exists)**

```json
{
  "articleId": "64f1a2b3c4d5e6f7a8b9c0d6",
  "action": "complete"
}
```

**Success response — 200**

```json
{
  "success": true,
  "data": {
    "articleId": "64f1a2b3c4d5e6f7a8b9c0d6",
    "pointsEarned": 10
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `articleId and action are required` |
| 400 | `action must be one of: view, complete, bookmark, unbookmark` |
| 400 | `title and category are required when creating a new article record` |

---

## 9. Activity

---

### 9.1 Log a Custom Activity

Log any activity event not automatically captured by the other endpoints.
The main use case is **exercise completion**.

> Most activity is logged automatically:
> - Registering → logged by register endpoint
> - Completing an article → logged by article interact endpoint
> - Logging symptoms / moods / reminders → logged by their respective endpoints
> - Starting a session → logged by session endpoint

```
POST /api/mobile/activity
Authorization: Bearer <token>
```

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `action` | string | yes | Human-readable description shown in the dashboard feed |
| `type` | string | yes | Must be one of the valid activity types below |

**Valid activity types**

| Type | When to use |
|------|-------------|
| `exercise_completed` | User completes a physical or cognitive exercise. Awards +5 points. |
| `user_registered` | Handled automatically by register — do not call manually |
| `article_completed` | Handled automatically by article interact — do not call manually |
| `symptom_logged` | Handled automatically by symptoms endpoint — do not call manually |
| `reminder_created` | Handled automatically by reminders endpoint — do not call manually |
| `mood_logged` | Handled automatically by moods endpoint — do not call manually |
| `session_started` | Handled automatically by sessions endpoint — do not call manually |

**Example request**

```json
{
  "action": "Completed 10-minute memory card exercise",
  "type": "exercise_completed"
}
```

**Success response — 201**

```json
{
  "success": true,
  "data": {
    "activityId": "64f1a2b3c4d5e6f7a8b9c0d7"
  }
}
```

**Error responses**

| Status | Message |
|--------|---------|
| 400 | `action and type are required` |
| 400 | `type must be one of: user_registered, article_completed, ...` |

---

## 10. Points System

Points are automatically awarded and accumulated on the user's profile (`totalPoints`).

| Action | Points |
|--------|--------|
| Log symptoms | +5 |
| Log a mood | +5 |
| View an article | +1 |
| Bookmark an article | +2 |
| Complete an article | +10 |
| Complete an exercise | +5 |

The dashboard displays `totalPoints` per user on the Users page and in the Overview metrics.

---

## 11. Error Responses

### HTTP status codes used

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — missing or expired token |
| `403` | Forbidden — token valid but not allowed to access this resource |
| `404` | Resource not found |
| `409` | Conflict — e.g. email already registered |
| `500` | Internal server error |

### Token expired

When a `401` is returned, the mobile app should redirect the user to the login screen
and clear the stored token.

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## 12. Integration Checklist

Use this checklist when integrating each feature of the mobile app.

### On app install / first launch
- [ ] Call `POST /api/mobile/auth/register` and store the returned `token` and `user.id` securely

### On every login
- [ ] Call `POST /api/mobile/auth/login` and refresh the stored `token`

### On every app open
- [ ] Call `PUT /api/mobile/users/:id` with `{ "lastActive": "<now ISO>" }` to mark the user active on the dashboard

### On app close / background
- [ ] Call `POST /api/mobile/sessions` with the session duration and features used

### When user logs a symptom
- [ ] Call `POST /api/mobile/symptoms`

### When user logs a mood
- [ ] Call `POST /api/mobile/moods`

### When user creates a reminder
- [ ] Call `POST /api/mobile/reminders`

### When user acknowledges / completes a reminder
- [ ] Call `PUT /api/mobile/reminders/:id` with `{ "status": "Completed" }`

### When a reminder fires and is not acknowledged
- [ ] Call `PUT /api/mobile/reminders/:id` with `{ "status": "Missed" }`

### When user deletes a reminder
- [ ] Call `DELETE /api/mobile/reminders/:id`

### When user opens an article
- [ ] Call `POST /api/mobile/articles/interact` with `action: "view"` (and `title`/`category` if first time)

### When user finishes reading an article
- [ ] Call `POST /api/mobile/articles/interact` with `action: "complete"`

### When user bookmarks an article
- [ ] Call `POST /api/mobile/articles/interact` with `action: "bookmark"`

### When user removes a bookmark
- [ ] Call `POST /api/mobile/articles/interact` with `action: "unbookmark"`

### When user completes an exercise
- [ ] Call `POST /api/mobile/activity` with `type: "exercise_completed"`
