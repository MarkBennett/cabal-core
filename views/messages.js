var View = require('kappa-view-level')
var through = require('through2')
var readonly = require('read-only-stream')
var charwise = require('charwise')
var xtend = require('xtend')

module.exports = function (lvl) {
  return View(lvl, {
    map: function (msg) {
      if (msg.value.type.startsWith('text/') && msg.value.content.channel) {
        return [
          ['msg!' + msg.value.content.channel + '!' + charwise.encode(msg.value.timestamp), msg.value]
        ]
      } else {
        return []
      }
    },

    api: {
      read: function (core, channel, opts) {
        opts = opts || {}

        var t = through.obj()
        this.ready(function () {
          var v = lvl.createValueStream(xtend(opts, {
            gt: 'msg!' + channel + '!',
            lt: 'msg!' + channel + '~'
          })
          v.pipe(t)
        })
        return readonly(t)
      }
    }
  })
}
