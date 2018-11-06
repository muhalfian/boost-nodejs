    // SDK Needs to create video and canvas nodes in the DOM in order to function
    // Here we are adding those nodes a predefined div.
    var divRoot = $("#affdex_elements")[0];
    var width = 100;
    var height = 100;
    var emotions = ["anger", "contempt", "joy", "sadness", "surprise"];
    var emoji_threshold = {
        anger: 45,
        contempt: 90,
        joy: 70,
        sadness: 70,
        surprise: 90
    };
    var emoji_emitted = {
        anger: false,
        contempt: false,
        joy: false,
        sadness: false,
        surprise: false
    };
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES;

    var anger, contempt, joy, sad, surprised = [];
    var avgAnger, avgContempt, avgJoy, avgSad, avgSurprised;
    var total = 0;

    //Construct a CameraDetector and specify the image width / height and face detector mode.
    var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
    //Enable detection of all Expressions, Emotions and Emojis classifiers.
    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllEmojis();
    detector.detectAllAppearance();

    //Add a callback to notify when the detector is initialized and ready for runing.
    detector.addEventListener("onInitializeSuccess", function () {
        log('#logs', "The detector reports initialized");
        //Display canvas instead of video feed because we want to draw the feature points on it
        $("#face_video_canvas").css("display", "block");
        $("#face_video").css("display", "none");
    });

    function log(node_name, msg) {
        $(node_name).append("<span>" + msg + "</span><br />")
    }

    //function executes when Start button is pushed.
    function onStart() {
        if (detector && !detector.isRunning) {
            $("#logs").html("");
            detector.start();
        }
        log('#logs', "Clicked the start button");
    }

    //function executes when the Stop button is pushed.
    var onStop = function () {
        log('#logs', "Clicked the stop button");
        if (detector && detector.isRunning) {
            detector.removeEventListener();
            detector.stop();
        }
    };

    //function executes when the Reset button is pushed.
    function onReset() {
        log('#logs', "Clicked the reset button");
        if (detector && detector.isRunning) {
            detector.reset();

            $('#results').html("");
        }
    };

    //Add a callback to notify when camera access is allowed
    detector.addEventListener("onWebcamConnectSuccess", function () {
        log('#logs', "Webcam access allowed");
    });

    //Add a callback to notify when camera access is denied
    detector.addEventListener("onWebcamConnectFailure", function () {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
    });

    //Add a callback to notify when detector is stopped
    detector.addEventListener("onStopSuccess", function () {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
    });

    //Add a callback to receive the results from processing an image.
    //The faces object contains the list of the faces detected in an image.
    //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
    detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
        $('#results').html("");
        log('#results', "Timestamp: " + timestamp.toFixed(2));
        log('#results', "Number of faces found: " + faces.length);
        
        if (faces.length > 0) {
            // console.log("Appearance: " + JSON.stringify(faces[0].appearance));
            // console.log("Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
            //     return val.toFixed ? Number(val.toFixed(0)) : val;
            // }));
            // console.log("Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
            //     return val.toFixed ? Number(val.toFixed(0)) : val;
            // }));
            // console.log("Emoji: " + faces[0].emojis.dominantEmoji);
            // drawFeaturePoints(image, faces[0].featurePoints);

            setAverage(faces[0].emotions);
            setAnimation(face[0].emotions);
        }
    });

    function setAnimation(val) {
        // var emotions_val = faces[0].emotions[val];
        // if (faces[0].emotions.contempt > emoji_threshold[val]) {
        //     $("#" + val + "-icon").animate({
        //         "opacity": 0.555 + emotions_val / 150.0
        //     }, 50, "liniear");
        // }
        console.log(val);
        // if (val.anger >= emoji_threshold.anger)
    }

    function setAverage(emotions) {
        anger.push(emotions.anger);
        contempt.push(emotions.contempt);
        joy.push(emotions.joy);
        sad.push(emotions.sadness);
        surprised.push(emotions.surprise);
    }

    function saveData() {
        anger.forEach(item => {
            total += item;
        });
        avgAnger = total / anger.length;
        total = 0;

        contempt.forEach(item => {
            total += item;
        });
        avgContempt = total / contempt.length;
        total = 0;

        joy.forEach(item => {
            total += item;
        });
        avgJoy = total / joy.length;
        total = 0;

        sad.forEach(item => {
            total += item;
        });
        avgSad = total / sad.length;
        total = 0;

        surprised.forEach(item => {
            total += item;
        });
        avgSurprised = total / surprised.length;
        
        $.ajax({
            url     : '/emotion/save',
            type    : 'POST',
            data    : {
                video_id    : 1,
                users_id    : 1,
                anger       : avgAnger,
                contempt    : contempt,
                joy         : joy,
                sad         : sad,
                surprised   : surprised
            }, 
            success : function(res) {
                console.log('Success');
            }
        });
    }

    //Draw the detected facial feature points on the image
    function drawFeaturePoints(img, featurePoints) {
        var contxt = $('#face_video_canvas')[0].getContext('2d');

        var hRatio = contxt.canvas.width / img.width;
        var vRatio = contxt.canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);

        contxt.strokeStyle = "#FFFFFF";
        for (var id in featurePoints) {
            contxt.beginPath();
            contxt.arc(featurePoints[id].x,
                featurePoints[id].y, 2, 0, 2 * Math.PI);
            contxt.stroke();

        }
    }

    // var video = videojs('my-video').ready(function () {
    //     var player = this;

    //     player.on('ended', function () {
    //         alert('video is done!');
    //         onStop();
    //     });

    //     player.on('pause', function () {
    //         alert('video is paused!');
    //         onStop();
    //     });

    //     player.on('resume', function () {
    //         alert('video is resume!');
    //         onStart();
    //     });
    // });

