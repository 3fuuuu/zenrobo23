#include <Arduino.h>
#include <WiFi.h>
#include "ESPAsyncWebSrv.h"
#include "SPIFFS.h"

const char ssid[] = "ESP32AP-TEST";
const char pass[] = "12345678";       // パスワードは8文字以上
const IPAddress ip(192,168,123,45);
const IPAddress subnet(255,255,255,0);
AsyncWebServer server(80);            // ポート設定

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

  // サーバースタート
  server.begin();

  Serial.println("Server start!");
}

void loop() {}