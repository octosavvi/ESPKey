### What the heck is this anyway?
ESPKey is a small device which can be implanted into facility access control systems.  ESPKey is compatible with pretty much every door that requires a card swipe or tap with optional pin code to unlock.  It even works on many systems requiring finger print or other biometric authentication.  Inserting an ESPKey behind a card reader is better than a skimmer because not only can it log all authorized use of a system, it can also inject or replay captured credentials.  Once ESPKey shows you what credentials work on this door, use your favorite RFID tools to clone or simulate those credentials for use on other doors.  Want to show someone how insecure their facility is?  This is an incredibly easy way to start.

In case you need a simple access control system to play with, ESPKey can do that too.  All you need is a card reader, ESPKey and some device to be controlled (like a door lock, electric strike, magnetic lock or just an indicator light).  ESPKey replaces the giant door controller, allowing you to build a simple mobile test lab.  Or a great little portable RFID credential sponge, ready to be hand carried or installed in any heavily trafficked area.

### Releases
Have a look [over here](https://github.com/octosavvi/ESPKey/releases/latest) for the latest pre-built firmware and UI release.

### Build instructions
1. [Install PlatformIO Core](http://docs.platformio.org/page/core.html)
2.  Run these commands:

```shell
# Change to working directory
$ cd <path-to-workingdir>

# Build project
$ pio run

# Upload firmware
$ pio run --target upload

# Build specific environment
$ pio run -e esp12

# Upload firmware for the specific environment
$ pio run -e esp12 --target upload

# Clean build files
$ pio run --target clean
```

3. Launch html_src/publish.sh to generate ui-update.sh. When connected to ESPKey's web server, launch ui-update.sh to upload the files that make the web UI.

### Usage
Check out [this great documentation](https://redteamtools.com/espkey) put together by Babak of Red Team Tools.

### Hardware
Hardware can be [purchased](https://redteamtools.com/espkey) or have a look in the [hardware](hardware/) directory if you want to build your own.
