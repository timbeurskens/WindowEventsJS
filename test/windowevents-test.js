var assert = require('assert');
var windowEvents = require('../src/windowevents');

suite("WindowEvents", function () {
    setup(function () {

    });

    suite("EventTransmitter", function () {
        test('should throw an error on an invalid window object', function () {
            assert.throws(function(){
                new windowEvents.EventTransmitter({});
            }, Error);
        });
        test('should return an object when a valid window object is given', function () {
            var transmitter = new windowEvents.EventTransmitter(window);
            assert(typeof transmitter == "object");
        });
    });

    suite("EventListener", function () {
        test('should fire an event when transmitting', function (done) {
            windowEvents.clearListeners();
            windowEvents.listen("test1", function () {
                done();
            });
            windowEvents.send("test1", null);
        });

        test('should listen for default events', function (done) {
            windowEvents.clearListeners();
            windowEvents.listen(null, function () {
                done();
            });

            windowEvents.send(null, null);
        });

        test('should listen for undefined events', function (done) {
            windowEvents.clearListeners();
            windowEvents.listen(null, function () {
                done();
            });

            windowEvents.send("test", null);
        });

        test('should return false when adding duplicate listeners', function () {
            windowEvents.clearListeners();
            var listener = function () {

            };
            assert.equal(windowEvents.listen("test", listener), true, "first instance");
            assert.equal(windowEvents.listen("test", listener), false, "second instance");
        });

        test('should be able to remove existing listeners', function () {
            windowEvents.clearListeners();
            var listener = function () {

            };
            windowEvents.listen("test", listener);
            assert.equal(windowEvents.removeListener("test", listener), true, "first instance");
            assert.equal(windowEvents.removeListener("test", listener), false, "second instance");
        });
    });
});