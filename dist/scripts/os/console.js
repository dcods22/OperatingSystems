///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
            this.currentXPosition = 0;
            this.currentYPosition = 13;
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);

                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text != "") {
                // Draw the text at the current X and Y coordinates.
                var words = text.split(" ");

                if (words.length > 1) {
                    for (var i = 0; i < words.length; i++) {
                        var word = words[i] + " ";

                        var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, word);

                        if ((this.currentXPosition + textOffset) > _Canvas.width) {
                            this.advanceLine();
                        }

                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, word);

                        // Move the current X position.
                        this.currentXPosition = this.currentXPosition + textOffset;
                    }
                } else {
                    var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, words[0]);

                    if ((this.currentXPosition + textOffset) > _Canvas.width) {
                        this.advanceLine();
                    }

                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, words[0]);

                    // Move the current X position.
                    this.currentXPosition = this.currentXPosition + textOffset;
                }
            }
        };

        Console.prototype.deleteText = function () {
            if (this.buffer.length > 0 && (this.currentXPosition <= 0)) {
                this.currentXPosition = _Canvas.width;
                this.currentYPosition -= (this.currentFontSize + 4);
            }

            var lastChar = this.buffer.substring(this.buffer.length - 1, this.buffer.length);

            var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);

            this.currentXPosition -= textOffset;

            //redraw over the existing text
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, textOffset + 1, 18);

            this.buffer = this.buffer.substring(0, this.buffer.length - 1);
        };

        Console.prototype.clearLine = function () {
            _DrawingContext.clearRect(this.currentFontSize, this.currentYPosition - this.currentFontSize, this.currentXPosition, 18);
            this.currentXPosition = this.currentFontSize;
        };

        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _FontHeightMargin;

            // TODO: Handle scrolling. (Project 1)
            // Handle scrolling, if necessary
            if (this.currentYPosition >= _Canvas.height) {
                var oldCanvas = _DrawingContext.getImageData(0, this.currentFontSize + 5, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(oldCanvas, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        };

        Console.prototype.commandUp = function () {
            if (commandReference > 0) {
                var sc = commandHistory[--commandReference];
                this.clearLine();
                this.putText(sc);
                this.buffer = sc;
            } else {
                var sc = commandHistory[commandReference];
                this.clearLine();
                this.putText(sc);
            }
        };

        Console.prototype.commandDown = function () {
            if (commandReference >= 0 && commandReference < commandHistory.length - 1) {
                var sc = commandHistory[++commandReference];
                this.clearLine();
                this.putText(sc);
                this.buffer = sc;
            }
        };

        Console.prototype.autoComplete = function () {
            var command = _OsShell.autoComplete(this.buffer);

            if (command) {
                this.clearLine();
                this.putText(command);
                this.buffer = command;
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
