// Package modules
import { Client } from "@elastic/elasticsearch";

// Local modules
import env from "../env";

const client = new Client({
  node: env.ELASTIC_NODE,
  auth: {
    username: env.ELASTIC_USERNAME,
    password: env.ELASTIC_PASSWORD
  }
});

export default client;
