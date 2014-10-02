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
            return _Memory.getByLoc(loc);
        }

        public setByLoc(loc, value) : void{
            _Memory.setByLoc(loc, value);
        }
    }
}