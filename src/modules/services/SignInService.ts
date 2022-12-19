import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { InternalApiError } from '../../shared/utils/errors/internalAppError'
import { ISignIn } from '../interfaces'
import { IUser } from '../models/IUser'
import { UserRepository } from '../repositories/UsersRepository'
import Mail from '../../shared/utils/mail'
import path from 'path'
import os from 'os'

interface IResponse {
	user: IUser
	token: string
}

export class SignInService {
	constructor(private readonly userRepository = UserRepository) {}

	public async execute({ email, password }: ISignIn): Promise<IResponse> {
		const userCheckEmail = await this.userRepository.findByEmail(email)

		if (userCheckEmail == null) {
			throw new InternalApiError('Incorrect email/password combination.')
		}

		const passwordMatched = await compare(password, userCheckEmail.password)

		if (!passwordMatched) {
			throw new InternalApiError('Incorrect email/password combination.')
		}

		const token = sign({}, process.env.JWT_SECRET as string, {
			subject: userCheckEmail.id,
			expiresIn: '1d'
		})

		const ip = os.networkInterfaces().eth0?.[0].address

		const time = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

		const template = path.resolve(__dirname + '../../../shared/utils/views/signIn.hbs')

		await Mail.sendMail({
			to: {
				name: userCheckEmail.name,
				email: userCheckEmail.email
			},
			subject: 'Sign In',
			template: {
				file: template,
				variables: {
					name: userCheckEmail.name,
					ip: ip!,
					time
				}
			}
		})

		return { user: userCheckEmail, token }
	}
}
