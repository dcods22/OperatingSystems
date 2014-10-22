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

- [ ] Add a shell command, runall, to execute all the programs at once.

- [x] Add a shell command, quantum <int>, to let the user set the Round Robin quantum (measured in clock ticks).

- [ ] Display the Ready queue and its (PCB) contents (including process state) in real time.

- [ ] Add a shell command, ps, to display the PIDs of all active processes. Add a shell command, kill <pid>, to kill an active process.

- [ ] Store multiple programs in memory, each in their own partition, allocated by the client OS (which obviously needs to keep track of available and used partitions).

- [ ] Add base and limit registers to your core memory access code in the host OS and to your PCB object in the client OS.

- [ ] Enforce memory partition boundaries at all times.

- [ ] Create a Resident list for the loaded processes.

- [ ] Create a Ready queue for the running processes.

- [ ] Instantiate a PCB for each loaded program and put it in the Resident list.

- [ ] Develop a CPU scheduler in the client OS using Round Robin scheduling with the user-speciVied quantum measured in clock ticks (default = 6).
    - [ ] Make the client OS control the host CPU with the client OS CPU scheduler.
    - [ ] Log all scheduling events.

- [ ] Implement context switches with software interrupts. Be sure to update the mode bit (if appropriate), the PCBs, and the Ready queue.

- [ ] Detect and gracefully handle errors like invalid op codes, missing operands (if you can detect that), and most importantly, memory out of bounds access attempts.