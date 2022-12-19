import { hash } from 'bcryptjs'
import Mail from '../../shared/utils/mail'
import path from 'path'
import { InternalApiError } from '../../shared/utils/errors/internalAppError'
import { ISignUp } from '../interfaces'
import { IUser } from '../models/IUser'
import { UserRepository } from '../repositories/UsersRepository'

export class SignUpService {
	constructor(private readonly userRepository = UserRepository) {}

	public async execute({ name, email, password }: ISignUp): Promise<IUser> {
		const userCheckEmail = await this.userRepository.findByEmail(email)

		if (userCheckEmail != null) {
			throw new InternalApiError('Email address already used.')
		}

		const user = this.userRepository.create({
			name,
			email,
			password: await hash(password, 8)
		})

		await this.userRepository.save(user)

		const template = path.resolve(__dirname + '../../../shared/utils/views/signUp.hbs')

		await Mail.sendMail({
			to: {
				name: user.name,
				email: user.email
			},
			subject: 'Sign Up',
			template: {
				file: template,
				variables: {
					name: user.name
				}
			}
		})

		return user
	}
}
