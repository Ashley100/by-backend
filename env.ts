import * as envalid from "envalid";

const env = envalid.cleanEnv(process.env, {
  ELASTIC_NODE: envalid.str(),
  ELASTIC_USERNAME: envalid.str(),
  ELASTIC_PASSWORD: envalid.str(),
});

export default env;