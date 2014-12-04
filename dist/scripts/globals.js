/* ------------
Globals.ts
Global CONSTANTS and _Variables.
(Global over both the OS and Hardware Simulation / Host.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME = "dcOdS";
var APP_VERSION = "0.22";
var USER_LOCATION = "Your Mothers House ;)";
var USER_STATUS = "Good";

var CPU_CLOCK_INTERVAL = 100;

var TIMER_IRQ = 0;
var KEYBOARD_IRQ = 1;
var CONTEXT_IRQ = 2;
var SYSCALL_IRQ = 3;
var FORMAT_IRQ = 4;
var CREATE_IRQ = 5;
var READ_IRQ = 6;
var WRITE_IRQ = 7;
var DELETE_IRQ = 8;

//
// Global Variables
//
var _MemoryManager;
var _Memory;

var _HDManager;
var _HardDrive;

var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};

var commandHistory = [];
var commandCount = 0;
var commandReference = 0;

//Memory
var executions = [];

var PID = 0;
var ResidentQueue = [];
var ReadyQueue = [];
var currentPID = 0;
var PCBStart = 0;
var PCBEnd = 255;

//CPU Scheduling
var _Quantum = 6;
var RR = true;
var FCFS = false;
var Priority = false;
var scheduling = "round robin";

//HD Variables
var fileList = [];
