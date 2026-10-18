
See `src/defender/index.html`.
It is an emulation of classic arcade game Defender (1981).

At startup, it loads source code from https://github.com/mwenge/defender
The code gets assembled and the ROMs are filled.

See `src/defender/img/defender-circuit-assembler-fetchcode.svg`.
It is a diagram of the emulated ciruit, with the ROM building process.

I want this diagram to be part of the cabinet.
Add a div with class "circuit" to the cabinet, at the bottom under coinstatus.
Add an svg and embed the svg elements.

The challenge is to finds ways to win vertical space.
There is space available between topbar and stage.
There is space available between stage and bottom of browser window.
If needed, the marquee can be made a little thinner.
The console has some black space available at top and bottom.
The coinstatus div can be thinner.
You can alter the circuit svg elements to make it more vertically compact.

Keep on working until it looks great.
