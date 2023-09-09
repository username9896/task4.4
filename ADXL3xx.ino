#include <WiFiNINA.h>
#include <PubSubClient.h>
#include <WiFiNINA.h>
#include <WiFiUdp.h>
//#include <NTPClient.h>

// Replace with your network credentials
const char* ssid = "Vicky";
const char* password = "vicky124";

// Replace with your MQTT broker IP address or hostname
const char* mqtt_server = "172.20.10.5";

//const char* ntpServer = "0.pool.ntp.org";

WiFiClient wifiClient;
PubSubClient client(wifiClient);

//WiFiUDP ntpUDP;
//NTPClient timeClient(ntpUDP, ntpServer);

const int xpin = A0; // X-axis of the accelerometer (analog pin A0)
const int ypin = A1; // Y-axis (analog pin A1)
const int zpin = A2; // Z-axis (analog pin A2)

void setup() {
  // Initialize serial communication:
  Serial.begin(9600);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Connect to MQTT broker
  client.setServer(mqtt_server, 1884);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (client.connect("arduino")) {
      Serial.println("Connected to MQTT broker");
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void loop() {
  // Read accelerometer values:
  int xValue = analogRead(xpin);
  int yValue = analogRead(ypin);
  int zValue = analogRead(zpin);

  // Print the sensor values:
  Serial.print("X: ");
  Serial.print(xValue);
  Serial.print("\t");

  Serial.print("Y: ");
  Serial.print(yValue);
  Serial.print("\t");

  Serial.print("Z: ");
  Serial.print(zValue);
  Serial.println();

  client.publish("xvalue: ", String(xValue).c_str());
  client.publish("yvalue: ", String(yValue).c_str());
  client.publish("zvalue: ", String(zValue).c_str());

  // Delay before the next reading:
  delay(1000);
}
