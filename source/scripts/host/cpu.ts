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

module TSOS {

    var rrCount = 0;

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public singleStep: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.singleStep = false;

            this.initializeExecutions();
        }

        public cycle(): void {

            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            this.removeColors();

            ReadyQueue[0].State = "Running";

            if(ReadyQueue[0].Location == "HDD"){
                this.swapToHDD();
            }

            var PCB = ReadyQueue[0];

            var PCBStart: number = PCB.Base;
            var PCBEnd: number = PCB.Limit;

            var PCLoc = PCB.PC + PCBStart;

            var hexLoc = PCLoc.toString(16);
            var command = _MemoryManager.getByLoc(hexLoc);
            var exec = executions[command];
            var mem = "";

            $("#memoryTable").find("#memory-label-" + PCLoc).addClass("instruction");

            if(exec){
                PCB.IR = command;
                PCB.PC++;

                if(exec == "LDAC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Acc = constant;
                    PCB.Acc = constant;
                }else if(exec == "LDXC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Xreg = constant
                    PCB.X = constant
                }else if(exec == "LDYC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    mem = "#" + constant;

                    this.Yreg = constant
                    PCB.Y = constant;
                }else if(exec == "LDAM"){
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
                    value=parseInt(value, 10);

                    PCB.Acc = value;
                    this.Acc = value;
                }else if(exec == "LDXM"){
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
                    value=parseInt(value, 10);

                    PCB.X = value;
                    this.Xreg = value;
                }else if(exec == "LDYM"){
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
                    value=parseInt(value, 10);

                    PCB.Y = value;
                    this.Yreg = value;
                }else if(exec == "STAM" ){
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
                }else if(exec == "ADC" ){
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
                    value=parseInt(value, 10);

                    var finalValue = parseInt(PCB.Acc) + parseInt(value);

                    PCB.Acc = finalValue;
                    _CPU.setAcc(finalValue);
                }else if(exec == "CPX"){
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

                    if(value == PCB.X){
                        PCB.Z = 1;
                        _CPU.setZ(1);
                    }else if(value != PCB.X){
                        PCB.Z = 0;
                        _CPU.setZ(0);
                    }
                }else if(exec == "INC"){
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

                    value = parseInt(value,16) + 1;

                    mem = "$" + hexLoc;

                    _MemoryManager.setByLoc(finalLoc ,value.toString(16));
                }else if(exec == "BNE"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;

                    $("#memoryTable").find("#memory-label-" + PCLoc).addClass("parameter");

                    var constant = _MemoryManager.getByLoc(hexLoc);

                    //move PC counter to appropiate location if z = 0
                    if(PCB.Z == 0){
                        var jumpAmt = parseInt(constant,16);
                        if(((PCB.PC + jumpAmt)) > 255){
                            PCB.PC = PCB.PC + jumpAmt - 255 + - 1;
                        }else{
                            PCB.PC += jumpAmt;
                        }
                    }

                    mem = "#" + constant;
                }else if(exec == "SYS"){
                    _KernelInterruptQueue.enqueue(new Interrupt(SYSCALL_IRQ, ""));
                }else if(exec == "NOP"){
                    PCB.PC++;
                }else if(exec == "BRK"){
                    _MemoryManager.clearBlock(PCB.Base);
                    ReadyQueue.splice(0,1);
                    $("#queueTableBody").html("");
                    PCB.PC = 0;

                    if(ReadyQueue.length == 0){
                        this.isExecuting = false;
                        //this.removeFromResidentQueue(PCB.PID);
                        _StdOut.advanceLine();
                    }

                }

                this.PC = PCB.PC;

                if(exec != "BRK"){
                    this.updateCPU();
                    _MemoryManager.updateMemory();
                    this.updateReadyQueue();
                }

                if(RR && ReadyQueue.length > 1){
                    if(rrCount == _Quantum){
                        Control.hostLog("Scheduling Switch - RR", "CPU");
                        _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_IRQ, ""));
                        rrCount = 0;
                    }else{
                        rrCount++;
                    }
                }

                $("#instruction-details").html(exec.toString() + " " + mem);

                if(this.singleStep || PCB.PC === PCBEnd){
                    this.isExecuting = false;
                }

                if(ReadyQueue[0].Location == "HDD"){
                    this.swapToHDD();
                }

            }else{
                Control.hostLog("Invalid Opcode", "CPU");
                _StdOut.putText("Invalid Opcode");

                ReadyQueue.splice(0,1);

                if(ReadyQueue.length == 0){
                    this.isExecuting = false;
                }
            }

        }

        public setAcc(val){
            this.Acc = val;
        }

        public setX(val){
            this.Xreg = val;
        }

        public setY(val){
            this.Yreg = val;
        }

        public setZ(val){
            this.Zflag = val;
        }

        public initializeExecutions(){
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
        }

        public updateCPU(){
            var PCB = ReadyQueue[0];
            $("#pc").html(this.PC.toString());
            $("#ir").html(PCB.IR);
            $("#acc").html(this.Acc.toString());
            $("#x").html(this.Xreg.toString());
            $("#y").html(this.Yreg.toString());
            $("#z").html(this.Zflag.toString());
        }

        public resetCPU(){
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
        }

        public removeColors(){
            var memoryTable = $("#memoryTable");
            for(var i=0; i < 768; i++){
                memoryTable.find("#memory-label-" + i).removeClass("instruction");
                memoryTable.find("#memory-label-" + i).removeClass("parameter");
            }
        }

        public updateReadyQueue(){
            var table = $("#queueTableBody");
            table.html("");
            if(ReadyQueue.length > 0){
                for(var i=0; i < ReadyQueue.length; i++){
                   var pcb = ReadyQueue[i];
                    if(pcb)
                        table.append("<tr><td class='pid'>" + pcb.PID + "</td><td class='pc'>" + pcb.PC + "</td><td class='ir'>" + pcb.IR + "</td><td class='acc'>" + pcb.Acc + "</td><td class='x'>" + pcb.X + "</td><td class='y'>" + pcb.Y + "</td><td class='z'>" + pcb.Z + "</td><td class='priority'>" + pcb.Priority + "</td><td class='state'>" + pcb.State + "</td><td class='location'>" + pcb.Location + "</td><tr>");
                }
            }
        }

        public swapReadyQueue(){
            var oldFirst = ReadyQueue[0];

            oldFirst.State = "Waiting";

            ReadyQueue.splice(0,1);

            ReadyQueue[ReadyQueue.length] = oldFirst;

            ReadyQueue[0].State = "Running";
        }

        public removeFromResidentQueue(PID){
            for(var i=0; i < ResidentQueue.length; i++){
                if(ResidentQueue[i].PID = PID){
                    ResidentQueue.splice(i,1);
                }
            }
        }

        public swapToHDD(){
            var oldProg = "";
            var content = _HDManager.getProgram(ReadyQueue[0].PID);

            if(_MemoryManager.memoryFilled()){
                if(ReadyQueue[3].Location = "Memory"){
                    ReadyQueue[3].Location = "HDD";
                    oldProg = _MemoryManager.getProgram(ReadyQueue[3].Base);
                    _HDManager.writeSwap(ReadyQueue[3].PID, oldProg);
                    _MemoryManager.addProgram(ReadyQueue[3].Base, content);
                    ReadyQueue[0].Base = ReadyQueue[3].Base;
                    ReadyQueue[0].Limit = ReadyQueue[3].Limit;

                }else if(ReadyQueue[2].Location = "Memory"){
                    ReadyQueue[2].Location = "HDD";
                    oldProg = _MemoryManager.getProgram(ReadyQueue[2].Base);
                    _HDManager.writeSwap(ReadyQueue[2].PID, oldProg);
                    _MemoryManager.addProgram(ReadyQueue[2].Base, content);
                    ReadyQueue[0].Base = ReadyQueue[2].Base;
                    ReadyQueue[0].Limit = ReadyQueue[2].Limit;

                }else if(ReadyQueue[1].Location = "Memory"){
                    ReadyQueue[1].Location = "HDD";
                    oldProg = _MemoryManager.getProgram(ReadyQueue[1].Base);
                    _HDManager.writeSwap(ReadyQueue[1].PID, oldProg);
                    _MemoryManager.addProgram(ReadyQueue[1].Base, content);
                    ReadyQueue[0].Base = ReadyQueue[1].Base;
                    ReadyQueue[0].Limit = ReadyQueue[1].Limit;
                }

            }else{
                var loc = _MemoryManager.getOpenMemory();
                _MemoryManager.addProgram(loc, content);
            }

            ReadyQueue[0].Location = "Memory";
        }

    }
}
