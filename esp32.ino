#include <WiFi.h>
#include <HTTPClient.h>

// === CONFIGURAÇÕES DE REDE ===
const char* ssid = "NOME_DA_SUA_REDE";
const char* password = "SENHA_DA_SUA_REDE";

// === URL DO SEU WEB APP (Google Apps Script) ===
// Exemplo: https://script.google.com/macros/s/AKfycbx.../exec
const char* scriptURL = "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec";

// === PINO DO SENSOR / ENTRADA ===
const int sensorPin = 34;  // use um pino analógico, se quiser

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Conecta ao WiFi
  Serial.println("Conectando ao WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Lê o valor do pino
  int valor = analogRead(sensorPin);
  Serial.print("Valor lido: ");
  Serial.println(valor);

  // Monta os dados em JSON
  String json = "{\"sensor\":\"Temperatura\",\"value\":" + String(valor) + ",\"note\":\"Leitura automatica\"}";

  // Envia os dados
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(scriptURL);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(json);

    if (httpResponseCode > 0) {
      Serial.print("Resposta do servidor: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Erro no envio: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("❌ Sem conexão WiFi.");
  }

  delay(10000); // Envia a cada 10 segundos
}
