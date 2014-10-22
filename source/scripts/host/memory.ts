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

export class Memory {

    constructor(public memory = []) {
        this.initalizeMemory();
    }

    private initalizeMemory() : void{
        this.resetMemory();

        var memoryTable = $("#memoryTable");
        memoryTable.html("");

        for(var i=0; i < 96; i++){

            memoryTable.append("<tr id='memory-row-" + i + "'>");

            var memoryRow = $("#memory-row-" + i);

            var hexInt = i * 8;

            var hexIntString = hexInt.toString(16);
            if(hexIntString.length < 2){
                hexIntString = "00" + hexIntString;
            }else if(hexIntString.length < 3){
                hexIntString = "0" + hexIntString;
            }

            memoryRow.append("<td class='memoryData'>0x" + hexIntString.toUpperCase() + "</td>");

            for(var x=0; x < 8; x++){
                var memoryLocation = (x + hexInt);
                memoryRow.append("<td id='memory-label-" + memoryLocation +"' class='memoryData'>" + this.memory[memoryLocation.toString(16)].toUpperCase() + "</td>");
            }

            memoryTable.append("</tr>");
        }
    }

    public resetMemory() : void{
        for(var i=0; i < 768; i++){
            var hexValue = i.toString(16);
            this.memory[hexValue] = "00";
        }
    }

    public updateMemory() : void{
        var memoryTable = $("#memoryTable");

        for(var i=0; i < 768; i++){
            memoryTable.find("#memory-label-" + i).html(this.memory[i.toString(16)].toUpperCase());
        }
    }

    public getByLoc(loc){
        return this.memory[loc];
    }

    public setByLoc(loc, value) : void{
        this.memory[loc] = value
    }
}
}