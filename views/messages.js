var View = require('kappa-view-level')
var through = require('through2')
var readonly = require('read-only-stream')
var charwise = require('charwise')
var xtend = require('xtend')
var EventEmitter = require('events').EventEmitter

module.exports = function (lvl) {
  var events = new EventEmitter()

  return View(lvl, {
    map: function (msg) {
      if (!sanitize(msg)) return []

      if (!msg.value.timestamp) return []

      // If the message is from <<THE FUTURE>>, index it at _now_.
      var timestamp = msg.value.timestamp
      var now = new Date().getTime()
      if (timestamp > now) timestamp = now

      if (msg.value.type.startsWith('chat/') && msg.value.content.channel) {
        var key = 'msg!' + msg.value.content.channel + '!' + charwise.encode(timestamp)
        return [
          [key, msg]
        ]
      } else {
        return []
      }
    },

    indexed: function (msgs) {
      msgs
        .filter(msg => Boolean(sanitize(msg)))
        .filter(msg => msg.value.type.startsWith('chat/') && msg.value.content.channel)
        .sort(cmpMsg)
        .forEach(function (msg) {
          events.emit('message', msg)
          events.emit(msg.value.content.channel, msg)
        })
    },

    api: {
      read: function (core, channel, opts) {
        opts = opts || {}

        var t = through.obj()

        if (opts.gt) opts.gt = 'msg!' + channel + '!' + charwise.encode(opts.gt)  + '!'
        else opts.gt = 'msg!' + channel + '!'
        if (opts.lt) opts.lt = 'msg!' + channel + '!' + charwise.encode(opts.lt)  + '~'
        else opts.lt = 'msg!' + channel + '~'

        this.ready(function () {
          var v = lvl.createValueStream(xtend(opts, {
            reverse: true
          }))
          v.pipe(t)
        })

        return readonly(t)
      },

      events: events
    }
  })
}

function cmpMsg (a, b) {
  return a.value.timestamp - b.value.timestamp
}

// Either returns a well-formed chat message, or null.
function sanitize (msg) {
  if (typeof msg !== 'object') return null
  if (typeof msg.value !== 'object') return null
  if (typeof msg.value.content !== 'object') return null
  if (typeof msg.value.timestamp !== 'number') return null
  if (typeof msg.value.type !== 'string') return null
  if (typeof msg.value.content.channel !== 'string') return null
  if (typeof msg.value.content.text !== 'string') return null
  return msg
}
