import { Router } from 'express'
import { RoleController } from './role.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/admin.middleware'

const router = Router()




router.post('/', authMiddleware, requireAdmin, RoleController.create)
router.get('/', authMiddleware, RoleController.list)
router.post('/:roleId/permissions/:permissionId', authMiddleware, requireAdmin, RoleController.addPermission)
router.get('/:roleId/permissions', authMiddleware, RoleController.getPermissions)

export default router