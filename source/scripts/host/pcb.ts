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

export class PCB {

    constructor(public PCBStart: number,
                public PCBEnd: number,
                public PID: number,
                public PC: number = 0,
                public Acc: number = 0,
                public X: number = 0,
                public Y: number = 0,
                public Z: number = 0,
                public State: String = "Waiting",
                public Priority: number = 0,
                public Location: String ="Memory"){}
}
}