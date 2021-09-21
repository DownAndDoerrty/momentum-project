# momentum-project
Project setup
## Backend
- [ ] Postgres Database
- [ ] Prisma
    - [ ] Models/Schema*
    - [ ] Seed
- [ ] GraphQL
- [ ] Express Server
    - [ ] JWT
    - [ ] Endpoints
        - [ ] `/login`
        - [ ] `/graphql`

## Frontend
- [ ] UI Layout
    - [ ] Pages
    - [ ] Components
    - [ ] Routing and Navigation
- [ ] Authentication (Authguard?)
- [ ] GraphQL

## GraphQL
- [ ] Mutations
    - [ ] Create user
        - `firstName`
        - `lastName`
        - `email`
        - `passwordHash`
        - `profilePictureURL`
    - [ ] Create donation
        - `donorUserId`
        - `campaignId`
        - `donationAmount`
        - `donationNote`
    - [ ] Create campaign
        - `campaignOwnerId`
        - `campaignName`
        - `campaignDescription`
        - `campaignPictureURL`
- [ ] Queries 
    - [ ] Get list of all users
    - [ ] Get single user by `userId`
    - [ ] Get list of all campaigns
    - [ ] Get single campaign by `campaignId`
    - [ ] Get list of all donations by `campaignId`
    - [ ] Get single donation by `donorUserId`





*Prisma Models/Schema
```
model Campaign {
  campaignId          Int      @id @default(autoincrement())
  campaignOwnerId     Int
  campaignName        String
  campaignDescription String
  campaignPictureURL  String
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  campaignOwner       User     @relation(fields: [campaignOwnerId], references: [userId])
}
model Donation {
  donationId     Int      @id @default(autoincrement())
  donorUserId    Int
  campaignId     Int
  donationAmount Decimal
  donationNote   String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  donor          User     @relation(fields: [donorUserId], references: [userId])
}
model User {
  userId            Int        @id @default(autoincrement())
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