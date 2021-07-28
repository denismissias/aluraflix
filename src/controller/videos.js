const express = require('express');
const router = express.Router();
const validator = require ('validator');
const ValidationException = require('../core/validationException');
let VideoEntity = require('../entity/video');
let VideoRepository = require('../repository/video');

router.route('/')
  .get(async function(req, res) {
    let result = await VideoRepository.find();

    if (result.length > 0) {
      let videos = [];

      result.forEach(element => {
        videos.push({
          id: element.id,
          title: element.title,
          description: element.description,
          url: element.url
        });
      });

      res.json(videos);
    } else {
      res.status(404).send();
    }
    
  })
  .post(async function(req, res) {

    try {
      let video = new VideoEntity(req.body.title, req.body.description, req.body.url);
      let videoId = await VideoRepository.add(video);
      res.status(201).json({
        id: videoId,
        title: video.title,
        description: video.description,
        url: video.url
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).send(error.message);
      } else {
        console.log(error);
        res.status(500).send();
      }
    }
  })

  router.route('/:id')
  .get(async function(req, res) {

    if (req.params.id == undefined || validator.isEmpty(req.params.id)) {
      res.status(400).send("O Id é obrigatório.");
    }
  
    try {
      let video = await VideoRepository.findOneById(req.params.id);
    
      if (video == undefined) {
        res.status(404).send();
      } else {
        res.json({
          id: video.id,
          title: video.title,
          description: video.description,
          url: video.url
        });
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).send(error.message);
      } else {
        console.log(error);
        res.status(500).send();
      }
    }
  })
  .put(async function(req, res) {
    if (req.params.id == undefined || validator.isEmpty(req.params.id)) {
      res.status(400).send("O Id é obrigatório.");
    }

    try {
      let video = new VideoEntity(req.body.title, req.body.description, req.body.url);
      let result = await VideoRepository.update(req.params.id, video);
      
      if (result.modifiedCount > 0 || result.matchedCount > 0) {
        res.status(200).json({
          id: req.params.id,
          title: video.title,
          description: video.description,
          url: video.url
        });
      } else if (result.matchedCount < 1) {
        res.status(404).send();
      } else {
        res.status(500).send();
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).send(error.message);
      } else {
        console.log(error);
        res.status(500).send();
      }
    }
  })
  .delete(async function(req, res) {
    if (req.params.id == undefined || validator.isEmpty(req.params.id)) {
      res.status(400).send("O Id é obrigatório.");
    }
  
    try {
      let result = await VideoRepository.delete(req.params.id);
    
      if (result.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).send(error.message);
      } else {
        console.log(error);
        res.status(500).send();
      }
    }
  });
  
  module.exports = router;