const fs = require("fs");
const path = require("path");
const Audio = require("../models/Audio"); 

const uploadAudio = async (req, res) => {
    try {
        if(!req.files || !req.files.audio || !req.files.cover){
            return res.status(400).json({ message: "Audio and cover files are required" });
        }

        const newAudio = new Audio({
            title: req.body.title,
            genre: req.body.genre,
            audioPath: req.files.audio.path,
            coverPath: req.files.cover.path,
            user: req.user.id,
            isPrivate: req.body.isPrivate,
            playCount: 0,
        })

        await newAudio.save();

        res.status(201).message("Audio uploaded successfully").json(newAudio);
    }catch(error){
        res.status(500).message(error.message).json({ message: error.message });
    }
}

const streamById = async (req, res) => {
    try{

        const audio = await Audio.findById(req.params.id);
        if(!audio){
            return res.status(404).json({ message: "Audio not found" });
        }
        const audioPath = path.resolve(req.params.id);
        if(!fs.existsSync(audioPath)){
            return res.status(404).json({ message: "Audio not found" });
        }
        const stat = fs.statSync(audioPath);
        const range = req.headers.range;
        if(!range){
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'audio/mpeg');
            fs.createReadStream(audioPath).pipe(res);
        }else{
            const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
            const start = parseInt(startStr, 10);
            const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
            const chunkSize = end - start + 1;
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'audio/mpeg',
            });
            fs.createReadStream(audioPath, { start, end }).pipe(res);
        }
    }catch(error){
        res.status(500).message(error.message).json({ message: error.message });
    }
}

const listPublic = async (req, res) => {
    try{
        const audios = await Audio.find({ isPrivate: false }).populate("uploader", "user email").sort({ createdAt: -1 });
        if(!audios){
            return res.status(404).json({ message: "No audios found" });
        }
        res.status(200).message("Audios fetched successfully").count(audios.length).json(audios);
    }catch(error){
        res.status(500).message(error.message).json({ message: error.message });
    }
}

const listMine = async (req , res) => {
    try{
        const user = req.user.id;
        if(!user){
            res.status(401).json({ message: "Unauthorized" });
        }
        const myAudios = await Audio.find({ uploader: user }).sort({ createdAt: -1 });
        if(!myAudios){
            return res.status(404).json({ message: "No audios found" });
        }
        res.status(200).message("Audios fetched successfully").count(myAudios.length).json(myAudios);    
    }catch(error){
        return res.status(500).message(error.message).json({ message: error.message });
    }
}

const updateAudio = async (req, res) => {
    try{
        const user = req.user.id;
        const { id } = req.params;
        const {title , isPrivate} = req.body;
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(audio.uploader.toString() !== user){
            return res.status(403).json({ message: "no access for you to update on this audio" });
        }
        const audio = await Audio.findById(id);
        if(!audio){
            return res.status(404).json({ message: "Audio not found" });
        }
        if(title){
            audio.title = title;
        }
        if(typeof isPrivate !== 'undefined'){
            audio.isPrivate = isPrivate;
        }
        
        await audio.save();

        res.status(201).message("The File Update Successfully").json(audio)

    }catch(error){
        return res.status(500).message(error.message).json({ message: error.message });
    }
}

const deleteAudio = async (req, res) => {
    try{
        const user = req.user.id;
        const { id } = req.params;
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(audio.uploader.toString() !== user){
            return res.status(403).json({ message: "no access for you to update on this audio" });
        }
        const audio = await Audio.findById(id);
        if(!audio){
            return res.status(404).json({ message: "Audio not found" });
        }
        const filePath = path.join(__dirname, "..", audio.audioPath);
        const coverPath = path.join(__dirname, "..", audio.coverPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
        await audio.deleteOne();

        res.status(201).message("The File Deleted Successfully").json({ message: "The File Deleted Successfully" });
    }catch(error){
        return res.status(500).message(error.message).json({ message: error.message });
    }
}


module.exports = {
    uploadAudio,
    streamById,
    listPublic,
    listMine,
    updateAudio,
    deleteAudio,
}