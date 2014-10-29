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
                var end = ReadyQueue[0].Limit;
                var pos = parseInt(loc, 16) + ReadyQueue[0].Base;

                if (pos >= end || pos < ReadyQueue[0].Base) {
                    _Kernel.krnTrapError("Out Of Memory Error");
                }
            }

            return _Memory.getByLoc(loc);
        };

        MemoryManager.prototype.setByLoc = function (loc, value) {
            if (_CPU.isExecuting) {
                var end = ReadyQueue[0].Limit;
                var pos = parseInt(loc, 16) + ReadyQueue[0].Base;

                if (pos >= end || pos < ReadyQueue[0].Base) {
                    _Kernel.krnTrapError("Out Of Memory Error");
                }
            }

            _Memory.setByLoc(loc, value);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
