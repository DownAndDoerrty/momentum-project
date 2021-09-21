import { PrismaClient } from "@prisma/client";
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
  log: ["query"],
});
const port = 4000;

const typeDefs = `
    scalar Date
    type Campaign {
        campaignId:          Int       
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
        donationId:     Int
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
        userId:            Int
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
  Campaign: {
    donations: (parent: any) => {
      return prisma.campaign
        .findUnique({
          where: { campaignId: parent?.campaignId },
        })
        .donations();
    },
    campaignOwner: (parent: any) => {
      return prisma.user.findUnique({
        where: { userId: parent?.campaignOwnerId },
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
  }));

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
