import { ForgotPasswordService } from '../services/ForgotPasswordService'
import { ResetPasswordService } from '../services/ResetPasswordService'
import { SignInService } from '../services/SignInService'
import { SignUpService } from '../services/SignUpService'
import { Request, Response } from 'express'

export class UserController {
	public async signup(req: Request, res: Response): Promise<Response> {
		try {
			const { name, email, password } = req.body
			const signUpService = new SignUpService()
			const user = await signUpService.execute({ name, email, password })
			return res.status(201).json(user)
		} catch (err) {
			return res.status(400).json(err)
		}
	}

	public async signin(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = req.body
			const signInService = new SignInService()
			const user = await signInService.execute({ email, password })
			return res.status(200).json(user)
		} catch (err) {
			return res.status(400).json(err)
		}
	}

	public async forgotPassword(req: Request, res: Response): Promise<Response> {
		try {
			const { email } = req.body
			const forgotPasswordService = new ForgotPasswordService()
			const user = await forgotPasswordService.execute({ email })
			return res.status(201).json({ token: `${user.token}` })
		} catch (err) {
			return res.status(400).json(err)
		}
	}

	public async resetPassword(req: Request, res: Response): Promise<Response> {
		try {
			const { password, token } = req.body
			const resetPasswordService = new ResetPasswordService()
			await resetPasswordService.execute({ token, password })
			return res.status(200).json({})
		} catch (err) {
			return res.status(400).json(err)
		}
	}
}
