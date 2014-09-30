///<reference path="../globals.ts" />
/* ------------
CPU.ts
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
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, singleStep) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            if (typeof singleStep === "undefined") { singleStep = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.singleStep = singleStep;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.singleStep = false;

            this.initializeExecutions();
            this.resetMemory();
            this.updateMemory();
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var PCB = PCBArray[currentPID];
            var PCBStart = PCB.PCBStart;
            var PCBEnd = PCB.PCBEnd;
            var PC = PCB.PC;

            var hexLoc = PC.toString(16);
            var command = memory[hexLoc];
            var exec = executions[command];

            PCB.PC++;

            if (exec == "LDAC") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];

                _CPU.setAcc(constant);
                PCB.ACC = constant;
            } else if (exec == "LDXC") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];

                _CPU.setX(constant);
                PCB.X = constant;
            } else if (exec == "LDYC") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];

                _CPU.setY(constant);
                PCB.Y = constant;
            } else if (exec == "BNE") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];

                //move PC counter to appropiate location if z = 0
                if (PCB.Z == 0) {
                    PCB.PC += parseInt(constant, 16);
                }
            } else if (exec == "LDAM") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];

                var memoryLoc = constant + constant2;
                console.log("memory loc" + memoryLoc);
                var value = memory[memoryLoc];
                PCB.ACC = value;
            } else if (exec == "LDXM") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            } else if (exec == "LDYM") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            } else if (exec == "STAM") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            } else if (exec == "ADC") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            } else if (exec == "CPX") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            } else if (exec == "INC") {
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant = memory[hexLoc];
                hexLoc = PC.toString(16);
                PCB.PC++;
                var constant2 = memory[hexLoc];
            }

            this.updateCPU();
            this.updateMemory();

            if (this.singleStep || PCB.PC === PCBEnd)
                this.isExecuting = false;
        };

        Cpu.prototype.setAcc = function (val) {
            this.Acc = val;
        };

        Cpu.prototype.setX = function (val) {
            this.Xreg = val;
        };

        Cpu.prototype.setY = function (val) {
            this.Yreg = val;
        };

        Cpu.prototype.setZ = function (val) {
            this.Zflag = val;
        };

        Cpu.prototype.initializeExecutions = function () {
            executions["A9"] = "LDAC";
            executions["AD"] = "LDAM";
            executions["8D"] = "STAM";
            executions["6D"] = "ADC";
            executions["A2"] = "LDXC";
            executions["AE"] = "LDXM";
            executions["A0"] = "LDYC";
            executions["AC"] = "LDYM";
            executions["EA"] = "NOP";
            executions["00"] = "BRK";
            executions["EC"] = "CPX";
            executions["D0"] = "BNE";
            executions["EE"] = "INC";
            executions["FF"] = "SYS";
        };

        Cpu.prototype.resetMemory = function () {
            for (var i = 0; i < 768; i++) {
                var hexValue = i.toString(16);
                memory[hexValue] = "00";
            }
        };

        Cpu.prototype.updateMemory = function () {
            var memoryTable = $("#memoryTable");
            memoryTable.html("");

            for (var i = 0; i < 96; i++) {
                memoryTable.append("<tr id='memory-row-" + i + "'>");

                var memoryRow = $("#memory-row-" + i);

                var hexInt = i * 8;

                var hexIntString = hexInt.toString(16);
                if (hexIntString.length < 2) {
                    hexIntString = "00" + hexIntString;
                } else if (hexIntString.length < 3) {
                    hexIntString = "0" + hexIntString;
                }

                memoryRow.append("<td id='memory-label-" + i + "' class='memoryData'>0x" + hexIntString.toUpperCase() + "</td>");

                for (var x = 0; x < 8; x++) {
                    var memoryLocation = (x + hexInt);
                    memoryRow.append("<td id='memory-label-" + memoryLocation + "' class='memoryData'>" + memory[memoryLocation.toString(16)].toUpperCase() + "</td>");
                }

                memoryTable.append("</tr>");
            }
        };

        Cpu.prototype.updateCPU = function () {
            $("#pc").html(this.PC.toString());
            $("#acc").html(this.Acc.toString());
            $("#x").html(this.Xreg.toString());
            $("#y").html(this.Yreg.toString());
            $("#z").html(this.Zflag.toString());
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
