Assignment 1
============

- [x] Alter the	ver	command	to	display	your	own	data.
- [x] Add some	new	shell	commands:
     - [x] date -	displays	the	current	date	and	time
     - [x] whereami	-	displays	the	users	current	location	(use	your	imagination)
     - [x] something	else	interesting	and	creative;	surprise	me

- [x] Enhance	the host	display	with	a	graphic	task	bar	that	displays
     - [x] the current	date	and	time
     - [x] status messages	as	specified	by	the	user	with	a	new	shell command: status	<string>

- [x] Implement scrolling	in	the	client	OS	console/CLI.

- [x] Other console/CLI	enhancements:
     - [x] Accept and	display	punctuation	characters	and	symbols.
     - [x] Handle backspace	appropriately.
     - [x] Implement command	completion	with	the	tab	key.
     - [x] Provide command	history	recall	via	the	up	and	down	arrow	keys.

- [x] Display a BSOD	message	(on	the	CLI)	when	the	kernel	traps	an OS error.
     - [x] Add a shell	command	to	test	this.	Remember	to	include	it in the help.
- [x] Add a	shell	command	called	load	to	validate	the	user	code in the HTML5 text	area	(id=	“taProgramInput”).	Only	hex	digits	and	spaces	are	valid.
- [x] [optional]	Implement	line-wrap	in	the	CLI.

Assignment 2
============

- [x] Modify	the	load	command	to	copy	the	6502a	machine	language	op	codes into	main	memory.
    - [x] Put	the	code	at	location	$0000	in	memory
    - [x] assign	a	Process	ID	(PID)
    - [x] create	a	Process	Control	Block	(PCB)
    - [x] return	the	PID	to	the	console.

- [x] Add	a	shell	command,	run	<pid>,	to	run	a	program	already	in	memory.

- [x] Update	and	display	the	PCB	contents	at	the	end	of	execution.

- [x] Implement	line-wrap	in	the	CLI.	(This	is	not	longer	optional.)

- [x] Optional:	Provide	the	ability	to	single-step	execution.

- [x] Develop	a	PCB	prototype	and	implement	it	in	the	client	OS.
- [x] Develop	a	memory	manager	and	implement	it	in	the	client	OS.
- [x] Develop	a	core	memory	prototype	and	implement	it	in	the	host	OS.
- [x] Develop	a	CPU	prototype	and	implement	it	in	the	host	OS.

Assignment 3
============

- [x] Add a shell command, clearmem, to clear all memory partitions.

- [x] Allow the user to load three programs into memory at once.

- [x] Add a shell command, runall, to execute all the programs at once.

- [x] Add a shell command, quantum <int>, to let the user set the Round Robin quantum (measured in clock ticks).

- [x] Display the Ready queue and its (PCB) contents (including process state) in real time.

- [x] Add a shell command, ps, to display the PIDs of all active processes. Add a shell command, kill <pid>, to kill an active process.

- [x] Store multiple programs in memory, each in their own partition, allocated by the client OS (which obviously needs to keep track of available and used partitions).

- [x] Add base and limit registers to your core memory access code in the host OS and to your PCB object in the client OS.

- [x] Enforce memory partition boundaries at all times.

- [x] Create a Resident list for the loaded processes.

- [x] Create a Ready queue for the running processes.

- [x] Instantiate a PCB for each loaded program and put it in the Resident list.

- [x] Develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specivied quantum measured in clock ticks (default = 6).
    - [x] Make the client OS control the host CPU with the client OS CPU scheduler.
    - [x] Log all scheduling events.

- [x] Implement context switches with software interrupts. Be sure to update the mode bit (if appropriate), the PCBs, and the Ready queue.

- [x] Detect and gracefully handle errors like invalid op codes, missing operands (if you can detect that), and most importantly, memory out of bounds access attempts.


Assignment 4
============

Add shell commands for the following disk operations:
- [ ] create <filename> — Create the File filename and display a message denoting success or failure.
- [ ] read <filename> — Read and display the contents of filename or display an error if something went wrong.
- [ ] write <filename> “data” — Write the data inside the quotes to filename and display a message denoting success or failure.
- [ ] delete <filename> — Remove filename from storage and display a message denoting success or failure.
- [ ] format — Initialize all blocks in all sectors in all tracks and display a message denoting success or failure.

- [ ] Add a shell command, ls, to list the Files currently stored on the disk.
- [x] Add a shell command to allow the user to select a CPU scheduling algorithm — setschedule [rr, fcfs, priority]
- [x] Add a shell command, getschedule, to return the currently selected cpu scheduling algorithm.

- [ ] Implement a File system in HTML5 web storage as discussed in class.
- [x] Include a File system viewer in your OS interface.

- [ ] Develop a File System Device Driver (fsDD) for all of the functional requirements noted above.
- [ ] Load the fsDD in a similar manner as the keyboard device driver.
- [ ] Develop your fsDD to insulate and encapsulate the implementation of the kernel-level I/O operations (noted above) from the byte-level details of your individual blocks on the local storage.

Add new scheduling algorithms to your CPU scheduler:
- [x] Default to RR. First-come, First-served (FCFS)
- [x] non-preemptive priority (You will need an optional load parameter here.)

- [ ] Implement swapped virtual memory with enough physical memory for three concurrent user processes.

- [ ] Allow the OS to execute four concurrent user process by writing roll-out and roll-in routines to . . .
    - [ ] Take a ready process and store it to the disk via your fsDD.
    - [ ] Load a swapped-out process and place it in the ready queue.
    - [ ] Your ready queue should denote which processes are where.