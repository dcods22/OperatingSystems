///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
///<reference path="..//host/pcb.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.dateAndTime = new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString();
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "<string> - Tells you where you are.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellDate, "date", "<string> - Tells you the date.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellTruth, "truth", "- Tells you the truth.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Changes you your current status.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Gives you the BSOD.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads the program out of the User Program Input Text Area.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRun, "run", "<string> - Runs, based on process ID a program that is loaded into memory.");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears out memory");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs All Programs in Memory");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Sets the round robin quantum");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Displays the running PID's");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<id> - Kills the program with that specific PID");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "displays the current scheduling alrogithm");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "<string> - The string of the new scheduling algorithm");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellHDFormat, "format", "- Formats the Hard Drive");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<string> - Creates a file on the hard drive with a filename");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellRead, "read", "<string> - reads a file on the hard drive with a filename");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<string> <string> - writes the data in the \" \" to the HD with a file name");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<string> - deletes a file on the hard drive with a filename");

            this.commandList[this.commandList.length] = sc;

            sc = new TSOS.ShellCommand(this.shellLS, "ls", "- Lists the files on the File System");

            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            _StdOut.putText(this.dateAndTime);
            _StdOut.advanceLine();
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
            userCommand = this.parseInput(buffer);

            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again.
            this.putPrompt();
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);

            commandHistory[commandCount++] = "ver";
            commandReference = commandCount;
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }

            commandHistory[commandCount++] = "help";
            commandReference = commandCount;
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();

            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
            commandHistory[commandCount++] = "shutdown";
            commandReference = commandCount;
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();

            commandHistory[commandCount++] = "cls";
            commandReference = commandCount;
        };

        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }

            commandHistory[commandCount++] = "man";
            commandReference = commandCount;
        };

        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }

            commandHistory[commandCount++] = "trace";
            commandReference = commandCount;
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }

            commandHistory[commandCount++] = "rot13";
            commandReference = commandCount;
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }

            commandHistory[commandCount++] = "prompt";
            commandReference = commandCount;
        };

        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText(USER_LOCATION);

            commandHistory[commandCount++] = "whereami";
            commandReference = commandCount;
        };

        Shell.prototype.shellDate = function (args) {
            var currDateTime = new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString();
            _StdOut.putText(currDateTime);

            commandHistory[commandCount++] = "date";
            commandReference = commandCount;
        };

        Shell.prototype.shellTruth = function (args) {
            _StdOut.putText("Daniel Craig is the best James Bond Ever!");

            commandHistory[commandCount++] = "truth";
            commandReference = commandCount;
        };

        Shell.prototype.shellStatus = function (args) {
            USER_STATUS = args;

            _StdOut.putText("Your Current Status is " + USER_STATUS);

            commandHistory[commandCount++] = "status";
            commandReference = commandCount;
        };

        Shell.prototype.shellBSOD = function (args) {
            _StdOut.clearScreen();
            _Canvas.style.backgroundColor = "#1028D9";
            _Canvas.style.color = 'white';
            _StdOut.putText("Blue Screen of Death!");
            _Kernel.krnShutdown();

            commandHistory[commandCount++] = "bsod";
            commandReference = commandCount;
        };

        Shell.prototype.shellLoad = function (args) {
            var program = document.getElementById("taProgramInput");

            var loadedProgram = program.value.toString().replace(/\s/g, '');
            loadedProgram.replace("\n", "");

            var re = new RegExp("^[0-9A-F]+$");

            if (_MemoryManager.memoryFilled()) {
                _StdOut.putText("Program ID: " + PID);

                PCBStart = -1;
                PCBEnd = -1;

                var priority = args[0];

                if (!args[0]) {
                    priority = 0;
                }

                ResidentQueue[PID] = new TSOS.PCB(PCBStart, PCBEnd, PID, priority, "HDD");

                _HDManager.writeSwap(PID, loadedProgram);

                PID++;
            } else {
                if (re.test(loadedProgram)) {
                    _StdOut.putText("Program ID: " + PID);

                    PCBStart = _MemoryManager.getOpenMemory();
                    PCBEnd = PCBStart + 256;

                    for (var i = 0; i < 255; i++) {
                        var hexLoc = i + PCBStart;
                        var hexLocation = hexLoc.toString(16).toUpperCase();
                        var hexValue = loadedProgram.substring(i * 2, (i * 2) + 2).toUpperCase();

                        if (hexValue == "")
                            hexValue = "00";

                        _MemoryManager.setByLoc(hexLocation, hexValue);
                    }

                    _MemoryManager.updateMemory();

                    var priority = args[0];

                    if (!args[0]) {
                        priority = 0;
                    }

                    ResidentQueue[PID] = new TSOS.PCB(PCBStart, PCBEnd, PID, priority, "Memory");

                    PID++;
                } else
                    _StdOut.putText("Program was not successfully Loaded, there is non hex values in the program field");
            }

            commandHistory[commandCount++] = "load";
            commandReference = commandCount;
        };

        Shell.prototype.shellRun = function (args) {
            if (args != "") {
                if (ReadyQueue.length > 0) {
                    for (var i = 0; i < ReadyQueue.length; i++) {
                        ReadyQueue[i + 1] = ReadyQueue[i];
                    }
                }

                var p;

                for (var i = 0; i < ResidentQueue.length; i++) {
                    if (ResidentQueue[i]) {
                        if (ResidentQueue[i].PID == args[0]) {
                            p = i;
                        }
                    }
                }

                if (p || p == 0) {
                    ReadyQueue[0] = ResidentQueue[p];
                    ResidentQueue.splice(p, 1);
                    ReadyQueue[0].State = "Running";
                    ReadyQueue[0].Location = "Memory";

                    if (!_CPU.singleStep) {
                        _CPU.isExecuting = true;
                    }
                } else {
                    _StdOut.putText("Invalid Program ID");
                }
            } else {
                _StdOut.putText("Need a Program ID");
            }

            commandHistory[commandCount++] = "run " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.autoComplete = function (args) {
            var possibleCommands = [];

            for (var i = 0; i < this.commandList.length; i++) {
                var comm = this.commandList[i];
                if (this.startsWith(args, comm.command)) {
                    possibleCommands.push(comm.command);
                }
            }

            if (possibleCommands.length == 1) {
                return possibleCommands[0];
            } else {
                var outputString = "";

                for (var x = 0; x < possibleCommands.length; x++) {
                    outputString += possibleCommands[x] + " ";
                }

                _StdOut.clearLine();
                _StdOut.putText(outputString);
                _StdOut.advanceLine();
                _StdOut.putText(this.promptStr);

                return args;
            }
        };

        Shell.prototype.startsWith = function (buffer, command) {
            var subCommand = command.substring(0, buffer.length);

            return subCommand === buffer;
        };

        Shell.prototype.shellClearMem = function (args) {
            _MemoryManager.resetMemory();
            _MemoryManager.updateMemory();

            commandHistory[commandCount++] = "clearmem";
            commandReference = commandCount;
        };

        Shell.prototype.shellQuantum = function (args) {
            _Quantum = parseInt(args[0]);

            commandHistory[commandCount++] = "quantum " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellPS = function (args) {
            _StdOut.putText("PID PC  IR  ACC  X  Y  Z");
            _StdOut.advanceLine();

            for (var i = 0; i < ReadyQueue.length; i++) {
                var PCB = ReadyQueue[i];
                _StdOut.putText(" " + PCB.PID + "   " + PCB.PC + "  " + PCB.IR + "  " + PCB.Acc + "  " + PCB.X + "  " + PCB.Y + "  " + PCB.Z);
            }

            commandHistory[commandCount++] = "ps";
            commandReference = commandCount;
        };

        Shell.prototype.shellKill = function (args) {
            var loc;

            for (var i = 0; i < ReadyQueue.length; i++) {
                if (ReadyQueue[i].PID.toString() == args[0]) {
                    loc = i;
                }
            }

            if (loc || loc == "0") {
                var start = ReadyQueue[loc].Base;
                _MemoryManager.clearBlock(start);
                ReadyQueue.splice(loc, 1);
            } else {
                _StdOut.putText("PID " + args[0] + " does not exist");
            }

            if (ReadyQueue.length == 0) {
                _CPU.isExecuting = false;
            }

            commandHistory[commandCount++] = "kill";
            commandReference = commandCount;
        };

        Shell.prototype.shellRunAll = function (args) {
            if (Priority) {
                ReadyQueue[0] = ResidentQueue[0];
                ResidentQueue.splice(0, 1);

                while (ResidentQueue.length > 0) {
                    for (var i = 0; i <= ReadyQueue.length; i++) {
                        if (ResidentQueue[0].Priority > ReadyQueue[i].Priority) {
                            var len = ReadyQueue.length;

                            for (var n = i; n < len; n++) {
                                ReadyQueue[n + 1] = ReadyQueue[n];
                            }

                            ReadyQueue[i] = ResidentQueue[0];
                            ResidentQueue.splice(0, 1);

                            break;
                        } else if (i == (ReadyQueue.length - 1)) {
                            ReadyQueue[i + 1] = ResidentQueue[0];
                            ResidentQueue.splice(0, 1);

                            break;
                        }
                    }
                }

                ReadyQueue[0].Status = "Running";
            } else {
                for (var i = 0; i < ResidentQueue.length; i++) {
                    ReadyQueue[i] = ResidentQueue[i];
                }

                ReadyQueue[0].Status = "Running";

                while (ResidentQueue.length > 0) {
                    ResidentQueue.splice(0, 1);
                }
            }

            if (!_CPU.singleStep)
                _CPU.isExecuting = true;

            commandHistory[commandCount++] = "runall";
            commandReference = commandCount;
        };

        Shell.prototype.shellGetSchedule = function (args) {
            _StdOut.putText("Scheduling Algorith: " + scheduling);

            commandHistory[commandCount++] = "getschedule " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellSetSchedule = function (args) {
            if (args[0] == "rr") {
                RR = true;
                FCFS = false;
                Priority = false;
                scheduling = "rr";

                _StdOut.putText("Your Scheduling Algorithm was changed to Round Robin");
            } else if (args[0] == "fcfs") {
                RR = false;
                FCFS = true;
                Priority = false;
                scheduling = "fcfs";

                _StdOut.putText("Your Scheduling Algorithm was changed to First Come First Served");
            } else if (args[0] == "priority") {
                RR = false;
                FCFS = false;
                scheduling = "priority";
                Priority = true;

                _StdOut.putText("Your Scheduling Algorithm was changed to Priority");
            } else {
                _StdOut.putText("You must choose RR, FCFS, or Priority");
            }

            commandHistory[commandCount++] = "setschedule " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellHDFormat = function (args) {
            if (_CPU.isExecuting) {
                _StdOut.putText("Cannot format hard drive since CPU is executing");
            } else {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(FORMAT_IRQ, ""));
            }

            commandHistory[commandCount++] = "format";
            commandReference = commandCount;
        };

        Shell.prototype.shellCreate = function (args) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CREATE_IRQ, args[0]));

            commandHistory[commandCount++] = "create " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellRead = function (args) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(READ_IRQ, args[0]));

            commandHistory[commandCount++] = "read " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellWrite = function (args) {
            var str = args[1];
            for (var i = 2; i < args.length; i++) {
                str = str + " " + args[i];
            }
            var write = args[0] + "%%" + str;

            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(WRITE_IRQ, write));

            commandHistory[commandCount++] = "write " + args[0] + " " + str;
            commandReference = commandCount;
        };

        Shell.prototype.shellDelete = function (args) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DELETE_IRQ, args[0]));

            commandHistory[commandCount++] = "delete " + args[0];
            commandReference = commandCount;
        };

        Shell.prototype.shellLS = function (args) {
            _StdOut.putText("Current Files Are...");

            for (var i = 1; i < fileList.length; i++) {
                _StdOut.putText(fileList[i] + ", ");
            }

            commandHistory[commandCount++] = "delete " + args[0];
            commandReference = commandCount;
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
