/**
 * Window-Events v1.0.2
 * Easy wrapper for the window.postMessage functionality.
 */

"use strict";

var eventListeners = {};

function receiveMessage(event) {
    var eventData = event.data['data'] || {};
    var eventName = event.data['eventName'] || null;

    var origin = event.origin;
    var source = event.source;

    var targetListeners = eventListeners[eventName] || eventListeners[null] || [];
    var replyTransmitter;

    try {
        replyTransmitter = new windowEvents.EventTransmitter(source);
    }catch (e){
        replyTransmitter = null;
    }

    targetListeners.forEach(function (listener) {
        listener(eventData, replyTransmitter, origin);
    });
}

function postMessage(window, eventName, data) {
    window.postMessage({eventName: eventName, data: data}, "*");
}

var windowEvents = {
    listen: function (eventName, callback) {
        if(eventListeners[eventName] === undefined){
            eventListeners[eventName] = [];
        }

        if(typeof callback == "function" && eventListeners[eventName].indexOf(callback) < 0){
            eventListeners[eventName].push(callback);
            return true;
        }

        return false;
    },

    removeListener: function (eventName, callback) {
        if(eventListeners[eventName] === undefined || typeof callback != "function"){
            return false;
        }

        var index = eventListeners[eventName].indexOf(callback);
        if(index >= 0){
            eventListeners[eventName].splice(index, 1);
            return true;
        }else {
            return false;
        }
    },

    EventTransmitter: function (window) {
        if(typeof window.postMessage == "function"){
            return {
                send: function (eventName, data) {
                    postMessage(window, eventName, data);
                }
            };
        }else {
            throw new Error("window.postMessage is undefined, is the window parameter a real Window object?");
        }
    },

    transmitterFromIframe: function (frame) {
        var w = frame.contentWindow || frame;
        return new this.EventTransmitter(w);
    },

    send: function (eventName, data) {
        postMessage(window, eventName, data);
    },

    clearListeners: function () {
        eventListeners = {};
    }
};

window.addEventListener("message", receiveMessage, false);

module.exports = windowEvents;