// Se https://github.com/mxstbr/karabiner

import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, basicRemap, fallbacks, switch_karabiner_profile } from "./utils";

const name_of_default_fn = "Caps -> Hyper";
const name_of_builtin_fn = "Caps -> Hyper (Fn keys are mac builtins)";



const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: [
              "left_command",
              "left_option",
              "left_shift"
            ],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
          // {
          //   "key_code": "left_shift",
          //   "modifiers": [
          //     "left_command",
          //     "left_control",
          //     "left_option"
          //   ],
          // },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [{
          "key_code": "escape",
        }],
        "parameters": {
          "basic.to_if_alone_timeout_milliseconds": 500
        },
        type: "basic",
      },
    ],
  },
  {
    "description": "Alt+tick finishes backtick",
    "manipulators": [
      {
        "from": {
          "key_code": "equal_sign",
          "modifiers": {
            "mandatory": [
              "left_alt"
            ]
          }
        },
        "to": [
          {
            "key_code": "equal_sign",
            "modifiers": [
              "left_shift"
            ],
            "repeat": true
          },
          {
            "key_code": "spacebar",
            "repeat": true
          }
        ],
        "type": "basic"
      },
      {
        "from": {
          "key_code": "equal_sign",
          "modifiers": {
            "mandatory": [
              "right_alt"
            ]
          }
        },
        "to": [
          {
            "key_code": "equal_sign",
            "modifiers": [
              "left_shift"
            ],
            "repeat": true
          },
          {
            "key_code": "spacebar",
            "repeat": true
          }
        ],
        "type": "basic"
      }
    ]
  },
  ...createHyperSubLayers({
    ...fallbacks,

    page_up: switch_karabiner_profile(name_of_default_fn),
    page_down: switch_karabiner_profile(name_of_builtin_fn),

    j: {
      to: [{
        key_code: "left_arrow",
        modifiers: [],
      }]
    },
    k: {
      to: [{
        key_code: "up_arrow",
        modifiers: [],
      }]
    },
    l: {
      to: [{
        key_code: "down_arrow",
        modifiers: [],
      }]
    },
    semicolon: {
      to: [{
        key_code: "right_arrow",
        modifiers: [],
      }]
    },

    m: {
      to: [{
        key_code: "left_arrow",
        modifiers: [
          "left_command",
        ],
      }]
    },
    comma: {
      to: [{
        key_code: "left_arrow",
        modifiers: [
          "left_alt",
        ],
      }]
    },
    period: {
      to: [{
        key_code: "right_arrow",
        modifiers: [
          "left_alt",
        ],
      }]
    },
    slash: {
      to: [{
        key_code: "right_arrow",
        modifiers: [
          "left_command",
        ],
      }]
    },

    h: {
      to: [{
        key_code: "delete_or_backspace",
        modifiers: [],
      }]
    },
    quote: {
      to: [{
        key_code: "delete_forward",
        modifiers: [],
      }]
    },

    c: open("raycast://extensions/raycast/clipboard-history/clipboard-history"),

    // D = digits. Numeric keys for right hand, moved down a notch from the numeric row for easier reach.
    d: {
      u: basicRemap("7"),
      i: basicRemap("8"),
      o: basicRemap("9"),
      j: basicRemap("4"),
      k: basicRemap("5"),
      l: basicRemap("6"),
      m: basicRemap("1"),
      comma: basicRemap("2"),
      period: basicRemap("3"),
      spacebar: basicRemap("0"),
      right_command: basicRemap("comma"),
      right_alt: basicRemap("period"),
      semicolon: basicRemap("keypad_plus"),
      p: basicRemap("keypad_hyphen"),
      0: basicRemap("keypad_asterisk"),
      9: basicRemap("keypad_slash"),
      h: basicRemap("comma"),
      y: basicRemap("period"),
    },

    // All window-commands
    w: {
      y: rectangle('bottom-left'),
      u: rectangle('top-left'),
      i: rectangle('top-right'),
      o: rectangle('bottom-right'),
      r: rectangle('restore'),
      c: rectangle('center'),

      n: rectangle('top-center-sixth'),
      m: rectangle('bottom-center-sixth'),

      7: rectangle('left-half'),
      8: rectangle('maximize'),
      9: rectangle('right-half'),
      comma: rectangle('smaller'),
      period: rectangle('larger'),
      j: rectangle('left-half'),
      k: rectangle('maximize'),
      semicolon: rectangle('right-half'),

      1: rectangle('previous-display'),

      e: rectangle("top-half"),
      d: rectangle("bottom-half"),
      f: rectangle("center-half"),
      t: rectangle("move-up"),
      g: open("-g raycast://extensions/raycast/window-management/top-center-two-thirds"),
    },

    // o = "Open" applications
    o: {
      // v: app("Visual Studio Code"),
      v: open("raycast://extensions/thomas/visual-studio-code/index"),
      e: app("Microsoft Edge"),
      g: app("Opera GX"),
      t: app("iTerm"),
      i: app("iTerm"),
      z: app("zoom.us"),
      f: app("Finder"),
      // b = "Beskeder"
      b: app("Messages"),
      m: app("Mattermost"),
    },

    // f1: app("Mail"),
    // f2: app("Microsoft Edge"),
    // f3: app("Visual Studio Code"),
    // f4: app("Opera GX"),


    // s = "System"
    s: {
      // f = "Fn"
      f: switch_karabiner_profile(name_of_default_fn),
      // b = "Builtins"
      b: switch_karabiner_profile(name_of_builtin_fn),
      //   u: {
      //     to: [
      //       {
      //         key_code: "volume_increment",
      //       },
      //     ],
      //   },
      //   j: {
      //     to: [
      //       {
      //         key_code: "volume_decrement",
      //       },
      //     ],
      //   },
      //   i: {
      //     to: [
      //       {
      //         key_code: "display_brightness_increment",
      //       },
      //     ],
      //   },
      //   k: {
      //     to: [
      //       {
      //         key_code: "display_brightness_decrement",
      //       },
      //     ],
      //   },
      //   l: {
      //     to: [
      //       {
      //         key_code: "q",
      //         modifiers: ["right_control", "right_command"],
      //       },
      //     ],
      //   },
      p: basicRemap("play_or_pause"),
      //   semicolon: {
      //     to: [
      //       {
      //         key_code: "fastforward",
      //       },
      //     ],
      //   },
      //   e: open(
      //     `raycast://extensions/thomas/elgato-key-light/toggle?launchType=background`
      //   ),
      //   // "D"o not disturb toggle
      d: open(
        `raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`
      ),
      //   // "T"heme
      //   t: open(`raycast://extensions/raycast/system/toggle-system-appearance`),
    },

    // // c = Musi*c* which isn't "m" because we want it to be on the left hand
    // c: {
    //   p: {
    //     to: [{ key_code: "play_or_pause" }],
    //   },
    //   n: {
    //     to: [{ key_code: "fastforward" }],
    //   },
    //   b: {
    //     to: [{ key_code: "rewind" }],
    //   },
    // },

    // r = "Raycast"
    r: {
      //   c: open("raycast://extensions/thomas/color-picker/pick-color"),
      //   n: open("raycast://script-commands/dismiss-notifications"),
      //   l: open(
      //     "raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink"
      //   ),
      //   e: open(
      //     "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      //   ),
      //   p: open("raycast://extensions/raycast/raycast/confetti"),
      //   a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      //   s: open("raycast://extensions/peduarte/silent-mention/index"),
      //   h: open(
      //     "raycast://extensions/raycast/clipboard-history/clipboard-history"
      //   ),
      //   1: open(
      //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
      //   ),
      //   2: open(
      //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
      //   ),
      // s: open("raycast://extensions/mattisssa/spotify-player/nowPlayingMenuBar"),
      // K for kalender
      k: open("raycast://extensions/raycast/calendar/my-schedule"),
      c: open("raycast://extensions/raycast/system/open-camera"),
      n: open("-g raycast://extensions/raycast/floating-notes/toggle-floating-notes-window"),
      m: open("-g raycast://extensions/raycast/floating-notes/toggle-floating-notes-focus"),
    },
    q: {
      j: basicRemap("1", ["left_control"]),
      k: basicRemap("2", ["left_control"]),
      l: basicRemap("3", ["left_control"]),
      semicolon: basicRemap("4", ["left_control"]),
      u: basicRemap("5", ["left_control"]),
      i: basicRemap("6", ["left_control"]),
      o: basicRemap("7", ["left_control"]),
    },
  }),
];

const basic_params = {
  "devices": [
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 835,
        "vendor_id": 1452
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": false,
        "is_pointing_device": true,
        "product_id": 835,
        "vendor_id": 1452
      },
      "ignore": true,
      "manipulate_caps_lock_led": false,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 20496,
        "vendor_id": 6493
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": false,
        "is_pointing_device": true,
        "product_id": 20496,
        "vendor_id": 6493
      },
      "ignore": true,
      "manipulate_caps_lock_led": false,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 620,
        "vendor_id": 76
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": false,
        "is_pointing_device": true,
        "product_id": 617,
        "vendor_id": 76
      },
      "ignore": true,
      "manipulate_caps_lock_led": false,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 50504,
        "vendor_id": 1133
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": false,
        "is_pointing_device": true,
        "product_id": 50504,
        "vendor_id": 1133
      },
      "ignore": true,
      "manipulate_caps_lock_led": false,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": false,
        "is_pointing_device": true,
        "product_id": 2835,
        "vendor_id": 1118
      },
      "ignore": true,
      "manipulate_caps_lock_led": false,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [
        // {
        //   "from": {
        //     "key_code": "f1"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f1"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f2"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f2"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f3"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f3"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f4"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f4"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f5"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f5"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f6"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f6"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f7"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f7"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f8"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f8"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f9"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f9"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f10"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f10"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f11"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f11"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f12"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f12"
        //     }
        //   ]
        // }
      ],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": true,
        "product_id": 291,
        "vendor_id": 13364
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [
        // {
        //   "from": {
        //     "key_code": "f1"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f1"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f2"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f2"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f3"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f3"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f4"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f4"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f5"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f5"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f6"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f6"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f7"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f7"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f8"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f8"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f9"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f9"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f10"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f10"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f11"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f11"
        //     }
        //   ]
        // },
        // {
        //   "from": {
        //     "key_code": "f12"
        //   },
        //   "to": [
        //     {
        //       "key_code": "f12"
        //     }
        //   ]
        // }
      ],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 291,
        "vendor_id": 13364
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 598,
        "vendor_id": 1452
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": true,
        "product_id": 305,
        "vendor_id": 13364
      },
      "ignore": true,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    },
    {
      "disable_built_in_keyboard_if_exists": false,
      "fn_function_keys": [],
      "game_pad_swap_sticks": false,
      "identifiers": {
        "is_game_pad": false,
        "is_keyboard": true,
        "is_pointing_device": false,
        "product_id": 305,
        "vendor_id": 13364
      },
      "ignore": false,
      "manipulate_caps_lock_led": true,
      "mouse_flip_horizontal_wheel": false,
      "mouse_flip_vertical_wheel": false,
      "mouse_flip_x": false,
      "mouse_flip_y": false,
      "mouse_swap_wheels": false,
      "mouse_swap_xy": false,
      "simple_modifications": [],
      "treat_as_built_in_keyboard": false
    }
  ],
  "fn_function_keys": [
    {
      "from": {
        "key_code": "f1"
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_decrement"
        }
      ]
    },
    {
      "from": {
        "key_code": "f2"
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_increment"
        }
      ]
    },
    {
      "from": {
        "key_code": "f3"
      },
      "to": [
        {
          "apple_vendor_keyboard_key_code": "mission_control"
        }
      ]
    },
    {
      "from": {
        "key_code": "f4"
      },
      "to": [
        {
          "key_code": "f4"
        }
      ]
    },
    {
      "from": {
        "key_code": "f5"
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_down"
        }
      ]
    },
    {
      "from": {
        "key_code": "f6"
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_up"
        }
      ]
    },
    {
      "from": {
        "key_code": "f7"
      },
      "to": [
        {
          "consumer_key_code": "rewind"
        }
      ]
    },
    {
      "from": {
        "key_code": "f8"
      },
      "to": [
        {
          "consumer_key_code": "play_or_pause"
        }
      ]
    },
    {
      "from": {
        "key_code": "f9"
      },
      "to": [
        {
          "consumer_key_code": "fast_forward"
        }
      ]
    },
    {
      "from": {
        "key_code": "f10"
      },
      "to": [
        {
          "consumer_key_code": "mute"
        }
      ]
    },
    {
      "from": {
        "key_code": "f11"
      },
      "to": [
        {
          "consumer_key_code": "volume_decrement"
        }
      ]
    },
    {
      "from": {
        "key_code": "f12"
      },
      "to": [
        {
          "consumer_key_code": "volume_increment"
        }
      ]
    }
  ],
  "parameters": {
    "delay_milliseconds_before_open_device": 1000
  },
  "simple_modifications": [
    {
      "from": {
        "key_code": "f13"
      },
      "to": [
        {
          "consumer_key_code": "dictation"
        }
      ]
    },
    {
      "from": {
        "key_code": "f16"
      },
      "to": [
        {
          "software_function": {
            "iokit_power_management_sleep_system": {}
          }
        }
      ]
    }
  ],
  "virtual_hid_keyboard": {
    "country_code": 0,
    "indicate_sticky_modifier_keys_state": true,
    "mouse_key_xy_scale": 100
  }
}

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        "ask_for_confirmation_before_quitting": true,
        "check_for_updates_on_startup": true,
        "show_in_menu_bar": false,
        "show_profile_name_in_menu_bar": false,
        "unsafe_ui": false
      },
      profiles: [
        {
          name: name_of_default_fn,
          complex_modifications: {
            parameters: {
              "basic.simultaneous_threshold_milliseconds": 50,
              "basic.to_delayed_action_delay_milliseconds": 500,
              "basic.to_if_alone_timeout_milliseconds": 1000,
              "basic.to_if_held_down_threshold_milliseconds": 500,
              "mouse_motion_to_scroll.speed": 100
            },
            rules,
          },
          "selected": true,
          ...basic_params,
          "fn_function_keys": [
            {
              "from": {
                "key_code": "f1"
              },
              "to": [
                {
                  "key_code": "f1"
                }
              ]
            },
            {
              "from": {
                "key_code": "f2"
              },
              "to": [
                {
                  "key_code": "f2"
                }
              ]
            },
            {
              "from": {
                "key_code": "f3"
              },
              "to": [
                {
                  "key_code": "f3"
                }
              ]
            },
            {
              "from": {
                "key_code": "f4"
              },
              "to": [
                {
                  "key_code": "f4"
                }
              ]
            },
            {
              "from": {
                "key_code": "f5"
              },
              "to": [
                {
                  "key_code": "f5"
                }
              ]
            },
            {
              "from": {
                "key_code": "f6"
              },
              "to": [
                {
                  "key_code": "f6"
                }
              ]
            },
            {
              "from": {
                "key_code": "f7"
              },
              "to": [
                {
                  "key_code": "f7"
                }
              ]
            },
            {
              "from": {
                "key_code": "f8"
              },
              "to": [
                {
                  "key_code": "f8"
                }
              ]
            },
            {
              "from": {
                "key_code": "f9"
              },
              "to": [
                {
                  "key_code": "f9"
                }
              ]
            },
            {
              "from": {
                "key_code": "f10"
              },
              "to": [
                {
                  "key_code": "f10"
                }
              ]
            },
            {
              "from": {
                "key_code": "f11"
              },
              "to": [
                {
                  "key_code": "f11"
                }
              ]
            },
            {
              "from": {
                "key_code": "f12"
              },
              "to": [
                {
                  "key_code": "f12"
                }
              ]
            }
          ]
        },
        {
          name: name_of_builtin_fn,
          complex_modifications: {
            parameters: {
              "basic.simultaneous_threshold_milliseconds": 50,
              "basic.to_delayed_action_delay_milliseconds": 500,
              "basic.to_if_alone_timeout_milliseconds": 1000,
              "basic.to_if_held_down_threshold_milliseconds": 500,
              "mouse_motion_to_scroll.speed": 100
            },
            rules,
          },
          "selected": false,
          ...basic_params,
          "fn_function_keys": [
            {
              "from": {
                "key_code": "f1"
              },
              "to": [
                {
                  "consumer_key_code": "display_brightness_decrement"
                }
              ]
            },
            {
              "from": {
                "key_code": "f2"
              },
              "to": [
                {
                  "consumer_key_code": "display_brightness_increment"
                }
              ]
            },
            {
              "from": {
                "key_code": "f3"
              },
              "to": [
                {
                  "apple_vendor_keyboard_key_code": "mission_control"
                }
              ]
            },
            {
              "from": {
                "key_code": "f4"
              },
              "to": [
                {
                  "apple_vendor_keyboard_key_code": "spotlight"
                }
              ]
            },
            {
              "from": {
                "key_code": "f5"
              },
              "to": [
                {
                  "apple_vendor_top_case_key_code": "illumination_down"
                }
              ]
            },
            {
              "from": {
                "key_code": "f6"
              },
              "to": [
                {
                  "apple_vendor_top_case_key_code": "illumination_up"
                }
              ]
            },
            {
              "from": {
                "key_code": "f7"
              },
              "to": [
                {
                  "consumer_key_code": "rewind"
                }
              ]
            },
            {
              "from": {
                "key_code": "f8"
              },
              "to": [
                {
                  "consumer_key_code": "play_or_pause"
                }
              ]
            },
            {
              "from": {
                "key_code": "f9"
              },
              "to": [
                {
                  "consumer_key_code": "fast_forward"
                }
              ]
            },
            {
              "from": {
                "key_code": "f10"
              },
              "to": [
                {
                  "consumer_key_code": "mute"
                }
              ]
            },
            {
              "from": {
                "key_code": "f11"
              },
              "to": [
                {
                  "consumer_key_code": "volume_decrement"
                }
              ]
            },
            {
              "from": {
                "key_code": "f12"
              },
              "to": [
                {
                  "consumer_key_code": "volume_increment"
                }
              ]
            }
          ],
        }
      ],
    },
    null,
    2
  )
);
