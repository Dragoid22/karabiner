// Se https://github.com/mxstbr/karabiner

import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, basicRemap, fallbacks, switch_karabiner_profile, app_with_notification, shortcut, fn_function_keys, fn_media_keys } from "./utils";
import * as dotenv from 'dotenv';

dotenv.config()

const name_of_default_fn = "Caps -> Hyper";
const name_of_builtin_fn = "Caps -> Hyper (Fn keys are mac builtins)";

const default_selected = (process.env.DEFAULT_LAYOUT && process.env.DEFAULT_LAYOUT == "builtin") ? name_of_builtin_fn : name_of_default_fn;


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
        // to_if_alone: [{
        //   "key_code": "escape",
        // }],
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

    page_up: switch_karabiner_profile(name_of_default_fn, "Fn keys"),
    page_down: switch_karabiner_profile(name_of_builtin_fn, "Media keys"),

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

    // a = "A"udio/video
    a: {
      // s = Stop everything
      s: open("-g raycast://script-commands/mute-and-cut-video"),
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
      n: basicRemap("period"),
    },

    // All window-commands
    w: {
      u: rectangle('bottom-left'),
      i: rectangle('top-left'),
      o: rectangle('top-right'),
      p: rectangle('bottom-right'),
    //   y: rectangle('bottom-left'),
    //   u: rectangle('top-left'),
    //   i: rectangle('top-right'),
    //   o: rectangle('bottom-right'),
      r: rectangle('restore'),
      c: rectangle('center'),
      l: rectangle('center-half'),

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

    e: {
      u: open("-g raycast://extensions/raycast/window-management/center && open -g raycast://extensions/raycast/window-management/move-left"),
      i: open("-g raycast://extensions/raycast/window-management/center && open -g raycast://extensions/raycast/window-management/move-up"),
      o: open("-g raycast://extensions/raycast/window-management/center && open -g raycast://extensions/raycast/window-management/move-down"),
      p: open("-g raycast://extensions/raycast/window-management/center && open -g raycast://extensions/raycast/window-management/move-right"),
      j: open("-g raycast://extensions/raycast/window-management/move-left"),
      k: open("-g raycast://extensions/raycast/window-management/move-up"),
      l: open("-g raycast://extensions/raycast/window-management/move-down"),
      semicolon: open("-g raycast://extensions/raycast/window-management/move-right"),
    },

    // o = "Open" applications
    o: {
      c: app("Visual Studio Code"),
      v: open("raycast://extensions/thomas/visual-studio-code/index"),
      e: app_with_notification("Microsoft Edge"),
	  // n = "N"ew edge window
      n: open("raycast://script-commands/new-edge-window"),
      g: app_with_notification("Opera GX"),
      t: app("iTerm"),
      i: app("iTerm"),
      z: app("zoom.us"),
      f: app("Finder"),
      // b = "Beskeder"
      b: app_with_notification("Messages"),
      p: app_with_notification("Mail"),
      m: app_with_notification("Mattermost"),
    },

    // f1: app("Mail"),
    // f2: app("Microsoft Edge"),
    // f3: app("Visual Studio Code"),
    // f4: app("Opera GX"),


    // s = "System"
    s: {
      // f = "Fn"
      f: switch_karabiner_profile(name_of_default_fn, "Fn keys"),
      // b = "Builtins"
      b: switch_karabiner_profile(name_of_builtin_fn, "Media keys"),
	  m: open("-g raycast://extensions/iamyeizi/toggle-menu-bar/toggle"),
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
	//   o: shortcut("f17", ["cmd", "control", "shift", "alt"]),
	//   l: basicRemap("f17", ["left_command", "left_control", "left_shift", "left_alt"]),
	//   o: basicRemap("f18", ["left_command", "left_control", "left_shift", "left_alt"]),
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
      n: open("-g raycast://extensions/raycast/raycast-notes/raycast-notes"),
    //   m: open("-g raycast://extensions/raycast/floating-notes/toggle-floating-notes-focus"),
	},
	// u = Ur
	u: {
	  // r = "R"estart stopwatch
	  r: open("-g raycast://script-commands/genstart-stopur"),
	  // s = Start stopwatch
      s: open("-g raycast://script-commands/start-stopur"),
	  // e = End stopwatch
      spacebar: open("-g raycast://script-commands/stop-stopur"),
    },
    q: {
      j: basicRemap("1", ["left_control"]),
      k: basicRemap("2", ["left_control"]),
      l: basicRemap("3", ["left_control"]),
      semicolon: basicRemap("4", ["left_control"]),
      u: basicRemap("5", ["left_control"]),
      i: basicRemap("6", ["left_control"]),
      o: basicRemap("7", ["left_control"]),
      m: basicRemap("5", ["left_control"]),
      comma: basicRemap("6", ["left_control"]),
      period: basicRemap("7", ["left_control"]),
    },
	non_us_pound: {
		
		to: [
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
			},
			{
				"pointing_button": "button1",
				"hold_down_milliseconds": 30,
				repeat: false,
			},
			// {
			// 	"hold_down_milliseconds": 30,
			// 	software_function: {
			// 		"cg_event_double_click": {
			// 			button: 0
			// 		}
			// 	},
			// 	repeat: false,
			// }
		],
	}
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
            rules: [
              ...rules,
              fn_function_keys,
            ],
          },
          "selected": (default_selected == name_of_default_fn),
          ...basic_params,
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
            rules: [
              ...rules,
              fn_media_keys,
            ],
          },
          "selected": (default_selected == name_of_builtin_fn),
          ...basic_params,
        }
      ],
    },
    null,
    2
  )
);
