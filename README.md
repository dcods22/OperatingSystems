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

- [ ] Modify	the	load	command	to	copy	the	6502a	machine	language	op	codes into	main	memory.
    - [x] Put	the	code	at	location	$0000	in	memory
    - [x] assign	a	Process	ID	(PID)
    - [] create	a	Process	Control	Block	(PCB)
    - [x] return	the	PID	to	the	console.

- [ ] Add	a	shell	command,	run	<pid>,	to	run	a	program	already	in	memory.

- [ ] Update	and	display	the	PCB	contents	at	the	end	of	execution.

- [x] Implement	line-wrap	in	the	CLI.	(This	is	not	longer	optional.)

- [ ] Optional:	Provide	the	ability	to	single-step	execution.

- [ ] Develop	a	PCB	prototype	and	implement	it	in	the	client	OS.
- [ ] Develop	a	memory	manager	and	implement	it	in	the	client	OS.
- [ ] Develop	a	core	memory	prototype	and	implement	it	in	the	host	OS.
- [ ] Develop	a	CPU	prototype	and	implement	it	in	the	host	OS.