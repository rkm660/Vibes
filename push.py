import urllib2
import urllib
import base64
import json





post_data = {
  "tokens":[
    "f9b63e6bf372cde3cea7070fc115141ec4d8e52e5bd154fe4a38920c5227a475"
  ],
  "notification":{
    "alert":"It worked"
  }
}

d = json.dumps(post_data)
app_id = "e2c37079"
private_key = "6fc2a474fa7d5572a9228c7a507e9718760efd75fcbefba9"
url = "https://push.ionic.io/api/v1/push"
req = urllib2.Request(url, data=d)
req.add_header("Content-Type", "application/json")
req.add_header("X-Ionic-Application-Id", app_id)
b64 = base64.encodestring('%s:' % private_key).replace('\n', '')
req.add_header("Authorization", "Basic %s" % b64)
resp = urllib2.urlopen(req)

