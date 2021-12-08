Hello!
All indices start at 0 here.
There are 327 objects, but the first 29 don't have descriptions because they are units (e.g. kilometer)


****** Language files format (e.g. l0.txt) ******

The first 596 lines (298 pairs) denote the 298 objects' names, alternating between the name and its description (written by 14-year-old me, cringe)
The first line starts with "tx=", that was just due to how Flash loaded the file: you can ignore it.

Lines 596-601 denote units of scale and their plurals.
Lines 602-618 denote prefixes and suffixes that denote orders of magnitude (e.g. kilo-, mega-, etc.)

I should convert all this to JSON data at some point so it's more flexible, but I don't envision adding new objects in the near future.
(If I do, it'd probably go into a full-fledged SOTU 3.)




****** Sizes ******

Each line corresponds to one object from the .FLA.
In other words, Object #73 in the FLA has the size listed on line #73 of sizes.txt.
Object n's corresponding language text is on lines (n-29)*2 and (n-29)*2+1.
The -29 is because the first 29 objects are the unit-rings (e.g. kilometer), which do not have descriptions.

Each line has 4 comma-separated values.
The first number is the exponent,
the second: coefficient,
the third is how big it should be before it disappears. (not needed if you're smart about object appearance / deletion)
the fourth is the ratio between the drawn size and the real-life size (almost always 1, explanation below.)




****** EXAMPLE 1 ******
Object 41?

The title for Object 41 is on language text line (41-29)*2 = 24.     It's 'Earth'.
The description for Object 41 is on language text line (41-29)*2 = 25.

Line 41 is "7,1.27,1,1".     (using indices that start at 0)
The 41st object in the .FLA is Earth.
That means Earth's size, 
10^7 * 1.27 meters.

The first 1 means that when Earth's perceived size gets above the standard threshold (perhaps 1,000 pixels), it is no longer drawn.
The second 1 means that Earth's size really is 10^7 * 1.27 meters.






****** EXAMPLE 2 ******
Object 42?

The title for Object 42 is on language text line (42-29)*2 = 26.    It's 'Deneb'.
The description for Object 42 is on language text line (42-29)*2 = 27.

Many objects, like Object 42 = Deneb, have size descriptions like "11,3.1,0.86,1"
Deneb is 10^11 * 3.1 meters across.
The third number (0.86) means that we must draw Deneb even when our zoom is 0.86 times the typical point at which we don't
draw Deneb anymore. This is slightly more zoomed in (camera width is 0.86 of typical). This is because Deneb's glow extends
quite close to the center of the screen.



****** EXAMPLE 3 ******
Object 230?

The title for Object 230 is on language text line (230-29)*2 = 402.    It's "Gamma Ray Wavelength"
The description for Object 230 is on language text line (230-29)*2 = 403.

Object 230 = Gamma Ray Wavelength
"-12,1,1,2"
The size is 10^12 * 1 meters.
Everything's pretty standard except for the fourth number, 2.
What does the 2 mean?
The gamma ray image is drawn to be twice as large as 10^12 * 1 meters.
It's drawn as 2 picometers when one cycle of a gamma ray is 1 picometer.
That's because the image I drew of a gamma ray has 2 cycles in it.
You can see why this quirk only really happens with wavelengths!