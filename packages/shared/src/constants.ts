/**
 * Weather types available in GTA V/RAGE:MP
 */
export enum WeatherType {
    /** Extra sunny weather with bright lighting and clear skies */
    ExtraSunny = 'EXTRASUNNY',
    /** Clear weather with good visibility */
    Clear = 'CLEAR',
    /** Cloudy weather with overcast skies */
    Clouds = 'CLOUDS',
    /** Smoggy weather with reduced visibility */
    Smog = 'SMOG',
    /** Foggy weather with significantly reduced visibility */
    Foggy = 'FOGGY',
    /** Overcast weather with heavy cloud cover */
    Overcast = 'OVERCAST',
    /** Rainy weather with precipitation */
    Rain = 'RAIN',
    /** Thunderstorm weather with lightning and rain */
    Thunder = 'THUNDER',
    /** Weather transitioning from cloudy to clear */
    Clearing = 'CLEARING',
    /** Neutral weather conditions */
    Neutral = 'NEUTRAL',
    /** Snowy weather with snowfall */
    Snow = 'SNOW',
    /** Heavy snow with blizzard conditions */
    Blizzard = 'BLIZZARD',
    /** Light snow with gentle snowfall */
    SnowLight = 'SNOWLIGHT',
    /** Christmas-themed weather */
    Xmas = 'XMAS',
    /** Halloween-themed spooky weather */
    Halloween = 'HALLOWEEN',
    /** Halloween-themed rainy weather */
    RainHalloween = 'RAIN_HALLOWEEN',
    /** Halloween-themed snowy weather */
    SnowHalloween = 'SNOW_HALLOWEEN',
}

/**
 * Virtual Key Codes for keyboard and mouse input handling
 *
 * @see {@link https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes} Windows Virtual Key Codes
 */
export const KeyCode = Object.freeze({
    // Mouse buttons
    /** Left mouse button */
    LButton: 0x01,
    /** Right mouse button */
    RButton: 0x02,
    /** Control-break processing */
    Cancel: 0x03,
    /** Middle mouse button (three-button mouse) */
    MButton: 0x04,
    /** X1 mouse button */
    XButton1: 0x05,
    /** X2 mouse button */
    XButton2: 0x06,

    // Special keys
    /** Backspace key */
    Backspace: 0x08,
    /** Tab key */
    Tab: 0x09,
    /** Clear key */
    Clear: 0x0c,
    /** Enter key */
    Enter: 0x0d,

    // Modifier keys
    /** Shift key */
    Shift: 0x10,
    /** Ctrl key */
    Control: 0x11,
    /** Alt key */
    Alt: 0x12,
    /** Pause key */
    Pause: 0x13,
    /** Caps Lock key */
    CapsLock: 0x14,

    // IME keys
    /** Kana key on Japanese keyboards */
    Kana: 0x15,
    /** Hangul key on Korean keyboards */
    Hangul: 0x15,
    /** Junja key on Korean keyboards */
    Junja: 0x17,
    /** Final key on Korean keyboards */
    Final: 0x18,
    /** Hanja key on Korean keyboards */
    Hanja: 0x19,
    /** Kanji key on Japanese keyboards */
    Kanji: 0x19,

    /** Escape key */
    Escape: 0x1b,
    /** Convert key on Japanese keyboards */
    Convert: 0x1c,
    /** Non-convert key on Japanese keyboards */
    NonConvert: 0x1d,
    /** Accept key */
    Accept: 0x1e,
    /** Mode change key */
    ModeChange: 0x1f,

    // Navigation keys
    /** Spacebar */
    Space: 0x20,
    /** Page Up key */
    PageUp: 0x21,
    /** Page Down key */
    PageDown: 0x22,
    /** End key */
    End: 0x23,
    /** Home key */
    Home: 0x24,
    /** Left arrow key */
    LeftArrow: 0x25,
    /** Up arrow key */
    UpArrow: 0x26,
    /** Right arrow key */
    RightArrow: 0x27,
    /** Down arrow key */
    DownArrow: 0x28,
    /** Select key */
    Select: 0x29,
    /** Print key */
    Print: 0x2a,
    /** Execute key */
    Execute: 0x2b,
    /** Print Screen key */
    PrintScreen: 0x2c,
    /** Insert key */
    Insert: 0x2d,
    /** Delete key */
    Delete: 0x2e,
    /** Help key */
    Help: 0x2f,

    // Number row
    /** 0 key */
    Key0: 0x30,
    /** 1 key */
    Key1: 0x31,
    /** 2 key */
    Key2: 0x32,
    /** 3 key */
    Key3: 0x33,
    /** 4 key */
    Key4: 0x34,
    /** 5 key */
    Key5: 0x35,
    /** 6 key */
    Key6: 0x36,
    /** 7 key */
    Key7: 0x37,
    /** 8 key */
    Key8: 0x38,
    /** 9 key */
    Key9: 0x39,

    // Letters
    /** A key */
    A: 0x41,
    /** B key */
    B: 0x42,
    /** C key */
    C: 0x43,
    /** D key */
    D: 0x44,
    /** E key */
    E: 0x45,
    /** F key */
    F: 0x46,
    /** G key */
    G: 0x47,
    /** H key */
    H: 0x48,
    /** I key */
    I: 0x49,
    /** J key */
    J: 0x4a,
    /** K key */
    K: 0x4b,
    /** L key */
    L: 0x4c,
    /** M key */
    M: 0x4d,
    /** N key */
    N: 0x4e,
    /** O key */
    O: 0x4f,
    /** P key */
    P: 0x50,
    /** Q key */
    Q: 0x51,
    /** R key */
    R: 0x52,
    /** S key */
    S: 0x53,
    /** T key */
    T: 0x54,
    /** U key */
    U: 0x55,
    /** V key */
    V: 0x56,
    /** W key */
    W: 0x57,
    /** X key */
    X: 0x58,
    /** Y key */
    Y: 0x59,
    /** Z key */
    Z: 0x5a,

    // Windows keys
    /** Left Windows key */
    LeftWin: 0x5b,
    /** Right Windows key */
    RightWin: 0x5c,
    /** Applications key */
    Apps: 0x5d,
    /** Computer Sleep key */
    Sleep: 0x5f,

    // Numpad
    /** Numeric keypad 0 key */
    Numpad0: 0x60,
    /** Numeric keypad 1 key */
    Numpad1: 0x61,
    /** Numeric keypad 2 key */
    Numpad2: 0x62,
    /** Numeric keypad 3 key */
    Numpad3: 0x63,
    /** Numeric keypad 4 key */
    Numpad4: 0x64,
    /** Numeric keypad 5 key */
    Numpad5: 0x65,
    /** Numeric keypad 6 key */
    Numpad6: 0x66,
    /** Numeric keypad 7 key */
    Numpad7: 0x67,
    /** Numeric keypad 8 key */
    Numpad8: 0x68,
    /** Numeric keypad 9 key */
    Numpad9: 0x69,
    /** Multiply key (*) on numeric keypad */
    NumpadMultiply: 0x6a,
    /** Add key (+) on numeric keypad */
    NumpadAdd: 0x6b,
    /** Separator key on numeric keypad */
    NumpadSeparator: 0x6c,
    /** Subtract key (-) on numeric keypad */
    NumpadSubtract: 0x6d,
    /** Decimal key (.) on numeric keypad */
    NumpadDecimal: 0x6e,
    /** Divide key (/) on numeric keypad */
    NumpadDivide: 0x6f,

    // Function keys
    /** F1 key */
    F1: 0x70,
    /** F2 key */
    F2: 0x71,
    /** F3 key */
    F3: 0x72,
    /** F4 key */
    F4: 0x73,
    /** F5 key */
    F5: 0x74,
    /** F6 key */
    F6: 0x75,
    /** F7 key */
    F7: 0x76,
    /** F8 key */
    F8: 0x77,
    /** F9 key */
    F9: 0x78,
    /** F10 key */
    F10: 0x79,
    /** F11 key */
    F11: 0x7a,
    /** F12 key */
    F12: 0x7b,
    /** F13 key */
    F13: 0x7c,
    /** F14 key */
    F14: 0x7d,
    /** F15 key */
    F15: 0x7e,
    /** F16 key */
    F16: 0x7f,
    /** F17 key */
    F17: 0x80,
    /** F18 key */
    F18: 0x81,
    /** F19 key */
    F19: 0x82,
    /** F20 key */
    F20: 0x83,
    /** F21 key */
    F21: 0x84,
    /** F22 key */
    F22: 0x85,
    /** F23 key */
    F23: 0x86,
    /** F24 key */
    F24: 0x87,

    // Lock keys
    /** Num Lock key */
    NumLock: 0x90,
    /** Scroll Lock key */
    ScrollLock: 0x91,

    // Specific left/right modifier keys
    /** Left Shift key */
    LeftShift: 0xa0,
    /** Right Shift key */
    RightShift: 0xa1,
    /** Left Control key */
    LeftControl: 0xa2,
    /** Right Control key */
    RightControl: 0xa3,
    /** Left Alt key */
    LeftAlt: 0xa4,
    /** Right Alt key */
    RightAlt: 0xa5,

    // Browser keys
    /** Browser Back key */
    BrowserBack: 0xa6,
    /** Browser Forward key */
    BrowserForward: 0xa7,
    /** Browser Refresh key */
    BrowserRefresh: 0xa8,
    /** Browser Stop key */
    BrowserStop: 0xa9,
    /** Browser Search key */
    BrowserSearch: 0xaa,
    /** Browser Favorites key */
    BrowserFavorites: 0xab,
    /** Browser Start and Home key */
    BrowserHome: 0xac,

    // Volume keys
    /** Volume Mute key */
    VolumeMute: 0xad,
    /** Volume Down key */
    VolumeDown: 0xae,
    /** Volume Up key */
    VolumeUp: 0xaf,

    // Media keys
    /** Next Track key */
    MediaNextTrack: 0xb0,
    /** Previous Track key */
    MediaPrevTrack: 0xb1,
    /** Stop Media key */
    MediaStop: 0xb2,
    /** Play/Pause Media key */
    MediaPlayPause: 0xb3,

    // Launch keys
    /** Start Mail key */
    LaunchMail: 0xb4,
    /** Select Media key */
    LaunchMediaSelect: 0xb5,
    /** Start Application 1 key */
    LaunchApp1: 0xb6,
    /** Start Application 2 key */
    LaunchApp2: 0xb7,

    // OEM keys (varies by keyboard layout)
    /** OEM-specific key 1 (';:' for US keyboards) */
    OEM1: 0xba, // ';:' for US
    /** OEM Plus key ('+' for any country) */
    OEMPlus: 0xbb, // '+' any country
    /** OEM Comma key (',' for any country) */
    OEMComma: 0xbc, // ',' any country
    /** OEM Minus key ('-' for any country) */
    OEMMinus: 0xbd, // '-' any country
    /** OEM Period key ('.' for any country) */
    OEMPeriod: 0xbe, // '.' any country
    /** OEM-specific key 2 ('/?' for US keyboards) */
    OEM2: 0xbf, // '/?' for US
    /** OEM-specific key 3 ('`~' for US keyboards) */
    OEM3: 0xc0, // '`~' for US
    /** OEM-specific key 4 ('[{' for US keyboards) */
    OEM4: 0xdb, // '[{' for US
    /** OEM-specific key 5 ('\\|' for US keyboards) */
    OEM5: 0xdc, // '\|' for US
    /** OEM-specific key 6 (']}' for US keyboards) */
    OEM6: 0xdd, // ']}' for US
    /** OEM-specific key 7 (''"' for US keyboards) */
    OEM7: 0xde, // ''"' for US
    /** OEM-specific key 8 */
    OEM8: 0xdf,
    /** OEM-specific key 102 ('<>' or '\\|' on RT 102-key keyboard) */
    OEM102: 0xe2, // "<>" or "\|" on RT 102-key keyboard

    // Process key
    /** Process key */
    ProcessKey: 0xe5,

    // Packet key
    /** Packet key used to pass Unicode characters */
    Packet: 0xe7,

    // Attn key
    /** Attn key */
    Attn: 0xf6,
    /** CrSel key */
    CrSel: 0xf7,
    /** ExSel key */
    ExSel: 0xf8,
    /** Erase EOF key */
    EraseEOF: 0xf9,
    /** Play key */
    Play: 0xfa,
    /** Zoom key */
    Zoom: 0xfb,
    /** Reserved */
    NoName: 0xfc,
    /** PA1 key */
    PA1: 0xfd,
    /** Clear key */
    OEMClear: 0xfe,
});
