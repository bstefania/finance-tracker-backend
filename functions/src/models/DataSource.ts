import {DataSource} from "typeorm"
import {getEnvironmentVariable} from "../utils/EnvironmentVariable"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: getEnvironmentVariable("DB_HOST"),
  port: +getEnvironmentVariable("DB_PORT"),
  username: getEnvironmentVariable("DB_USERNAME"),
  password: getEnvironmentVariable("DB_PASSWORD"),
  database: getEnvironmentVariable("DB_NAME"),
  // IMPORTANT! Never user "synchronize: true" for a production database after data has been inserted.
  synchronize:
    process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "test" ?
      true :
      false,
  logging: false,
  // local database doesn't have ssl
  ssl: getEnvironmentVariable("DB_SSL") === "true",
  entities: ["./src/models/entities/*.ts"],
})
