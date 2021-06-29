const logger = require("../../services/logger.service");
const userService = require("../user/user.service");
const socketService = require("../../services/socket.service");
const videoService = require("./video.service");

async function getVideos(req, res) {
  try {
    console.log("req.query:-", req.query);
    let filterBy = req.query;
    if (!Object.keys(filterBy).length) filterBy = { txt: "" };
    const videos = await videoService.query(filterBy);
    res.send(videos);
  } catch (err) {
    logger.error('Cannot get videos', err)
    res.status(500).send({ err: "Failed to get videos" });
  }
}

// Get a single video by id
async function getVideo(req, res) {
  try {
    console.log("req.params", req.params);
    const videoId = req.params.id;
    const video = await videoService.getById(videoId);
    res.send(video);
  } catch (err) {
    logger.error("Cannot get video", err);
    res.status(500).send({ err: "Failed to get video" });
  }
  // const videoId = req.params.videoId
  // videoService.getById(videoId)
  //     .then(video => {
  //         res.json(video)
  //     })
}

async function deleteVideo(req, res) {
  try {
    await videoService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete video", err);
    res.status(500).send({ err: "Failed to delete video" });
  }
}

async function addVideo(req, res) {
  try {
    var video = req.body;
    // video.byUserId = req.session.user._id
    video = await videoService.add(video);

    // prepare the updated video for sending out
    // video.byUser = await userService.getById(video.byUserId)
    // video.aboutUser = await userService.getById(video.aboutUserId)

    console.log("CTRL SessionId:", req.sessionID);
    socketService.broadcast({ type: "video-added", data: video });
    // socketService.emitToAll({type: 'user-updated', data: video.byUser, room: req.session.user._id})
    res.send(video);
  } catch (err) {
    console.log(err);
    logger.error("Failed to add video", err);
    res.status(500).send({ err: "Failed to add video" });
  }
}

// Update a Video
async function updateVideo(req, res) {
  // const { name, price, type, inStock, _id, createdAt } = req.body
  // const video = { _id, name, price, type, inStock, createdAt }
  // videoService.save(video)
  //     .then((savedVideo) => {
  //         console.log('Updated Video:', savedVideo);
  //         res.json(savedVideo)
  //     })
  //     .catch(err => {
  //         console.log(err)
  //         return res.status(401).send('access denied')
  //     })

  try {
    const video = req.body;
    const savedVideo = await videoService.update(video);
    res.send(savedVideo);
  } catch (err) {
    logger.error("Failed to update video", err);
    res.status(500).send({ err: "Failed to update video" });
  }

  // try {
  //     const { name, price, type, inStock, _id, createdAt } = req.body
  //     const video = { _id, name, price, type, inStock, createdAt }
  //     video = await videoService.save(video)
  //     res.send(video)
  // } catch (err) {
  //     logger.error('Failed to update video', err)
  //     res.status(500).send({ err: 'Failed to update video' })
  // }
}

// Update a Video
async function performVideo(req, res) {
  try {
    const video = req.body;
    const savedVideo = await videoService.performVideo(video);
    res.send(savedVideo);
  } catch (err) {
    logger.error("Failed to update video", err);
    res.status(500).send({ err: "Failed to update video" });
  }
}

module.exports = {
  getVideos,
  deleteVideo,
  addVideo,
  getVideo,
  updateVideo,
  performVideo,
};
