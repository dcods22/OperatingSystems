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

            var PCB = PCBArray[currentPID];
            var PCBStart: number = PCB.PCBStart;
            var PCBEnd: number = PCB.PCBEnd;

            var hexLoc = PCB.PC.toString(16);
            var command = _MemoryManager.getByLoc(hexLoc);
            var exec = executions[command];

            if(exec){
                PCB.IR = command;
                PCB.PC++;

                if(exec == "LDAC"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setAcc(constant);
                    PCB.ACC = constant;
                }else if(exec == "LDXC"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setX(constant);
                    PCB.X = constant
                }else if(exec == "LDYC"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setY(constant);
                    PCB.Y = constant;
                }else if(exec == "BNE"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    //move PC counter to appropiate location if z = 0
                    if(PCB.Z == 0){
                        PCB.PC += parseInt(constant,16);
                    }
                }else if(exec == "LDAM"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.ACC = value;
                    _CPU.setAcc(value);
                }else if(exec == "LDXM"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.X = value;
                    _CPU.setX(value);
                }else if(exec == "LDYM"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.Y = value;
                    _CPU.setY(value);
                }else if(exec == "STAM" ){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    _MemoryManager.setByLoc(memoryLoc, PCB.ACC);
                }else if(exec == "ADC" ){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.ACC = value + PCB.ACC;
                    _CPU.setAcc(value + PCB.ACC);
                }else if(exec == "CPX"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    if(value == PCB.X){
                        PCB.Z = 0;
                        _CPU.setZ(0);
                    }else if(value != PCB.X){
                        PCB.Z = 1;
                        _CPU.setZ(1);
                    }
                }else if(exec == "INC"){
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);

                    value = parseInt(value,10) + 1;
                    _MemoryManager.setByLoc(memoryLoc ,value.toString(16));
                }else if(exec == "SYS"){
                    _StdOut.putText(PCB.Y);
                }else if(exec == "BRK"){
                    _StdOut.putText("DONE");
                    this.isExecuting = false;
                }

                this.updateCPU();
                _MemoryManager.updateMemory();
            }

            if(this.singleStep || PCB.PC === PCBEnd){
                this.isExecuting = false;
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
            var PCB = PCBArray[currentPID];
            $("#pc").html(PCB.PC);
            $("#ir").html(PCB.IR);
            $("#acc").html(PCB.ACC);
            $("#x").html(PCB.X);
            $("#y").html(PCB.Y);
            $("#z").html(PCB.Z);
        }
    }
}
