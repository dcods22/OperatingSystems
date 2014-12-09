///<reference path="../globals.ts" />
/* ------------
memory.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
///<reference path='../jquery.d.ts' />
var TSOS;
(function (TSOS) {
    var HardDrive = (function () {
        function HardDrive() {
            this.initalizeHardDrive();
        }
        HardDrive.prototype.initalizeHardDrive = function () {
            this.resetHardDrive();
            this.updateHardDrive();
        };

        HardDrive.prototype.resetHardDrive = function () {
            var hdStr = "";
            var empty = "0000000000000000000000000000000000000000000000000000000000000000";

            for (var m = 0; m < 4; m++) {
                for (var i = 0; i < 8; i++) {
                    for (var n = 0; n < 8; n++) {
                        hdStr = m + ":" + i + ":" + n;
                        this.setByLoc(hdStr, empty);
                    }
                }
            }
        };

        HardDrive.prototype.updateHardDrive = function () {
            var hdStr = "";
            var hex = "";

            var memoryTable = $("#hdTable");

            memoryTable.html("");

            for (var m = 0; m < 4; m++) {
                for (var i = 0; i < 8; i++) {
                    for (var n = 0; n < 8; n++) {
                        hdStr = m + ":" + i + ":" + n;
                        hex = this.getByLoc(hdStr);
                        memoryTable.append("");
                    }
                }
            }
        };

        HardDrive.prototype.getByLoc = function (loc) {
            return sessionStorage.getItem(loc);
        };

        HardDrive.prototype.setByLoc = function (loc, value) {
            sessionStorage.setItem(loc, value);
        };
        return HardDrive;
    })();
    TSOS.HardDrive = HardDrive;
})(TSOS || (TSOS = {}));
