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
    var rrCount = 0;

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

            this.removeColors();

            ReadyQueue[0].State = "Running";

            if (ReadyQueue[0].Location == "HDD") {
                TSOS.Control.hostLog("Swapping memory to HDD", "HDD");
                this.swapToHDD();
            }

            var PCB = ReadyQueue[0];

            var PCBStart = PCB.Base;
            var PCBEnd = PCB.Limit;

            var PCLoc = PCB.PC + PCBStart;

            var hexLoc = PCLoc.toString(16);

            var command = _MemoryManager.getByLoc(hexLoc);
            var exec = executions[command];
            var mem = "";

            $("#memoryTable").find("#memory-label-" + PCLoc).addClass("instruction");

            if (exec) {
                PCB.IR = command;
                PCB.PC++;

                if (exec == "LDAC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Acc = constant;
                    PCB.Acc = constant;
                } else if (exec == "LDXC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Xreg = constant;
                    PCB.X = constant;
                } else if (exec == "LDYC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Yreg = constant;
                    PCB.Y = constant;
                } else if (exec == "LDAM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2.toString() + constant.toString();

                    mem = "$" + newLoc;

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    var value = _MemoryManager.getByLoc(finalLoc);
                    value = parseInt(value, 10);

                    PCB.Acc = value;
                    this.Acc = value;
                } else if (exec == "LDXM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2.toString() + constant.toString();

                    mem = "$" + newLoc;

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    var value = _MemoryManager.getByLoc(finalLoc);
                    value = parseInt(value, 10);

                    PCB.X = value;
                    this.Xreg = value;
                } else if (exec == "LDYM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2.toString() + constant.toString();

                    mem = "$" + newLoc;

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    var value = _MemoryManager.getByLoc(finalLoc);
                    value = parseInt(value, 10);

                    PCB.Y = value;
                    this.Yreg = value;
                } else if (exec == "STAM") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2 + constant;

                    mem = "$" + newLoc;

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    _MemoryManager.setByLoc(finalLoc, PCB.Acc);
                } else if (exec == "ADC") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2.toString() + constant.toString();

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    mem = "$" + hexLoc;

                    var value = _MemoryManager.getByLoc(finalLoc);
                    value = parseInt(value, 10);

                    var finalValue = parseInt(PCB.Acc) + parseInt(value);

                    PCB.Acc = finalValue;
                    _CPU.setAcc(finalValue);
                } else if (exec == "CPX") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var newLoc = constant2.toString() + constant.toString();

                    var intLoc = parseInt(newLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    var value = _MemoryManager.getByLoc(finalLoc);

                    mem = "$" + newLoc;

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

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var hexLoc = constant2.toString() + constant.toString();

                    var intLoc = parseInt(hexLoc, 16) + PCBStart;

                    var finalLoc = intLoc.toString(16);

                    var value = _MemoryManager.getByLoc(finalLoc);

                    value = parseInt(value, 16) + 1;

                    mem = "$" + hexLoc;

                    _MemoryManager.setByLoc(finalLoc, value.toString(16));
                } else if (exec == "BNE") {
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    //move PC counter to appropiate location if z = 0
                    if (PCB.Z == 0) {
                        var jumpAmt = parseInt(constant, 16);
                        if (((PCB.PC + jumpAmt)) > 255) {
                            PCB.PC = PCB.PC + jumpAmt - 255 + -1;
                        } else {
                            PCB.PC += jumpAmt;
                        }
                    }

                    mem = "#" + constant;
                } else if (exec == "SYS") {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSCALL_IRQ, ""));
                } else if (exec == "NOP") {
                    PCB.PC++;
                } else if (exec == "BRK") {
                    _MemoryManager.clearBlock(PCB.Base);
                    ReadyQueue.splice(0, 1);
                    $("#queueTableBody").html("");
                    PCB.PC = 0;

                    if (ReadyQueue.length == 0) {
                        this.isExecuting = false;

                        //this.removeFromResidentQueue(PCB.PID);
                        _StdOut.advanceLine();
                    }
                }

                this.PC = PCB.PC;

                if (exec != "BRK") {
                    this.updateCPU();
                    _MemoryManager.updateMemory();
                    this.updateReadyQueue();
                }

                if (RR && ReadyQueue.length > 1) {
                    if (rrCount == (_Quantum - 1)) {
                        TSOS.Control.hostLog("Scheduling Switch - RR", "CPU");
                        _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_IRQ, ""));
                        rrCount = 0;
                    } else {
                        rrCount++;
                    }
                }

                $("#instruction-details").html(exec.toString() + " " + mem);

                if (this.singleStep || PCB.PC === PCBEnd) {
                    this.isExecuting = false;
                }

                if (ReadyQueue[0].Location == "HDD") {
                    this.swapToHDD();
                }
            } else {
                TSOS.Control.hostLog("Invalid Opcode", "CPU");
                _StdOut.putText("Invalid Opcode");

                ReadyQueue.splice(0, 1);

                if (ReadyQueue.length == 0) {
                    this.isExecuting = false;
                }
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
            var PCB = ReadyQueue[0];
            $("#pc").html(PCB.PC.toString());
            $("#ir").html(PCB.IR);
            $("#acc").html(PCB.Acc.toString());
            $("#x").html(PCB.X.toString());
            $("#y").html(PCB.Y.toString());
            $("#z").html(PCB.Z.toString());
        };

        Cpu.prototype.resetCPU = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            $("#pc").html(this.PC.toString());
            $("#ir").html(this.PC.toString());
            $("#acc").html(this.Acc.toString());
            $("#x").html(this.Xreg.toString());
            $("#y").html(this.Yreg.toString());
            $("#z").html(this.Zflag.toString());
        };

        Cpu.prototype.removeColors = function () {
            var memoryTable = $("#memoryTable");
            for (var i = 0; i < 768; i++) {
                memoryTable.find("#memory-label-" + i).removeClass("instruction");
                memoryTable.find("#memory-label-" + i).removeClass("parameter");
            }
        };

        Cpu.prototype.updateReadyQueue = function () {
            var table = $("#queueTableBody");
            table.html("");
            if (ReadyQueue.length > 0) {
                for (var i = 0; i < ReadyQueue.length; i++) {
                    var pcb = ReadyQueue[i];
                    if (pcb)
                        table.append("<tr><td class='pid'>" + pcb.PID + "</td><td class='pc'>" + pcb.PC + "</td><td class='ir'>" + pcb.IR + "</td><td class='acc'>" + pcb.Acc + "</td><td class='x'>" + pcb.X + "</td><td class='y'>" + pcb.Y + "</td><td class='z'>" + pcb.Z + "</td><td class='priority'>" + pcb.Priority + "</td><td class='state'>" + pcb.State + "</td><td class='location'>" + pcb.Location + "</td><tr>");
                }
            }
        };

        Cpu.prototype.swapReadyQueue = function () {
            var oldFirst = ReadyQueue[0];

            oldFirst.State = "Waiting";

            ReadyQueue.splice(0, 1);

            ReadyQueue[ReadyQueue.length] = oldFirst;

            ReadyQueue[0].State = "Running";
        };

        Cpu.prototype.removeFromResidentQueue = function (PID) {
            for (var i = 0; i < ResidentQueue.length; i++) {
                if (ResidentQueue[i].PID = PID) {
                    ResidentQueue.splice(i, 1);
                }
            }
        };

        Cpu.prototype.swapToHDD = function () {
            var oldProg = "";
            var content = _HDManager.getProgram(ReadyQueue[0].PID);
            var swapNum = ReadyQueue.length - 1;
            var done = false;

            if (_MemoryManager.memoryFilled()) {
                for (var i = swapNum; i > 0; i--) {
                    if (ReadyQueue[i].Location == "Memory") {
                        ReadyQueue[0].Location = "Memory";
                        ReadyQueue[i].Location = "HDD";
                        oldProg = _MemoryManager.getProgram(ReadyQueue[3].Base);
                        _HDManager.writeSwap(ReadyQueue[i].PID, oldProg);
                        ReadyQueue[0].Base = ReadyQueue[i].Base;
                        ReadyQueue[0].Limit = ReadyQueue[i].Limit;
                        _MemoryManager.addProgram(ReadyQueue[i].Base, content);
                        done = true;
                    }

                    if (done)
                        break;
                }
            } else {
                var loc = _MemoryManager.getOpenMemory();
                _MemoryManager.addProgram(loc, content);
                ReadyQueue[0].Base = loc;
                ReadyQueue[0].Limit = loc + 255;
            }

            ReadyQueue[0].Location = "Memory";

            this.updateReadyQueue();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
