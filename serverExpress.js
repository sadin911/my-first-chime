const express = require('express')
const app = express()
const https = require("https");
const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')
const cors = require('cors')
const region = 'us-east-1'
const fs = require('fs');
const { resolveProjectReferencePath } = require('typescript');
var key = fs.readFileSync('sslcert/privateKey.key');
var cert = fs.readFileSync('sslcert/certificate.crt');
var optionsSSL = {
  key: key,
  cert: cert,
};

const chime = new AWS.Chime({ region })
chime.endpoint = new AWS.Endpoint(
  'https://service.chime.aws.amazon.com/console'
)
const meetingCache = {};
const attendeeCache = {};
app.get('/meeting', cors(), async (req, res) => {
  try {
    const response = {}
    response.meetingResponse = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: region,
      })
      .promise()

    response.attendee = await chime
      .createAttendee({
        MeetingId: response.meetingResponse.Meeting.MeetingId,
        ExternalUserId: uuid(),
      })
      .promise()
    console.log(response)
    res.send(response)
  } catch (err) {
    res.send(err)
  }
})

app.post('/join?', cors(), async (req, res) => {
  try {
    console.log('joining')
    console.log(req.query)
    const response = {}
    const query = req.query;
    const title = query.title;
    const name = query.name;
    const region = query.region || 'us-east-1';
    if (!meetingCache[title]) {
      meetingCache[title] = await chime
        .createMeeting({
          ClientRequestToken: uuid(),
          MediaRegion: region
        })
        .promise();
      attendeeCache[title] = {};
    }
    console.log('joining2')
    console.log(meetingCache)
    const joinInfo = {
      JoinInfo: {
        Title: title,
        Meeting: meetingCache[title].Meeting,
        Attendee: (
          await chime
            .createAttendee({
              MeetingId: meetingCache[title].Meeting.MeetingId,
              ExternalUserId: uuid()
            })
            .promise()
        ).Attendee
      }
    };
    // console.log(joinInfo)
    attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;
    console.log(attendeeCache)
    res.send(joinInfo)
  } catch (err) {
    res.send(err)
  }
})

https.createServer(optionsSSL, app).listen(8080);
console.log(`server run as https port 8080`);

