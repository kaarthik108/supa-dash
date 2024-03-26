"use client";

// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/geo
import { ResponsiveChoropleth } from "@nivo/geo";
import countries from "./world_countries.json";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsiveChoropleth = () => (
  <ResponsiveChoropleth
    data={data}
    features={countries.features}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    colors="nivo"
    domain={[0, 1000000]}
    unknownColor="#666666"
    label="properties.name"
    valueFormat=".2s"
    projectionScale={90}
    projectionTranslation={[0.5, 0.7]}
    projectionRotation={[0, 0, 0]}
    borderWidth={0.5}
    borderColor="#152538"
    //  legends={[
    //    {
    //      anchor: "bottom-left",
    //      direction: "column",
    //      justify: true,
    //      translateX: 20,
    //      translateY: -100,
    //      itemsSpacing: 0,
    //      itemWidth: 94,
    //      itemHeight: 18,
    //      itemDirection: "left-to-right",
    //      itemTextColor: "#444444",
    //      itemOpacity: 0.85,
    //      symbolSize: 18,
    //      effects: [
    //        {
    //          on: "hover",
    //          style: {
    //            itemTextColor: "#000000",
    //            itemOpacity: 1,
    //          },
    //        },
    //      ],
    //    },
    //  ]}
  />
);

const data = [
  {
    id: "AFG",
    value: 190774,
  },
  {
    id: "AGO",
    value: 141794,
  },
  {
    id: "ALB",
    value: 183679,
  },
  {
    id: "ARE",
    value: 386660,
  },
  {
    id: "ARG",
    value: 559988,
  },
  {
    id: "ARM",
    value: 983224,
  },
  {
    id: "ATA",
    value: 925395,
  },
  {
    id: "ATF",
    value: 301926,
  },
  {
    id: "AUT",
    value: 434055,
  },
  {
    id: "AZE",
    value: 263795,
  },
  {
    id: "BDI",
    value: 133696,
  },
  {
    id: "BEL",
    value: 467626,
  },
  {
    id: "BEN",
    value: 316976,
  },
  {
    id: "BFA",
    value: 35896,
  },
  {
    id: "BGD",
    value: 171344,
  },
  {
    id: "BGR",
    value: 565797,
  },
  {
    id: "BHS",
    value: 488556,
  },
  {
    id: "BIH",
    value: 494398,
  },
  {
    id: "BLR",
    value: 560247,
  },
  {
    id: "BLZ",
    value: 890655,
  },
  {
    id: "BOL",
    value: 594196,
  },
  {
    id: "BRN",
    value: 948742,
  },
  {
    id: "BTN",
    value: 850392,
  },
  {
    id: "BWA",
    value: 269828,
  },
  {
    id: "CAF",
    value: 948882,
  },
  {
    id: "CAN",
    value: 547912,
  },
  {
    id: "CHE",
    value: 140150,
  },
  {
    id: "CHL",
    value: 73134,
  },
  {
    id: "CHN",
    value: 583199,
  },
  {
    id: "CIV",
    value: 663524,
  },
  {
    id: "CMR",
    value: 161062,
  },
  {
    id: "COG",
    value: 253401,
  },
  {
    id: "COL",
    value: 902175,
  },
  {
    id: "CRI",
    value: 733212,
  },
  {
    id: "CUB",
    value: 919716,
  },
  {
    id: "-99",
    value: 434699,
  },
  {
    id: "CYP",
    value: 14588,
  },
  {
    id: "CZE",
    value: 215715,
  },
  {
    id: "DEU",
    value: 935163,
  },
  {
    id: "DJI",
    value: 871201,
  },
  {
    id: "DNK",
    value: 163604,
  },
  {
    id: "DOM",
    value: 299660,
  },
  {
    id: "DZA",
    value: 218561,
  },
  {
    id: "ECU",
    value: 919340,
  },
  {
    id: "EGY",
    value: 811601,
  },
  {
    id: "ERI",
    value: 739924,
  },
  {
    id: "ESP",
    value: 813731,
  },
  {
    id: "EST",
    value: 209805,
  },
  {
    id: "ETH",
    value: 32081,
  },
  {
    id: "FIN",
    value: 527658,
  },
  {
    id: "FJI",
    value: 446948,
  },
  {
    id: "FLK",
    value: 971239,
  },
  {
    id: "FRA",
    value: 94981,
  },
  {
    id: "GAB",
    value: 410970,
  },
  {
    id: "GBR",
    value: 791398,
  },
  {
    id: "GEO",
    value: 823517,
  },
  {
    id: "GHA",
    value: 591861,
  },
  {
    id: "GIN",
    value: 506109,
  },
  {
    id: "GMB",
    value: 292445,
  },
  {
    id: "GNB",
    value: 72414,
  },
  {
    id: "GNQ",
    value: 484470,
  },
  {
    id: "GRC",
    value: 236607,
  },
  {
    id: "GTM",
    value: 571233,
  },
  {
    id: "GUY",
    value: 912321,
  },
  {
    id: "HND",
    value: 667778,
  },
  {
    id: "HRV",
    value: 929801,
  },
  {
    id: "HTI",
    value: 895773,
  },
  {
    id: "HUN",
    value: 284657,
  },
  {
    id: "IDN",
    value: 496452,
  },
  {
    id: "IND",
    value: 139286,
  },
  {
    id: "IRL",
    value: 141921,
  },
  {
    id: "IRN",
    value: 992678,
  },
  {
    id: "IRQ",
    value: 36588,
  },
  {
    id: "ISL",
    value: 416740,
  },
  {
    id: "ISR",
    value: 960700,
  },
  {
    id: "ITA",
    value: 381737,
  },
  {
    id: "JAM",
    value: 276647,
  },
  {
    id: "JOR",
    value: 55513,
  },
  {
    id: "JPN",
    value: 356395,
  },
  {
    id: "KAZ",
    value: 72024,
  },
  {
    id: "KEN",
    value: 692492,
  },
  {
    id: "KGZ",
    value: 819096,
  },
  {
    id: "KHM",
    value: 592715,
  },
  {
    id: "OSA",
    value: 303140,
  },
  {
    id: "KWT",
    value: 579684,
  },
  {
    id: "LAO",
    value: 307653,
  },
  {
    id: "LBN",
    value: 829732,
  },
  {
    id: "LBR",
    value: 443356,
  },
  {
    id: "LBY",
    value: 897578,
  },
  {
    id: "LKA",
    value: 515362,
  },
  {
    id: "LSO",
    value: 8151,
  },
  {
    id: "LTU",
    value: 29695,
  },
  {
    id: "LUX",
    value: 248088,
  },
  {
    id: "LVA",
    value: 996728,
  },
  {
    id: "MAR",
    value: 952503,
  },
  {
    id: "MDA",
    value: 472895,
  },
  {
    id: "MDG",
    value: 400298,
  },
  {
    id: "MEX",
    value: 104796,
  },
  {
    id: "MKD",
    value: 86909,
  },
  {
    id: "MLI",
    value: 159396,
  },
  {
    id: "MMR",
    value: 151081,
  },
  {
    id: "MNE",
    value: 423758,
  },
  {
    id: "MNG",
    value: 358235,
  },
  {
    id: "MOZ",
    value: 187162,
  },
  {
    id: "MRT",
    value: 156253,
  },
  {
    id: "MWI",
    value: 636719,
  },
  {
    id: "MYS",
    value: 849294,
  },
  {
    id: "NAM",
    value: 484348,
  },
  {
    id: "NCL",
    value: 378303,
  },
  {
    id: "NER",
    value: 238199,
  },
  {
    id: "NGA",
    value: 528423,
  },
  {
    id: "NIC",
    value: 3773,
  },
  {
    id: "NLD",
    value: 758359,
  },
  {
    id: "NOR",
    value: 376704,
  },
  {
    id: "NPL",
    value: 987257,
  },
  {
    id: "NZL",
    value: 822952,
  },
  {
    id: "OMN",
    value: 12716,
  },
  {
    id: "PAK",
    value: 109293,
  },
  {
    id: "PAN",
    value: 782055,
  },
  {
    id: "PER",
    value: 833569,
  },
  {
    id: "PHL",
    value: 921274,
  },
  {
    id: "PNG",
    value: 295583,
  },
  {
    id: "POL",
    value: 256470,
  },
  {
    id: "PRI",
    value: 254339,
  },
  {
    id: "PRT",
    value: 102848,
  },
  {
    id: "PRY",
    value: 515044,
  },
  {
    id: "QAT",
    value: 550434,
  },
  {
    id: "ROU",
    value: 900109,
  },
  {
    id: "RUS",
    value: 914506,
  },
  {
    id: "RWA",
    value: 773213,
  },
  {
    id: "ESH",
    value: 984414,
  },
  {
    id: "SAU",
    value: 17386,
  },
  {
    id: "SDN",
    value: 945266,
  },
  {
    id: "SDS",
    value: 812969,
  },
  {
    id: "SEN",
    value: 476477,
  },
  {
    id: "SLB",
    value: 823057,
  },
  {
    id: "SLE",
    value: 697914,
  },
  {
    id: "SLV",
    value: 571992,
  },
  {
    id: "ABV",
    value: 710727,
  },
  {
    id: "SOM",
    value: 634693,
  },
  {
    id: "SRB",
    value: 722581,
  },
  {
    id: "SUR",
    value: 659070,
  },
  {
    id: "SVK",
    value: 450687,
  },
  {
    id: "SVN",
    value: 121473,
  },
  {
    id: "SWZ",
    value: 958336,
  },
  {
    id: "SYR",
    value: 296294,
  },
  {
    id: "TCD",
    value: 338019,
  },
  {
    id: "TGO",
    value: 81663,
  },
  {
    id: "THA",
    value: 926745,
  },
  {
    id: "TJK",
    value: 688559,
  },
  {
    id: "TKM",
    value: 246018,
  },
  {
    id: "TLS",
    value: 607117,
  },
  {
    id: "TTO",
    value: 29577,
  },
  {
    id: "TUN",
    value: 991725,
  },
  {
    id: "TUR",
    value: 426963,
  },
  {
    id: "TWN",
    value: 530308,
  },
  {
    id: "TZA",
    value: 705534,
  },
  {
    id: "UGA",
    value: 229838,
  },
  {
    id: "UKR",
    value: 755792,
  },
  {
    id: "URY",
    value: 229491,
  },
  {
    id: "USA",
    value: 621723,
  },
  {
    id: "UZB",
    value: 737463,
  },
  {
    id: "VEN",
    value: 101472,
  },
  {
    id: "VNM",
    value: 202508,
  },
  {
    id: "VUT",
    value: 327211,
  },
  {
    id: "PSE",
    value: 790894,
  },
  {
    id: "YEM",
    value: 672538,
  },
  {
    id: "ZAF",
    value: 687191,
  },
  {
    id: "ZMB",
    value: 359873,
  },
  {
    id: "ZWE",
    value: 654519,
  },
  {
    id: "KOR",
    value: 285346,
  },
];
