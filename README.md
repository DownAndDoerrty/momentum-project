# momentum-project
Project setup
## Backend
- [X] Postgres Database
- [X] Prisma
    - [X] Models/Schema*
    - [X] Seed
- [X] GraphQL
- [X] Express Server
    - [ ] JWT
    - [ ] Endpoints
        - [ ] `/login`
        - [X] `/graphql`

## Frontend
- [ ] UI Layout
    - [ ] Pages
    - [ ] Components
    - [ ] Routing and Navigation
- [ ] Authentication (Authguard?)
- [ ] GraphQL

## GraphQL
- [X] Mutations
    - [X] Create user
        - `firstName`
        - `lastName`
        - `email`
        - `passwordHash`
        - `profilePictureURL`
    - [X] Create donation
        - `donorUserId`
        - `campaignId`
        - `donationAmount`
        - `donationNote`
    - [X] Create campaign
        - `campaignOwnerId`
        - `campaignName`
        - `campaignDescription`
        - `campaignPictureURL`
- [X] Queries
    - [X] Get list of all users
    - [X] Get single user by `userId`
    - [X] Get list of all campaigns
    - [X] Get single campaign by `campaignId`
    - [X] Get list of all donations by `campaignId`
    - [X] Get single donation by `donorUserId`
    - [X] Get donations by `donorUserId` and `campaignId`





*Prisma Models/Schema
```
model Campaign {
  id                  Int        @id @default(autoincrement())
  campaignOwnerId     Int
  campaignName        String
  campaignDescription String
  campaignPictureURL  String
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt
  campaignOwner       User       @relation(fields: [campaignOwnerId], references: [id])
  donations           Donation[] @relation
}

model Donation {
  id             Int      @id @default(autoincrement())
  donorUserId    Int
  campaignId     Int
  donationAmount Decimal
  donationNote   String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  donor          User     @relation(fields: [donorUserId], references: [id])
  campaign       Campaign @relation(fields: [campaignId], references: [id])
}

model User {
  id                Int        @id @default(autoincrement())
  firstName         String
  lastName          String
  email             String
  passwordHash      String
  profilePictureURL String
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
  donations         Donation[] @relation
  ownedCampaigns    Campaign[] @relation
}
```

## Commands

- Generate ESLint Cache `npx eslint . --cache --fix --ext .ts,.js`
