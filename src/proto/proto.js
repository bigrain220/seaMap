/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/light";

const $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.addJSON({
  center: {
    options: {
      java_package: "com.coneall.schedule.console.dto",
      java_outer_classname: "VesselProto"
    },
    nested: {
      Push: {
        fields: {
          type: {
            type: "Type",
            id: 1
          },
          time: {
            type: "int64",
            id: 2
          },
          body: {
            type: "bytes",
            id: 3
          }
        },
        nested: {
          Type: {
            values: {
              UNKNOWN: 0,
              COM_PORT: 1,
              SERIAL_PORT: 2,
              WIND: 3,
              HOOK_STATION: 4,
              HOOK_RELEASE: 5,
              TERMINAL: 6,
              LASER: 7,
              LASER_POWER: 8,
              TEMPERATURE: 9,
              HUMIDITY: 10,
              WAVE: 11,
              PRESSURE: 12,
              CURRENT: 13,
              TIDE: 14,
              VISIBILITY: 15,
              RAIN: 16,
              DLD: 17,
              TERMINAL_INFO: 18,
              WARNING: 19
            }
          }
        }
      },
      Warning: {
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          srv: {
            type: "int64",
            id: 2
          },
          start: {
            type: "int64",
            id: 3
          },
          filed: {
            type: "int32",
            id: 4
          },
          flag: {
            type: "Flag",
            id: 5
          },
          state: {
            type: "State",
            id: 6
          }
        },
        nested: {
          Flag: {
            values: {
              NORMAL: 0,
              ALERT: 1,
              WARN: 2
            }
          },
          State: {
            values: {
              UNREAD: 0,
              CONFIRM: 1
            }
          }
        }
      },
      Terminal: {
        oneofs: {
          _L: {
            oneof: [
              "L"
            ]
          },
          _R: {
            oneof: [
              "R"
            ]
          },
          _ange: {
            oneof: [
              "ange"
            ]
          }
        },
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          L: {
            type: "Laser",
            id: 2,
            options: {
              proto3_optional: true
            }
          },
          R: {
            type: "Laser",
            id: 3,
            options: {
              proto3_optional: true
            }
          },
          ange: {
            type: "sint32",
            id: 4,
            options: {
              proto3_optional: true
            }
          }
        }
      },
      Laser: {
        fields: {
          dis: {
            type: "sint32",
            id: 1
          },
          spd: {
            type: "sint32",
            id: 2
          }
        }
      },
      TerminalInfo: {
        oneofs: {
          _vessel: {
            oneof: [
              "vessel"
            ]
          },
          _dir: {
            oneof: [
              "dir"
            ]
          }
        },
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          mode: {
            type: "Mode",
            id: 2
          },
          vessel: {
            type: "int64",
            id: 3,
            options: {
              proto3_optional: true
            }
          },
          dir: {
            type: "int32",
            id: 4,
            options: {
              proto3_optional: true
            }
          }
        },
        nested: {
          Mode: {
            values: {
              OFF: 0,
              APPROACH: 1,
              MOORING: 2,
              DEPARTURE: 3
            }
          }
        }
      },
      Wind: {
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          spd: {
            type: "int32",
            id: 2
          },
          dir: {
            type: "int32",
            id: 3
          },
          flag: {
            type: "Flag",
            id: 4
          }
        },
        nested: {
          Flag: {
            values: {
              NORMAL: 0,
              ALERT: 1,
              WARN: 2
            }
          }
        }
      },
      Tide: {
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          height: {
            type: "sint32",
            id: 2
          },
          tendency: {
            type: "Tendency",
            id: 3
          }
        },
        nested: {
          Tendency: {
            values: {
              NORMAL: 0,
              DOWN: 1,
              UP: 2
            }
          }
        }
      },
      Area: {
        fields: {
          id: {
            type: "int64",
            id: 1
          },
          time: {
            type: "int64",
            id: 2
          },
          content: {
            rule: "repeated",
            type: "Vessel",
            id: 3
          }
        }
      },
      Vessel: {
        fields: {
          mmsi: {
            type: "fixed32",
            id: 1
          },
          lat: {
            type: "fixed32",
            id: 2
          },
          lon: {
            type: "fixed32",
            id: 3
          },
          name: {
            type: "string",
            id: 4
          },
          width: {
            type: "int32",
            id: 5
          },
          length: {
            type: "int32",
            id: 6
          },
          type: {
            type: "int32",
            id: 7
          },
          status: {
            type: "int32",
            id: 8
          },
          cog: {
            type: "int32",
            id: 9
          },
          sog: {
            type: "int32",
            id: 10
          },
          cost: {
            type: "int32",
            id: 11
          }
        }
      }
    }
  }
});

export { $root as default };
