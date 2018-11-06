const mongoose = require('mongoose');

const EmotionType = mongoose.Schema({
  joy         : {
    type : Number
  },
  sadness     : {
    type : Number
  },
  disgust     : {
    type : Number
  },
  contempt    : {
    type : Number
  },
  anger       : {
    type : Number
  },
  fear        : {
    type : Number
  },
  surprise    : {
    type : Number
  },
  emoji       : {
    type : String
  },
  timestamp   : {
    type : Number
  }
})

const EmotionSchema = mongoose.Schema({
    music_id    : {
        type        : Number,
        required    : true
    },
    users_id    : {
        type        : Number,
        required    : true
    },
    emotions    : {
        // joy         : [{type:Number}],
        // sadness     : [{type:Number}],
        // disgust     : [{type:Number}],
        // contempt    : [{type:Number}],
        // anger       : [{type:Number}],
        // fear        : [{type:Number}],
        // surprise    : [{type:Number}],
        // emoji       : [{type:String}],
        // timestamp   : [{type:Number}]
        // joy         : Number,
        // sadness     : Number,
        // disgust     : Number,
        // contempt    : Number,
        // anger       : Number,
        // fear        : Number,
        // surprise    : Number,
        // emoji       : String,
        // timestamp   : Number
        type : EmotionType
        // required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Emotion', EmotionSchema);
