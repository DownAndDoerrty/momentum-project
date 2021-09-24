export const donationFragment = `
id
donorUserId
campaignId
donationAmount
donationNote
createdAt
updatedAt
`;

export const campaignFragment = `
  id
  campaignOwnerId
  campaignName
  campaignDescription
  campaignPictureURL
  createdAt
  updatedAt
`;

export const userFragment = `
  id
  firstName
  lastName
  email
  passwordHash
  profilePictureURL
  createdAt
  updatedAt
`;
