///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public dateAndTime = new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString();
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWhereAmI,
                                   "whereami",
                                   "<string> - Tells you where you are.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDate,
                "date",
                "<string> - Tells you the date.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellTruth,
                "truth",
                "<string> - Tells you the truth.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Tells you your current status.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellBSOD,
                "bsod",
                "<string> - Gives you the BSOD.");

            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                "load",
                "<string> - Loads the program out of the User Program Input Text Area.");

            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            _StdOut.putText(this.dateAndTime);
            _StdOut.advanceLine();
            this.putPrompt();


        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
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
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
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
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }

//            this.hostLogger("Invalid Command");
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;

//            this.hostLogger("Cursing...");
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }

//            this.hostLogger("We Apologize");
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);

            commandHistory[commandCount++] = "ver";
            commandReference = commandCount;

//            this.hostLogger("ver Called");
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }

            commandHistory[commandCount++] = "help";
            commandReference = commandCount;

//            this.hostLogger("Help Called");
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)

            commandHistory[commandCount++] = "shutdown";
            commandReference = commandCount;

//            this.hostLogger("Shutdown Called");
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();

            commandHistory[commandCount++] = "cls";
            commandReference = commandCount;

//            this.hostLogger("Cls Called");
        }

        public shellMan(args) {
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

//            this.hostLogger("Man Called");
        }

        public shellTrace(args) {
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

//            this.hostLogger("Trace Called");
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }

            commandHistory[commandCount++] = "rot13";
            commandReference = commandCount;

//            this.hostLogger("ROT13 Called");
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }

            commandHistory[commandCount++] = "prompt";
            commandReference = commandCount;

//            this.hostLogger("Prompt Called");
        }

        public shellWhereAmI(args){
             _StdOut.putText(USER_LOCATION);

            commandHistory[commandCount++] = "whereami";
            commandReference = commandCount;

//            this.hostLogger("Where Am I Called");
        }

        public shellDate(args){
            var currDateTime = new Date().toLocaleDateString() + "  " + new Date().toLocaleTimeString();
            _StdOut.putText(currDateTime);

            commandHistory[commandCount++] = "date";
            commandReference = commandCount;

//            this.hostLogger("Date Called");
        }

        public shellTruth(args){
            _StdOut.putText("Daniel Craig is the best James Bond Ever!");

            commandHistory[commandCount++] = "truth";
            commandReference = commandCount;

//            this.hostLogger("Truth Called");
        }

        public shellStatus(args){
            _StdOut.putText("Your Current Status is " + USER_STATUS);

            commandHistory[commandCount++] = "status";
            commandReference = commandCount;

//            this.hostLogger("Status Called");
        }

        public shellBSOD(args){
            _StdOut.clearScreen();
            _Canvas.style.backgroundColor = "blue";
            _Canvas.style.color = 'white';
            _StdOut.putText("Blue Screen of Death!");

//            this.hostLogger("Blue Screen of Death!");
        }

        public shellLoad(args){
//            var program = <HTMLInputElement> document.getElementById("taProgramInput").value;

            program = program.replace(/\s/g, '');

            var re = new RegExp("^[0-9A-F]+$");

            if(re.test(program))
                _StdOut.putText("Program Loaded Successfully");
            else
                _StdOut.putText("Program was not successfully Loaded");

            commandHistory[commandCount++] = "load";
            commandReference = commandCount;

//            this.hostLogger("Load Called");
        }

        public autoComplete(args){
            var possibleCommands = [];

            for(var i=0; i < this.commandList.length; i++){
                var comm = this.commandList[i];
                if(this.startsWith(comm, args)){
                    possibleCommands.push(comm);
                }
            }

            console.log(possibleCommands);

            if(possibleCommands.length == 1){
                return possibleCommands[0];
            }else{
                return "";
            }
        }

        public startsWith(str1, str2){
            var exists = false;

            for(var i=0; i < str1.length; i++){
                if(str1.charAt(i) != str2.charAt(i))
                    exists = false;
            }

            return exists;
        }

        public hostLogger(str){
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
        }


    }
}
