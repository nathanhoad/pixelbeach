# Pixel Beach

## Aseperite export

eg.

`ase -b --split-layers --list-layers --list-tags surfer.ase --sheet surfer.png --data surfer.json`

## Exporting multi tiff for DMG background

https://developer.apple.com/library/content/documentation/GraphicsAnimation/Conceptual/HighResolutionOSX/Optimizing/Optimizing.html#//apple_ref/doc/uid/TP40012302-CH7-SW13

eg.

`tiffutil -cathidpicheck ./build/dmg-background.png ./build/dmg-background@2x.png -out ./build/dmg-background.tiff`

## Build with signing cert

eg.

Export the certs to the `build` dir: [https://www.electron.build/code-signing](https://www.electron.build/code-signing)

`CSC_LINK=./build/certificates.p12 CSC_KEY_PASSWORD=<PASSWORD> npm run dist -- -m`
