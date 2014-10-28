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
            var end = ReadyQueue[0].Limit + 1;
            var pos = parseInt(loc,10) + ReadyQueue[0].Base;

            if(pos > end || pos < ReadyQueue[0].Base){
                _Kernel.krnTrapError("Out Of Memory Error");
            }

            return _Memory.getByLoc(loc);
        }

        public setByLoc(loc, value) : void{
            _Memory.setByLoc(loc, value);
        }
    }
}