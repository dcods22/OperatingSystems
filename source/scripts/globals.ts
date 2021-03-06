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
var APP_NAME: string    = "dcOdS";   // Dan Cody but in an OS form
var APP_VERSION: string = "0.22";   // Best Number in History
var USER_LOCATION: string = "Your Mothers House ;)";    //Incase anyone was wondering
var USER_STATUS: string = "Good";     //Do as you please with my OS

var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ: number = 0;
var KEYBOARD_IRQ: number = 1;
var CONTEXT_IRQ: number = 2;
var SYSCALL_IRQ: number = 3;
var FORMAT_IRQ: number = 4;
var CREATE_IRQ: number = 5;
var READ_IRQ: number = 6;
var WRITE_IRQ: number = 7;
var DELETE_IRQ: number = 8;

//
// Global Variables
//

var _MemoryManager: TSOS.MemoryManager;
var _Memory: TSOS.Memory;

var _HDManager: TSOS.HDManager;
var _HardDrive: TSOS.HardDrive;

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.


var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.


var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
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