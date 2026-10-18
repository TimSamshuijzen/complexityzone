
See `src/defender/index.html`.
It is an emulation of classic arcade game Defender (1981).

In the coinstatus div, add "load code" and "reset machine" buttons. Similar to insert coin button, but blue version.
Place them on right side, next to status.

The load code button empties the code, re-fetches the code, reassembles, and fills the roms, and resets the machine.

The reset machine button just resets the machine.

The app now fetches the code on startup.
I want the app to start up in empty state, with no code fetched.

Add overlay div "loadcode" to screen, and show it when code is empty.
The loadcode overlay has a button for fetching the code.
When pressed, the code is fetched.

