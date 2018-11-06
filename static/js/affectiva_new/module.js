      // SDK Needs to create video and canvas nodes in the DOM in order to function
      // Here we are adding those nodes a predefined div.
      var divRoot = $("#affdex_elements")[0];
      var width = 640;
      var height = 480;
      var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
      //Construct a CameraDetector and specify the image width / height and face detector mode.
      var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
      var face_emoji = '';
      var iter_submit = 0;

      var emotion_temp = [0,0,0,0,0,0,0]

      var emotion_collect = {
          joy : "",
          sadness : "",
          disgust : "",
          contempt : "",
          anger : "",
          fear : "",
          surprise : "",
          emoji : "",
          timestamp : ""
      };

      //Enable detection of all Expressions, Emotions and Emojis classifiers.
      detector.detectAllEmotions();
      detector.detectAllEmojis();
      detector.setMaxProcess(1);
      // detector.detectAllExpressions();
      // detector.detectAllAppearance();

      //Add a callback to notify when the detector is initialized and ready for runing.
      detector.addEventListener("onInitializeSuccess", function() {
        log('#logs', "Face Detected");
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
      }

      //function executes when the Stop button is pushed.
      function onStop() {
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

      function onSubmit() {
          $.ajax({
              url     : '/emotion/save',
              type    : 'POST',
              data    : {
                  music_id    : 1,
                  users_id    : 1,
                  joy : emotion_collect.joy,
                  sadness : emotion_collect.sadness,
                  disgust : emotion_collect.disgust,
                  contempt : emotion_collect.contempt,
                  anger : emotion_collect.anger,
                  fear : emotion_collect.fear,
                  surprise : emotion_collect.surprise,
                  emoji : emotion_collect.emoji,
                  timestamp : emotion_collect.timestamp
              },
              success : function(res, err) {
                  console.log('Success');
                  console.log(emotion_collect);
                  if(err){
                    console.log(err);
                  }
              },
          });
      }

      function recommendMusic(data_emotion) {
          $.ajax({
              url     : 'http://localhost:5000/api/v1/resources/recommend/',
              type    : 'POST',
              data    : {
                  data : data_emotion
              },
              success : function(res, err) {
                  console.log('Success Recommend');
                  console.log(res);
                  if(err){
                    console.log(err);
                  }
              },
          });
      }

      //Add a callback to notify when camera access is allowed
      detector.addEventListener("onWebcamConnectSuccess", function() {
        log('#logs', "Start Detecting Your Face");
      });

      //Add a callback to notify when camera access is denied
      detector.addEventListener("onWebcamConnectFailure", function() {
        log('#logs', "webcam denied");
        console.log("Webcam access denied");
      });

      //Add a callback to notify when detector is stopped
      detector.addEventListener("onStopSuccess", function() {
        log('#logs', "The detector reports stopped");
        $("#results").html("");
      });

      //Add a callback to receive the results from processing an image.
      //The faces object contains the list of the faces detected in an image.
      //Faces object contains probabilities for all the different expressions, emotions and appearance metrics
      detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
        console.log("running image analysist");
        $('#results').html("");

        if (faces.length > 0) {
          face_emoji = faces[0].emojis.dominantEmoji;
          emotion_collect.joy = faces[0].emotions.joy;
          emotion_collect.sadness = faces[0].emotions.sadness;
          emotion_collect.disgust = faces[0].emotions.disgust;
          emotion_collect.contempt = faces[0].emotions.contempt;
          emotion_collect.anger = faces[0].emotions.anger;
          emotion_collect.fear = faces[0].emotions.fear;
          emotion_collect.surprise = faces[0].emotions.surprise;
          emotion_collect.emoji = faces[0].emojis.dominantEmoji;
          emotion_collect.timestamp = Date.now();

          // console.log(emotion_collect);
          onSubmit();
          $('#logs').html("");
        }
        log('#results', face_emoji);

        iter_submit++;
        emotion_temp[0] += emotion_collect.joy;
        emotion_temp[1] += emotion_collect.sadness;
        emotion_temp[2] += emotion_collect.disgust;
        emotion_temp[3] += emotion_collect.contempt;
        emotion_temp[4] += emotion_collect.anger;
        emotion_temp[5] += emotion_collect.fear;
        emotion_temp[6] += emotion_collect.surprise;
        n_iter = 60

        if(iter_submit>n_iter){
          emotion_temp[0] /= n_iter;
          emotion_temp[1] /= n_iter;
          emotion_temp[2] /= n_iter;
          emotion_temp[3] /= n_iter;
          emotion_temp[4] /= n_iter;
          emotion_temp[5] /= n_iter;
          emotion_temp[6] /= n_iter;
          recommendMusic(emotion_temp);
        }
      });

      detector.addEventListener("onImageResultsFailure", function(image, timestamp, detail) {
        console.log(image, timestamp, detail);
      });

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
