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
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            var hex = _Memory.getByLoc(loc);

            if(hex.length < 2){
                "0" + hex;
            }

            return hex;
        }

        public setByLoc(loc, value) : void{
            if(_CPU.isExecuting){
                var pcb = ReadyQueue[0];
                var end = pcb.Limit;
                var base = pcb.Base;
                var pos = parseInt(loc,16);

                if(pos >= 0 && end >= 0){
                    if(pos >= end || pos < base){
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            if(value.length < 2){
                value = "0" + value;
            }

            _Memory.setByLoc(loc, value);
        }

        public memoryFilled(){
            var first = this.getLocNoCheck("0");
            var second = this.getLocNoCheck("100");
            var third = this.getLocNoCheck("200");

            if(first == "00" || second == "00" || third == "00"){
                return false;
            }else{
                return true;
            }
        }

        public getOpenMemory(){
            var first = this.getLocNoCheck("0");
            var second = this.getLocNoCheck("100");
            var third = this.getLocNoCheck("200");

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
                this.setLocNoCheck(memLoc, "00");
            }

            this.updateMemory();
        }

        public getProgram(base){
            var prog = "";

            var hex = this.getLocNoCheck(base);
            var instr = "";

            for(var i=base; i < (base + 255); i++){
                instr = this.getLocNoCheck(i.toString(16));

                if(instr.length < 2){
                    instr = "0" + instr;
                }

                prog += instr;
            }

            this.clearBlock(base);

            return prog;
        }

        public getLocNoCheck(loc){
            return _Memory.getByLoc(loc)
        }

        public setLocNoCheck(loc, value){
            _Memory.setByLoc(loc, value);
        }

        public addProgram(start, program){
            var loc = 0;

            for(var i=0; i < 256; i++){
                loc = i + start;
                this.setLocNoCheck(loc.toString(16), program.substring(i*2, ((i + 1)*2)));
            }

            this.updateMemory();
        }
    }
}