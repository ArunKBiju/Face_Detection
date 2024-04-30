let videoFileInput = document.getElementById('videoFile');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let isVideoLoaded = false;

videoFileInput.addEventListener('change', function() {
    let file = this.files[0];
    let url = URL.createObjectURL(file);
    video.src = url;
    video.onloadmetadata = function() {
        isVideoLoaded = true;
    };
});

function processVideo() {
    if (!isVideoLoaded) {
        alert('Please upload a video file.');
        return;
    }

    let cap = new cv.VideoCapture(video);
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let faces = new cv.RectVector();

    function processFrame() {
        cap.read(src);
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        let faceCascade = new cv.CascadeClassifier();
        faceCascade.load('haarcascade_frontalface_default.xml');
        let facesSize = new cv.Size(0, 0);
        let facesCenter = new cv.Point(0, 0);
        let facesize = Math.min(src.cols, src.rows);
        let minSize = new cv.Size(facesize, facesize);
        let maxSize = new cv.Size(0, 0);
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, minSize, maxSize);
        for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        }
        cv.imshow('canvas', src);
        requestAnimationFrame(processFrame);
    }

    processFrame();
}