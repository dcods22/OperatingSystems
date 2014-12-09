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
            //loop for tracks
            for(var i=0; i < 4; i++){

                //loop for sectors
                for(var n=0; n < 8; n++){

                    //loop for blocks
                    for(var m=0; m < 8; m++){

                        var hdString = i + ":" + n + ":" + m;

                        var hdValue = "0000000000000000000000000000000000000000000000000000000000000000";

                        this.setByLoc(hdString, hdValue);
                    }
                }
            }
        }

        public updateHardDrive() : void{
            var hdTable = $("#hdBody");
            hdTable.html("");

            //loop for tracks
            for(var i=0; i < 4; i++){

                //loop for sectors
                for(var n=0; n < 8; n++){

                    //loop for blocks
                    for(var m=0; m < 8; m++){

                        var hdString = i + ":" + n + ":" + m;

                        var hdValue = this.getByLoc(hdString);

                        hdTable.append("<tr id='hd-row-" + hdString +"' /><td class='text-muted'>" + hdString + "</td><td class='text-primary'>" + hdValue.substring(0,1) + " </td><td class='text-success'>" + hdValue.substring(1,2) +":" + hdValue.substring(2,3) + ":" + hdValue.substring(3,4) + " </td><td class='text-warning'>" + hdValue.substring(4) + " </td></tr>");
                    }
                }
            }
        }

        public getByLoc(loc){
            if(loc){
                return sessionStorage.getItem(loc);
            }
        }

        public setByLoc(loc, value) : void{
            if(loc){
                sessionStorage.setItem(loc,value);
            }
        }
    }
}