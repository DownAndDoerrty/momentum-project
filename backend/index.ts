import { Campaign, Donation, PrismaClient, User } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { GraphQLScalarType, Kind } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
//import cors from "cors";
//import jsonwebtoken from "jsonwebtoken";
//import dotenv from "dotenv";
//import jwt from "express-jwt";
// import QueryString from "qs";

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
        getCampaignDonations(campaignId: Int!): [Donation]
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
    getCampaignDonations: (_: any, { campaignId }: { campaignId: number }) => {
      return prisma.donation.findMany({
        where: {
          campaignId: campaignId,
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
      })
    },
    createCampaign: async (
      _: any, 
      data: Omit<Campaign, "updatedAt" | "createdAt" | "id">
    ) => {
      return await prisma.campaign.create({
        data,
      })
    }
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

app.use(
  "/graphql",
  // jwt({ secret: JWT_SECRET, algorithms: ["HS256"], credentialsRequired: false }),
  // authenticationMiddleware,
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
