(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.adapter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  
  'use strict';
  
  var _adapter_factory = require('./adapter_factory.js');
  
  var adapter = (0, _adapter_factory.adapterFactory)({ window: window });
  module.exports = adapter; // this is the difference from adapter_core.
  
  },{"./adapter_factory.js":2}],2:[function(require,module,exports){
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.adapterFactory = adapterFactory;
  
  var _utils = require('./utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  var _chrome_shim = require('./chrome/chrome_shim');
  
  var chromeShim = _interopRequireWildcard(_chrome_shim);
  
  var _edge_shim = require('./edge/edge_shim');
  
  var edgeShim = _interopRequireWildcard(_edge_shim);
  
  var _firefox_shim = require('./firefox/firefox_shim');
  
  var firefoxShim = _interopRequireWildcard(_firefox_shim);
  
  var _safari_shim = require('./safari/safari_shim');
  
  var safariShim = _interopRequireWildcard(_safari_shim);
  
  var _common_shim = require('./common_shim');
  
  var commonShim = _interopRequireWildcard(_common_shim);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  // Shimming starts here.
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  function adapterFactory() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        window = _ref.window;
  
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      shimChrome: true,
      shimFirefox: true,
      shimEdge: true,
      shimSafari: true
    };
  
    // Utils.
    var logging = utils.log;
    var browserDetails = utils.detectBrowser(window);
  
    var adapter = {
      browserDetails: browserDetails,
      commonShim: commonShim,
      extractVersion: utils.extractVersion,
      disableLog: utils.disableLog,
      disableWarnings: utils.disableWarnings
    };
  
    // Shim browser if found.
    switch (browserDetails.browser) {
      case 'chrome':
        if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
          logging('Chrome shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming chrome.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = chromeShim;
  
        chromeShim.shimGetUserMedia(window);
        chromeShim.shimMediaStream(window);
        chromeShim.shimPeerConnection(window);
        chromeShim.shimOnTrack(window);
        chromeShim.shimAddTrackRemoveTrack(window);
        chromeShim.shimGetSendersWithDtmf(window);
        chromeShim.shimGetStats(window);
        chromeShim.shimSenderReceiverGetStats(window);
        chromeShim.fixNegotiationNeeded(window);
  
        commonShim.shimRTCIceCandidate(window);
        commonShim.shimConnectionState(window);
        commonShim.shimMaxMessageSize(window);
        commonShim.shimSendThrowTypeError(window);
        commonShim.removeAllowExtmapMixed(window);
        break;
      case 'firefox':
        if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
          logging('Firefox shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming firefox.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = firefoxShim;
  
        firefoxShim.shimGetUserMedia(window);
        firefoxShim.shimPeerConnection(window);
        firefoxShim.shimOnTrack(window);
        firefoxShim.shimRemoveStream(window);
        firefoxShim.shimSenderGetStats(window);
        firefoxShim.shimReceiverGetStats(window);
        firefoxShim.shimRTCDataChannel(window);
        firefoxShim.shimAddTransceiver(window);
        firefoxShim.shimCreateOffer(window);
        firefoxShim.shimCreateAnswer(window);
  
        commonShim.shimRTCIceCandidate(window);
        commonShim.shimConnectionState(window);
        commonShim.shimMaxMessageSize(window);
        commonShim.shimSendThrowTypeError(window);
        break;
      case 'edge':
        if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
          logging('MS edge shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming edge.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = edgeShim;
  
        edgeShim.shimGetUserMedia(window);
        edgeShim.shimGetDisplayMedia(window);
        edgeShim.shimPeerConnection(window);
        edgeShim.shimReplaceTrack(window);
  
        // the edge shim implements the full RTCIceCandidate object.
  
        commonShim.shimMaxMessageSize(window);
        commonShim.shimSendThrowTypeError(window);
        break;
      case 'safari':
        if (!safariShim || !options.shimSafari) {
          logging('Safari shim is not included in this adapter release.');
          return adapter;
        }
        logging('adapter.js shimming safari.');
        // Export to the adapter global object visible in the browser.
        adapter.browserShim = safariShim;
  
        safariShim.shimRTCIceServerUrls(window);
        safariShim.shimCreateOfferLegacy(window);
        safariShim.shimCallbacksAPI(window);
        safariShim.shimLocalStreamsAPI(window);
        safariShim.shimRemoteStreamsAPI(window);
        safariShim.shimTrackEventTransceiver(window);
        safariShim.shimGetUserMedia(window);
  
        commonShim.shimRTCIceCandidate(window);
        commonShim.shimMaxMessageSize(window);
        commonShim.shimSendThrowTypeError(window);
        commonShim.removeAllowExtmapMixed(window);
        break;
      default:
        logging('Unsupported browser!');
        break;
    }
  
    return adapter;
  }
  
  // Browser shims.
  
  },{"./chrome/chrome_shim":3,"./common_shim":6,"./edge/edge_shim":7,"./firefox/firefox_shim":11,"./safari/safari_shim":14,"./utils":15}],3:[function(require,module,exports){
  
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _getusermedia = require('./getusermedia');
  
  Object.defineProperty(exports, 'shimGetUserMedia', {
    enumerable: true,
    get: function get() {
      return _getusermedia.shimGetUserMedia;
    }
  });
  
  var _getdisplaymedia = require('./getdisplaymedia');
  
  Object.defineProperty(exports, 'shimGetDisplayMedia', {
    enumerable: true,
    get: function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }
  });
  exports.shimMediaStream = shimMediaStream;
  exports.shimOnTrack = shimOnTrack;
  exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
  exports.shimGetStats = shimGetStats;
  exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
  exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
  exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
  exports.shimPeerConnection = shimPeerConnection;
  exports.fixNegotiationNeeded = fixNegotiationNeeded;
  
  var _utils = require('../utils.js');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  function shimMediaStream(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  }
  
  function shimOnTrack(window) {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function get() {
          return this._ontrack;
        },
        set: function set(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
          }
          this.addEventListener('track', this._ontrack = f);
        },
  
        enumerable: true,
        configurable: true
      });
      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        var _this = this;
  
        if (!this._ontrackpoly) {
          this._ontrackpoly = function (e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function (te) {
              var receiver = void 0;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = _this.getReceivers().find(function (r) {
                  return r.track && r.track.id === te.track.id;
                });
              } else {
                receiver = { track: te.track };
              }
  
              var event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = { receiver: receiver };
              event.streams = [e.stream];
              _this.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function (track) {
              var receiver = void 0;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = _this.getReceivers().find(function (r) {
                  return r.track && r.track.id === track.id;
                });
              } else {
                receiver = { track: track };
              }
              var event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = { receiver: receiver };
              event.streams = [e.stream];
              _this.dispatchEvent(event);
            });
          };
          this.addEventListener('addstream', this._ontrackpoly);
        }
        return origSetRemoteDescription.apply(this, arguments);
      };
    } else {
      // even if RTCRtpTransceiver is in window, it is only used and
      // emitted in unified-plan. Unfortunately this means we need
      // to unconditionally wrap the event.
      utils.wrapPeerConnectionEvent(window, 'track', function (e) {
        if (!e.transceiver) {
          Object.defineProperty(e, 'transceiver', { value: { receiver: e.receiver } });
        }
        return e;
      });
    }
  }
  
  function shimGetSendersWithDtmf(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
      var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
        return {
          track: track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };
  
      // augment addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          this._senders = this._senders || [];
          return this._senders.slice(); // return a copy of the internal state.
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
          var sender = origAddTrack.apply(this, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(this, track);
            this._senders.push(sender);
          }
          return sender;
        };
  
        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
        window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
          origRemoveTrack.apply(this, arguments);
          var idx = this._senders.indexOf(sender);
          if (idx !== -1) {
            this._senders.splice(idx, 1);
          }
        };
      }
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this2 = this;
  
        this._senders = this._senders || [];
        origAddStream.apply(this, [stream]);
        stream.getTracks().forEach(function (track) {
          _this2._senders.push(shimSenderWithDtmf(_this2, track));
        });
      };
  
      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this3 = this;
  
        this._senders = this._senders || [];
        origRemoveStream.apply(this, [stream]);
  
        stream.getTracks().forEach(function (track) {
          var sender = _this3._senders.find(function (s) {
            return s.track === track;
          });
          if (sender) {
            // remove sender
            _this3._senders.splice(_this3._senders.indexOf(sender), 1);
          }
        });
      };
    } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        var _this4 = this;
  
        var senders = origGetSenders.apply(this, []);
        senders.forEach(function (sender) {
          return sender._pc = _this4;
        });
        return senders;
      };
  
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function get() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  }
  
  function shimGetStats(window) {
    if (!window.RTCPeerConnection) {
      return;
    }
  
    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
      var _this5 = this;
  
      var _arguments = Array.prototype.slice.call(arguments),
          selector = _arguments[0],
          onSucc = _arguments[1],
          onErr = _arguments[2];
  
      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
  
  
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }
  
      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
        return origGetStats.apply(this, []);
      }
  
      var fixChromeStats_ = function fixChromeStats_(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function (report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function (name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });
  
        return standardReport;
      };
  
      // shim getStats with maplike support
      var makeMapStats = function makeMapStats(stats) {
        return new Map(Object.keys(stats).map(function (key) {
          return [key, stats[key]];
        }));
      };
  
      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function successCallbackWrapper_(response) {
          onSucc(makeMapStats(fixChromeStats_(response)));
        };
  
        return origGetStats.apply(this, [successCallbackWrapper_, selector]);
      }
  
      // promise-support
      return new Promise(function (resolve, reject) {
        origGetStats.apply(_this5, [function (response) {
          resolve(makeMapStats(fixChromeStats_(response)));
        }, reject]);
      }).then(onSucc, onErr);
    };
  }
  
  function shimSenderReceiverGetStats(window) {
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
      return;
    }
  
    // shim sender stats.
    if (!('getStats' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          var _this6 = this;
  
          var senders = origGetSenders.apply(this, []);
          senders.forEach(function (sender) {
            return sender._pc = _this6;
          });
          return senders;
        };
      }
  
      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        var sender = this;
        return this._pc.getStats().then(function (result) {
          return (
            /* Note: this will include stats of all senders that
             *   send a track with the same id as sender.track as
             *   it is not possible to identify the RTCRtpSender.
             */
            utils.filterStats(result, sender.track, true)
          );
        });
      };
    }
  
    // shim receiver stats.
    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          var _this7 = this;
  
          var receivers = origGetReceivers.apply(this, []);
          receivers.forEach(function (receiver) {
            return receiver._pc = _this7;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, 'track', function (e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        var receiver = this;
        return this._pc.getStats().then(function (result) {
          return utils.filterStats(result, receiver.track, false);
        });
      };
    }
  
    if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
      return;
    }
  
    // shim RTCPeerConnection.getStats(track).
    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
      if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
        var track = arguments[0];
        var sender = void 0;
        var receiver = void 0;
        var err = void 0;
        this.getSenders().forEach(function (s) {
          if (s.track === track) {
            if (sender) {
              err = true;
            } else {
              sender = s;
            }
          }
        });
        this.getReceivers().forEach(function (r) {
          if (r.track === track) {
            if (receiver) {
              err = true;
            } else {
              receiver = r;
            }
          }
          return r.track === track;
        });
        if (err || sender && receiver) {
          return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
        } else if (sender) {
          return sender.getStats();
        } else if (receiver) {
          return receiver.getStats();
        }
        return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
      }
      return origGetStats.apply(this, arguments);
    };
  }
  
  function shimAddTrackRemoveTrackWithNative(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      var _this8 = this;
  
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
        return _this8._shimmedLocalStreams[streamId][0];
      });
    };
  
    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
  
      var sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };
  
    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this9 = this;
  
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
  
      stream.getTracks().forEach(function (track) {
        var alreadyExists = _this9.getSenders().find(function (s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.', 'InvalidAccessError');
        }
      });
      var existingSenders = this.getSenders();
      origAddStream.apply(this, arguments);
      var newSenders = this.getSenders().filter(function (newSender) {
        return existingSenders.indexOf(newSender) === -1;
      });
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };
  
    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };
  
    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      var _this10 = this;
  
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
          var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            _this10._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (_this10._shimmedLocalStreams[streamId].length === 1) {
            delete _this10._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
  }
  
  function shimAddTrackRemoveTrack(window) {
    if (!window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
      return shimAddTrackRemoveTrackWithNative(window);
    }
  
    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      var _this11 = this;
  
      var nativeStreams = origGetLocalStreams.apply(this);
      this._reverseStreams = this._reverseStreams || {};
      return nativeStreams.map(function (stream) {
        return _this11._reverseStreams[stream.id];
      });
    };
  
    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this12 = this;
  
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
  
      stream.getTracks().forEach(function (track) {
        var alreadyExists = _this12.getSenders().find(function (s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.', 'InvalidAccessError');
        }
      });
      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!this._reverseStreams[stream.id]) {
        var newStream = new window.MediaStream(stream.getTracks());
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(this, [stream]);
    };
  
    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
  
      origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
      delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
      delete this._streams[stream.id];
    };
  
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
      var _this13 = this;
  
      if (this.signalingState === 'closed') {
        throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
      }
      var streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
        return t === track;
      })) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
      }
  
      var alreadyExists = this.getSenders().find(function (s) {
        return s.track === track;
      });
      if (alreadyExists) {
        throw new DOMException('Track already exists.', 'InvalidAccessError');
      }
  
      this._streams = this._streams || {};
      this._reverseStreams = this._reverseStreams || {};
      var oldStream = this._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);
  
        // Trigger ONN async.
        Promise.resolve().then(function () {
          _this13.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        var newStream = new window.MediaStream([track]);
        this._streams[stream.id] = newStream;
        this._reverseStreams[newStream.id] = stream;
        this.addStream(newStream);
      }
      return this.getSenders().find(function (s) {
        return s.track === track;
      });
    };
  
    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    function replaceExternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    ['createOffer', 'createAnswer'].forEach(function (method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];
      var methodObj = _defineProperty({}, method, function () {
        var _this14 = this;
  
        var args = arguments;
        var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
        if (isLegacyCall) {
          return nativeMethod.apply(this, [function (description) {
            var desc = replaceInternalStreamId(_this14, description);
            args[0].apply(null, [desc]);
          }, function (err) {
            if (args[1]) {
              args[1].apply(null, err);
            }
          }, arguments[2]]);
        }
        return nativeMethod.apply(this, arguments).then(function (description) {
          return replaceInternalStreamId(_this14, description);
        });
      });
      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  
    var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(this, arguments);
      }
      arguments[0] = replaceExternalStreamId(this, arguments[0]);
      return origSetLocalDescription.apply(this, arguments);
    };
  
    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
  
    var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
      get: function get() {
        var description = origLocalDescription.get.apply(this);
        if (description.type === '') {
          return description;
        }
        return replaceInternalStreamId(this, description);
      }
    });
  
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
      var _this15 = this;
  
      if (this.signalingState === 'closed') {
        throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
      }
      var isLocal = sender._pc === this;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
      }
  
      // Search for the native stream the senders track belongs to.
      this._streams = this._streams || {};
      var stream = void 0;
      Object.keys(this._streams).forEach(function (streamid) {
        var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
          return sender.track === track;
        });
        if (hasTrack) {
          stream = _this15._streams[streamid];
        }
      });
  
      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          this.removeStream(this._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        this.dispatchEvent(new Event('negotiationneeded'));
      }
    };
  }
  
  function shimPeerConnection(window) {
    var browserDetails = utils.detectBrowser(window);
  
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
      // very basic support for old versions.
      window.RTCPeerConnection = window.webkitRTCPeerConnection;
    }
    if (!window.RTCPeerConnection) {
      return;
    }
  
    var addIceCandidateNullSupported = window.RTCPeerConnection.prototype.addIceCandidate.length === 0;
  
    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    if (browserDetails.version < 53) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = _defineProperty({}, method, function () {
          arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
  
    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
      if (!addIceCandidateNullSupported && !arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions. Native support planned for Chrome M77.
      if (browserDetails.version < 78 && arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  }
  
  function fixNegotiationNeeded(window) {
    utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
      var pc = e.target;
      if (pc.signalingState !== 'stable') {
        return;
      }
      return e;
    });
  }
  
  },{"../utils.js":15,"./getdisplaymedia":4,"./getusermedia":5}],4:[function(require,module,exports){
  /*
   *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = shimGetDisplayMedia;
  function shimGetDisplayMedia(window, getSourceId) {
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    if (!window.navigator.mediaDevices) {
      return;
    }
    // getSourceId is a function that returns a promise resolving with
    // the sourceId of the screen/window/tab to be shared.
    if (typeof getSourceId !== 'function') {
      console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      return getSourceId(constraints).then(function (sourceId) {
        var widthSpecified = constraints.video && constraints.video.width;
        var heightSpecified = constraints.video && constraints.video.height;
        var frameRateSpecified = constraints.video && constraints.video.frameRate;
        constraints.video = {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            maxFrameRate: frameRateSpecified || 3
          }
        };
        if (widthSpecified) {
          constraints.video.mandatory.maxWidth = widthSpecified;
        }
        if (heightSpecified) {
          constraints.video.mandatory.maxHeight = heightSpecified;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
      });
    };
  }
  
  },{}],5:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  exports.shimGetUserMedia = shimGetUserMedia;
  
  var _utils = require('../utils.js');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  var logging = utils.log;
  
  function shimGetUserMedia(window) {
    var navigator = window && window.navigator;
  
    if (!navigator.mediaDevices) {
      return;
    }
  
    var browserDetails = utils.detectBrowser(window);
  
    var constraintsToChrome_ = function constraintsToChrome_(c) {
      if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
        return c;
      }
      var cc = {};
      Object.keys(c).forEach(function (key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
        if (r.exact !== undefined && typeof r.exact === 'number') {
          r.min = r.max = r.exact;
        }
        var oldname_ = function oldname_(prefix, name) {
          if (prefix) {
            return prefix + name.charAt(0).toUpperCase() + name.slice(1);
          }
          return name === 'deviceId' ? 'sourceId' : name;
        };
        if (r.ideal !== undefined) {
          cc.optional = cc.optional || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[oldname_('min', key)] = r.ideal;
            cc.optional.push(oc);
            oc = {};
            oc[oldname_('max', key)] = r.ideal;
            cc.optional.push(oc);
          } else {
            oc[oldname_('', key)] = r.ideal;
            cc.optional.push(oc);
          }
        }
        if (r.exact !== undefined && typeof r.exact !== 'number') {
          cc.mandatory = cc.mandatory || {};
          cc.mandatory[oldname_('', key)] = r.exact;
        } else {
          ['min', 'max'].forEach(function (mix) {
            if (r[mix] !== undefined) {
              cc.mandatory = cc.mandatory || {};
              cc.mandatory[oldname_(mix, key)] = r[mix];
            }
          });
        }
      });
      if (c.advanced) {
        cc.optional = (cc.optional || []).concat(c.advanced);
      }
      return cc;
    };
  
    var shimConstraints_ = function shimConstraints_(constraints, func) {
      if (browserDetails.version >= 61) {
        return func(constraints);
      }
      constraints = JSON.parse(JSON.stringify(constraints));
      if (constraints && _typeof(constraints.audio) === 'object') {
        var remap = function remap(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };
        constraints = JSON.parse(JSON.stringify(constraints));
        remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
        remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
        constraints.audio = constraintsToChrome_(constraints.audio);
      }
      if (constraints && _typeof(constraints.video) === 'object') {
        // Shim facingMode for mobile & surface pro.
        var face = constraints.video.facingMode;
        face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : { ideal: face });
        var getSupportedFacingModeLies = browserDetails.version < 66;
  
        if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
          delete constraints.video.facingMode;
          var matches = void 0;
          if (face.exact === 'environment' || face.ideal === 'environment') {
            matches = ['back', 'rear'];
          } else if (face.exact === 'user' || face.ideal === 'user') {
            matches = ['front'];
          }
          if (matches) {
            // Look for matches in label, or use last cam for back (typical).
            return navigator.mediaDevices.enumerateDevices().then(function (devices) {
              devices = devices.filter(function (d) {
                return d.kind === 'videoinput';
              });
              var dev = devices.find(function (d) {
                return matches.some(function (match) {
                  return d.label.toLowerCase().includes(match);
                });
              });
              if (!dev && devices.length && matches.includes('back')) {
                dev = devices[devices.length - 1]; // more likely the back cam
              }
              if (dev) {
                constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
              }
              constraints.video = constraintsToChrome_(constraints.video);
              logging('chrome: ' + JSON.stringify(constraints));
              return func(constraints);
            });
          }
        }
        constraints.video = constraintsToChrome_(constraints.video);
      }
      logging('chrome: ' + JSON.stringify(constraints));
      return func(constraints);
    };
  
    var shimError_ = function shimError_(e) {
      if (browserDetails.version >= 64) {
        return e;
      }
      return {
        name: {
          PermissionDeniedError: 'NotAllowedError',
          PermissionDismissedError: 'NotAllowedError',
          InvalidStateError: 'NotAllowedError',
          DevicesNotFoundError: 'NotFoundError',
          ConstraintNotSatisfiedError: 'OverconstrainedError',
          TrackStartError: 'NotReadableError',
          MediaDeviceFailedDueToShutdown: 'NotAllowedError',
          MediaDeviceKillSwitchOn: 'NotAllowedError',
          TabCaptureError: 'AbortError',
          ScreenCaptureError: 'AbortError',
          DeviceCaptureError: 'AbortError'
        }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint || e.constraintName,
        toString: function toString() {
          return this.name + (this.message && ': ') + this.message;
        }
      };
    };
  
    var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
      shimConstraints_(constraints, function (c) {
        navigator.webkitGetUserMedia(c, onSuccess, function (e) {
          if (onError) {
            onError(shimError_(e));
          }
        });
      });
    };
    navigator.getUserMedia = getUserMedia_.bind(navigator);
  
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    if (navigator.mediaDevices.getUserMedia) {
      var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function (cs) {
        return shimConstraints_(cs, function (c) {
          return origGetUserMedia(c).then(function (stream) {
            if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
              stream.getTracks().forEach(function (track) {
                track.stop();
              });
              throw new DOMException('', 'NotFoundError');
            }
            return stream;
          }, function (e) {
            return Promise.reject(shimError_(e));
          });
        });
      };
    }
  }
  
  },{"../utils.js":15}],6:[function(require,module,exports){
  /*
   *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  exports.shimRTCIceCandidate = shimRTCIceCandidate;
  exports.shimMaxMessageSize = shimMaxMessageSize;
  exports.shimSendThrowTypeError = shimSendThrowTypeError;
  exports.shimConnectionState = shimConnectionState;
  exports.removeAllowExtmapMixed = removeAllowExtmapMixed;
  
  var _sdp = require('sdp');
  
  var _sdp2 = _interopRequireDefault(_sdp);
  
  var _utils = require('./utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function shimRTCIceCandidate(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
      return;
    }
  
    var NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function RTCIceCandidate(args) {
      // Remove the a= which shouldn't be part of the candidate string.
      if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substr(2);
      }
  
      if (args.candidate && args.candidate.length) {
        // Augment the native candidate with the parsed fields.
        var nativeCandidate = new NativeRTCIceCandidate(args);
        var parsedCandidate = _sdp2.default.parseCandidate(args.candidate);
        var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);
  
        // Add a serializer that does not serialize the extra attributes.
        augmentedCandidate.toJSON = function toJSON() {
          return {
            candidate: augmentedCandidate.candidate,
            sdpMid: augmentedCandidate.sdpMid,
            sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
            usernameFragment: augmentedCandidate.usernameFragment
          };
        };
        return augmentedCandidate;
      }
      return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
  
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
      if (e.candidate) {
        Object.defineProperty(e, 'candidate', {
          value: new window.RTCIceCandidate(e.candidate),
          writable: 'false'
        });
      }
      return e;
    });
  }
  
  function shimMaxMessageSize(window) {
    if (!window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);
  
    if (!('sctp' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
        get: function get() {
          return typeof this._sctp === 'undefined' ? null : this._sctp;
        }
      });
    }
  
    var sctpInDescription = function sctpInDescription(description) {
      if (!description || !description.sdp) {
        return false;
      }
      var sections = _sdp2.default.splitSections(description.sdp);
      sections.shift();
      return sections.some(function (mediaSection) {
        var mLine = _sdp2.default.parseMLine(mediaSection);
        return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
      });
    };
  
    var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
      // TODO: Is there a better solution for detecting Firefox?
      var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      var version = parseInt(match[1], 10);
      // Test for NaN (yes, this is ugly)
      return version !== version ? -1 : version;
    };
  
    var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
      // Every implementation we know can send at least 64 KiB.
      // Note: Although Chrome is technically able to send up to 256 KiB, the
      //       data does not reach the other peer reliably.
      //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
      var canSendMaxMessageSize = 65536;
      if (browserDetails.browser === 'firefox') {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            // FF < 57 will send in 16 KiB chunks using the deprecated PPID
            // fragmentation.
            canSendMaxMessageSize = 16384;
          } else {
            // However, other FF (and RAWRTC) can reassemble PPID-fragmented
            // messages. Thus, supporting ~2 GiB when sending.
            canSendMaxMessageSize = 2147483637;
          }
        } else if (browserDetails.version < 60) {
          // Currently, all FF >= 57 will reset the remote maximum message size
          // to the default value when a data channel is created at a later
          // stage. :(
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
          canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
        } else {
          // FF >= 60 supports sending ~2 GiB
          canSendMaxMessageSize = 2147483637;
        }
      }
      return canSendMaxMessageSize;
    };
  
    var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
      // Note: 65536 bytes is the default value from the SDP spec. Also,
      //       every implementation we know supports receiving 65536 bytes.
      var maxMessageSize = 65536;
  
      // FF 57 has a slightly incorrect default remote max message size, so
      // we need to adjust it here to avoid a failure when sending.
      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
      if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }
  
      var match = _sdp2.default.matchPrefix(description.sdp, 'a=max-message-size:');
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substr(19), 10);
      } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
        // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };
  
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      this._sctp = null;
      // Chrome decided to not expose .sctp in plan-b mode.
      // As usual, adapter.js has to do an 'ugly worakaround'
      // to cover up the mess.
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
        var _getConfiguration = this.getConfiguration(),
            sdpSemantics = _getConfiguration.sdpSemantics;
  
        if (sdpSemantics === 'plan-b') {
          Object.defineProperty(this, 'sctp', {
            get: function get() {
              return typeof this._sctp === 'undefined' ? null : this._sctp;
            },
  
            enumerable: true,
            configurable: true
          });
        }
      }
  
      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        var isFirefox = getRemoteFirefoxVersion(arguments[0]);
  
        // Get the maximum message size the local peer is capable of sending
        var canSendMMS = getCanSendMaxMessageSize(isFirefox);
  
        // Get the maximum message size of the remote peer.
        var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
  
        // Determine final maximum message size
        var maxMessageSize = void 0;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }
  
        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        var sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get: function get() {
            return maxMessageSize;
          }
        });
        this._sctp = sctp;
      }
  
      return origSetRemoteDescription.apply(this, arguments);
    };
  }
  
  function shimSendThrowTypeError(window) {
    if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
      return;
    }
  
    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
  
    function wrapDcSend(dc, pc) {
      var origDataChannelSend = dc.send;
      dc.send = function send() {
        var data = arguments[0];
        var length = data.length || data.size || data.byteLength;
        if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
          throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
        }
        return origDataChannelSend.apply(dc, arguments);
      };
    }
    var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
      var dataChannel = origCreateDataChannel.apply(this, arguments);
      wrapDcSend(dataChannel, this);
      return dataChannel;
    };
    utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
      wrapDcSend(e.channel, e.target);
      return e;
    });
  }
  
  /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
   * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
   * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
   * since DTLS failures would be hidden. See
   * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
   * for the Firefox tracking bug.
   */
  function shimConnectionState(window) {
    if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
      return;
    }
    var proto = window.RTCPeerConnection.prototype;
    Object.defineProperty(proto, 'connectionState', {
      get: function get() {
        return {
          completed: 'connected',
          checking: 'connecting'
        }[this.iceConnectionState] || this.iceConnectionState;
      },
  
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(proto, 'onconnectionstatechange', {
      get: function get() {
        return this._onconnectionstatechange || null;
      },
      set: function set(cb) {
        if (this._onconnectionstatechange) {
          this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
          delete this._onconnectionstatechange;
        }
        if (cb) {
          this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
        }
      },
  
      enumerable: true,
      configurable: true
    });
  
    ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
      var origMethod = proto[method];
      proto[method] = function () {
        if (!this._connectionstatechangepoly) {
          this._connectionstatechangepoly = function (e) {
            var pc = e.target;
            if (pc._lastConnectionState !== pc.connectionState) {
              pc._lastConnectionState = pc.connectionState;
              var newEvent = new Event('connectionstatechange', e);
              pc.dispatchEvent(newEvent);
            }
            return e;
          };
          this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
        }
        return origMethod.apply(this, arguments);
      };
    });
  }
  
  function removeAllowExtmapMixed(window) {
    /* remove a=extmap-allow-mixed for Chrome < M71 */
    if (!window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);
    if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
      return;
    }
    var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
      if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
        desc.sdp = desc.sdp.split('\n').filter(function (line) {
          return line.trim() !== 'a=extmap-allow-mixed';
        }).join('\n');
      }
      return nativeSRD.apply(this, arguments);
    };
  }
  
  },{"./utils":15,"sdp":17}],7:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
  
  var _getusermedia = require('./getusermedia');
  
  Object.defineProperty(exports, 'shimGetUserMedia', {
    enumerable: true,
    get: function get() {
      return _getusermedia.shimGetUserMedia;
    }
  });
  
  var _getdisplaymedia = require('./getdisplaymedia');
  
  Object.defineProperty(exports, 'shimGetDisplayMedia', {
    enumerable: true,
    get: function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }
  });
  exports.shimPeerConnection = shimPeerConnection;
  exports.shimReplaceTrack = shimReplaceTrack;
  
  var _utils = require('../utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  var _filtericeservers = require('./filtericeservers');
  
  var _rtcpeerconnectionShim = require('rtcpeerconnection-shim');
  
  var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function shimPeerConnection(window) {
    var browserDetails = utils.detectBrowser(window);
  
    if (window.RTCIceGatherer) {
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function RTCIceCandidate(args) {
          return args;
        };
      }
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function RTCSessionDescription(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
          set: function set(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }
  
    // ORTC defines the DTMF sender a bit different.
    // https://github.com/w3c/ortc/issues/714
    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function get() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = new window.RTCDtmfSender(this);
            } else if (this.track.kind === 'video') {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
    // Edge currently only implements the RTCDtmfSender, not the
    // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
    if (window.RTCDtmfSender && !window.RTCDTMFSender) {
      window.RTCDTMFSender = window.RTCDtmfSender;
    }
  
    var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2.default)(window, browserDetails.version);
    window.RTCPeerConnection = function RTCPeerConnection(config) {
      if (config && config.iceServers) {
        config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
        utils.log('ICE servers after filtering:', config.iceServers);
      }
      return new RTCPeerConnectionShim(config);
    };
    window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
  }
  
  function shimReplaceTrack(window) {
    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
    if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
      window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
    }
  }
  
  },{"../utils":15,"./filtericeservers":8,"./getdisplaymedia":9,"./getusermedia":10,"rtcpeerconnection-shim":16}],8:[function(require,module,exports){
  /*
   *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.filterIceServers = filterIceServers;
  
  var _utils = require('../utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  // Edge does not like
  // 1) stun: filtered after 14393 unless ?transport=udp is present
  // 2) turn: that does not have all of turn:host:port?transport=udp
  // 3) turn: with ipv6 addresses
  // 4) turn: occurring muliple times
  function filterIceServers(iceServers, edgeVersion) {
    var hasTurn = false;
    iceServers = JSON.parse(JSON.stringify(iceServers));
    return iceServers.filter(function (server) {
      if (server && (server.urls || server.url)) {
        var urls = server.urls || server.url;
        if (server.url && !server.urls) {
          utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
        }
        var isString = typeof urls === 'string';
        if (isString) {
          urls = [urls];
        }
        urls = urls.filter(function (url) {
          // filter STUN unconditionally.
          if (url.indexOf('stun:') === 0) {
            return false;
          }
  
          var validTurn = url.startsWith('turn') && !url.startsWith('turn:[') && url.includes('transport=udp');
          if (validTurn && !hasTurn) {
            hasTurn = true;
            return true;
          }
          return validTurn && !hasTurn;
        });
  
        delete server.url;
        server.urls = isString ? urls[0] : urls;
        return !!urls.length;
      }
    });
  }
  
  },{"../utils":15}],9:[function(require,module,exports){
  /*
   *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = shimGetDisplayMedia;
  function shimGetDisplayMedia(window) {
    if (!('getDisplayMedia' in window.navigator)) {
      return;
    }
    if (!window.navigator.mediaDevices) {
      return;
    }
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
  }
  
  },{}],10:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetUserMedia = shimGetUserMedia;
  function shimGetUserMedia(window) {
    var navigator = window && window.navigator;
  
    var shimError_ = function shimError_(e) {
      return {
        name: { PermissionDeniedError: 'NotAllowedError' }[e.name] || e.name,
        message: e.message,
        constraint: e.constraint,
        toString: function toString() {
          return this.name;
        }
      };
    };
  
    // getUserMedia error shim.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function (c) {
      return origGetUserMedia(c).catch(function (e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  
  },{}],11:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _getusermedia = require('./getusermedia');
  
  Object.defineProperty(exports, 'shimGetUserMedia', {
    enumerable: true,
    get: function get() {
      return _getusermedia.shimGetUserMedia;
    }
  });
  
  var _getdisplaymedia = require('./getdisplaymedia');
  
  Object.defineProperty(exports, 'shimGetDisplayMedia', {
    enumerable: true,
    get: function get() {
      return _getdisplaymedia.shimGetDisplayMedia;
    }
  });
  exports.shimOnTrack = shimOnTrack;
  exports.shimPeerConnection = shimPeerConnection;
  exports.shimSenderGetStats = shimSenderGetStats;
  exports.shimReceiverGetStats = shimReceiverGetStats;
  exports.shimRemoveStream = shimRemoveStream;
  exports.shimRTCDataChannel = shimRTCDataChannel;
  exports.shimAddTransceiver = shimAddTransceiver;
  exports.shimCreateOffer = shimCreateOffer;
  exports.shimCreateAnswer = shimCreateAnswer;
  
  var _utils = require('../utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  function shimOnTrack(window) {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  
  function shimPeerConnection(window) {
    var browserDetails = utils.detectBrowser(window);
  
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
      // very basic support for old versions.
      window.RTCPeerConnection = window.mozRTCPeerConnection;
    }
  
    if (browserDetails.version < 53) {
      // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        var methodObj = _defineProperty({}, method, function () {
          arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
          return nativeMethod.apply(this, arguments);
        });
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });
    }
  
    // support for addIceCandidate(null or undefined)
    // as well as ignoring {sdpMid, candidate: ""}
    if (browserDetails.version < 68) {
      var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
      window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
          if (arguments[1]) {
            arguments[1].apply(null);
          }
          return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        if (arguments[0] && arguments[0].candidate === '') {
          return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
      };
    }
  
    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };
  
    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
      var _arguments = Array.prototype.slice.call(arguments),
          selector = _arguments[0],
          onSucc = _arguments[1],
          onErr = _arguments[2];
  
      return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
        if (browserDetails.version < 53 && !onSucc) {
          // Shim only promise getStats with spec-hyphens in type names
          // Leave callback version alone; misc old uses of forEach before Map
          try {
            stats.forEach(function (stat) {
              stat.type = modernStatsTypes[stat.type] || stat.type;
            });
          } catch (e) {
            if (e.name !== 'TypeError') {
              throw e;
            }
            // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
            stats.forEach(function (stat, i) {
              stats.set(i, Object.assign({}, stat, {
                type: modernStatsTypes[stat.type] || stat.type
              }));
            });
          }
        }
        return stats;
      }).then(onSucc, onErr);
    };
  }
  
  function shimSenderGetStats(window) {
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
      return;
    }
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        var _this = this;
  
        var senders = origGetSenders.apply(this, []);
        senders.forEach(function (sender) {
          return sender._pc = _this;
        });
        return senders;
      };
    }
  
    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        var sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
      return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
    };
  }
  
  function shimReceiverGetStats(window) {
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
      return;
    }
    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        var _this2 = this;
  
        var receivers = origGetReceivers.apply(this, []);
        receivers.forEach(function (receiver) {
          return receiver._pc = _this2;
        });
        return receivers;
      };
    }
    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      return this._pc.getStats(this.track);
    };
  }
  
  function shimRemoveStream(window) {
    if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
      return;
    }
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      var _this3 = this;
  
      utils.deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(function (sender) {
        if (sender.track && stream.getTracks().includes(sender.track)) {
          _this3.removeTrack(sender);
        }
      });
    };
  }
  
  function shimRTCDataChannel(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) {
      window.RTCDataChannel = window.DataChannel;
    }
  }
  
  function shimAddTransceiver(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
      return;
    }
    var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) {
      window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
        this.setParametersPromises = [];
        var initParameters = arguments[1];
        var shouldPerformCheck = initParameters && 'sendEncodings' in initParameters;
        if (shouldPerformCheck) {
          // If sendEncodings params are provided, validate grammar
          initParameters.sendEncodings.forEach(function (encodingParam) {
            if ('rid' in encodingParam) {
              var ridRegex = /^[a-z0-9]{0,16}$/i;
              if (!ridRegex.test(encodingParam.rid)) {
                throw new TypeError('Invalid RID value provided.');
              }
            }
            if ('scaleResolutionDownBy' in encodingParam) {
              if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                throw new RangeError('scale_resolution_down_by must be >= 1.0');
              }
            }
            if ('maxFramerate' in encodingParam) {
              if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                throw new RangeError('max_framerate must be >= 0.0');
              }
            }
          });
        }
        var transceiver = origAddTransceiver.apply(this, arguments);
        if (shouldPerformCheck) {
          // Check if the init options were applied. If not we do this in an
          // asynchronous way and save the promise reference in a global object.
          // This is an ugly hack, but at the same time is way more robust than
          // checking the sender parameters before and after the createOffer
          // Also note that after the createoffer we are not 100% sure that
          // the params were asynchronously applied so we might miss the
          // opportunity to recreate offer.
          var sender = transceiver.sender;
  
          var params = sender.getParameters();
          if (!('encodings' in params)) {
            params.encodings = initParameters.sendEncodings;
            this.setParametersPromises.push(sender.setParameters(params).catch(function () {}));
          }
        }
        return transceiver;
      };
    }
  }
  
  function shimCreateOffer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
      return;
    }
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer() {
      var _this4 = this,
          _arguments2 = arguments;
  
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(function () {
          return origCreateOffer.apply(_this4, _arguments2);
        }).finally(function () {
          _this4.setParametersPromises = [];
        });
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  
  function shimCreateAnswer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
      return;
    }
    var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
    window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
      var _this5 = this,
          _arguments3 = arguments;
  
      if (this.setParametersPromises && this.setParametersPromises.length) {
        return Promise.all(this.setParametersPromises).then(function () {
          return origCreateAnswer.apply(_this5, _arguments3);
        }).finally(function () {
          _this5.setParametersPromises = [];
        });
      }
      return origCreateAnswer.apply(this, arguments);
    };
  }
  
  },{"../utils":15,"./getdisplaymedia":12,"./getusermedia":13}],12:[function(require,module,exports){
  /*
   *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.shimGetDisplayMedia = shimGetDisplayMedia;
  function shimGetDisplayMedia(window, preferredMediaSource) {
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    if (!window.navigator.mediaDevices) {
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
      if (!(constraints && constraints.video)) {
        var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = { mediaSource: preferredMediaSource };
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
  }
  
  },{}],13:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  exports.shimGetUserMedia = shimGetUserMedia;
  
  var _utils = require('../utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function shimGetUserMedia(window) {
    var browserDetails = utils.detectBrowser(window);
    var navigator = window && window.navigator;
    var MediaStreamTrack = window && window.MediaStreamTrack;
  
    navigator.getUserMedia = function (constraints, onSuccess, onError) {
      // Replace Firefox 44+'s deprecation warning with unprefixed version.
      utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
  
    if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
      var remap = function remap(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
  
      var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function (c) {
        if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
          remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeGetUserMedia(c);
      };
  
      if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
        var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
        MediaStreamTrack.prototype.getSettings = function () {
          var obj = nativeGetSettings.apply(this, arguments);
          remap(obj, 'mozAutoGainControl', 'autoGainControl');
          remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
          return obj;
        };
      }
  
      if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
        var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
        MediaStreamTrack.prototype.applyConstraints = function (c) {
          if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c, 'autoGainControl', 'mozAutoGainControl');
            remap(c, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeApplyConstraints.apply(this, [c]);
        };
      }
    }
  }
  
  },{"../utils":15}],14:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
  exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
  exports.shimCallbacksAPI = shimCallbacksAPI;
  exports.shimGetUserMedia = shimGetUserMedia;
  exports.shimConstraints = shimConstraints;
  exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
  exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
  exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
  
  var _utils = require('../utils');
  
  var utils = _interopRequireWildcard(_utils);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function shimLocalStreamsAPI(window) {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        var _this = this;
  
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (!this._localStreams.includes(stream)) {
          this._localStreams.push(stream);
        }
        // Try to emulate Chrome's behaviour of adding in audio-video order.
        // Safari orders by track id.
        stream.getAudioTracks().forEach(function (track) {
          return _addTrack.call(_this, track, stream);
        });
        stream.getVideoTracks().forEach(function (track) {
          return _addTrack.call(_this, track, stream);
        });
      };
  
      window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
        var stream = arguments[1];
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
        }
        return _addTrack.apply(this, arguments);
      };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        var _this2 = this;
  
        if (!this._localStreams) {
          this._localStreams = [];
        }
        var index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        var tracks = stream.getTracks();
        this.getSenders().forEach(function (sender) {
          if (tracks.includes(sender.track)) {
            _this2.removeTrack(sender);
          }
        });
      };
    }
  }
  
  function shimRemoteStreamsAPI(window) {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get: function get() {
          return this._onaddstream;
        },
        set: function set(f) {
          var _this3 = this;
  
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
            this.removeEventListener('track', this._onaddstreampoly);
          }
          this.addEventListener('addstream', this._onaddstream = f);
          this.addEventListener('track', this._onaddstreampoly = function (e) {
            e.streams.forEach(function (stream) {
              if (!_this3._remoteStreams) {
                _this3._remoteStreams = [];
              }
              if (_this3._remoteStreams.includes(stream)) {
                return;
              }
              _this3._remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              _this3.dispatchEvent(event);
            });
          });
        }
      });
      var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        var pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function (e) {
            e.streams.forEach(function (stream) {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    }
  }
  
  function shimCallbacksAPI(window) {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    var prototype = window.RTCPeerConnection.prototype;
    var origCreateOffer = prototype.createOffer;
    var origCreateAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;
  
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
      var options = arguments.length >= 2 ? arguments[2] : arguments[0];
      var promise = origCreateOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
  
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
      var options = arguments.length >= 2 ? arguments[2] : arguments[0];
      var promise = origCreateAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
  
    var withCallback = function withCallback(description, successCallback, failureCallback) {
      var promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
  
    withCallback = function withCallback(description, successCallback, failureCallback) {
      var promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
  
    withCallback = function withCallback(candidate, successCallback, failureCallback) {
      var promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  }
  
  function shimGetUserMedia(window) {
    var navigator = window && window.navigator;
  
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // shim not needed in Safari 12.1
      var mediaDevices = navigator.mediaDevices;
      var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
      navigator.mediaDevices.getUserMedia = function (constraints) {
        return _getUserMedia(shimConstraints(constraints));
      };
    }
  
    if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
        navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
      }.bind(navigator);
    }
  }
  
  function shimConstraints(constraints) {
    if (constraints && constraints.video !== undefined) {
      return Object.assign({}, constraints, { video: utils.compactObject(constraints.video) });
    }
  
    return constraints;
  }
  
  function shimRTCIceServerUrls(window) {
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in window.RTCPeerConnection) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function get() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  }
  
  function shimTrackEventTransceiver(window) {
    // Add event.transceiver member over deprecated event.receiver
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function get() {
          return { receiver: this.receiver };
        }
      });
    }
  }
  
  function shimCreateOfferLegacy(window) {
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
        }
        var audioTransceiver = this.getTransceivers().find(function (transceiver) {
          return transceiver.receiver.track.kind === 'audio';
        });
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
          this.addTransceiver('audio');
        }
  
        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
        }
        var videoTransceiver = this.getTransceivers().find(function (transceiver) {
          return transceiver.receiver.track.kind === 'video';
        });
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('sendonly');
            } else {
              videoTransceiver.direction = 'sendonly';
            }
          } else if (videoTransceiver.direction === 'recvonly') {
            if (videoTransceiver.setDirection) {
              videoTransceiver.setDirection('inactive');
            } else {
              videoTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
          this.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(this, arguments);
    };
  }
  
  },{"../utils":15}],15:[function(require,module,exports){
  /*
   *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
  /* eslint-env node */
  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  exports.extractVersion = extractVersion;
  exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
  exports.disableLog = disableLog;
  exports.disableWarnings = disableWarnings;
  exports.log = log;
  exports.deprecated = deprecated;
  exports.detectBrowser = detectBrowser;
  exports.compactObject = compactObject;
  exports.walkStats = walkStats;
  exports.filterStats = filterStats;
  
  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
  var logDisabled_ = true;
  var deprecationWarnings_ = true;
  
  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  function extractVersion(uastring, expr, pos) {
    var match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  }
  
  // Wraps the peerconnection event eventNameToWrap in a function
  // which returns the modified event object (or false to prevent
  // the event).
  function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
    if (!window.RTCPeerConnection) {
      return;
    }
    var proto = window.RTCPeerConnection.prototype;
    var nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function (nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap) {
        return nativeAddEventListener.apply(this, arguments);
      }
      var wrappedCallback = function wrappedCallback(e) {
        var modifiedEvent = wrapper(e);
        if (modifiedEvent) {
          cb(modifiedEvent);
        }
      };
      this._eventMap = this._eventMap || {};
      this._eventMap[cb] = wrappedCallback;
      return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
    };
  
    var nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function (nativeEventName, cb) {
      if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[cb]) {
        return nativeRemoveEventListener.apply(this, arguments);
      }
      var unwrappedCb = this._eventMap[cb];
      delete this._eventMap[cb];
      return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
    };
  
    Object.defineProperty(proto, 'on' + eventNameToWrap, {
      get: function get() {
        return this['_on' + eventNameToWrap];
      },
      set: function set(cb) {
        if (this['_on' + eventNameToWrap]) {
          this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
          delete this['_on' + eventNameToWrap];
        }
        if (cb) {
          this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
        }
      },
  
      enumerable: true,
      configurable: true
    });
  }
  
  function disableLog(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
  }
  
  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  function disableWarnings(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  }
  
  function log() {
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  }
  
  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  function deprecated(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
  }
  
  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  function detectBrowser(window) {
    var navigator = window.navigator;
  
    // Returned result object.
  
    var result = { browser: null, version: null };
  
    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }
  
    if (navigator.mozGetUserMedia) {
      // Firefox.
      result.browser = 'firefox';
      result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
      // Chrome, Chromium, Webview, Opera.
      // Version matches Chrome/WebRTC version.
      // Chrome 74 removed webkitGetUserMedia on http as well so we need the
      // more complicated fallback to webkitRTCPeerConnection.
      result.browser = 'chrome';
      result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
      // Edge.
      result.browser = 'edge';
      result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
    } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
      // Safari.
      result.browser = 'safari';
      result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
      result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
    } else {
      // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }
  
    return result;
  }
  
  /**
   * Checks if something is an object.
   *
   * @param {*} val The something you want to check.
   * @return true if val is an object, false otherwise.
   */
  function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }
  
  /**
   * Remove all empty objects and undefined values
   * from a nested object -- an enhanced and vanilla version
   * of Lodash's `compact`.
   */
  function compactObject(data) {
    if (!isObject(data)) {
      return data;
    }
  
    return Object.keys(data).reduce(function (accumulator, key) {
      var isObj = isObject(data[key]);
      var value = isObj ? compactObject(data[key]) : data[key];
      var isEmptyObject = isObj && !Object.keys(value).length;
      if (value === undefined || isEmptyObject) {
        return accumulator;
      }
      return Object.assign(accumulator, _defineProperty({}, key, value));
    }, {});
  }
  
  /* iterates the stats graph recursively. */
  function walkStats(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) {
      return;
    }
    resultSet.set(base.id, base);
    Object.keys(base).forEach(function (name) {
      if (name.endsWith('Id')) {
        walkStats(stats, stats.get(base[name]), resultSet);
      } else if (name.endsWith('Ids')) {
        base[name].forEach(function (id) {
          walkStats(stats, stats.get(id), resultSet);
        });
      }
    });
  }
  
  /* filter getStats for a sender/receiver track. */
  function filterStats(result, track, outbound) {
    var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
    var filteredResult = new Map();
    if (track === null) {
      return filteredResult;
    }
    var trackStats = [];
    result.forEach(function (value) {
      if (value.type === 'track' && value.trackIdentifier === track.id) {
        trackStats.push(value);
      }
    });
    trackStats.forEach(function (trackStat) {
      result.forEach(function (stats) {
        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
          walkStats(result, stats, filteredResult);
        }
      });
    });
    return filteredResult;
  }
  
  },{}],16:[function(require,module,exports){
  /*
   *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */
   /* eslint-env node */
  'use strict';
  
  var SDPUtils = require('sdp');
  
  function fixStatsType(stat) {
    return {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    }[stat.type] || stat.type;
  }
  
  function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
    var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
  
    // Map ICE parameters (ufrag, pwd) to SDP.
    sdp += SDPUtils.writeIceParameters(
        transceiver.iceGatherer.getLocalParameters());
  
    // Map DTLS parameters to SDP.
    sdp += SDPUtils.writeDtlsParameters(
        transceiver.dtlsTransport.getLocalParameters(),
        type === 'offer' ? 'actpass' : dtlsRole || 'active');
  
    sdp += 'a=mid:' + transceiver.mid + '\r\n';
  
    if (transceiver.rtpSender && transceiver.rtpReceiver) {
      sdp += 'a=sendrecv\r\n';
    } else if (transceiver.rtpSender) {
      sdp += 'a=sendonly\r\n';
    } else if (transceiver.rtpReceiver) {
      sdp += 'a=recvonly\r\n';
    } else {
      sdp += 'a=inactive\r\n';
    }
  
    if (transceiver.rtpSender) {
      var trackId = transceiver.rtpSender._initialTrackId ||
          transceiver.rtpSender.track.id;
      transceiver.rtpSender._initialTrackId = trackId;
      // spec.
      var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
          trackId + '\r\n';
      sdp += 'a=' + msid;
      // for Chrome. Legacy should no longer be required.
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' ' + msid;
  
      // RTX
      if (transceiver.sendEncodingParameters[0].rtx) {
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' ' + msid;
        sdp += 'a=ssrc-group:FID ' +
            transceiver.sendEncodingParameters[0].ssrc + ' ' +
            transceiver.sendEncodingParameters[0].rtx.ssrc +
            '\r\n';
      }
    }
    // FIXME: this should be written by writeRtpDescription.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
    if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' cname:' + SDPUtils.localCName + '\r\n';
    }
    return sdp;
  }
  
  // Edge does not like
  // 1) stun: filtered after 14393 unless ?transport=udp is present
  // 2) turn: that does not have all of turn:host:port?transport=udp
  // 3) turn: with ipv6 addresses
  // 4) turn: occurring muliple times
  function filterIceServers(iceServers, edgeVersion) {
    var hasTurn = false;
    iceServers = JSON.parse(JSON.stringify(iceServers));
    return iceServers.filter(function(server) {
      if (server && (server.urls || server.url)) {
        var urls = server.urls || server.url;
        if (server.url && !server.urls) {
          console.warn('RTCIceServer.url is deprecated! Use urls instead.');
        }
        var isString = typeof urls === 'string';
        if (isString) {
          urls = [urls];
        }
        urls = urls.filter(function(url) {
          var validTurn = url.indexOf('turn:') === 0 &&
              url.indexOf('transport=udp') !== -1 &&
              url.indexOf('turn:[') === -1 &&
              !hasTurn;
  
          if (validTurn) {
            hasTurn = true;
            return true;
          }
          return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
              url.indexOf('?transport=udp') === -1;
        });
  
        delete server.url;
        server.urls = isString ? urls[0] : urls;
        return !!urls.length;
      }
    });
  }
  
  // Determines the intersection of local and remote capabilities.
  function getCommonCapabilities(localCapabilities, remoteCapabilities) {
    var commonCapabilities = {
      codecs: [],
      headerExtensions: [],
      fecMechanisms: []
    };
  
    var findCodecByPayloadType = function(pt, codecs) {
      pt = parseInt(pt, 10);
      for (var i = 0; i < codecs.length; i++) {
        if (codecs[i].payloadType === pt ||
            codecs[i].preferredPayloadType === pt) {
          return codecs[i];
        }
      }
    };
  
    var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
      var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
      var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
      return lCodec && rCodec &&
          lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
    };
  
    localCapabilities.codecs.forEach(function(lCodec) {
      for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
        var rCodec = remoteCapabilities.codecs[i];
        if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
            lCodec.clockRate === rCodec.clockRate) {
          if (lCodec.name.toLowerCase() === 'rtx' &&
              lCodec.parameters && rCodec.parameters.apt) {
            // for RTX we need to find the local rtx that has a apt
            // which points to the same local codec as the remote one.
            if (!rtxCapabilityMatches(lCodec, rCodec,
                localCapabilities.codecs, remoteCapabilities.codecs)) {
              continue;
            }
          }
          rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
          // number of channels is the highest common number of channels
          rCodec.numChannels = Math.min(lCodec.numChannels,
              rCodec.numChannels);
          // push rCodec so we reply with offerer payload type
          commonCapabilities.codecs.push(rCodec);
  
          // determine common feedback mechanisms
          rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
            for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
              if (lCodec.rtcpFeedback[j].type === fb.type &&
                  lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                return true;
              }
            }
            return false;
          });
          // FIXME: also need to determine .parameters
          //  see https://github.com/openpeer/ortc/issues/569
          break;
        }
      }
    });
  
    localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
      for (var i = 0; i < remoteCapabilities.headerExtensions.length;
           i++) {
        var rHeaderExtension = remoteCapabilities.headerExtensions[i];
        if (lHeaderExtension.uri === rHeaderExtension.uri) {
          commonCapabilities.headerExtensions.push(rHeaderExtension);
          break;
        }
      }
    });
  
    // FIXME: fecMechanisms
    return commonCapabilities;
  }
  
  // is action=setLocalDescription with type allowed in signalingState
  function isActionAllowedInSignalingState(action, type, signalingState) {
    return {
      offer: {
        setLocalDescription: ['stable', 'have-local-offer'],
        setRemoteDescription: ['stable', 'have-remote-offer']
      },
      answer: {
        setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
        setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
      }
    }[type][action].indexOf(signalingState) !== -1;
  }
  
  function maybeAddCandidate(iceTransport, candidate) {
    // Edge's internal representation adds some fields therefore
    // not all fieldѕ are taken into account.
    var alreadyAdded = iceTransport.getRemoteCandidates()
        .find(function(remoteCandidate) {
          return candidate.foundation === remoteCandidate.foundation &&
              candidate.ip === remoteCandidate.ip &&
              candidate.port === remoteCandidate.port &&
              candidate.priority === remoteCandidate.priority &&
              candidate.protocol === remoteCandidate.protocol &&
              candidate.type === remoteCandidate.type;
        });
    if (!alreadyAdded) {
      iceTransport.addRemoteCandidate(candidate);
    }
    return !alreadyAdded;
  }
  
  
  function makeError(name, description) {
    var e = new Error(description);
    e.name = name;
    // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
    e.code = {
      NotSupportedError: 9,
      InvalidStateError: 11,
      InvalidAccessError: 15,
      TypeError: undefined,
      OperationError: undefined
    }[name];
    return e;
  }
  
  module.exports = function(window, edgeVersion) {
    // https://w3c.github.io/mediacapture-main/#mediastream
    // Helper function to add the track to the stream and
    // dispatch the event ourselves.
    function addTrackToStreamAndFireEvent(track, stream) {
      stream.addTrack(track);
      stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
          {track: track}));
    }
  
    function removeTrackFromStreamAndFireEvent(track, stream) {
      stream.removeTrack(track);
      stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
          {track: track}));
    }
  
    function fireAddTrack(pc, track, receiver, streams) {
      var trackEvent = new Event('track');
      trackEvent.track = track;
      trackEvent.receiver = receiver;
      trackEvent.transceiver = {receiver: receiver};
      trackEvent.streams = streams;
      window.setTimeout(function() {
        pc._dispatchEvent('track', trackEvent);
      });
    }
  
    var RTCPeerConnection = function(config) {
      var pc = this;
  
      var _eventTarget = document.createDocumentFragment();
      ['addEventListener', 'removeEventListener', 'dispatchEvent']
          .forEach(function(method) {
            pc[method] = _eventTarget[method].bind(_eventTarget);
          });
  
      this.canTrickleIceCandidates = null;
  
      this.needNegotiation = false;
  
      this.localStreams = [];
      this.remoteStreams = [];
  
      this._localDescription = null;
      this._remoteDescription = null;
  
      this.signalingState = 'stable';
      this.iceConnectionState = 'new';
      this.connectionState = 'new';
      this.iceGatheringState = 'new';
  
      config = JSON.parse(JSON.stringify(config || {}));
  
      this.usingBundle = config.bundlePolicy === 'max-bundle';
      if (config.rtcpMuxPolicy === 'negotiate') {
        throw(makeError('NotSupportedError',
            'rtcpMuxPolicy \'negotiate\' is not supported'));
      } else if (!config.rtcpMuxPolicy) {
        config.rtcpMuxPolicy = 'require';
      }
  
      switch (config.iceTransportPolicy) {
        case 'all':
        case 'relay':
          break;
        default:
          config.iceTransportPolicy = 'all';
          break;
      }
  
      switch (config.bundlePolicy) {
        case 'balanced':
        case 'max-compat':
        case 'max-bundle':
          break;
        default:
          config.bundlePolicy = 'balanced';
          break;
      }
  
      config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
  
      this._iceGatherers = [];
      if (config.iceCandidatePoolSize) {
        for (var i = config.iceCandidatePoolSize; i > 0; i--) {
          this._iceGatherers.push(new window.RTCIceGatherer({
            iceServers: config.iceServers,
            gatherPolicy: config.iceTransportPolicy
          }));
        }
      } else {
        config.iceCandidatePoolSize = 0;
      }
  
      this._config = config;
  
      // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
      // everything that is needed to describe a SDP m-line.
      this.transceivers = [];
  
      this._sdpSessionId = SDPUtils.generateSessionId();
      this._sdpSessionVersion = 0;
  
      this._dtlsRole = undefined; // role for a=setup to use in answers.
  
      this._isClosed = false;
    };
  
    Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
      configurable: true,
      get: function() {
        return this._localDescription;
      }
    });
    Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
      configurable: true,
      get: function() {
        return this._remoteDescription;
      }
    });
  
    // set up event handlers on prototype
    RTCPeerConnection.prototype.onicecandidate = null;
    RTCPeerConnection.prototype.onaddstream = null;
    RTCPeerConnection.prototype.ontrack = null;
    RTCPeerConnection.prototype.onremovestream = null;
    RTCPeerConnection.prototype.onsignalingstatechange = null;
    RTCPeerConnection.prototype.oniceconnectionstatechange = null;
    RTCPeerConnection.prototype.onconnectionstatechange = null;
    RTCPeerConnection.prototype.onicegatheringstatechange = null;
    RTCPeerConnection.prototype.onnegotiationneeded = null;
    RTCPeerConnection.prototype.ondatachannel = null;
  
    RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
      if (this._isClosed) {
        return;
      }
      this.dispatchEvent(event);
      if (typeof this['on' + name] === 'function') {
        this['on' + name](event);
      }
    };
  
    RTCPeerConnection.prototype._emitGatheringStateChange = function() {
      var event = new Event('icegatheringstatechange');
      this._dispatchEvent('icegatheringstatechange', event);
    };
  
    RTCPeerConnection.prototype.getConfiguration = function() {
      return this._config;
    };
  
    RTCPeerConnection.prototype.getLocalStreams = function() {
      return this.localStreams;
    };
  
    RTCPeerConnection.prototype.getRemoteStreams = function() {
      return this.remoteStreams;
    };
  
    // internal helper to create a transceiver object.
    // (which is not yet the same as the WebRTC 1.0 transceiver)
    RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
      var hasBundleTransport = this.transceivers.length > 0;
      var transceiver = {
        track: null,
        iceGatherer: null,
        iceTransport: null,
        dtlsTransport: null,
        localCapabilities: null,
        remoteCapabilities: null,
        rtpSender: null,
        rtpReceiver: null,
        kind: kind,
        mid: null,
        sendEncodingParameters: null,
        recvEncodingParameters: null,
        stream: null,
        associatedRemoteMediaStreams: [],
        wantReceive: true
      };
      if (this.usingBundle && hasBundleTransport) {
        transceiver.iceTransport = this.transceivers[0].iceTransport;
        transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
      } else {
        var transports = this._createIceAndDtlsTransports();
        transceiver.iceTransport = transports.iceTransport;
        transceiver.dtlsTransport = transports.dtlsTransport;
      }
      if (!doNotAdd) {
        this.transceivers.push(transceiver);
      }
      return transceiver;
    };
  
    RTCPeerConnection.prototype.addTrack = function(track, stream) {
      if (this._isClosed) {
        throw makeError('InvalidStateError',
            'Attempted to call addTrack on a closed peerconnection.');
      }
  
      var alreadyExists = this.transceivers.find(function(s) {
        return s.track === track;
      });
  
      if (alreadyExists) {
        throw makeError('InvalidAccessError', 'Track already exists.');
      }
  
      var transceiver;
      for (var i = 0; i < this.transceivers.length; i++) {
        if (!this.transceivers[i].track &&
            this.transceivers[i].kind === track.kind) {
          transceiver = this.transceivers[i];
        }
      }
      if (!transceiver) {
        transceiver = this._createTransceiver(track.kind);
      }
  
      this._maybeFireNegotiationNeeded();
  
      if (this.localStreams.indexOf(stream) === -1) {
        this.localStreams.push(stream);
      }
  
      transceiver.track = track;
      transceiver.stream = stream;
      transceiver.rtpSender = new window.RTCRtpSender(track,
          transceiver.dtlsTransport);
      return transceiver.rtpSender;
    };
  
    RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      if (edgeVersion >= 15025) {
        stream.getTracks().forEach(function(track) {
          pc.addTrack(track, stream);
        });
      } else {
        // Clone is necessary for local demos mostly, attaching directly
        // to two different senders does not work (build 10547).
        // Fixed in 15025 (or earlier)
        var clonedStream = stream.clone();
        stream.getTracks().forEach(function(track, idx) {
          var clonedTrack = clonedStream.getTracks()[idx];
          track.addEventListener('enabled', function(event) {
            clonedTrack.enabled = event.enabled;
          });
        });
        clonedStream.getTracks().forEach(function(track) {
          pc.addTrack(track, clonedStream);
        });
      }
    };
  
    RTCPeerConnection.prototype.removeTrack = function(sender) {
      if (this._isClosed) {
        throw makeError('InvalidStateError',
            'Attempted to call removeTrack on a closed peerconnection.');
      }
  
      if (!(sender instanceof window.RTCRtpSender)) {
        throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.');
      }
  
      var transceiver = this.transceivers.find(function(t) {
        return t.rtpSender === sender;
      });
  
      if (!transceiver) {
        throw makeError('InvalidAccessError',
            'Sender was not created by this connection.');
      }
      var stream = transceiver.stream;
  
      transceiver.rtpSender.stop();
      transceiver.rtpSender = null;
      transceiver.track = null;
      transceiver.stream = null;
  
      // remove the stream from the set of local streams
      var localStreams = this.transceivers.map(function(t) {
        return t.stream;
      });
      if (localStreams.indexOf(stream) === -1 &&
          this.localStreams.indexOf(stream) > -1) {
        this.localStreams.splice(this.localStreams.indexOf(stream), 1);
      }
  
      this._maybeFireNegotiationNeeded();
    };
  
    RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      stream.getTracks().forEach(function(track) {
        var sender = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (sender) {
          pc.removeTrack(sender);
        }
      });
    };
  
    RTCPeerConnection.prototype.getSenders = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpSender;
      })
      .map(function(transceiver) {
        return transceiver.rtpSender;
      });
    };
  
    RTCPeerConnection.prototype.getReceivers = function() {
      return this.transceivers.filter(function(transceiver) {
        return !!transceiver.rtpReceiver;
      })
      .map(function(transceiver) {
        return transceiver.rtpReceiver;
      });
    };
  
  
    RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
        usingBundle) {
      var pc = this;
      if (usingBundle && sdpMLineIndex > 0) {
        return this.transceivers[0].iceGatherer;
      } else if (this._iceGatherers.length) {
        return this._iceGatherers.shift();
      }
      var iceGatherer = new window.RTCIceGatherer({
        iceServers: this._config.iceServers,
        gatherPolicy: this._config.iceTransportPolicy
      });
      Object.defineProperty(iceGatherer, 'state',
          {value: 'new', writable: true}
      );
  
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
      this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
        var end = !event.candidate || Object.keys(event.candidate).length === 0;
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        iceGatherer.state = end ? 'completed' : 'gathering';
        if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
          pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
        }
      };
      iceGatherer.addEventListener('localcandidate',
        this.transceivers[sdpMLineIndex].bufferCandidates);
      return iceGatherer;
    };
  
    // start gathering from an RTCIceGatherer.
    RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
      var pc = this;
      var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
      if (iceGatherer.onlocalcandidate) {
        return;
      }
      var bufferedCandidateEvents =
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
      iceGatherer.removeEventListener('localcandidate',
        this.transceivers[sdpMLineIndex].bufferCandidates);
      iceGatherer.onlocalcandidate = function(evt) {
        if (pc.usingBundle && sdpMLineIndex > 0) {
          // if we know that we use bundle we can drop candidates with
          // ѕdpMLineIndex > 0. If we don't do this then our state gets
          // confused since we dispose the extra ice gatherer.
          return;
        }
        var event = new Event('icecandidate');
        event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};
  
        var cand = evt.candidate;
        // Edge emits an empty object for RTCIceCandidateComplete‥
        var end = !cand || Object.keys(cand).length === 0;
        if (end) {
          // polyfill since RTCIceGatherer.state is not implemented in
          // Edge 10547 yet.
          if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
            iceGatherer.state = 'completed';
          }
        } else {
          if (iceGatherer.state === 'new') {
            iceGatherer.state = 'gathering';
          }
          // RTCIceCandidate doesn't have a component, needs to be added
          cand.component = 1;
          // also the usernameFragment. TODO: update SDP to take both variants.
          cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
  
          var serializedCandidate = SDPUtils.writeCandidate(cand);
          event.candidate = Object.assign(event.candidate,
              SDPUtils.parseCandidate(serializedCandidate));
  
          event.candidate.candidate = serializedCandidate;
          event.candidate.toJSON = function() {
            return {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              usernameFragment: event.candidate.usernameFragment
            };
          };
        }
  
        // update local description.
        var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
        if (!end) {
          sections[event.candidate.sdpMLineIndex] +=
              'a=' + event.candidate.candidate + '\r\n';
        } else {
          sections[event.candidate.sdpMLineIndex] +=
              'a=end-of-candidates\r\n';
        }
        pc._localDescription.sdp =
            SDPUtils.getDescription(pc._localDescription.sdp) +
            sections.join('');
        var complete = pc.transceivers.every(function(transceiver) {
          return transceiver.iceGatherer &&
              transceiver.iceGatherer.state === 'completed';
        });
  
        if (pc.iceGatheringState !== 'gathering') {
          pc.iceGatheringState = 'gathering';
          pc._emitGatheringStateChange();
        }
  
        // Emit candidate. Also emit null candidate when all gatherers are
        // complete.
        if (!end) {
          pc._dispatchEvent('icecandidate', event);
        }
        if (complete) {
          pc._dispatchEvent('icecandidate', new Event('icecandidate'));
          pc.iceGatheringState = 'complete';
          pc._emitGatheringStateChange();
        }
      };
  
      // emit already gathered candidates.
      window.setTimeout(function() {
        bufferedCandidateEvents.forEach(function(e) {
          iceGatherer.onlocalcandidate(e);
        });
      }, 0);
    };
  
    // Create ICE transport and DTLS transport.
    RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
      var pc = this;
      var iceTransport = new window.RTCIceTransport(null);
      iceTransport.onicestatechange = function() {
        pc._updateIceConnectionState();
        pc._updateConnectionState();
      };
  
      var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
      dtlsTransport.ondtlsstatechange = function() {
        pc._updateConnectionState();
      };
      dtlsTransport.onerror = function() {
        // onerror does not set state to failed by itself.
        Object.defineProperty(dtlsTransport, 'state',
            {value: 'failed', writable: true});
        pc._updateConnectionState();
      };
  
      return {
        iceTransport: iceTransport,
        dtlsTransport: dtlsTransport
      };
    };
  
    // Destroy ICE gatherer, ICE transport and DTLS transport.
    // Without triggering the callbacks.
    RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
        sdpMLineIndex) {
      var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
      if (iceGatherer) {
        delete iceGatherer.onlocalcandidate;
        delete this.transceivers[sdpMLineIndex].iceGatherer;
      }
      var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
      if (iceTransport) {
        delete iceTransport.onicestatechange;
        delete this.transceivers[sdpMLineIndex].iceTransport;
      }
      var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
      if (dtlsTransport) {
        delete dtlsTransport.ondtlsstatechange;
        delete dtlsTransport.onerror;
        delete this.transceivers[sdpMLineIndex].dtlsTransport;
      }
    };
  
    // Start the RTP Sender and Receiver for a transceiver.
    RTCPeerConnection.prototype._transceive = function(transceiver,
        send, recv) {
      var params = getCommonCapabilities(transceiver.localCapabilities,
          transceiver.remoteCapabilities);
      if (send && transceiver.rtpSender) {
        params.encodings = transceiver.sendEncodingParameters;
        params.rtcp = {
          cname: SDPUtils.localCName,
          compound: transceiver.rtcpParameters.compound
        };
        if (transceiver.recvEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
        }
        transceiver.rtpSender.send(params);
      }
      if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
        // remove RTX field in Edge 14942
        if (transceiver.kind === 'video'
            && transceiver.recvEncodingParameters
            && edgeVersion < 15019) {
          transceiver.recvEncodingParameters.forEach(function(p) {
            delete p.rtx;
          });
        }
        if (transceiver.recvEncodingParameters.length) {
          params.encodings = transceiver.recvEncodingParameters;
        } else {
          params.encodings = [{}];
        }
        params.rtcp = {
          compound: transceiver.rtcpParameters.compound
        };
        if (transceiver.rtcpParameters.cname) {
          params.rtcp.cname = transceiver.rtcpParameters.cname;
        }
        if (transceiver.sendEncodingParameters.length) {
          params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
        }
        transceiver.rtpReceiver.receive(params);
      }
    };
  
    RTCPeerConnection.prototype.setLocalDescription = function(description) {
      var pc = this;
  
      // Note: pranswer is not supported.
      if (['offer', 'answer'].indexOf(description.type) === -1) {
        return Promise.reject(makeError('TypeError',
            'Unsupported type "' + description.type + '"'));
      }
  
      if (!isActionAllowedInSignalingState('setLocalDescription',
          description.type, pc.signalingState) || pc._isClosed) {
        return Promise.reject(makeError('InvalidStateError',
            'Can not set local ' + description.type +
            ' in state ' + pc.signalingState));
      }
  
      var sections;
      var sessionpart;
      if (description.type === 'offer') {
        // VERY limited support for SDP munging. Limited to:
        // * changing the order of codecs
        sections = SDPUtils.splitSections(description.sdp);
        sessionpart = sections.shift();
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var caps = SDPUtils.parseRtpParameters(mediaSection);
          pc.transceivers[sdpMLineIndex].localCapabilities = caps;
        });
  
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          pc._gather(transceiver.mid, sdpMLineIndex);
        });
      } else if (description.type === 'answer') {
        sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
        sessionpart = sections.shift();
        var isIceLite = SDPUtils.matchPrefix(sessionpart,
            'a=ice-lite').length > 0;
        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var transceiver = pc.transceivers[sdpMLineIndex];
          var iceGatherer = transceiver.iceGatherer;
          var iceTransport = transceiver.iceTransport;
          var dtlsTransport = transceiver.dtlsTransport;
          var localCapabilities = transceiver.localCapabilities;
          var remoteCapabilities = transceiver.remoteCapabilities;
  
          // treat bundle-only as not-rejected.
          var rejected = SDPUtils.isRejected(mediaSection) &&
              SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
  
          if (!rejected && !transceiver.rejected) {
            var remoteIceParameters = SDPUtils.getIceParameters(
                mediaSection, sessionpart);
            var remoteDtlsParameters = SDPUtils.getDtlsParameters(
                mediaSection, sessionpart);
            if (isIceLite) {
              remoteDtlsParameters.role = 'server';
            }
  
            if (!pc.usingBundle || sdpMLineIndex === 0) {
              pc._gather(transceiver.mid, sdpMLineIndex);
              if (iceTransport.state === 'new') {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    isIceLite ? 'controlling' : 'controlled');
              }
              if (dtlsTransport.state === 'new') {
                dtlsTransport.start(remoteDtlsParameters);
              }
            }
  
            // Calculate intersection of capabilities.
            var params = getCommonCapabilities(localCapabilities,
                remoteCapabilities);
  
            // Start the RTCRtpSender. The RTCRtpReceiver for this
            // transceiver has already been started in setRemoteDescription.
            pc._transceive(transceiver,
                params.codecs.length > 0,
                false);
          }
        });
      }
  
      pc._localDescription = {
        type: description.type,
        sdp: description.sdp
      };
      if (description.type === 'offer') {
        pc._updateSignalingState('have-local-offer');
      } else {
        pc._updateSignalingState('stable');
      }
  
      return Promise.resolve();
    };
  
    RTCPeerConnection.prototype.setRemoteDescription = function(description) {
      var pc = this;
  
      // Note: pranswer is not supported.
      if (['offer', 'answer'].indexOf(description.type) === -1) {
        return Promise.reject(makeError('TypeError',
            'Unsupported type "' + description.type + '"'));
      }
  
      if (!isActionAllowedInSignalingState('setRemoteDescription',
          description.type, pc.signalingState) || pc._isClosed) {
        return Promise.reject(makeError('InvalidStateError',
            'Can not set remote ' + description.type +
            ' in state ' + pc.signalingState));
      }
  
      var streams = {};
      pc.remoteStreams.forEach(function(stream) {
        streams[stream.id] = stream;
      });
      var receiverList = [];
      var sections = SDPUtils.splitSections(description.sdp);
      var sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      var usingBundle = SDPUtils.matchPrefix(sessionpart,
          'a=group:BUNDLE ').length > 0;
      pc.usingBundle = usingBundle;
      var iceOptions = SDPUtils.matchPrefix(sessionpart,
          'a=ice-options:')[0];
      if (iceOptions) {
        pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
            .indexOf('trickle') >= 0;
      } else {
        pc.canTrickleIceCandidates = false;
      }
  
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var lines = SDPUtils.splitLines(mediaSection);
        var kind = SDPUtils.getKind(mediaSection);
        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
        var protocol = lines[0].substr(2).split(' ')[2];
  
        var direction = SDPUtils.getDirection(mediaSection, sessionpart);
        var remoteMsid = SDPUtils.parseMsid(mediaSection);
  
        var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();
  
        // Reject datachannels which are not implemented yet.
        if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
            protocol === 'UDP/DTLS/SCTP'))) {
          // TODO: this is dangerous in the case where a non-rejected m-line
          //     becomes rejected.
          pc.transceivers[sdpMLineIndex] = {
            mid: mid,
            kind: kind,
            protocol: protocol,
            rejected: true
          };
          return;
        }
  
        if (!rejected && pc.transceivers[sdpMLineIndex] &&
            pc.transceivers[sdpMLineIndex].rejected) {
          // recycle a rejected transceiver.
          pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
        }
  
        var transceiver;
        var iceGatherer;
        var iceTransport;
        var dtlsTransport;
        var rtpReceiver;
        var sendEncodingParameters;
        var recvEncodingParameters;
        var localCapabilities;
  
        var track;
        // FIXME: ensure the mediaSection has rtcp-mux set.
        var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
        var remoteIceParameters;
        var remoteDtlsParameters;
        if (!rejected) {
          remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
              sessionpart);
          remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
              sessionpart);
          remoteDtlsParameters.role = 'client';
        }
        recvEncodingParameters =
            SDPUtils.parseRtpEncodingParameters(mediaSection);
  
        var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
  
        var isComplete = SDPUtils.matchPrefix(mediaSection,
            'a=end-of-candidates', sessionpart).length > 0;
        var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
            .map(function(cand) {
              return SDPUtils.parseCandidate(cand);
            })
            .filter(function(cand) {
              return cand.component === 1;
            });
  
        // Check if we can use BUNDLE and dispose transports.
        if ((description.type === 'offer' || description.type === 'answer') &&
            !rejected && usingBundle && sdpMLineIndex > 0 &&
            pc.transceivers[sdpMLineIndex]) {
          pc._disposeIceAndDtlsTransports(sdpMLineIndex);
          pc.transceivers[sdpMLineIndex].iceGatherer =
              pc.transceivers[0].iceGatherer;
          pc.transceivers[sdpMLineIndex].iceTransport =
              pc.transceivers[0].iceTransport;
          pc.transceivers[sdpMLineIndex].dtlsTransport =
              pc.transceivers[0].dtlsTransport;
          if (pc.transceivers[sdpMLineIndex].rtpSender) {
            pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                pc.transceivers[0].dtlsTransport);
          }
          if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
            pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                pc.transceivers[0].dtlsTransport);
          }
        }
        if (description.type === 'offer' && !rejected) {
          transceiver = pc.transceivers[sdpMLineIndex] ||
              pc._createTransceiver(kind);
          transceiver.mid = mid;
  
          if (!transceiver.iceGatherer) {
            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                usingBundle);
          }
  
          if (cands.length && transceiver.iceTransport.state === 'new') {
            if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
              transceiver.iceTransport.setRemoteCandidates(cands);
            } else {
              cands.forEach(function(candidate) {
                maybeAddCandidate(transceiver.iceTransport, candidate);
              });
            }
          }
  
          localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
  
          // filter RTX until additional stuff needed for RTX is implemented
          // in adapter.js
          if (edgeVersion < 15019) {
            localCapabilities.codecs = localCapabilities.codecs.filter(
                function(codec) {
                  return codec.name !== 'rtx';
                });
          }
  
          sendEncodingParameters = transceiver.sendEncodingParameters || [{
            ssrc: (2 * sdpMLineIndex + 2) * 1001
          }];
  
          // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
          var isNewTrack = false;
          if (direction === 'sendrecv' || direction === 'sendonly') {
            isNewTrack = !transceiver.rtpReceiver;
            rtpReceiver = transceiver.rtpReceiver ||
                new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
  
            if (isNewTrack) {
              var stream;
              track = rtpReceiver.track;
              // FIXME: does not work with Plan B.
              if (remoteMsid && remoteMsid.stream === '-') {
                // no-op. a stream id of '-' means: no associated stream.
              } else if (remoteMsid) {
                if (!streams[remoteMsid.stream]) {
                  streams[remoteMsid.stream] = new window.MediaStream();
                  Object.defineProperty(streams[remoteMsid.stream], 'id', {
                    get: function() {
                      return remoteMsid.stream;
                    }
                  });
                }
                Object.defineProperty(track, 'id', {
                  get: function() {
                    return remoteMsid.track;
                  }
                });
                stream = streams[remoteMsid.stream];
              } else {
                if (!streams.default) {
                  streams.default = new window.MediaStream();
                }
                stream = streams.default;
              }
              if (stream) {
                addTrackToStreamAndFireEvent(track, stream);
                transceiver.associatedRemoteMediaStreams.push(stream);
              }
              receiverList.push([track, rtpReceiver, stream]);
            }
          } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
            transceiver.associatedRemoteMediaStreams.forEach(function(s) {
              var nativeTrack = s.getTracks().find(function(t) {
                return t.id === transceiver.rtpReceiver.track.id;
              });
              if (nativeTrack) {
                removeTrackFromStreamAndFireEvent(nativeTrack, s);
              }
            });
            transceiver.associatedRemoteMediaStreams = [];
          }
  
          transceiver.localCapabilities = localCapabilities;
          transceiver.remoteCapabilities = remoteCapabilities;
          transceiver.rtpReceiver = rtpReceiver;
          transceiver.rtcpParameters = rtcpParameters;
          transceiver.sendEncodingParameters = sendEncodingParameters;
          transceiver.recvEncodingParameters = recvEncodingParameters;
  
          // Start the RTCRtpReceiver now. The RTPSender is started in
          // setLocalDescription.
          pc._transceive(pc.transceivers[sdpMLineIndex],
              false,
              isNewTrack);
        } else if (description.type === 'answer' && !rejected) {
          transceiver = pc.transceivers[sdpMLineIndex];
          iceGatherer = transceiver.iceGatherer;
          iceTransport = transceiver.iceTransport;
          dtlsTransport = transceiver.dtlsTransport;
          rtpReceiver = transceiver.rtpReceiver;
          sendEncodingParameters = transceiver.sendEncodingParameters;
          localCapabilities = transceiver.localCapabilities;
  
          pc.transceivers[sdpMLineIndex].recvEncodingParameters =
              recvEncodingParameters;
          pc.transceivers[sdpMLineIndex].remoteCapabilities =
              remoteCapabilities;
          pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
  
          if (cands.length && iceTransport.state === 'new') {
            if ((isIceLite || isComplete) &&
                (!usingBundle || sdpMLineIndex === 0)) {
              iceTransport.setRemoteCandidates(cands);
            } else {
              cands.forEach(function(candidate) {
                maybeAddCandidate(transceiver.iceTransport, candidate);
              });
            }
          }
  
          if (!usingBundle || sdpMLineIndex === 0) {
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  'controlling');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }
  
          // If the offer contained RTX but the answer did not,
          // remove RTX from sendEncodingParameters.
          var commonCapabilities = getCommonCapabilities(
            transceiver.localCapabilities,
            transceiver.remoteCapabilities);
  
          var hasRtx = commonCapabilities.codecs.filter(function(c) {
            return c.name.toLowerCase() === 'rtx';
          }).length;
          if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
            delete transceiver.sendEncodingParameters[0].rtx;
          }
  
          pc._transceive(transceiver,
              direction === 'sendrecv' || direction === 'recvonly',
              direction === 'sendrecv' || direction === 'sendonly');
  
          // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
          if (rtpReceiver &&
              (direction === 'sendrecv' || direction === 'sendonly')) {
            track = rtpReceiver.track;
            if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
              }
              addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
              receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              addTrackToStreamAndFireEvent(track, streams.default);
              receiverList.push([track, rtpReceiver, streams.default]);
            }
          } else {
            // FIXME: actually the receiver should be created later.
            delete transceiver.rtpReceiver;
          }
        }
      });
  
      if (pc._dtlsRole === undefined) {
        pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
      }
  
      pc._remoteDescription = {
        type: description.type,
        sdp: description.sdp
      };
      if (description.type === 'offer') {
        pc._updateSignalingState('have-remote-offer');
      } else {
        pc._updateSignalingState('stable');
      }
      Object.keys(streams).forEach(function(sid) {
        var stream = streams[sid];
        if (stream.getTracks().length) {
          if (pc.remoteStreams.ind