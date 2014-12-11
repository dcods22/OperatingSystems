///<reference path="..//host/memory.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            _Memory = new TSOS.Memory();
            this.resetMemory();
            this.updateMemory();
        }
        MemoryManager.prototype.resetMemory = function () {
            _Memory.resetMemory();
        };

        MemoryManager.prototype.updateMemory = function () {
            _Memory.updateMemory();
        };

        MemoryManager.prototype.getByLoc = function (loc) {
            if (_CPU.isExecuting) {
                var pcb = ReadyQueue[0];

                //var end = pcb.Limit;
                var pos = parseInt(loc, 16);

                if (pos > 0 && pcb.Limit > 0) {
                    if (pos >= pcb.Limit || pos < pcb.Base) {
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            return _Memory.getByLoc(loc);
        };

        MemoryManager.prototype.setByLoc = function (loc, value) {
            if (_CPU.isExecuting) {
                var pcb = ReadyQueue[0];
                var end = pcb.Limit;
                var base = pcb.Base;
                var pos = parseInt(loc, 16);

                if (pos >= 0 && end >= 0) {
                    if (pos >= end || pos < base) {
                        _Kernel.krnTrapError("Out Of Memory Error");
                    }
                }
            }

            _Memory.setByLoc(loc, value);
        };

        MemoryManager.prototype.memoryFilled = function () {
            var first = this.getLocNoCheck("0");
            var second = this.getLocNoCheck("100");
            var third = this.getLocNoCheck("200");

            if (first == "00" || second == "00" || third == "00") {
                return false;
            } else {
                return true;
            }
        };

        MemoryManager.prototype.getOpenMemory = function () {
            var first = this.getLocNoCheck("0");
            var second = this.getLocNoCheck("100");
            var third = this.getLocNoCheck("200");

            if (first == "00") {
                return 0;
            } else if (second == "00") {
                return 256;
            } else if (third == "00") {
                return 512;
            }

            return -1;
        };

        MemoryManager.prototype.clearBlock = function (start) {
            var memLoc = "";
            for (var i = start; i < (start + 255); i++) {
                memLoc = i.toString(16);
                this.setLocNoCheck(memLoc, "00");
            }

            this.updateMemory();
        };

        MemoryManager.prototype.getProgram = function (base) {
            var prog = "";

            var hex = this.getLocNoCheck(base);
            var instr = "";

            for (var i = base; i < (base + 255); i++) {
                instr = this.getLocNoCheck(i.toString(16));

                prog += instr;
            }

            this.clearBlock(base);

            return prog;
        };

        MemoryManager.prototype.getLocNoCheck = function (loc) {
            return _Memory.getByLoc(loc);
        };

        MemoryManager.prototype.setLocNoCheck = function (loc, value) {
            _Memory.setByLoc(loc, value);
        };

        MemoryManager.prototype.addProgram = function (start, program) {
            var loc = 0;

            for (var i = 0; i < 256; i++) {
                loc = i + start;
                this.setLocNoCheck(loc.toString(16), program.substring(i * 2, ((i + 1) * 2)));
            }

            this.updateMemory();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
