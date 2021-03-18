# loxone2mystromswitch

[Loxone] extension to integrate [MyStrom Switch] devices. This is a Node.js app
designed to be executed in a small container. This app provides an interface
based on the Loxone **Virtual Input** and **Virtual Output**. For the MyStrom
Switch devices, it will query the status via http based on the interval an
forward any action to the switches. In addition, the current state can be
exported to [MQTT] and/or the [InfluxDB].

[Loxone]: https://www.loxone.com/
[MyStrom Switch]: https://mystrom.ch/wifi-switch/
[MQTT]: https://mqtt.org/
[InfluxDB]: https://www.influxdata.com/

## Installation

The simplest way to start this app is using the published image on [Docker Hub]
and run it right away. Ensure you use an existing `config.json` file.

[Docker Hub]: https://hub.docker.com/r/claudiospizzi/loxone2mystromswitch

```console
docker run [TODO]
```

To have more control over the Docker container, it can be integrated into a
Docker Compose setup. It's recommended to mount the `config.json` file into the
container.

```yaml
services:
  [TODO]
```

To get even more control over the whole app, a dedicated Dockerfile can be used
to create a private Docker image. Check the following sample or the [Dockerfile]
used by this app. In the sample, the `config.json` is copied into the private
image.

[Dockerfile]: https://github.com/claudiospizzi/loxone2mystromswitch/blob/main/Dockerfile

```dockerfile
FROM node:alpine

RUN npm install -g loxone2mystromswitch

COPY config.json /etc/config.json

ENTRYPOINT [ "/usr/local/bin/loxone2mystromswitch", "/etc/config.json" ]
```

Alternatively, the app can be run with Node.js itself. It will load the default
configuration file `config.json` from the current path.

```console
npm install -g loxone2mystromswitch
node /usr/local/bin/loxone2mystromswitch
```

## Configuration

The following configuration file is an example. Please replace the desired
values.

```json
{
}
```

## Interfaces

### Loxone



### MyStrom Switch




### MQTT

The MQTT export uses the ideas described in [mqtt-smarthome] to export the state
of all managed MyStrom Switch devices to MQTT. This interface is only enabled,
if the configuration section `mqtt.enable` is set to `true`.

[mqtt-smarthome]: https://github.com/mqtt-smarthome/mqtt-smarthome

- `mystromswitch/relay/<device>`  
  Value has the current relay state, true or false.
- `mystromswitch/power/<device>`  
  Value has the current power in watt.
- `mystromswitch/temperature/<device>`  
  Value has the current temperature in °C.

The MQTT value is published in JSON. The field `ts` contains the current unix
epoch timestamp in milliseconds.

```json
{
  "ts": 1614534554124,
  "room": "My Room",
  "device": "Example Device",
  "value": "<value>"
}
```

### InfluxDB

The InfluxDB export will publish the state of all managed MyStrom Switches to
the time series database by using the *line protocol*. This interface is only
enabled, if the configuration section `influxdb.enabled` is set to `true`.

- ToDo...
