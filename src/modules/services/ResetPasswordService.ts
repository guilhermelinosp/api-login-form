import { UserRepository } from '../repositories/UsersRepository'
import { isAfter, addHours } from 'date-fns'
import { hash } from 'bcryptjs'
import { UserTokenRepository } from '../repositories/UserTokenRepository'
import { InternalApiError } from '../../shared/utils/errors/internalAppError'
import { IResetPassword } from '../interfaces'
import Mail from '../../shared/utils/mail'
import path from 'path'
import os from 'os'

export class ResetPasswordService {
	constructor(
		private readonly userRepository = UserRepository,
		private readonly userTokenRepository = UserTokenRepository
	) {}

	public async execute({ token, password }: IResetPassword): Promise<void> {
		const userCheckToken = await this.userTokenRepository.findByToken(token)
		if (userCheckToken == null) {
			throw new InternalApiError('User token does not exists.')
		}

		const userCheck = await this.userRepository.findById(userCheckToken.user_id)
		if (userCheck == null) {
			throw new InternalApiError('User does not exists.')
		}

		if (isAfter(Date.now(), addHours(userCheckToken.created_at, 2))) {
			throw new Error('Token expired.')
		}

		userCheck.password = await hash(password, 8)

		await this.userRepository.save(userCheck)

		await this.userTokenRepository.delete(userCheckToken.id)

		const template = path.resolve(__dirname + '../../../shared/utils/views/resetPassword.hbs')

		const ip = os.networkInterfaces().eth0?.[0].address

		const time = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

		await Mail.sendMail({
			to: {
				name: userCheck.name,
				email: userCheck.email
			},
			subject: 'Password Successfully Reset',
			template: {
				file: template,
				variables: {
					name: userCheck.name,
					ip: ip!,
					time
				}
			}
		})
	}
}
