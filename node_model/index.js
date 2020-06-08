const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg');
const posenet = require('@tensorflow-models/posenet');
const { Image } = require('image-js');
const util = require('util');
const pLimit = require('p-limit');

var net = null;
const limit = pLimit(5);

async function getPose(imgPath) {
    // load the posenet model from a checkpoint
    console.log("Start process image " + imgPath);
    let img = await Image.load(imgPath);

    const pose = await net.estimateSinglePose(img, {
        flipHorizontal: false
    });
    let poseCoordinates = {};
    poseCoordinates["imgPath"] = imgPath;
    for (var keypoint of pose.keypoints) {
        poseCoordinates[keypoint.part] = [keypoint.position.x, keypoint.position.y];
    }
    
    return poseCoordinates;
}


function processVideo(pathVideo, outputFolder) {
    console.log("Start videos to images " + pathVideo + "chambon " + outputFolder);
    try {

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true }, function (err) {
                if (err) {
                    console.log(err);
                    // echo the result back
                    response.send("ERROR! Can't make the directory! \n");
                }
            });
        }
        var process = new ffmpeg(pathVideo);
        process.then(function (video) {
            video.fnExtractFrameToJPG(outputFolder, {
                every_n_frames: 1
            }, function () { })
        }, function (err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log(e);
        console.log(e.code);
        console.log(e.msg);
    }
    console.log("Sali de Videos a imagenes");
}

function processVideos(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            processVideos(fullPath);
        } else {
            if (file.endsWith(".mp4")) {
                var outputFolder = fullPath.split('.')[0];
                processVideo(fullPath, "output/" + outputFolder);
            }
        }
    });
}
function writeFile(outputFullPath, fileOutput){
    fileOutput = JSON.stringify(fileOutput);
    fs.writeFile(outputFullPath, fileOutput, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

async function processImages(dir) {
    var images = {};
    await fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            processImages(fullPath);
        } else {
            if (file.endsWith(".jpg")) {
                var outputFolder = dir;          
                if (typeof images[outputFolder] === 'undefined') {
                    images[outputFolder] = [];
                }
                images[outputFolder].push({
                    fullPath: fullPath,
                })
            }
        }
        
    });

    net = await posenet.load({
        architecture: 'MobileNetV1',
        multiplier: 0.50
    });

    for(const entry of Object.entries(images)){
        let outputFolder = entry[0];
        let images = entry[1];              
        let promises = images.map(image => {
            // wrap the function we are calling in the limit function we defined above
            return limit(() => getPose(image.fullPath));
        });
        let fileOutput = await Promise.all(promises);                
        let outputfullPath = path.join(outputFolder, "coordinates.json");
        await writeFile(outputfullPath, fileOutput);
    }
}

const pathData = 'prueba2';
//processVideos(pathData);
processImages(pathData);