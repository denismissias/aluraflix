const mongoClient = require('../infrastructure/mongoClient');
const validationException = require('../core/validationException');
const ObjectId = require('mongodb').ObjectId
let VideoEntity = require('../entity/video');

class Video {
    async add(video) {
        try {
            await mongoClient.connect();

            let result = await mongoClient
                .db("aluraflix")
                .collection("video")
                .insertOne({
                    title: video.title,
                    description: video.description,
                    url: video.url
                });
            
            return result.insertedId;
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    };

    async find() {
        try {
            await mongoClient.connect();

            let result = await mongoClient
                .db("aluraflix")
                .collection("video")
                .find().toArray();

            let videos = [];
            
            if (result.length > 0) {
                result.forEach(element => {
                    let videoEntity = new VideoEntity(
                        element.title,
                        element.description,
                        element.url);
                    videoEntity.id = element._id;
                    videos.push(videoEntity);
                });
            }

            return videos;
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    };

    async findOneById(id) {
        if (!ObjectId.isValid(id)) {
            throw new validationException("Id inválido.");
        }

        try {
            await mongoClient.connect();
            let result = await mongoClient
                .db("aluraflix")
                .collection("video")
                .findOne({_id: ObjectId(id)});

            if (result == undefined) {
                return result;
            } else {
                let video = new VideoEntity(
                    result.title,
                    result.description,
                    result.url);
                video.id = result._id;
                return video;
            }
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    };

    async update(id, video) {
        if (!ObjectId.isValid(id)) {
            throw new validationException("Id inválido.");
        }

        try {
            await mongoClient.connect();

            let result = await mongoClient
                .db("aluraflix")
                .collection("video")
                .updateOne({
                    _id: ObjectId(id)
                },{
                    $set: {
                        title: video.title,
                        description: video.description,
                        url: video.url
                    }
                });
            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    };

    async delete(id) {
        if (!ObjectId.isValid(id)) {
            throw new validationException("Id inválido.");
        }

        try {
            await mongoClient.connect();
            let result = await mongoClient
                .db("aluraflix")
                .collection("video")
                .deleteOne({_id: ObjectId(id)});

            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
    };
}

module.exports = new Video;