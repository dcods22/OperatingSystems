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
                var end = ReadyQueue[0].Limit;
                var pos = parseInt(loc,16);

                if(pos >= end || pos < ReadyQueue[0].Base){
                    _Kernel.krnTrapError("Out Of Memory Error");
                }
            }

            return _Memory.getByLoc(loc);
        }

        public setByLoc(loc, value) : void{
            if(_CPU.isExecuting){
                var end = ReadyQueue[0].Limit;
                var pos = parseInt(loc,16);

                if(pos >= end || pos < ReadyQueue[0].Base){
                    _Kernel.krnTrapError("Out Of Memory Error");
                }
            }

            _Memory.setByLoc(loc, value);
        }
    }
}