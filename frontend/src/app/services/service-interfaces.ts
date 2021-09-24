export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePictureURL: string;
  createdAt: Date;
  updatedAt: Date;
  ownedCampaigns?: Campaign[];
  donations?: Donation[];
}

export interface Campaign {
  id: number;
  campaignOwnerId: number;
  campaignName: String;
  campaignDescription: string;
  campaignPictureURL: string;
  createdAt: Date;
  updatedAt: Date;
  campaignOwner: User;
  donations?: Donation[];
}

export interface Donation {
  id: number;
  donorUserId: number;
  campaignId: number;
  donationAmount: number;
  donationNote: string;
  createdAt: Date;
  updatedAt: Date;
  donor: User;
  campaign: Campaign;
}
