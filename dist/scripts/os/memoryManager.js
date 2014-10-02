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
            return _Memory.getByLoc(loc);
        };

        MemoryManager.prototype.setByLoc = function (loc, value) {
            _Memory.setByLoc(loc, value);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
