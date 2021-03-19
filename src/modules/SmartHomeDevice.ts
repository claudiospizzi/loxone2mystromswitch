import { EventEmitter } from 'events';
import { Logger } from 'tslog';

/**
 * Arguments of a connect event.
 */
export type ConnectArgs = {
  source: SmartHomeDevice;
};

/**
 * Arguments of a disconnect event.
 */
export type DisconnectArgs = {
  source: SmartHomeDevice;
};

/**
 * Arguments of a warning event.
 */
export type WarningArgs = {
  source: SmartHomeDevice;
  warning: string;
};

/**
 * Arguments of an error event.
 */
export type ErrorArgs = {
  source: SmartHomeDevice;
  error: Error;
};

/**
 * Arguments of a property update event.
 */
export type UpdateArgs = {
  source: SmartHomeDevice;
  propertyName: string;
  propertyValue: string | number | boolean | undefined;
};

/**
 * Base class for a smart home device.
 */
export abstract class SmartHomeDevice extends EventEmitter {
  protected log: Logger;

  /**
   * IP address or hostname of the device.
   */
  public address: string;

  /**
   * The identifier for the device. If not specified, the address is used.
   */
  public name: string;

  /**
   * Location or room of the device within the smart home.
   */
  public location: string;

  /**
   * Optional device description.
   */
  public description: string;

  /**
   * Create a smart home device object.
   * @param loggerName The logger name.
   */
  constructor(type: string, address: string, name?: string, location?: string, description?: string) {
    super();

    this.address = address;
    this.name = name !== undefined ? name : address;
    this.location = `${location}`;
    this.description = `${description}`;

    this.log = new Logger({ prefix: [type, address], ignoreStackLevels: 4 });
  }

  /**
   * Emit a connect event.
   */
  protected emitConnect() {
    const args: ConnectArgs = {
      source: this
    };
    this.emit('connect', args);
    this.log.debug(`Connect to ${this.address}`);
  }

  /**
   * Emit a disconnect event.
   */
  protected emitDisconnect() {
    const args: DisconnectArgs = {
      source: this
    };
    this.emit('disconnect', args);
    this.log.debug(`Disconnect from ${this.address}`);
  }

  /**
   * Emit a warning event.
   * @param warning The warning message.
   */
  protected emitWarning(warning: string) {
    const args: WarningArgs = {
      source: this,
      warning: warning
    };
    this.emit('warning', args);
    this.log.warn(warning);
  }

  /**
   * Emit an error event.
   * @param error The error object.
   */
  protected emitError(error: Error) {
    const args: ErrorArgs = {
      source: this,
      error: error
    };
    this.emit('error', args);
    this.log.error(error);
  }

  /**
   * Emit a property update event.
   * @param source The source smart home device.
   * @param propertyName The updated property name.
   * @param propertyValue The updated property value.
   */
  protected emitUpdate(propertyName: string, propertyValue: string | number | boolean | undefined) {
    const args: UpdateArgs = {
      source: this,
      propertyName: propertyName,
      propertyValue: propertyValue
    };
    this.emit('update', args);
    this.log.info(`Update ${propertyName} = ${propertyValue}`);
  }
}
