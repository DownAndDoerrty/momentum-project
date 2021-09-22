# momentum-project

Project setup

## Backend

- [x] Postgres Database
- [x] Prisma
  - [x] Models/Schema\*
  - [x] Seed
- [x] GraphQL
- [x] Express Server
  - [ ] JWT
  - [ ] Endpoints
    - [ ] `/login`
    - [x] `/graphql`

## Frontend

- [ ] UI Layout
  - [ ] Pages
  - [ ] Components
  - [ ] Routing and Navigation
- [ ] Authentication (Authguard?)
- [ ] GraphQL

## GraphQL

- [x] Mutations
  - [x] Create user
    - `firstName`
    - `lastName`
    - `email`
    - `passwordHash`
    - `profilePictureURL`
  - [x] Create donation
    - `donorUserId`
    - `campaignId`
    - `donationAmount`
    - `donationNote`
  - [x] Create campaign
    - `campaignOwnerId`
    - `campaignName`
    - `campaignDescription`
    - `campaignPictureURL`
- [x] Queries
  - [x] Get list of all users
  - [x] Get single user by `userId`
  - [x] Get list of all campaigns
  - [x] Get single campaign by `campaignId`
  - [x] Get list of all donations by `campaignId`
  - [x] Get single donation by `donorUserId`
  - [x] Get donations by `donorUserId` and `campaignId`

\*Prisma Models/Schema

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

### Harry Command History 9/22/2021 ~11:30 AM PST

```bash
cd backend
npx prisma migrate reset
npm run server
npm install
npm run server
npx prisma migrate reset
cd frontend
ng serve
cd frontend
npm i -D @angular-eslint/template-parser@4
ng add @angular-eslint/schematics
ng g @angular-eslint/schematics:convert-tslint-to-eslint --remove-tslint-if-no-more-tslint-targets --ignore-existing-tslint-config
npm install --save-dev @typescript-eslint/eslint-plugin eslint-plugin-prettier
npm install --save-dev prettier prettier-eslint eslint-config-prettier
git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short | grep harry | less
git show b6cfdc5
cd ...
cd momentum-project
cd frontend
npx eslint . --cache --fix --ext .ts,.js
git add .
ng lint
ng generate service services/user
cd ../backend
npm install cors
npm install dotenv
cd ../frontend
ng generate service services/campaign
ng generate service services/donation
```
