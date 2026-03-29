import { Router } from 'express'
import { RoleController } from './role.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()




router.post('/', authMiddleware, RoleController.create)
router.get('/', authMiddleware, RoleController.list)
router.post('/:roleId/permissions/:permissionId', authMiddleware, RoleController.addPermission)
router.get('/:roleId/permissions', authMiddleware, RoleController.getPermissions)

export default router