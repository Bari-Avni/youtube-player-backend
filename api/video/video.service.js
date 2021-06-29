const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;
const asyncLocalStorage = require("../../services/als.service");

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection("video");
    const videos = await collection.find(criteria).toArray();
    return videos;
  } catch (err) {
    logger.error("cannot find videos", err);
    throw err;
  }
}

async function getById(videoId) {
  try {
    const collection = await dbService.getCollection("video");
    // const video = await collection.findOne({ _id: ObjectId(videoId) });
    const videoObj = await collection.findOne({ "videos.id": videoId });
    console.log('videoObj', videoObj);
    return video;
  } catch (err) {
    logger.error(`while finding video ${videoId}`, err);
    throw err;
  }
}

async function update(video) {
  try {
    // peek only updatable fields!
    const videoToSave = {
      _id: ObjectId(video._id),
      searchWord: video.searchWord,
    };
    const collection = await dbService.getCollection("video");
    await collection.updateOne({ _id: videoToSave._id }, { $set: videoToSave });
    return videoToSave;
  } catch (err) {
    logger.error(`cannot update video ${video._id}`, err);
    throw err;
  }
}

async function remove(videoId) {
  try {
    const store = asyncLocalStorage.getStore();
    const { userId, isAdmin } = store;
    const collection = await dbService.getCollection("video");
    // remove only if user is owner/admin
    const query = { _id: ObjectId(videoId) };
    // if (!isAdmin) query.byUserId = ObjectId(userId)
    await collection.deleteOne(query);
    // return await collection.deleteOne({ _id: ObjectId(videoId), byUserId: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove video ${videoId}`, err);
    throw err;
  }
}

async function add(video) {
  try {
    // peek only updatable fields!
    const videoToAdd = {
      _id: ObjectId(video._id),
      searchWord: video[0].searchWord,
      videos: video,
    };
    const collection = await dbService.getCollection("video");
    await collection.insertOne(videoToAdd);
    return videoToAdd;
  } catch (err) {
    logger.error("cannot insert video", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" };
    criteria["searchWord"] = txtCriteria;
  }
  // if (filterBy.fromPrice || filterBy.toPrice) {
  //   criteria.$and = [
  //     { price: { $gte: +filterBy.fromPrice } },
  //     { price: { $lte: +filterBy.toPrice } },
  //   ];
  // }
  // if(filterBy.fromPrice){
  //     criteria.price = { $gte: +filterBy.fromPrice }
  // }
  // if(filterBy.toPrice){
  //     criteria.price = { $lte: +filterBy.toPrice }
  // }
  return criteria;
}

module.exports = {
  query,
  remove,
  add,
  getById,
  update,
};
