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
            for (var i = 0; i < 4; i++) {
                for (var n = 0; n < 8; n++) {
                    for (var m = 0; m < 8; m++) {
                        var hdString = i + ":" + n + ":" + m;

                        var hdValue = "0000000000000000000000000000000000000000000000000000000000000000";

                        this.setByLoc(hdString, hdValue);
                    }
                }
            }
        };

        HardDrive.prototype.updateHardDrive = function () {
            var hdTable = $("#hdBody");
            hdTable.html("");

            for (var i = 0; i < 4; i++) {
                for (var n = 0; n < 8; n++) {
                    for (var m = 0; m < 8; m++) {
                        var hdString = i + ":" + n + ":" + m;

                        var hdValue = this.getByLoc(hdString);

                        hdTable.append("<tr id='hd-row-" + hdString + "' /><td class='text-muted'>" + hdString + "</td><td class='text-primary'>" + hdValue.substring(0, 1) + " </td><td class='text-success'>" + hdValue.substring(1, 2) + ":" + hdValue.substring(2, 3) + ":" + hdValue.substring(3, 4) + " </td><td class='text-warning'>" + hdValue.substring(4) + " </td></tr>");
                    }
                }
            }
        };

        HardDrive.prototype.getByLoc = function (loc) {
            if (loc) {
                return sessionStorage.getItem(loc);
            }
        };

        HardDrive.prototype.setByLoc = function (loc, value) {
            if (loc) {
                sessionStorage.setItem(loc, value);
            }
        };
        return HardDrive;
    })();
    TSOS.HardDrive = HardDrive;
})(TSOS || (TSOS = {}));
