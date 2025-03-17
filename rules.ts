// Se https://github.com/mxstbr/karabiner

import fs from "fs";
import { KarabinerRules } from "./types";
import { generateAllHyperSubLayers, app, open, rectangle, basicRemap, fallbacks, switch_karabiner_profile, app_with_notification, shortcut, fn_function_keys, fn_media_keys, stickyLayer, layerHelper, clearSublayerWith, open_bundle } from "./utils";
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
      clearSublayerWith("escape"),
      clearSublayerWith("caps_lock"),
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
      },
    ]
  },
  
  ...generateAllHyperSubLayers({
    // Ensures that keys without a sublayer trigger a "regular" hyper key-combination
    ...fallbacks,

    page_up: switch_karabiner_profile(name_of_default_fn, "Fn keys"),
    page_down: switch_karabiner_profile(name_of_builtin_fn, "Media keys"),

    j: basicRemap("left_arrow"),
    k: basicRemap("up_arrow"),
    l: basicRemap("down_arrow"),
    semicolon: basicRemap("right_arrow"),
    m: basicRemap("left_arrow", ["left_command"]),
    comma: basicRemap("left_arrow", ["left_alt"]),
    period: basicRemap("right_arrow", ["left_alt"]),
    slash: basicRemap("right_arrow", ["left_command"]),
    h: basicRemap("delete_or_backspace", []),
    quote: basicRemap("delete_forward", []),

    // a = "A"udio/video
    // a: {
    //   // s = Stop everything
    //   s: open("-g raycast://script-commands/mute-and-cut-video"),
    // },

    g: stickyLayer("Apps", {
      c: layerHelper("VS (C)ode", app("Visual Studio Code")),
      v: layerHelper("(V)S Code projects", open("raycast://extensions/thomas/visual-studio-code/index")),
      // e: layerHelper("Microsoft (E)dge", app_with_notification("Microsoft Edge")),
      a: layerHelper("(A)rc Browser", app_with_notification("Arc")),
      // n: layerHelper("(N)ew Edge Window", open("raycast://script-commands/new-edge-window")),
      // g: layerHelper("Opera (G)X", app_with_notification("Opera GX")),
      // t: layerHelper("Ghost(t)y", open("raycast://script-commands/new-ghostty-terminal")),
      i: layerHelper("(i)Term", app("iTerm")),
      // z: layerHelper("(Z)oom", app("zoom.us")),
      f: layerHelper("(F)inder", app("Finder")),
      // b: layerHelper("(B)eskeder", app_with_notification("Messages")),
      // p: layerHelper("(P)ost", app_with_notification("Mail")),
      m: layerHelper("(M)imestream", app_with_notification("Mimestream")),
    }),

    c: open("raycast://extensions/raycast/clipboard-history/clipboard-history"),
    v: open("raycast://extensions/raycast/snippets/search-snippets"),
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
    // TODO: Remap to old window bindings
    // All window-commands
    w: {
      u: rectangle('bottom-left'),
      i: rectangle('top-left'),
      o: rectangle('top-right'),
      p: rectangle('bottom-right'),
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
      // semicolon: {
      //   description: "Window: Hide",
      //   to: [
      //     {
      //       key_code: "h",
      //       modifiers: ["right_command"],
      //     },
      //   ],
      // },
      return_or_enter: rectangle('maximize'),

      1: rectangle('previous-display'),
      // open_bracket: rectangle("next-display"),
      // close_bracket: rectangle("previous-display"),
      e: rectangle("top-half"),
      d: rectangle("bottom-half"),
      f: rectangle("center-half"),
      t: rectangle("move-up"),
      g: open("-g raycast://extensions/raycast/window-management/top-center-two-thirds"),
      // // Halfs 1/2
      // up_arrow: rectangle("top-half"),
      // down_arrow: rectangle("bottom-half"),
      // left_arrow: rectangle("left-half"),
      // right_arrow: rectangle("right-half"),
      //   // Quadrants 1/4
      //   u: rectangle("top-left"),
      //   i: rectangle("top-right"),
      //   j: rectangle("bottom-left"),
      //   k: rectangle("bottom-right"),
      //   d: rectangle("first-third"),
      //   f: rectangle("center-third"),
      //   g: rectangle("last-third"),
      //   // Two Thirds 2/3
      //   e: rectangle("first-two-thirds"),
      //   t: rectangle("last-two-thirds"),
    },

    // TODO : Return to Rectangle instead of raycast
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
      a: app("Arc"),
      b: app("BusyCal"),
      c: app("Visual Studio Code"),
      d: app("Drafts"),
      v: open("raycast://extensions/thomas/visual-studio-code/index"),
      t: app("iTerm"),
      i: app("iTerm"),
      f: app("Finder"),
      r: app("OmniFocus"),
      e: app_with_notification("Mimestream"),
      m: open("kmtrigger://macro=912BA00A-E521-4543-8667-D246A74EDA63"),
    },

    // f1: app("Mail"),
    // f2: app("Microsoft Edge"),
    // f3: app("Visual Studio Code"),
    // f4: app("Opera GX"),


    // s = "System"
    s: stickyLayer("Scripts/System", {
      // f = "Fn"
      f: layerHelper("(F)unction keys", switch_karabiner_profile(name_of_default_fn, "Fn keys")),
      // b = "Builtins"
      b: layerHelper("(B)uiltin media keys", switch_karabiner_profile(name_of_builtin_fn, "Media keys")),
  	  m: layerHelper("Toggle (M)enu bar", open("-g raycast://extensions/iamyeizi/toggle-menu-bar/toggle")),
      p: layerHelper("(P)lay or pause", basicRemap("play_or_pause")),
      //   // "D"o not disturb toggle
      // d: layerHelper("(D)o not disturb", open(`raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`)),

	  // o: layerHelper("(O)pen cloudflare tunnel", open("raycast://script-commands/open-cloudflare-tunnel")),
	  // c: layerHelper("(C)lost cloudflare tunnel", open("raycast://script-commands/close-cloudflare-tunnel")),
	  // 1: layerHelper("SkvizBiz VPN", open("-g raycast://script-commands/connect-to-skvizbiz-vpn")),
	  // 2: layerHelper("Close SkvizBiz VPN", open("-g raycast://script-commands/disconnect-skvizbiz-vpn")),
	  // 3: layerHelper("VPN Status", open("-g raycast://script-commands/vpn-status-1")),
    }),

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
      c: open("raycast://extensions/thomas/color-picker/pick-color"),
      //   n: open("raycast://script-commands/dismiss-notifications"),
      e: open("raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"),
      p: open("raycast://extensions/raycast/raycast/confetti"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      f: open("raycast://extensions/raycast/file-search/search-files"),
      //   s: open("raycast://extensions/peduarte/silent-mention/index"),
      //   h: open("raycast://extensions/raycast/clipboard-history/clipboard-history"),
      // 1: open("raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"),
      //   2: open("raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"),
      // s: open("raycast://extensions/mattisssa/spotify-player/nowPlayingMenuBar"),
      // K for kalender
      k: open("raycast://extensions/raycast/calendar/my-schedule"),
      // c: open("raycast://extensions/raycast/system/open-camera"),
      n: open("-g raycast://extensions/raycast/raycast-notes/raycast-notes"),
    //   m: open("-g raycast://extensions/raycast/floating-notes/toggle-floating-notes-focus"),
	  },  
	// // u = Ur
	// u: {
	//   // r = "R"estart stopwatch
	//   r: open("-g raycast://script-commands/genstart-stopur"),
	//   // s = Start stopwatch
  //     s: open("-g raycast://script-commands/start-stopur"),
	//   // e = End stopwatch
  //     spacebar: open("-g raycast://script-commands/stop-stopur"),
  //   },

  //* Display Swaitcher
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
    },
  }),
];


const basic_params = {
  "devices": [
	{
		"identifiers": {
			"is_keyboard": true,
			"is_pointing_device": true,
			"product_id": 291,
			"vendor_id": 13364
		},
		"ignore": false
	}
  ],
  "parameters": {
    "delay_milliseconds_before_open_device": 1000
  },
  "simple_modifications": [
    // {
    //   "from": {
    //     "key_code": "f13"
    //   },
    //   "to": [
    //     {
    //       "consumer_key_code": "dictation"
    //     }
    //   ]
    // },
    // {
    //   "from": {
    //     "key_code": "f16"
    //   },
    //   "to": [
    //     {
    //       "software_function": {
    //         "iokit_power_management_sleep_system": {}
    //       }
    //     }
    //   ]
    // }
  ],
  "virtual_hid_keyboard": {
	"keyboard_type_v2": "ansi",
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
