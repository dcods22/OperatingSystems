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

            var PCB = ResidentQueue[currentPID];
            var PCBStart: number = PCB.PCBStart;
            var PCBEnd: number = PCB.PCBEnd;

            var PCLoc = PCB.PC + PCBStart;
            var hexLoc = PCLoc.toString(16);
            var command = _MemoryManager.getByLoc(hexLoc);
            var exec = executions[command];

            if(exec){
                PCB.IR = command;
                PCB.PC++;

                if(exec == "LDAC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setAcc(constant);
                    PCB.ACC = constant;
                }else if(exec == "LDXC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setX(constant);
                    PCB.X = constant
                }else if(exec == "LDYC"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    _CPU.setY(constant);
                    PCB.Y = constant;
                }else if(exec == "LDAM"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.ACC = value;
                    _CPU.setAcc(value);
                }else if(exec == "LDXM"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.X = value;
                    _CPU.setX(value);
                }else if(exec == "LDYM"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);
                    hexLoc = PCB.PC.toString(16);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.Y = value;
                    _CPU.setY(value);
                }else if(exec == "STAM" ){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    _MemoryManager.setByLoc(memoryLoc, PCB.ACC);
                }else if(exec == "ADC" ){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

                    PCB.ACC = value + PCB.ACC;
                    _CPU.setAcc(value + PCB.ACC);
                }else if(exec == "CPX"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);
                    value=parseInt(value, 10);

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
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant2 = _MemoryManager.getByLoc(hexLoc);

                    var memoryLoc = parseInt((constant2 + constant),10).toString();

                    var value = _MemoryManager.getByLoc(memoryLoc);

                    value = parseInt(value,10) + 1;
                    _MemoryManager.setByLoc(memoryLoc ,value.toString(16));
                }else if(exec == "BNE"){
                    PCLoc = PCB.PC + PCBStart;
                    hexLoc = PCLoc.toString(16);
                    PCB.PC++;
                    var constant = _MemoryManager.getByLoc(hexLoc);

                    //move PC counter to appropiate location if z = 0
                    if(PCB.Z == 0){
                        var jumpAmt = parseInt(constant,16);
                        if(((PCB.PC + jumpAmt) - PCBStart) > 255){
                            PCB.PC = PCB.PC + jumpAmt - 255 - 1;
                        }else{
                            PCB.PC += jumpAmt - 1;
                        }
                    }
                }else if(exec == "SYS"){
                    if(PCB.X == 1){
                        _StdOut.putText(PCB.Y.toString());
                    }else if(PCB.X == 2){
                        //Loop through till 00
                        //print appropiate charaters
                        var currentLoc = parseInt(PCB.Y) + PCBStart;
                        var constant3 = _MemoryManager.getByLoc(currentLoc);
                        while(constant3 != "00"){
                            var letterVal = parseInt(constant3,16);
                            var letter = String.fromCharCode(letterVal);
                            _StdOut.putText(letter);
                            var intLoc = parseInt(currentLoc.toString(),16) + 1;
                            currentLoc = parseInt(intLoc.toString(16));
                            constant3 = _MemoryManager.getByLoc(currentLoc);
                        }
                    }
                }else if(exec == "NOP"){
                    PCB.PC++;
                }else if(exec == "BRK"){
                    this.isExecuting = false;
                    var PCBString = "PC: " + PCB.PC + " ACC: " + PCB.ACC + " IR: " + PCB.IR +" X: " + PCB.X + " Y: " + PCB.Y + " Z: " + PCB.Z;
                    _StdOut.advanceLine();
                    _StdOut.putText(PCBString);
                    this.resetCPU();
                }

                this.PC = PCB.PC;

                if(exec != "BRK"){
                    this.updateCPU();
                    _MemoryManager.updateMemory();
                }
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
            var PCB = ResidentQueue[currentPID];
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
    }
}
