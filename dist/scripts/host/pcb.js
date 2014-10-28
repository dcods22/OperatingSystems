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
    var PCB = (function () {
        function PCB(Base, Limit, PID, PC, Acc, IR, X, Y, Z, State, Priority, Location) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof IR === "undefined") { IR = "0"; }
            if (typeof X === "undefined") { X = 0; }
            if (typeof Y === "undefined") { Y = 0; }
            if (typeof Z === "undefined") { Z = 0; }
            if (typeof State === "undefined") { State = "Waiting"; }
            if (typeof Priority === "undefined") { Priority = 0; }
            if (typeof Location === "undefined") { Location = "Memory"; }
            this.Base = Base;
            this.Limit = Limit;
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.IR = IR;
            this.X = X;
            this.Y = Y;
            this.Z = Z;
            this.State = State;
            this.Priority = Priority;
            this.Location = Location;
        }
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
