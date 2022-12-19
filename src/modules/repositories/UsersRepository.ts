import { dataSource } from '../../shared/typeorm'
import { User } from '../../shared/typeorm/entities/User'

export const UserRepository = dataSource.getRepository(User).extend({
	async findById(id: string): Promise<User | null> {
		const user = await this.findOneBy({ id })
		return user
	},

	async findByName(name: string): Promise<User | null> {
		const user = await this.findOneBy({ name })
		return user
	},

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.findOneBy({ email })
		return user
	}
})
