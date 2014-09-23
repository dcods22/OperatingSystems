///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
            this.currentXPosition = 0;
            this.currentYPosition = 13;
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
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
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.

                var words = text.split(" ");

                if(words.length > 1){
                    for(var i=0; i < words.length; i++){

                        var word = words[i] + " ";

                        var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, word);

                        if((this.currentXPosition + textOffset) > _Canvas.width){
                            this.advanceLine();
                        }

                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, word);
                        // Move the current X position.

                        this.currentXPosition = this.currentXPosition + textOffset;
                    }
                }else{
                    var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, words[0]);

                    if((this.currentXPosition + textOffset) > _Canvas.width){
                        this.advanceLine();
                    }

                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, words[0]);
                    // Move the current X position.

                    this.currentXPosition = this.currentXPosition + textOffset;
                }
            }
         }

        public deleteText(): void{
            //move the x position back
            if(this.currentXPosition > 12.48){
                var textOffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.substring(this.buffer.length -1, this.buffer.length));

                this.currentXPosition -= textOffset;

                //redraw over the existing text
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, textOffset + 1, 18);

                this.buffer = this.buffer.substring(0, this.buffer.length -1);
            }
        }

        public clearLine(): void{
            _DrawingContext.clearRect(this.currentFontSize, this.currentYPosition - this.currentFontSize, this.currentXPosition, 18);
            this.currentXPosition = this.currentFontSize;
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)
            // Handle scrolling, if necessary
            if (this.currentYPosition >= _Canvas.height) {
                var oldCanvas = _DrawingContext.getImageData(0, this.currentFontSize + 5, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(oldCanvas, 0, 0);
                this.currentYPosition = _Canvas.height - this.currentFontSize;
            }
        }

        public commandUp(): void{
            if(commandReference > 0){
                var sc = commandHistory[--commandReference];
                this.clearLine();
                this.putText(sc);
                this.buffer = sc;
            }else{
                var sc = commandHistory[commandReference];
                this.clearLine();
                this.putText(sc);
            }
        }

        public commandDown(): void{
            if(commandReference >= 0 && commandReference < commandHistory.length - 1){
                var sc = commandHistory[++commandReference];
                this.clearLine();
                this.putText(sc);
                this.buffer = sc;
            }
        }

        public autoComplete(): void{
            var command = _OsShell.autoComplete(this.buffer);

            if(command){
                this.clearLine();
                this.putText(command);
                this.buffer = command;
            }
        }
    }
 }
