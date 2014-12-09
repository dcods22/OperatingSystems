///<reference path="../globals.ts" />

/* ------------
 memory.ts

 Requires global.ts.

 Routines for the host CPU simulation, NOT for the OS itself.
 In this manner, it's A LITTLE BIT like a hypervisor,
 in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
 that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
 TypeScript/JavaScript in both the host and client environments.

 This code references page numbers in the text book:
 Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
 ------------ */

///<reference path='../jquery.d.ts' />

module TSOS {

    export class HardDrive {

        constructor() {
            this.initalizeHardDrive();
        }

        private initalizeHardDrive() : void{
            this.resetHardDrive();
            this.updateHardDrive();
        }

        public resetHardDrive() : void{
            var hdStr = "";
            var empty = "0000000000000000000000000000000000000000000000000000000000000000"

            for(var m=0; m < 4; m++){
                for(var i=0; i < 8; i++){
                    for(var n=0; n < 8; n++){
                        hdStr = m + ":" + i + ":" + n;
                        this.setByLoc(hdStr, empty);
                    }
                }
            }
        }

        public updateHardDrive() : void{
            var hdStr = "";
            var hex = "";

            var memoryTable = $("#hdTable");

            memoryTable.html("");

            for(var m=0; m < 4; m++){
                for(var i=0; i < 8; i++){
                    for(var n=0; n < 8; n++){
                        hdStr = m + ":" + i + ":" + n;
                        hex = this.getByLoc(hdStr);
                        memoryTable.append("<tr><td class='text-muted'>" + hdStr + "</td><td class='text-warning'>" + hex.substring(0,1) + "</td><td class='text-success'>" + hex.substring(1,4) + "</td><td class='text-primary'>" + hex.substring(4) + "</td></tr>")
                    }
                }
            }
        }

        public getByLoc(loc){
            return sessionStorage.getItem(loc);
        }

        public setByLoc(loc, value) : void{
            sessionStorage.setItem(loc, value);
        }
    }
}