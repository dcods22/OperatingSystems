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
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var PCB = ResidentQueue[currentPID];
            var PCBStart = PCB.PCBStart;
            var PCBEnd = PCB.PCBEnd;

            var PCLoc = PCB.PC + PCBStart;
            var hexLoc = PCLoc.toString(16);
            var command = _MemoryManager.getByLoc(hexLoc);
            var exec = executions[command];

            if (exec) {
                PCB.IR = command;
                PCB.PC++;

                if (exec == "LDAC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setAcc(constant);
                    PCB.ACC = constant;
                } else if (exec == "LDXC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setX(constant);
                    PCB.X = constant;
                } else if (exec == "LDYC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setY(constant);
                    PCB.Y = constant;
                } else if (exec == "LDAM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value = parseInt(value, 10);

                    PCB.ACC = value;
                    _CPU.setAcc(value);
                } else if (exec == "LDXM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value = parseInt(value, 10);

                    PCB.X = value;
                    _CPU.setX(value);
                } else if (exec == "LDYM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value = parseInt(value, 10);

                    PCB.Y = value;
                    _CPU.setY(value);
                } else if (exec == "STAM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    _MemoryManager.setByLoc(memoryLoc, PCB.ACC);
                } else if (exec == "ADC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value = parseInt(value, 10);

                    PCB.ACC = value + PCB.ACC;
                    _CPU.setAcc(value + PCB.ACC);
                } else if (exec == "CPX") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value = parseInt(value, 10);

                    if (value == PCB.X) {
                        PCB.Z = 1;
                        _CPU.setZ(1);
                    } else if (value != PCB.X) {
                        PCB.Z = 0;
                        _CPU.setZ(0);
                    }
                } else if (exec == "INC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant), 10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);

                    value = parseInt(value, 10) + 1;
                    _MemoryManager.setByLoc(memoryLoc, value.toString(16));
                } else if (exec == "BNE") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    //move PC counter to appropiate location if z = 0
                    if (PCB.Z == 0) {
                        var jumpAmt = parseInt(constant, 16);
                        if (((PCB.PC + jumpAmt) - PCBStart) > 255) {
                            PCB.PC = PCB.PC + jumpAmt - 255 - 1;
                        } else {
                            PCB.PC += jumpAmt - 1;
                        }
                    }
                } else if (exec == "SYS") {
                    if (PCB.X == 1) {
                        _StdOut.putText(PCB.Y.toString());
                    } else if (PCB.X == 2) {
                        //Loop through till 00
                        //print appropiate charaters
                        var currentLoc = parseInt(PCB.Y) + PCBStart;
                        var constant3 = _MemoryManager.getByLoc(currentLoc);
                        while (constant3 != "00") {
                            var letterVal = parseInt(constant3, 16);
                            var letter = String.fromCharCode(letterVal);
                            _StdOut.putText(letter);
                            var intLoc = parseInt(currentLoc.toString(), 16) + 1;
                            currentLoc = parseInt(intLoc.toString(16));
                            constant3 = _MemoryManager.getByLoc(currentLoc);
                        }
                    }
                } else if (exec == "BRK") {
                    this.isExecuting = false;
                }

                this.updateCPU();
                _MemoryManager.updateMemory();
            }

            if (this.singleStep || PCB.PC === PCBEnd) {
                this.isExecuting = false;
            }
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

        Cpu.prototype.updateCPU = function () {
            var PCB = ResidentQueue[currentPID];
            $("#pc").html(PCB.PC);
            $("#ir").html(PCB.IR);
            $("#acc").html(PCB.ACC);
            $("#x").html(PCB.X);
            $("#y").html(PCB.Y);
            $("#z").html(PCB.Z);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
