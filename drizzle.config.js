/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai-interview-mocker_owner:RohF7dXmPEc9@ep-bitter-wind-a1clb956.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
  };