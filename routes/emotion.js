function emotionRoute(req, res) {
  var express = require('express');
  var router = express.Router();

  const mongoose  = require('mongoose');

  const Emotion   = require("../models/emotion.model.js");

  var action = req.params.action;

  if(action == 'view'){
    Emotion.find({}).exec({}, function(err, result) {
        if (err) res.json(err);


        var emotion_collection = {
          joy : [],
          sadness : [],
          disgust : [],
          contempt : [],
          anger : [],
          fear : [],
          surprise : [],
          avg_joy : 0,
          avg_sadness : 0,
          avg_disgust : 0,
          avg_contempt : 0,
          avg_anger : 0,
          avg_fear : 0,
          avg_surprise : 0,
          timestamp : []
        }
        var count = 0;

        for(let item of result){

          var today = new Date();
          var date_today = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();

          var a = new Date(item.emotions.timestamp );
          var date_data = a.getDate() + '/' + (a.getMonth()+1) + '/' + a.getFullYear();

          console.log(date_data, date_today);

          if(date_data == date_today){
              emotion_collection.joy.push(item.emotions.joy);
              emotion_collection.sadness.push(item.emotions.sadness);
              emotion_collection.disgust.push(item.emotions.disgust);
              emotion_collection.contempt.push(item.emotions.contempt);
              emotion_collection.anger.push(item.emotions.anger);
              emotion_collection.fear.push(item.emotions.fear);
              emotion_collection.surprise.push(item.emotions.surprise);
              time = a.getHours() + '.' + a.getMinutes();
              emotion_collection.timestamp.push(time.toString());

              emotion_collection.avg_joy += item.emotions.joy;
              emotion_collection.avg_sadness += item.emotions.sadness;
              emotion_collection.avg_disgust += item.emotions.disgust;
              emotion_collection.avg_contempt += item.emotions.contempt;
              emotion_collection.avg_anger += item.emotions.anger;
              emotion_collection.avg_fear += item.emotions.fear;
              emotion_collection.avg_surprise += item.emotions.surprise;

              count++;
          }
              // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              // var year = a.getFullYear();
              // var month = months[a.getMonth()];
              // var date = a.getDate();
              // var hour = a.getHours();
              // var min = a.getMinutes();
              // var sec = a.getSeconds();
              // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
              // return time;

        }

        emotion_collection.avg_joy /= count;
        emotion_collection.avg_sadness /= count;
        emotion_collection.avg_disgust /= count;
        emotion_collection.avg_contempt /= count;
        emotion_collection.avg_anger /= count;
        emotion_collection.avg_fear /= count;
        emotion_collection.avg_surprise /= count;

        console.log(emotion_collection);
        // res.json(emotions);
        res.render('emotions', {
          user: "Great User",
          title:"homepage",
          emotions : emotion_collection
          // emotions : {
          //   joy : result.emotions.joy
          // }
        });
    });
  } else if(action == 'save'){
    // res.json(req.body);
    // console.log(req.body);
    // res.status(400).send("unable to save to database");
    // console.log(req.body)
    console.log(req.body.disgust)
    Emotion.create({
        music_id    : req.body.music_id,
        users_id    : req.body.users_id,
        emotions    : {
          joy : req.body.joy,
          sadness : req.body.sadness,
          disgust : req.body.disgust,
          contempt : req.body.contempt,
          anger : req.body.anger,
          surprise : req.body.surprise,
          fear : req.body.fear,
          emoji : req.body.emoji,
          timestamp : req.body.timestamp,
        }
    }, function(err, emotions) {
        if (err) res.send(err);

        Emotion.find(function(err, emotions) {
            if (err) res.send(err);

            res.json(emotions);
        });
    });
  }
}


// router.get('/', function(req, res, next) {
//     Emotion.find({}).exec({}, function(err, emotions) {
//         if (err) res.json(err);
//
//         res.json(emotions);
//     });
// });


// router.post('/save', function(req, res, next) {
//     // res.json(req.body);
//     // console.log(req.body);
//     // res.status(400).send("unable to save to database");
//     Emotion.create({
//         music_id    : req.body.music_id,
//         users_id    : req.body.users_id,
//         emotions    : req.body.emotion
//     }, function(err, emotions) {
//         if (err) res.send(err);
//
//         Emotion.find(function(err, emotions) {
//             if (err) res.send(err);
//
//             res.json(emotions);
//         });
//     });
//     // Emotion.save()
//     //     .then(item => {
//     //         res.send("item saved to database");
//     //     })
//     //     .catch(err => {
//     //         res.send("item not saved to database");
//     //       // res.status(400).send("unable to save to database");
//     //     });
// });
//
// router.delete('/delete/:id', function(req, res, next) {
//     Emotion.deleteOne({
//         _id : req.params.id
//     }, function(err, emotions) {
//         if (err) res.send(err);
//
//         Emotion.find(function(err, emotions) {
//             if (err) res.send(err);
//
//             res.json(emotions);
//         });
//     });
// });
//
// router.get('/delete/all', function(req, res, next) {
//     Emotion.remove({
//         video_id : 1
//     }, function(err, emotion) {
//         if (err) res.send(err);
//
//         res.json({
//             message : "Success delete"
//         })
//     });
// });
//
module.exports = emotionRoute;
