const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
// const boardService = require('../board/board.service')

async function getById(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        const task = await collection.findOne({ _id: ObjectId(taskId) })
        // task._id = taskId
        return task
    } catch (err) {
        logger.error(`while finding task ${taskId}`, err)
        throw err
    }
}
async function query(filterBy = {}) {
    console.log('filterBy: ', filterBy);
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria : ', criteria);
        const collection = await dbService.getCollection('task')
        // const tasks = await collection.find(criteria).toArray()
        const tasks = await collection.aggregate([
            {
                $match: criteria
            },
        ]).toArray()
        return tasks
    } catch (err) {
        logger.error('cannot find tasks', err)
        throw err
    }

}
async function remove(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(taskId) })
        return taskId
    } catch (err) {
        logger.error(`cannot remove task ${taskId}`, err)
        throw err
    }
}

async function update(task) {
    try {
        const taskToUpdate = JSON.parse(JSON.stringify((task)))
        // const taskToUpdate = structuredClone(task)
        delete taskToUpdate._id  //need to change this
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: ObjectId(task._id) }, { $set: taskToUpdate })
        return task
    } catch (err) {
        logger.error(`cannot update task ${task._id}`, err)
        throw err
    }
}

async function add(task) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.insertOne(task)
        return task
    } catch (err) {
        logger.error('cannot insert task', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    criteria.groupId = filterBy.groupId
    if (filterBy.title !== "undefined") criteria.title = { $regex: filterBy.title, $options: 'i' }
    if (filterBy.memberIds !== 'undefined' && filterBy.memberIds !== '') {
        criteria.memberIds = { $in: filterBy.memberIds.split(',') }
    }
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    update,
    getById
}
