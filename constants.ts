
import { JsonSapFilter, JsonWellTypeDefinition } from "./types";

export const WAREHOUSE_GROUPS = {
  GSJ: ['CS01', 'CS05', 'CS09', 'EH01', 'EH02', 'EH05', 'EH09', 'HE01'],
  CA: ['B001', 'B009']
};

export const WELL_GROUPS_MAPPING: Record<string, string> = {
  "Convencional": "Convencional",
  "NOC Premium + DwC": "NOC Premium + DwC",
  "NOC BTC": "NOC BTC"
};

// --- USER CONFIGURATION DATA ---

// JSON 1: Filter List & Categories
export const MATERIALS_DB: JsonSapFilter[] = [
  {
    "codigo_sap": "02050588",
    "descripcion": "Zto Guia 9.5/8\" 36 ppf K55 LC",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050618",
    "descripcion": "Zto CWD 9.5/8\"",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050699",
    "descripcion": "Zto Guia 36 ppf K55 LC 100004728",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120029",
    "descripcion": "Zto Flotador 9.5/8\" STC H40 32.3#",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120177",
    "descripcion": "Zto Guia 32.3 ppf STC Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050577",
    "descripcion": "IPV",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050571",
    "descripcion": "Collar 9.5/8\"",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050283",
    "descripcion": "Collar Flotador 9 5/8\" 32.3# H40 STC",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050348",
    "descripcion": "Collar Flotador 9 5/8\" 32.3# K55 STC NR",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120330",
    "descripcion": "Centraliz 9.5/8\" Bow Spring Non-Weld",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120352",
    "descripcion": "Centralizador 9.5/8\" Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050575",
    "descripcion": "Tapón Sup NR (p/32.3ppf)",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02180052",
    "descripcion": "Tapon Superior 9.5/8\" Convencional",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02180254",
    "descripcion": "Tapón Sup NR (p/32,3ppf) Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050569",
    "descripcion": "Manguera Top Job",
    "categoria": "Consumible"
  },
  {
    "codigo_sap": "02170122",
    "descripcion": "Anillo de Vinculación 9.5/8\"",
    "categoria": "Consumible"
  },
  {
    "codigo_sap": "02050622",
    "descripcion": "Sellador de Rosca",
    "categoria": "Consumible"
  },
  {
    "codigo_sap": "04010130",
    "descripcion": "Grasa Jet Run n Seal (kg)",
    "categoria": "Consumible"
  },
  {
    "codigo_sap": "02120334",
    "descripcion": "Zto Flot 17 ppf K55 LC",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050574",
    "descripcion": "Zto Flot 17 ppf K55 LC Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050619",
    "descripcion": "Zto 5.5\" BTC",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02120333",
    "descripcion": "Collar Flot 17 ppf K55 LC",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050576",
    "descripcion": "Collar Flot 17 ppf K55 LC Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050620",
    "descripcion": "Collar BTC 5.5\" P110 14-23#",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02120331",
    "descripcion": "Centraliz 5.1/2\" Bow Non-Weld",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120349",
    "descripcion": "Centraliz 5.1/2\" Bow Non-Weld",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120341",
    "descripcion": "Centraliz 5.1/2\" Bow Non-Weld Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120332",
    "descripcion": "Centralizador Rígido",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02120336",
    "descripcion": "Stop Collar",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02180237",
    "descripcion": "Tapón Inf (p/17 ppf)",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050573",
    "descripcion": "Tapón Inf (p/17 ppf) Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02180236",
    "descripcion": "Tapón Sup (p/17 ppf)",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02050572",
    "descripcion": "Tapón Sup (p/17 ppf) Innovex",
    "categoria": "Convencional"
  },
  {
    "codigo_sap": "02180251",
    "descripcion": "Tapon Sup 5 1/2 HNBR",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02180252",
    "descripcion": "Tapon Inf 5 1/2 HNBR",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050299",
    "descripcion": "Collar 5 1/2 #20 TBL P110",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02120053",
    "descripcion": "Zapato 5 1/2 #20 TBL P110",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02140023",
    "descripcion": "Dv Tool 5.5\"",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02140077",
    "descripcion": "Dv Tool 5.5\"",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150207",
    "descripcion": "Contingencia Proilde",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150193",
    "descripcion": "PROILDE (Independiente) Sección A",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150190",
    "descripcion": "PROILDE (Independiente) Sección C",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150209",
    "descripcion": "Wenlen BRIDADO A+C+T",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150202",
    "descripcion": "Sección A (Wenlen)",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150203",
    "descripcion": "Sección C (Wenlen)",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150201",
    "descripcion": "Sección T (Wenlen)",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02150210",
    "descripcion": "Contingencia Wenlen",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02170053",
    "descripcion": "BRIDA COMPAÑERA 2.9/16 5M",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "09010412",
    "descripcion": "ANILLO P/BRID RING JOINT R27",
    "categoria": "Equipo"
  },
  {
    "codigo_sap": "16014953",
    "descripcion": "Wear Bushing",
    "categoria": "Equipo"
  },
  {
    "codigo_sap": "02170109",
    "descripcion": "O-Ring",
    "categoria": "Equipo"
  },
  {
    "codigo_sap": "02050689",
    "descripcion": "Niple Pin Pin 5.5' 3FT N80 LTC",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02050623",
    "descripcion": "CSG 9 5/8 32.3# H 40 STC R3",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02050624",
    "descripcion": "CSG 9 5/8 36# K 55 LTC R3",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02050625",
    "descripcion": "CSG 5 1/2 17# K 55 LTC R3",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050626",
    "descripcion": "CSG 5 1/2 17# N80Q LTC R3",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050702",
    "descripcion": "CSG 5 1/2 17# N80 TSH BLUE R3",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050627",
    "descripcion": "CSG 5 1/2 20# P110 TSH BLUE R3",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050690",
    "descripcion": "Niple 5 1/2\" 17# N80 1M TBL",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050700",
    "descripcion": "CSG 5 1/2\" 17# N80 TBL R1",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050629",
    "descripcion": "CSG 5 1/2 20# P110 TSH BLUE R1",
    "categoria": "NOC"
  },
  {
    "codigo_sap": "02050834",
    "descripcion": "CSG 5 1/2 17# N80 BTC R3",
    "categoria": "NOC BTC"
  },
  {
    "codigo_sap": "02050630",
    "descripcion": "CSC 5 1/2 20# P110 BTC R3",
    "categoria": "NOC BTC"
  },
  {
    "codigo_sap": "02050603",
    "descripcion": "CSG 5 1/2 20# P110 BTC R1",
    "categoria": "NOC BTC"
  },
  {
    "codigo_sap": "02050714",
    "descripcion": "Niple 5 1/2\" 17# N80 1M BTC",
    "categoria": "NOC BTC"
  },
  {
    "codigo_sap": "02060577",
    "descripcion": "XO 9.5/8\" 36# K55 TXP BTC PIN",
    "categoria": "CSG Drilling"
  },
  {
    "codigo_sap": "02050704",
    "descripcion": "CSG 9.5/8\" 32.3# H40 TXP BTC-LW",
    "categoria": "CSG Drilling"
  },
  {
    "codigo_sap": "02050705",
    "descripcion": "Niple de Maniobra 9.5/8\" 2FT K55",
    "categoria": "CSG Drilling"
  },
  {
    "codigo_sap": "02050578",
    "descripcion": "Cupla 9.5/8\" LTC K55",
    "categoria": "CSG Drilling"
  },
  {
    "codigo_sap": "02050597",
    "descripcion": "Cupla 9.5/8\" STC K55",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02050570",
    "descripcion": "CUPLA 5.1/2\" LTC 17# N80",
    "categoria": "Desarrollo"
  },
  {
    "codigo_sap": "02050582",
    "descripcion": "CUPLA 5.1/2\" LTC 17# K55",
    "categoria": "Desarrollo"
  }
];

// JSON 2: Requirements by Well Type
export const WELL_REQUIREMENTS_DB: JsonWellTypeDefinition[] = [
  {
    "tipo_pozo": "Convencional",
    "materiales": [
      {
        "etapa": "GUIA",
        "descripcion": "Zapato 9-5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050699"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02050588"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120029"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120177"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Collar 9-5/8\" + TPN Sup / IPV + TPN Sup",
        "alternativas": [
          {
            "es_kit": true,
            "componentes": [
              "02050283",
              "02180052"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050348",
              "02180254"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050577",
              "02180052"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050571",
              "02180052"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Centralizadores 9-5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120330"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120352"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Manguera Top Job",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050569"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Anillo de Vinculación 9.5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02170122"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Zapato 5-1/2\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120334"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02050574"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Collar 5-1/2\" + TPN Sup + TPN Inf",
        "alternativas": [
          {
            "es_kit": true,
            "componentes": [
              "02120333",
              "02180237",
              "02180236"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050576",
              "02050573",
              "02050572"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Centralizadores",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120331"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120349"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120341"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02120332",
              "02120336"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Niple Pin Pin 5.5\" 3FT N80 LTC",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050689"
            ]
          }
        ]
      },
      {
        "etapa": "CABEZAL",
        "descripcion": "Cabeza de pozo",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02150193"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02150202",
              "02150203",
              "02150201"
            ]
          }
        ]
      }
    ]
  },
  {
    "tipo_pozo": "NOC Premium + DwC",
    "materiales": [
      {
        "etapa": "GUIA",
        "descripcion": "Collar 9-5/8\" DwC",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050618"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "TPN Superior",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02180254"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Manguera Top Job",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050569"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Anillo de Vincluación 9.5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02170122"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Zapato 5-1/2\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120053"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120339"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Collar 5-1/2\" + TPN Sup + TPN Inf",
        "alternativas": [
          {
            "es_kit": true,
            "componentes": [
              "02050299",
              "02050572",
              "02050573"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Centralizadores",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120331"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120349"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120341"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02120332",
              "02120336"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "CABEZAL",
        "descripcion": "Cabeza de pozo",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02150199"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02150273",
              "02150246",
              "02150244"
            ]
          }
        ]
      },
      {
        "etapa": "CABEZAL",
        "descripcion": "Brida fractura 11 10M x 5.1/8\" 15M",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02170063"
            ]
          }
        ]
      }
    ]
  },
  {
    "tipo_pozo": "NOC BTC",
    "materiales": [
      {
        "etapa": "GUIA",
        "descripcion": "Zapato 9-5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050699"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02050588"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120029"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120177"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Collar 9-5/8\" + TPN Sup / IPV + TPN Sup",
        "alternativas": [
          {
            "es_kit": true,
            "componentes": [
              "02050283",
              "02180052"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050348",
              "02180254"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050577",
              "02180052"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02050571",
              "02180052"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Centralizadores 9-5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120330"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120352"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Manguera Top Job",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050569"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Anillo de Vincluación 9.5/8\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02170122"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "GUIA",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Zapato 5-1/2\"",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050619"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Collar 5-1/2\" + TPN Sup + TPN Inf",
        "alternativas": [
          {
            "es_kit": true,
            "componentes": [
              "02050620",
              "02050572",
              "02050573"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Centralizadores",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02120331"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120349"
            ]
          },
          {
            "es_kit": false,
            "componentes": [
              "02120341"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02120332",
              "02120336"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Sellador de Rosca",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02050622"
            ]
          }
        ]
      },
      {
        "etapa": "AISLACION",
        "descripcion": "Grasa Jet Run n Seal (kg)",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "04010130"
            ]
          }
        ]
      },
      {
        "etapa": "CABEZAL",
        "descripcion": "Cabeza de pozo",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02150199"
            ]
          },
          {
            "es_kit": true,
            "componentes": [
              "02150273",
              "02150246",
              "02150244"
            ]
          }
        ]
      },
      {
        "etapa": "CABEZAL",
        "descripcion": "Brida fractura 11 10M x 5.1/8\" 15M",
        "alternativas": [
          {
            "es_kit": false,
            "componentes": [
              "02170063"
            ]
          }
        ]
      }
    ]
  }
];
