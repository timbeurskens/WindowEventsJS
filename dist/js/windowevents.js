(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.windowevents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])(1)
});