import { SmartHomeDevice } from './SmartHomeDevice';
import mqtt, { MqttClient } from 'mqtt';

/**
 * Connection options for a MQTT Broker.
 */
export type MqttBrokerOption = {
  host: string;
  port: number;
  topic: string;
};

/**
 * Class representing a MQTT Broker.
 */
export class MqttBroker extends SmartHomeDevice {
  private client?: MqttClient;
  private initialized: boolean = false;

  /**
   * MQTT Broker url.
   */
  public url: string;

  /**
   * Topic prefix for MQTT messages.
   */
  public topic: string;

  /**
   * Create a new MQTT Broker.
   * @param option Connection option.
   */
  constructor(option: MqttBrokerOption) {
    super('MqttBroker', option.host);

    this.url = `mqtt://${this.address}:${option.port}`;
    this.topic = option.topic;
  }

  /**
   * Initialize the MQTT Broker.
   */
  initialize() {
    if (!this.initialized) {
      try {
        this.client = mqtt.connect(this.url, {
          will: {
            topic: `${this.topic}/connected`,
            payload: '0',
            retain: true,
            qos: 2
          }
        });
        this.client.on('connect', () => {
          this.client?.publish(`${this.topic}/connected`, '2', { retain: true, qos: 2 });
          this.emitConnect();
        });
        this.client.on('close', () => {
          this.emitDisconnect();
        });
        this.client.on('error', (error) => {
          this.emitError(error);
        });
        this.initialized = true;
      } catch (error) {
        this.emitError(error);
      }
    }
  }

  /**
   * Publish a MQTT message.
   * @param device The smart home device.
   * @param measure The measure to publish.
   * @param value The value to publish.
   * @param retain Option to control the MQTT message retain.
   */
  publishMessage(device: SmartHomeDevice, measure: string, value: string, retain: boolean = false) {
    if (this.initialized && this.client !== undefined) {
      const stringValue = JSON.stringify({
        ts: Date.now(),
        val: value,
        loc: device.location,
        desc: device.description
      });
      this.client.publish(`${this.topic}/${measure}/${device.name}`, stringValue, { retain: retain, qos: 2 });
    } else {
      this.emitWarning('MQTT Broker not initialized, unable to publish message.');
    }
  }
}
