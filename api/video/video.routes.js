const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addVideo, getVideos, getVideo, updateVideo, deleteVideo, performVideo} = require('./video.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getVideos)  // log, 
router.post('/', addVideo) //requireAuth
router.delete('/:id', deleteVideo) //requireAuth
router.get('/:id', log, getVideo)
router.put('/:id', updateVideo)
router.put('/:id/start', performVideo)
module.exports = router