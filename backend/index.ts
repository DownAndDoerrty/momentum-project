import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
//import { graphqlHTTP } from "express-graphql";
//import { makeExecutableSchema } from "@graphql-tools/schema";
//import cors from "cors";
//import jsonwebtoken from "jsonwebtoken";
//import dotenv from "dotenv";
//import jwt from "express-jwt";
import QueryString from "qs";

const expressPlayground =
  require("graphql-playground-middleware-express").default;

const prisma = new PrismaClient({
  log: ["query"],
});
const port = 4000;

app
  .use
  // "/graphql",
  // jwt({ secret: JWT_SECRET, algorithms: ["HS256"], credentialsRequired: false }),
  // authenticationMiddleware,
  // graphqlHTTP({
  //   schema,
  // })
  ();

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
