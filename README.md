# RentNest 🏠
**"Find & List Rental Properties with Ease"**

---

## Project Overview

RentNest is a backend API for a rental property marketplace. Landlords can list properties, manage availability, and approve or reject rental requests. Tenants can browse listings, submit rental requests, and leave reviews. Admins oversee the entire platform, managing users and moderating content.

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Tenant** | Users looking for rental properties | Browse listings, submit rental requests, leave reviews, manage profile |
| **Landlord** | Property owners who list rentals | Create/manage listings, approve/reject requests, view tenant history |
| **Admin** | Platform moderators | Manage all users, oversee all listings & requests, manage categories |

> 💡 **Note**: Users select their role during registration.

---



## Features

### Public Features
- Browse all available rental properties
- Search and filter by location, price range, property type, and amenities
- View detailed property listings

### Tenant Features
- Register and login as tenant
- Submit rental requests for properties
- **Make payments via Stripe or SSLCommerz after rental request is approved**
- **View payment history and payment status**
- View rental request history (pending, approved, rejected)
- Leave reviews after a completed rental
- Manage profile

### Landlord Features
- Register and login as landlord
- Create, edit, and remove property listings
- Set property availability status
- Approve or reject rental requests
- View rental history and tenant reviews

### Admin Features
- View all users (tenants and landlords)
- Manage user status (ban/unban)
- View all listings and rental requests
- Manage property categories

---

# 🗄️ Entity Relationship Diagram (ERD)

The following Entity Relationship Diagram (ERD) illustrates the database schema and relationships between the core entities used in **RentNest**.

<p align="center">
  <img src="./RentNest.drawio.png" alt="RentNest ER Diagram" width="100%">
</p>

> **Note:** If your ERD file has a different name, replace `ERD.png` with the correct filename (e.g., `er-diagram.png`, `database-schema.png`, etc.).


---












## Database Tables


- **Users** - Store user information, authentication details, and role
- **Properties** - Rental property listings (linked to landlord)
- **Categories** - Property type categories (apartment, house, studio, etc.)
- **RentalRequests** - Rental requests between tenants and landlords
- **Payments** - Payment transactions (transactionId, rentalRequestId, amount, method, provider [Stripe], status [  PENDING/COMPLETED/FAILED],)
- **Reviews** - Tenant reviews for properties


---

## Flow Diagrams

### 🏠 Tenant Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Browse     │
                              │  Properties  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │View Property │
                              │   Details    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Submit     │
                              │   Request    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Wait for    │
                              │  Approval    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Make Payment│
                              │(Stripe/SSLC) │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Leave Review │
                              └──────────────┘
```

### 🏘️ Landlord Journey

```
                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Create     │
                              │  Listings    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │    View      │
                              │  Requests    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Approve/   │
                              │   Reject     │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Manage     │
                              │  Properties  │
                              └──────────────┘
```

### 📊 Rental Request Status

```
                              ┌──────────────┐
                              │   PENDING    │
                              └──────────────┘
                               /            \
                              /              \
                       (landlord)       (landlord)
                        approves        rejects
                            /                \
                           ▼                  ▼
                   ┌──────────────┐   ┌──────────────┐
                   │   APPROVED   │   │   REJECTED   │
                   └──────────────┘   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   PAYMENT    │
                   │  (Stripe)    │
                   │              │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │    ACTIVE    │
                   │  (move-in)   │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  COMPLETED   │
                   └──────────────┘
```

---
