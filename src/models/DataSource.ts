import { DataSource } from "typeorm"
import { getEnvironmentVariable } from "../utils/EnvironmentVariable"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: getEnvironmentVariable("DB_HOST"),
    port: +getEnvironmentVariable("DB_PORT"),
    username: getEnvironmentVariable("DB_USERNAME"),
    password: getEnvironmentVariable("DB_PASSWORD"),
    database: getEnvironmentVariable("DB_NAME"),
    entities: [
        "src/models/entities/Transactions.ts"
    ]
})
