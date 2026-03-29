import { Types } from 'mongoose'
import { Node } from './node.model'
import { CreateNodeDto } from '../../types/node.types'
import { AppError } from '../../shared/errors/AppError'
import { slugify } from '../../shared/utils/slugify'

export class NodeService {
  static async create(data: CreateNodeDto) {
    const name = data.name?.trim()

    if (!name) {
      throw new AppError('Node name is required', 400)
    }

    let parent = null
    let ancestors: Types.ObjectId[] = []
    let path = `/${slugify(name)}`

    if (data.parentId) {
      parent = await Node.findById(data.parentId)

      if (!parent) {
        throw new AppError('Parent node not found', 404)
      }

      ancestors = [...(parent.ancestors as Types.ObjectId[]), parent._id as Types.ObjectId]
      path = `${parent.path}/${slugify(name)}`
    }

    const existingPath = await Node.findOne({ path })
    if (existingPath) {
      throw new AppError('A node with this path already exists', 409)
    }

    const node = await Node.create({
      name,
      type: data.type,
      parentId: data.parentId || null,
      ancestors,
      path
    })

    return node
  }

  static async findAll() {
    return Node.find().sort({ path: 1 })
  }

  static async findById(id: string) {

    if (!Types.ObjectId.isValid(id)){
        throw new AppError('Invalid id', 400)
    }

    const node = await Node.findById(id)
    if (!node) {
      throw new AppError('Node not found', 404)
    }
    return node
  }

  static async findChildren(parentId: string | null) {
    return Node.find({ parentId }).sort({ name: 1 })
  }

  static async buildTree(parentId: string | null = null): Promise<any[]> {
    const children = await Node.find({ parentId }).sort({ name: 1 })

    return Promise.all(
      children.map(async (node) => ({
        _id: node._id,
        name: node.name,
        type: node.type,
        path: node.path,
        children: await this.buildTree(String(node._id))
      }))
    )
  }
}