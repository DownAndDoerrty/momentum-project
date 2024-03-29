import { Campaign, Donation, PrismaClient, User } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { GraphQLScalarType, Kind } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import QueryString from "qs";
import jwt from "express-jwt";
import bcrypt from "bcryptjs";

const expressPlayground =
  require("graphql-playground-middleware-express").default;

const prisma = new PrismaClient({
  log: ["query"],
});
const port = 4000;

dotenv.config();

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
            password:          String
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
      data: Omit<User, "updatedAt" | "createdAt" | "id" | "passwordHash"> & {
        password: string;
      }
    ) => {
      const user = { ...data, passwordHash: bcrypt.hashSync(data.password) };
      return await prisma.user.create({
        data: user,
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

export const createAccountSchema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const app = express();

let corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const JWT_SECRET = Buffer.from(process.env.JWT_SECRET as string, "base64");

app.post("/login", express.json(), (req, res) => {
  prisma.user
    .findFirst({
      where: {
        email: req?.body.email,
      },
    })
    .then((user) => {
      if (!user) {
        res.sendStatus(401);
        return;
      }
      if (!bcrypt.compareSync(req?.body.password, user.passwordHash)) {
        res.sendStatus(401);
        return;
      }

      const userId = user.id;
      const token = jsonwebtoken.sign({ sub: userId }, JWT_SECRET, {
        expiresIn: "365d",
      });
      res.status(200).json({ token });
    });
});

app.post("/signup", express.json(), (req, res) => {
  console.log(req?.body);
  return prisma.user
    .create({
      data: {
        ...req?.body,
        password: undefined,
        passwordHash: bcrypt.hashSync(req?.body?.password),
      },
    })
    .then((user) => {
      if (!user) {
        res.sendStatus(503);
        return;
      }

      const userId = user.id;
      const token = jsonwebtoken.sign({ sub: userId }, JWT_SECRET, {
        expiresIn: "365d",
      });
      res.status(200).json({ token });
    });
});

const authenticationMiddleware = (
  req: Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  if ((req?.user as { sub: number })?.sub > 0) {
    prisma.user
      .findUnique({ where: { id: +(req?.user as { sub: number })?.sub } })
      .then((_user) => {
        next();
      });
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
};

app.use(
  "/graphql",
  jwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
  authenticationMiddleware,
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
