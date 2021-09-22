import { Campaign, Donation, PrismaClient, User } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { GraphQLScalarType, Kind } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";

const expressPlayground =
  require("graphql-playground-middleware-express").default;

const prisma = new PrismaClient({
  log: ["query", "info"],
});
const port = 4000;

const typeDefs = `
    scalar Date
    type Campaign {
        id:                  Int       
        campaignOwnerId:     Int
        campaignName:        String
        campaignDescription: String
        campaignPictureURL:  String
        createdAt:           Date
        updatedAt:           Date
        campaignOwner:       User
        donations:           [Donation]
    }
    
    type Donation {
        id:             Int
        donorUserId:    Int
        campaignId:     Int
        donationAmount: Float
        donationNote:   String
        createdAt:      Date
        updatedAt:      Date
        donor:          User
        campaign:       Campaign
    }
    
    type User {
        id:                Int
        firstName:         String
        lastName:          String
        email:             String
        passwordHash:      String
        profilePictureURL: String
        createdAt:         Date
        updatedAt:         Date
        donations:         [Donation]
        ownedCampaigns:    [Campaign]
    }

    type Query {
      getAllUsers:                                [User]
      getUserByUserId(userId: Int!):              User
      getAllCampaigns:                            [Campaign]
      getCampaignByCampaignId(campaignId: Int!):  Campaign
      getAllCampaignDonations(campaignId: Int!):  [Donation]
      getAllUserDonations(userId: Int!):          [Donation]
      getDonationsByCampaignIdAndUserId(campaignId: Int!, userId: Int!):   [Donation]
    }

    type Mutation {
        createUser(
            firstName:         String
            lastName:          String
            email:             String
            passwordHash:      String
            profilePictureURL: String
        ): User

        createDonation(
            donorUserId:         Int
            campaignId:          Int
            donationAmount:      Float
            donationNote:        String
        ): Donation

        createCampaign(
          campaignOwnerId:       Int
          campaignName:          String
          campaignDescription:   String
          campaignPictureURL:    String
        ): Campaign
    }
`;

const resolvers = {
  Query: {
    getAllUsers: () => {
      return prisma.user.findMany();
    },
    getUserByUserId: (_: any, { userId }: { userId: number }) => {
      return prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    },
    getAllCampaigns: () => {
      return prisma.campaign.findMany();
    },
    getCampaignByCampaignId: (
      _: any,
      { campaignId }: { campaignId: number }
    ) => {
      return prisma.campaign.findUnique({
        where: {
          id: campaignId,
        },
      });
    },
    getAllCampaignDonations: (
      _: any,
      { campaignId }: { campaignId: number }
    ) => {
      return prisma.donation.findMany({
        where: {
          campaignId: campaignId,
        },
      });
    },
    getAllUserDonations: (_: any, { userId }: { userId: number }) => {
      return prisma.donation.findMany({
        where: {
          donorUserId: userId,
        },
      });
    },
    getDonationsByCampaignIdAndUserId: (
      _: any,
      { campaignId, userId }: { campaignId: number; userId: number }
    ) => {
      return prisma.donation.findMany({
        where: {
          campaignId: campaignId,
          donorUserId: userId,
        },
      });
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      data: Omit<User, "updatedAt" | "createdAt" | "id">
    ) => {
      return await prisma.user.create({
        data,
      });
    },
    createDonation: async (
      _: any,
      data: Omit<Donation, "updatedAt" | "createdAt" | "id">
    ) => {
      return await prisma.donation.create({
        data,
      });
    },
    createCampaign: async (
      _: any,
      data: Omit<Campaign, "updatedAt" | "createdAt" | "id">
    ) => {
      return await prisma.campaign.create({
        data,
      });
    },
  },
  Campaign: {
    donations: (parent: any) => {
      return prisma.donation.findMany({
        where: { campaignId: parent?.id },
      });
    },
    campaignOwner: (parent: any) => {
      return prisma.user.findUnique({
        where: { id: parent?.campaignOwnerId },
      });
    },
  },
  User: {
    donations: (parent: any) => {
      return prisma.donation.findMany({
        where: { donorUserId: parent?.id },
      });
    },
    ownedCampaigns: (parent: any) => {
      return prisma.campaign.findMany({
        where: { campaignOwnerId: parent?.id },
      });
    },
  },
  Donation: {
    donor: (parent: any) => {
      return prisma.user.findUnique({
        where: { id: parent?.donorUserId },
      });
    },
    campaign: (parent: any) => {
      return prisma.campaign.findUnique({
        where: { id: parent?.campaignId },
      });
    },
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

export const schema = makeExecutableSchema({ resolvers, typeDefs });

const app = express();

let corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
  })
);

app.get(
  "/playground",
  expressPlayground({
    endpoint: "/graphql/",
  })
);

app.listen(port, () => {
  console.log(
    `Serving the GraphQL Playground on http://localhost:${port}/playground`
  );
});
