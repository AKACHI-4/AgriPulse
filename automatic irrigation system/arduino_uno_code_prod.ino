#include <Wire.h>
#include <LiquidCrystal_I2C.h>

int soilMoistureValue = 0;
int percentage = 0;

// Initialize the LCD with the I2C address (typically 0x27 or 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH); // Start with the pump off
  Serial.begin(9600);

  // Initialize the LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(2000); // Wait for 2 seconds
  lcd.clear();
}

void loop() {
  soilMoistureValue = analogRead(A1);
  percentage = map(soilMoistureValue, 490, 1023, 100, 0);

  // Display soil moisture percentage on the LCD
  lcd.setCursor(2, 0); 
  lcd.print("Moisture = ");
  lcd.print(percentage);
  lcd.print("%");

  // Control the pump based on soil moisture percentage
  if (percentage < 10) {
      lcd.setCursor(4, 1);
      lcd.print("Pump On ");
      Serial.println("Pump On");
      digitalWrite(13, LOW); // Turn on the pump
  } else if (percentage > 30) {
      lcd.setCursor(4, 1);
      lcd.print("Pump Off");
      Serial.println("Pump Off");
      digitalWrite(13, HIGH); // Turn off the pump
  }

  delay(700);
  lcd.clear();
}