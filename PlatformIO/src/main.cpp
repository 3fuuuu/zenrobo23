#include <Arduino.h>
#include <WiFi.h>
#include "ESPAsyncWebSrv.h"
#include "SPIFFS.h"
#include <ArduinoJson.h>

const char ssid[] = "ESP32AP-TEST";
const char pass[] = "12345678";       // パスワードは8文字以上
const IPAddress ip(192,168,123,45);
const IPAddress subnet(255,255,255,0);
AsyncWebServer server(80);            // ポート設定

const int L_PWM = 0;
const int L_DIR = 0;
const int R_PWM = 0;
const int R_DIR = 0;


void executeCommands(JsonArrayConst commands) {
  Serial.println("Sequence Received ");

  int index = 0;
  for (JsonObjectConst cmd : commands) {
    const char* type = cmd["type"] | "";

    Serial.print("#");
    Serial.print(index++);
    Serial.print(" TYPE=");
    Serial.println(type);

    if (strcmp(type, "MOVE") == 0) {
      float x = cmd["x"] | 0;
      float y = cmd["y"] | 0;

      Serial.print("  Move to X=");
      Serial.print(x);
      Serial.print(" Y=");
      Serial.println(y);
    }
    else if (strcmp(type, "WAIT") == 0) {
      int ms = cmd["ms"] | 0;

      Serial.print("  Wait ");
      Serial.print(ms);
      Serial.println(" ms");

      delay(ms);
    }
  }

  Serial.println("Sequence End");
}

void setup()
{
  Serial.begin(115200);

  // SPIFFSのセットアップ
  if(!SPIFFS.begin(true)){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }
  
  WiFi.softAP(ssid, pass);           // SSIDとパスの設定
  delay(100);                        // このdelayを入れないと失敗する場合がある
  WiFi.softAPConfig(ip, ip, subnet); // IPアドレス、ゲートウェイ、サブネットマスクの設定
  
  IPAddress myIP = WiFi.softAPIP();  // WiFi.softAPIP()でWiFi起動

  // 各種情報を表示
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("AP IP address: ");
  Serial.println(myIP);

  // GETリクエストに対するハンドラーを登録
  // rootにアクセスされた時のレスポンス
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html");
  });
  // style.cssにアクセスされた時のレスポンス
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/style.css", "text/css");
  });

  server.on(
    "/command",
    HTTP_POST,
    [](AsyncWebServerRequest *request){
      Serial.println(">>> HTTP POST /command");
      request->send(200, "text/plain", "OK");
    },
    NULL,
    [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t, size_t) {

      Serial.println(">>> JSON RECEIVED");
      Serial.print("Length: ");
      Serial.println(len);

      StaticJsonDocument<2048> doc;
      DeserializationError err = deserializeJson(doc, data, len);

      if (err) {
        Serial.print("JSON parse failed: ");
        Serial.println(err.c_str());
        return;
      }

      Serial.println("--- RAW JSON ---");
      serializeJsonPretty(doc, Serial);
      Serial.println();
      Serial.println("----------------");

      JsonArray commands = doc["commands"];
      executeCommands(commands);
    }
  );
  
  // サーバースタート
  server.begin();

  Serial.println("Server start!");
}

void loop() {}