///<reference path="..//host/memory.ts" />
module TSOS {

    export class MemoryManager {

        constructor() {
            _Memory = new Memory();
            this.resetMemory();
            this.updateMemory();
        }

        public resetMemory() : void{
            _Memory.resetMemory();
        }

        public updateMemory() : void{
            _Memory.updateMemory();
        }

        public getByLoc(loc){
            if(_CPU.isExecuting){
                var pcb = ReadyQueue[0];
                //var end = pcb.Limit;
                var pos = parseInt(loc,16);

                if(pos > 0  && pcb.Limit > 0){
                    if(pos >= pcb.Limit || pos < pcb.Base){
                        console.log("Get", pcb, "Base: " + pcb.Base, "Limit: " + pcb.Limit, "Pos:" + pos);
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            return _Memory.getByLoc(loc);
        }

        public setByLoc(loc, value) : void{
            if(_CPU.isExecuting){
                var pcb = ReadyQueue[0];
                var end = pcb.Limit;
                var base = pcb.Base;
                var pos = parseInt(loc,16);

                if(pos >= 0 && end >= 0){
                    if(pos >= end || pos < base){
                        console.log("Set", pcb, "Base: " + pcb.Base, "Limit: " + pcb.Limit, "Pos:" + pos);
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            _Memory.setByLoc(loc, value);
        }

        public memoryFilled(){
            var first = this.getByLoc("0");
            var second = this.getByLoc("100");
            var third = this.getByLoc("200");

            if(first == "00" || second == "00" || third == "00"){
                return false;
            }else{
                return true;
            }
        }

        public getOpenMemory(){
            var first = this.getByLoc("0");
            var second = this.getByLoc("100");
            var third = this.getByLoc("200");

            if(first == "00"){
                return 0;
            }else if(second == "00"){
                return 256;
            }else if(third == "00"){
                return 512;
            }

            return -1;
        }

        public clearBlock(start){
            var memLoc = "";
            for(var i=start; i < (start + 255); i++){
                memLoc = i.toString(16);
                this.setByLoc(memLoc, "00");
            }

            this.updateMemory();
        }

        public getProgram(base){
            var prog = "";

            var hex = this.getByLoc(base);
            var instr = "";
            var prevInstr = "";

            for(var i=base; i < (base + 255); i++){
                instr = this.getByLoc(i.toString(16));

                prog += instr;

                if(instr == "00" && prevInstr == "00"){
                    break;
                }

                prevInstr = instr;
            }

            this.clearBlock(base);

            return prog;
        }

        public addProgram(start, program){
            var loc = 0;

            for(var i=0; i < 256; i++){
                loc = i + start;
                this.setByLoc(loc.toString(16), program.substring(i*2, ((i + 1)*2)));
            }

            this.updateMemory();
        }
    }
}