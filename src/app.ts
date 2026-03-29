import express from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/user.routes'
import { errorMiddleware } from './middlewares/error.middleware'
import nodeRoutes from './modules/nodes/node.routes'
import roleRoutes from './modules/roles/role.routes'
import resourceRoutes from './modules/resources/resource.routes'
import permissionRoutes from './modules/permissions/permission.routes'
import membershipRoutes from './modules/memberships/membership.routes'
import policyRoutes from './modules/policies/policy.routes'
import auditRoutes from './modules/audit/audit.routes'
import testRoutes from './modules/test/test.routes'
import iamRoutes from './modules/iam/iam.routes'


const app = express()



app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/nodes', nodeRoutes)
app.use('/iam', iamRoutes)
app.use('/roles', roleRoutes)
app.use('/resources', resourceRoutes)
app.use('/permissions', permissionRoutes)
app.use('/audit-logs', auditRoutes)
app.use('/memberships', membershipRoutes)
app.use('/test', testRoutes)
app.use('/policies', policyRoutes)
app.use(errorMiddleware)











export default app