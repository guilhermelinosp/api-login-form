import { Router } from 'express'
import { UserRouter } from '../../modules/routes/UserRouter'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../shared/utils/swagger/swagger.json'

export const router = Router()

router.get('/', (_req, res) => {
	res.send('API is running')
})

router.use('/api/v1/', UserRouter)

router.use('/api/v1/docs', swaggerUi.serve)
router.get('/api/v1/docs', swaggerUi.setup(swaggerDocument))
