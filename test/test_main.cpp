#include <Arduino.h>
#include <unity.h>

#include "pin_config.h"

// void setUp(void) {
// // set stuff up here
// }

// void tearDown(void) {
// // clean stuff up here
// }

void test_assert_sense(uint8_t assert, uint8_t sense, uint8_t val) {
    digitalWrite(assert, val);
    delay(100); // leave some time for capacitors to charge/discharge
    /* ouptput HIGH on the gate forces LOW on drain*/
    TEST_ASSERT_EQUAL( (val == HIGH ) ? LOW : HIGH, digitalRead(sense));
}

void test_D0_HIGH() {
    test_assert_sense(D0_ASSERT, D0_SENSE, HIGH);
}

void test_D0_LOW() {
    test_assert_sense(D0_ASSERT, D0_SENSE, LOW);
}

void test_D1_HIGH() {
    test_assert_sense(D1_ASSERT, D1_SENSE, HIGH);
}

void test_D1_LOW() {
    test_assert_sense(D1_ASSERT, D1_SENSE, LOW);
}

void test_LED_HIGH() {
    test_assert_sense(LED_ASSERT, LED_SENSE, HIGH);
}

void test_LED_LOW() {
    test_assert_sense(LED_ASSERT, LED_SENSE, LOW);
}

void setup() {
    // NOTE!!! Wait for >2 secs
    // if board doesn't support software reset via Serial.DTR/RTS
    delay(2000);

    UNITY_BEGIN();    // IMPORTANT LINE!

    pinMode(D0_ASSERT, OUTPUT);
    pinMode(D1_ASSERT, OUTPUT);
    pinMode(LED_ASSERT, OUTPUT);

    digitalWrite(D0_ASSERT, LOW);
    digitalWrite(D1_ASSERT, LOW);
    digitalWrite(LED_ASSERT, LOW);
    
    pinMode(D0_SENSE, INPUT);
    pinMode(D1_SENSE, INPUT);
    pinMode(LED_SENSE, INPUT);

    Serial.println("Please connect 5V to D0, D1 and LED to test hardware");
}

uint8_t i = 0;
uint8_t max_loops = 5;
uint32_t test_delay=0;

void loop() {
    
    if (i < max_loops)
    {

        RUN_TEST(test_D0_HIGH);
        delay(test_delay) ;

        RUN_TEST(test_D0_LOW);
        delay(test_delay) ;

        RUN_TEST(test_D1_HIGH);
        delay(test_delay) ;

        RUN_TEST(test_D1_LOW);
        delay(test_delay) ;

        RUN_TEST(test_LED_HIGH);
        delay(test_delay) ;

        RUN_TEST(test_LED_LOW);
        delay(test_delay) ;
        
        i++;
    }
    else if (i == max_loops) {
      UNITY_END(); // stop unit testing
    }
}