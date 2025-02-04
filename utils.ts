import { To, KeyCode, Manipulator, KarabinerRules } from "./types";

/**
 * Custom way to describe a command in a layer
 */
export interface LayerCommand {
  to: To[];
  description?: string;
}

type HyperKeySublayer = {
  // The ? is necessary, otherwise we'd have to define something for _every_ key code
  [key_code in KeyCode]?: LayerCommand;
};
type StickySublayerHelper = {
  help_text: string;
  // commands: HyperKeyStickySublayer;
  commands: HyperKeySublayer;
}
type HyperKeyStickySublayer = {
  // The ? is necessary, otherwise we'd have to define something for _every_ key code
  [key_code in KeyCode]?: StickySublayerHelper;
};
type StickyDescriptor = {
  help_text: string;
  command: LayerCommand;
};

/**
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
export function createHyperSubLayer(
  sublayer_key: KeyCode,
  commands: StickySublayerHelper|HyperKeySublayer,
  allSubLayerVariables: string[]
): Manipulator[] {
  const subLayerVariableName = generateSubLayerVariableName(sublayer_key);

  let karabiner_notification_message: string|false = false;
  if (typeof commands['help_text'] !== "undefined") {
    karabiner_notification_message = commands['help_text'];
    commands = (commands as StickySublayerHelper).commands
  }

  let base_to_if_alone: To[] = [];
  let base_to_after_key_up: To[] = [];
  let base_to: To[] = [];
  if (karabiner_notification_message !== false) {
    // It's a sticky sublayer
    base_to.push({
      set_notification_message: {
        id: "sublayer",
        text: karabiner_notification_message,
      }
	  })
	  base_to.push({
      set_variable: {
        name: "sublayer",
        value: sublayer_key,
      },
    })
  } else {
    base_to.push({
      set_variable: {
        name: subLayerVariableName,
        value: 1,
      },
    })
    base_to_after_key_up.push({
      set_variable: {
        name: subLayerVariableName,
        // The default value of a variable is 0: https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/conditions/variable/
        // That means by using 0 and 1 we can filter for "0" in the conditions below and it'll work on startup
        value: 0,
      },
    });
    base_to_if_alone = [{
      key_code: sublayer_key,
      modifiers: [
        "left_shift",
        "left_command",
        "left_control",
        "left_option",
      ],
    }];
  }

  let layer_definition: Manipulator = {
    description: `Toggle Hyper sublayer ${sublayer_key}`,
    type: "basic",
    from: {
      key_code: sublayer_key,
      modifiers: {
        optional: ["any"],
      },
    },

    to: base_to,
    // This enables us to press other sublayer keys in the current sublayer
    // (e.g. Hyper + O > M even though Hyper + M is also a sublayer)
    // basically, only trigger a sublayer if no other sublayer is active
    conditions: [
      ...allSubLayerVariables
        .filter(
          (subLayerVariable) => subLayerVariable !== subLayerVariableName
        )
        .map((subLayerVariable) => ({
          name: subLayerVariable,
          type: "variable_if" as const,
          value: 0,
        })),
      {
        name: "sublayer",
        type: "variable_if" as const,
        value: 0,
      },
      {
        name: "hyper",
        type: "variable_if",
        value: 1,
      },
    ],
  };

  if (base_to_if_alone.length) {
    layer_definition.to_if_alone = base_to_if_alone;
  }
  if (base_to_after_key_up.length) {
    layer_definition.to_after_key_up = base_to_after_key_up;
  }

  return [
    // When Hyper + sublayer_key is pressed, set the variable to 1; on key_up, set it to 0 again
    layer_definition,
    // Define the individual commands that are meant to trigger in the sublayer
    ...(Object.keys(commands) as (keyof typeof commands)[]).map(
      (command_key): Manipulator => {
        let command = commands[command_key] as LayerCommand|StickyDescriptor;
        let sticky = false;
        if (karabiner_notification_message !== false) {
          sticky = true;
        }
        if (typeof command['help_text'] !== "undefined") {
          command = (command as StickyDescriptor).command;
          sticky = true;
        }
        // Just to calm typescript down.
        command = command as LayerCommand;
        // if (typeof command['to'] === "undefined") {
        //   command.to = [];
        // }
        let conditions;
        if (sticky === false) {
          conditions = [
            {
			  name: subLayerVariableName,
              type: "variable_if",
              value: 1,
            },
          ];
        } else {
          command.to.unshift({
            set_variable: {
              name: "sublayer",
              // The default value of a variable is 0: https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/conditions/variable/
              // That means by using 0 and 1 we can filter for "0" in the conditions below and it'll work on startup
              value: 0,
            },
          });
          conditions = [
            {
			  name: "sublayer",
              type: "variable_if",
              value: sublayer_key,
            },
          ];
        }
        command.to.unshift({
            set_notification_message: {
                id: "sublayer",
                text: ""
            }
        });
        return {
          ...command,
          type: "basic" as const,
          from: {
            key_code: command_key,
            modifiers: {
              optional: ["any"],
            },
          },
          // Only trigger this command if the variable is 1 (i.e., if Hyper + sublayer is held)
          conditions: conditions,
        }
      }
    ),
  ];
}

export function stickyLayer(header: string, commands: {
  [key_code in KeyCode]?: StickyDescriptor;
}): StickySublayerHelper {
  let help_texts: string[] = [];
  let return_commands = {};
  Object.entries(commands).forEach(([key, value]) => {
    let tmp = value;
    help_texts.push(`${key.toUpperCase()} - ${tmp.help_text}`);
    return_commands[key] = tmp.command;
  });
  let help_text = `${header}\n\n${help_texts.join("\n")}`;

  return {
    help_text: help_text,
    commands: return_commands,
  }
}

export function layerHelper(description: string, layerCommand: LayerCommand): StickyDescriptor {
  return {help_text: description, command: layerCommand};
}

export function clearSublayerWith(keycode: KeyCode): Manipulator {
  return {
    description: `Reset layer with ${keycode}`,
    from: {
      "key_code": keycode,
    },
    to: [
      {
        set_variable: {
            "name": "sublayer",
            "value": 0
        }
      },
      {
        set_notification_message: {
          id: "sublayer",
          text: ""
        }
      }
    ],
    conditions: [
      {
		name: "sublayer",
        type: "variable_unless",
        value: 0,
      }
    ],
    type: "basic",
  }
}



/**
 * Create all hyper sublayers. This needs to be a single function, as well need to
 * have all the hyper variable names in order to filter them and make sure only one
 * activates at a time
 */
export function generateAllHyperSubLayers(subLayers: {
  [key_code in KeyCode]?: StickySublayerHelper | HyperKeySublayer | LayerCommand;
}): KarabinerRules[] {
  const allSubLayerVariables = (
    Object.keys(subLayers) as (keyof typeof subLayers)[]
  )
  .filter(sublayer_key => {
    if (typeof subLayers[sublayer_key] === "undefined") {
      return false;
    } else if (typeof subLayers[sublayer_key] === "string") {
      return false;
    } else if (Object.keys(subLayers[sublayer_key]).filter(k => k != "to").length == 0) {
      return false;
    }
    return true;
  })
  .map((sublayer_key) => generateSubLayerVariableName(sublayer_key));


	return Object.entries(subLayers).map(([key, value]) => {
		if ("to" in value) {
      // Simple remap
			return {
				description: `Hyper Key + ${key}`,
				manipulators: [
					{
						...value,
						type: "basic" as const,
						from: {
							key_code: key as KeyCode,
							modifiers: {
								optional: ["any"],
							},
						},
						conditions: [
							{
								name: "hyper",
								type: "variable_if",
								value: 1,
							},
							{
								name: "sublayer",
								type: "variable_if" as const,
								value: 0,
							},
							...allSubLayerVariables.map((subLayerVariable) => ({
								name: subLayerVariable,
								type: "variable_if" as const,
								value: 0,
							})),

						],
					},
				],
			};
		} else {
      // Sublayer
			return {
				description: `Hyper Key sublayer "${key}"`,
				manipulators: createHyperSubLayer(
					key as KeyCode,
					value,
					allSubLayerVariables
				),
			}
		}
	});
}

function generateSubLayerVariableName(key: KeyCode) {
  return `hyper_sublayer_${key}`;
}

/**
 * Shortcut for "open" shell command
 */
export function open(...what: string[]): LayerCommand {
  return {
    to: what.map((w) => ({
      shell_command: `open ${w}`,
    })),
    description: `Open ${what.join(" & ")}`,
  };
}

export function open_bundle(bundle_identifier: string): LayerCommand {
  return {
    to: [{
      software_function: {
        open_application: {
          bundle_identifier: bundle_identifier
        }
      }
    }],
  }
}

/**
 * Utility function to create a LayerCommand from a tagged template literal
 * where each line is a shell command to be executed.
 */
export function shell(
  strings: TemplateStringsArray,
  ...values: any[]
): LayerCommand {
  const commands = strings.reduce((acc, str, i) => {
    const value = i < values.length ? values[i] : "";
    const lines = (str + value)
      .split("\n")
      .filter((line) => line.trim() !== "");
    acc.push(...lines);
    return acc;
  }, [] as string[]);

  return {
    to: commands.map((command) => ({
      shell_command: command.trim(),
    })),
    description: commands.join(" && "),
  };
}

export function shell_command(commands: string[]) {
  return {
    to: commands.map((command) => ({
      shell_command: command.trim(),
    })),
    description: commands.join(" && "),
  };
}

export function shortcut(key: string, modifiers: string[]) {
    let mods = [] as string[];
    if (modifiers.includes("cmd") || modifiers.includes("command")) {
        mods.push(`command down`);
    }
    if (modifiers.includes("control") || modifiers.includes("ctrl")) {
        mods.push(`control down`);
    }
    if (modifiers.includes("alt") || modifiers.includes("option")) {
        mods.push(`option down`);
    }
    if (modifiers.includes("shift")) {
        mods.push(`shift down`);
    }
    let modstring = "";
    if (mods.length) {
        modstring = ` using {${mods.join(", ")}}`;
    }

    let keystroke = `keystroke "${key}"`;
    if (key == "f1") {
        keystroke = " key code 122";
    }
    if (key == "f2") {
        keystroke = " key code 120";
    }
    if (key == "f3") {
        keystroke = " key code 99";
    }
    if (key == "f4") {
        keystroke = " key code 118";
    }
    if (key == "f5") {
        keystroke = " key code 96";
    }
    if (key == "f6") {
        keystroke = " key code 97";
    }
    if (key == "f7") {
        keystroke = " key code 98";
    }
    if (key == "f8") {
        keystroke = " key code 100";
    }
    if (key == "f9") {
        keystroke = " key code 101";
    }
    if (key == "f10") {
        keystroke = " key code 109";
    }
    if (key == "f11") {
        keystroke = " key code 103";
    }
    if (key == "f12") {
        keystroke = " key code 111";
    }

    if (key == "f13") {
        keystroke = " key code 105";
    }
    if (key == "f14") {
        keystroke = " key code 107";
    }
    if (key == "f15") {
        keystroke = " key code 113";
    }
    if (key == "f16") {
        keystroke = " key code 106";
    }
    if (key == "f17") {
        keystroke = " key code 64";
    }
    if (key == "f18") {
        keystroke = " key code 79";
    }
    if (key == "f19") {
        keystroke = " key code 80";
    }
    if (key == "f20") {
        keystroke = " key code 90";
    }


    return shell_command([`osascript -e 'tell application "System Events" to ${keystroke}${modstring}'`]);
}

export function switch_karabiner_profile(name: string, message?: string) {
  message = message || `Switched karabiner profile: ${name}`;
  return shell_command([`'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile '${name}' && ${raycast_notification_command(message)}`]);
//   return shell_command([`'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile '${name}' && osascript -e 'display notification "${name}" with title "Switched karabiner profile"'`]);
}

/**
 * Shortcut for managing window sizing with Rectangle
 */
export function rectangle(name: string): LayerCommand {
  return {
    to: [
      {
        shell_command: `open -g rectangle://execute-action?name=${name}`,
      },
    ],
    description: `Window: ${name}`,
  };
}

/**
 * Shortcut for "Open an app" command (of which there are a bunch)
 */
export function app(name: string): LayerCommand {
  return open(`-a '${name}.app'`);
}

export function app_with_notification(appname: string): LayerCommand {
//   let grep_regex = `[${appname.substring(0,1)}]${appname.substring(1)}$`;
//   let check_command = `ps axo pid,command | grep '${grep_regex}'`;
  let check_command = `pgrep -f '${appname}' > /dev/null`;
  
  let notification_command = raycast_notification_command(`Opening ${appname}`); // `open -g 'raycast://extensions/maxnyby/raycast-notification/index?launchType=background&arguments=${encodeURIComponent(JSON.stringify({title: `Opening ${appname}`, type: "success"}))}'`;

  return {
        to: [{
          shell_command: `(${check_command} || ${notification_command}) && open -a '${appname}'`,
        }],
        description: `Open ${appname}`,
  };
}

export function raycast_notification_command(notification_text: string) {
    return `open -g 'raycast://extensions/maxnyby/raycast-notification/index?launchType=background&arguments=${encodeURIComponent(JSON.stringify({title: notification_text, type: "success"}))}'`;
}




export const basicRemap = (key_code: KeyCode, modifiers?: string[]): LayerCommand => {
  if (typeof modifiers !== "undefined") {
    return {
      to: [{
        key_code: key_code,
        modifiers: modifiers,
      }]
    };
  } else {
    return {
      to: [{
        key_code: key_code,
      }]
    };
  }
}

export const standardHyperkey = (key_code) => {
  return {
    to: [{
      key_code: key_code,
      modifiers: [
        "left_shift",
        "left_command",
        "left_control",
        "left_option",
      ],
    }]
  }
}

const fallbacks = {};
[
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'hyphen',
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  'a',
  's',
  'd',
  'f',
  'h',
  'g',
  'j',
  'k',
  'l',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
  'f13',
  'f14',
  'f15',
  'f16',
  'f17',
  'f18',
  'f19',
  'f20',
  'f21',
  'f22',
  'f23',
  'f24',
  'left_arrow',
  'up_arrow',
  'right_arrow',
  'down_arrow',
  'home',
  'end',
  'page_up',
  'page_down',

  'return_or_enter',
  'escape',
  'delete_or_backspace',
  'delete_forward',
  'tab',
  'spacebar',
  'hyphen',
  'equal_sign',
  'open_bracket',
  'close_bracket',
  'backslash',
  'non_us_pound',
  'semicolon',
  'quote',
  'grave_accent_and_tilde',
  'comma',
  'period',
  'slash',
  'non_us_backslash',
].forEach(key_code => {
  fallbacks[key_code] = standardHyperkey(key_code)
});

export { fallbacks };


export const fn_function_keys = {
  "description": "Fn keys are normal function keys",
  "manipulators": [
    {
      "type": "basic",
      "from": {
        "key_code": "f1",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_decrement"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f1",
      },
      "to": [
        {
          "key_code": "f1",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f2",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_increment"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f2",
      },
      "to": [
        {
          "key_code": "f2",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f3",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "apple_vendor_keyboard_key_code": "mission_control"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f3",
      },
      "to": [
        {
          "key_code": "f3",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f4",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f4"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f4",
      },
      "to": [
        {
          "key_code": "f4",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f5",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_down"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f5",
      },
      "to": [
        {
          "key_code": "f5",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f6",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_up"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f6",
      },
      "to": [
        {
          "key_code": "f6",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f7",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "rewind"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f7",
      },
      "to": [
        {
          "key_code": "f7",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f8",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "play_or_pause"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f8",
      },
      "to": [
        {
          "key_code": "f8",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f9",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "fast_forward"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f9",
      },
      "to": [
        {
          "key_code": "f9",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f10",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "mute"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f10",
      },
      "to": [
        {
          "key_code": "f10",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f11",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "volume_decrement"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f11",
      },
      "to": [
        {
          "key_code": "f11",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f12",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "consumer_key_code": "volume_increment"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f12",
      },
      "to": [
        {
          "key_code": "f12",
        }
      ]
    },
  ]
};

export const fn_media_keys = {
  "description": "Fn keys are normal function keys",
  "manipulators": [
    {
      "type": "basic",
      "from": {
        "key_code": "f1",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f1",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f1",
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_decrement"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f2",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f2",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f2",
      },
      "to": [
        {
          "consumer_key_code": "display_brightness_increment"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f3",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f3",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f3",
      },
      "to": [
        {
          "apple_vendor_keyboard_key_code": "mission_control"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f4",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f4",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f4",
      },
      "to": [
        {
          "key_code": "f4"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f5",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f5",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f5",
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_down"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f6",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f6",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f6",
      },
      "to": [
        {
          "apple_vendor_top_case_key_code": "illumination_up"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f7",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f7",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f7",
      },
      "to": [
        {
          "consumer_key_code": "rewind"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f8",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f8",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f8",
      },
      "to": [
        {
          "consumer_key_code": "play_or_pause"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f9",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f9",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f9",
      },
      "to": [
        {
          "consumer_key_code": "fast_forward"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f10",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f10",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f10",
      },
      "to": [
        {
          "consumer_key_code": "mute"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f11",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f11",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f11",
      },
      "to": [
        {
          "consumer_key_code": "volume_decrement"
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f12",
        "modifiers": {
          "mandatory": [
            "fn",
          ],
        }
      },
      "to": [
        {
          "key_code": "f12",
        }
      ]
    },
    {
      "type": "basic",
      "from": {
        "key_code": "f12",
      },
      "to": [
        {
          "consumer_key_code": "volume_increment"
        }
      ]
    },
  ]
};