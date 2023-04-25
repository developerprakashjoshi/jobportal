import { DataSource } from "typeorm"
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "",
    password: "",
    database: "adminjs",
    synchronize: true,
    logging: true,
    entities: ['src/app/Models/*{.ts,.js}'],
    // subscribers: [],
    migrations: ['src/database/migrations/*{.ts,.js}']
})

