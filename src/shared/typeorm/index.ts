import 'dotenv/config'
import { DataSource } from 'typeorm'
import path from 'path'

export const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [path.join(__dirname) + '*/entities/*{.ts,.js}'],
	migrations: [path.join(__dirname) + '*/migrations/*{.ts,.js}'],
	synchronize: true,
	logging: false
})
