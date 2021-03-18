import { InfluxDB } from 'influx';
import { SmartHomeDevice } from './SmartHomeDevice';

/**
 * Connection options for an InfluxDB.
 */
export type InfluxDbOption = {
  host: string;
  port: number;
  database: string;
};

/**
 * Class representing a InfluxDB.
 */
export class InfluxDb extends SmartHomeDevice {
  private client?: InfluxDB;
  public initialized: boolean = false;

  /**
   * InfluxDB port.
   */
  public port: number;

  /**
   * InfluxDB database.
   */
  public database: string;

  /**
   * Create a new InfluxDB.
   * @param option Connection option.
   */
  constructor(option: InfluxDbOption) {
    super('InfluxDb', option.host);

    this.port = option.port;
    this.database = option.database;
  }

  /**
   * Initialize the InfluxDB.
   */
  initialize() {
    if (!this.initialized) {
      try {
        this.client = new InfluxDB({
          host: this.address,
          port: this.port,
          database: this.database
        });
        this.client
          .ping(5000)
          .then((hosts) => {
            if (hosts.length >= 1 && hosts[0].online) {
              this.emitConnect();
            } else {
              this.emitDisconnect();
            }
          })
          .catch((error) => {
            this.emitError(error);
          });
        this.initialized = true;
      } catch (error) {
        this.emitError(error);
      }
    }
  }

  /**
   * Write a InfluxDB measurement.
   * @param device The smart home device.
   * @param measurement The InfluxDB measurement.
   * @param field The value field.
   * @param value The value itself.
   */
  writeMeasurement(device: SmartHomeDevice, measurement: string, field: string, value: string) {
    if (this.initialized && this.client !== undefined) {
      this.client?.writeMeasurement(measurement, [
        {
          fields: {
            [field]: value
          },
          tags: {
            name: device.name,
            location: `${device.location}`,
            description: `${device.description}`
          }
        }
      ]);
    } else {
      this.emitWarning('InfluxDB not initialized, unable to write measurement.');
    }
  }
}
