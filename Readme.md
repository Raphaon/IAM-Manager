# IAM Backend

## Setup
- npm install
- config .env
- npm run seed
- npm run dev

## Main modules
- auth
- users
- nodes
- roles
- resources
- permissions
- memberships
- policies
- audit

## Main flows
- register/login
- create node hierarchy
- create role/resource/permission
- assign role to node with membership
- check access
- debug access

## Key endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me
- POST /iam/debug-access



Documentation des Tests

Cas 1
Paul = manager sur France
permission = invoice.read
policy allow on descendants
test sur Paris
attendu = autorisé
Cas 2
même user
invoice confidentielle
deny policy
attendu = refusé


# GIA Manager - IAM Backend

Backend IAM construit avec :
- Node.js
- Express
- TypeScript
- MongoDB / Mongoose
- JWT
- RBAC + Policies

## Fonctionnalités

- Authentification :
  - register
  - login
  - refresh token
  - logout
  - me
- Gestion des utilisateurs
- Hiérarchie organisationnelle via `nodes`
- Roles / Resources / Permissions
- Memberships
- RBAC
- Policies dynamiques
- Audit logs
- Debug IAM

---

## Architecture logique

User -> Membership -> Node -> Role -> Permission -> Resource

Puis par-dessus :
- Policy
- AuditLog
- RefreshToken

---

## Installation

```bash


Endpoints principaux
Auth
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /auth/me
Users
GET /users
GET /users/:id
PATCH /users/:id/status
Nodes
POST /nodes
GET /nodes
GET /nodes/tree
GET /nodes/:id
Roles
POST /roles
GET /roles
POST /roles/:roleId/permissions/:permissionId
GET /roles/:roleId/permissions
Resources
POST /resources
GET /resources
Permissions
POST /permissions
GET /permissions
Memberships
POST /memberships
GET /memberships
GET /memberships/user/:userId
GET /memberships/node/:nodeId
GET /memberships/:id
Policies
POST /policies
GET /policies
GET /policies/:id
Audit
GET /audit-logs
Debug IAM
POST /iam/debug-access
Test métier
GET /test/invoice/:id/read
Flux recommandé de test
Register
Login
Create nodes
Create roles
Create resources
Create permissions
Assign permissions to roles
Create memberships
Create policies
Test access
Inspect audit logs
Debug with /iam/debug-access
Exemple métier
ACME = organization
France = branch
Paris = subbranch
manager = role
invoice.read = permission
Paul = user
membership :
Paul -> France -> manager

Conséquence :

Paul peut lire les invoices de France
si héritage descendant activé, il peut aussi lire celles de Paris
Policies

Les policies ajoutent des règles dynamiques :

allow
deny

Exemples :

autoriser la lecture d’une invoice si elle appartient à l’utilisateur
refuser la lecture si classification = confidential
autoriser l’action si resource.nodeId in context.allowedNodeIds

Règle appliquée :

deny > allow
Debug IAM

Utiliser :

POST /iam/debug-access

Exemple de body :

{
  "userId": "USER_ID",
  "systemRole": "user",
  "action": "read",
  "resource": "invoice",
  "nodeId": "NODE_ID",
  "resourceData": {
    "ownerId": "USER_ID",
    "classification": "public",
    "amount": 1200
  }
}

La réponse indique :

memberships trouvés
checks de permissions
policies applicables
policies matchées
décision finale