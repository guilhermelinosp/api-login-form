import { InternalApiError } from '../../shared/utils/errors/internalAppError'
import { IForgotPassword } from '../interfaces'
import { UserRepository } from '../repositories/UsersRepository'
import { UserTokenRepository } from '../repositories/UserTokenRepository'
import Mail from '../../shared/utils/mail'
import path from 'path'
import { IUserToken } from '../models/IUserToken'

export class ForgotPasswordService {
	constructor(
		private readonly userRepository = UserRepository,
		private readonly userTokenRepository = UserTokenRepository
	) {}

	public async execute({ email }: IForgotPassword): Promise<IUserToken> {
		const user = await this.userRepository.findByEmail(email)
		if (user == null) {
			throw new InternalApiError('User does not exists.')
		}

		const token = await this.userTokenRepository.generateToken(user.id)

		const template = path.resolve(__dirname + '../../../shared/utils/views/forgotPassword.hbs')

		await Mail.sendMail({
			to: {
				name: user.name,
				email: user.email
			},
			subject: 'Reset Password',
			template: {
				file: template,
				variables: {
					name: user.name,
					link: `https://web-login-form.vercel.app/checktoken`,
					token: token.token
				}
			}
		})

		return token
	}
}
