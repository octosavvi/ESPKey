// Pin number assignments
// if you change these you may also change the args to createDigigraph() in gpio.htm so the diagnostics tab reflects these changes.
#if defined(ESP8266)

    #define D0_ASSERT 12 
    #define D0_SENSE 13 

    #define D1_ASSERT 16
    #define D1_SENSE 14

    #define LED_ASSERT 4 
    #define LED_SENSE 5

    #define CONF_RESET 0

#elif defined(ESP32)
// for ESP32 you may use GPIO > 31, but the diagnostics graph can't handle them.
    #define D0_ASSERT 33 
    #define D0_SENSE 32 

    #define D1_ASSERT 22
    #define D1_SENSE 35 

    #define LED_ASSERT 23 
    #define LED_SENSE 34 

    #define CONF_RESET 0

#else  
    
    #error "please use ESP8266 or ESP32"

#endif

