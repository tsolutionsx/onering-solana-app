const plugin = require("tailwindcss/plugin");

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    // console.log(opacityValue);
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: "class",
  // important: true,
  theme: {
    extend: {
      placeholderColor: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      textColor: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      backgroundColor: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      gradientColorStops: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      stroke: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      borderColor: {
        skin: {
          base: withOpacity("--base"),
          muted: withOpacity("--muted"),
          inverted: withOpacity("--inverted"),
          hover: withOpacity("--hover"),
          accent: withOpacity("--accent"),
          transparent: withOpacity("--transparent"),
          body: withOpacity("--body"),
          light: withOpacity("--light"),
          gradient1: withOpacity("--gradient1"),
          gradient2: withOpacity("--gradient2"),
          gradient3: withOpacity("--gradient3"),
          gradient4: withOpacity("--gradient4"),
        },
      },
      backgroundImage: {
        main: "var(--background)",
        tower: "url('../public/bg-dark.svg')",
        rivendell: "url('../public/bg-light.svg')",
        solanaTower: "url('../public/bg-solana.svg')",
        oneusd:
          "linear-gradient(rgba(25, 24, 0, 0.3), rgba(0, 0, 0, 0.2)), url('../public/oneusd-clear2.svg')",
        darkoneusd:
          "linear-gradient(rgba(25, 24, 0, 0.6), rgba(0, 0, 0, 1)), url('../public/oneusd-clear2.svg')",
        totalstaked: "linear-gradient(32deg, white 0%, #dcdada 100%)",
        totalrewards: "linear-gradient(32deg, #ff782b 0%, #FF5D00 100%)",
      },
      transitionProperty: {
        height: "height",
      },
      fontFamily: {
        futuraPT: ["Futura PT"],
        futuraPTHeavy: ["Futura PT-Heavy"],
        inter: ["Inter"],
      },
      colors: {
        darker: "#0C0C0C",
        dark: "#1C1C1C",
        light: "#F6F6F6",
        ringpurple: "#CEB7FF",
        ringorange: "#FF5D00",

        solanapurple: "#9945FF",
        solanagreen: "#14F195",

        usdcFrom: "#27B6CA",
        usdtFrom: "#96F537",
        daiFrom: "#F5C037",

        usdcTo: "#2775CA",
        usdtTo: "#33D373",
        daiTo: "#FF5D00",

        buttonFrom: "#FF5D00",
        buttonTo: "#EB0000",

        colorFrom: "#27B6CA",
        colorTo: "#2775CA",
      },

      boxShadow: {
        default:
          "0px 16px 24px rgba(0, 0, 0, 0.16), 0px 24px 32px rgba(0, 0, 0, 0.16), 0px 32px 40px rgba(0, 0, 0, 0.16), 0px 40px 48px rgba(0, 0, 0, 0.16), inset 0px 2px 2px rgba(255, 255, 255, 0.12)",
        box: "0px 16px 24px rgba(0, 0, 0, 0.16), 0px 24px 32px rgba(0, 0, 0, 0.16), 0px 32px 40px rgba(0, 0, 0, 0.16), 0px 40px 48px rgba(0, 0, 0, 0.16), inset 0px 2px 2px rgba(255, 255, 255, 0.12)",
        lightDropdown:
          "0px 4px 6px rgba(0, 0, 0, 0.14), 0px 6px 8px rgba(0, 0, 0, 0.14), 0px 8px 10px rgba(0, 0, 0, 0.14), 0px 10px 12px rgba(0, 0, 0, 0.14), inset 0px 1px 1px rgba(255, 255, 255, 0.14)",
        dropdown:
          "0px 4px 6px rgba(0, 0, 0, 0.24), 0px 6px 8px rgba(0, 0, 0, 0.24), 0px 8px 10px rgba(0, 0, 0, 0.24), 0px 10px 12px rgba(0, 0, 0, 0.24), inset 0px 1px 1px rgba(255, 255, 255, 0.24)",
        internal:
          "inset 2px 2px 4px rgba(0, 0, 0, 0.32), inset -2px -2px 1px rgba(255, 255, 255, 0.08)",
        buttonElevation:
          "0px 4px 6px rgba(0, 0, 0, 0.24), 0px 6px 8px rgba(0, 0, 0, 0.24), 0px 8px 10px rgba(0, 0, 0, 0.24), 0px 10px 12px rgba(0, 0, 0, 0.24), inset 0px 1px 1px rgba(255, 255, 255, 0.24)",
        buttonDisabled:
          "inset 2px 2px 4px rgba(0, 0, 0, 0.32), inset -2px -2px 1px rgba(255, 255, 255, 0.08)",
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [
    // plugin(function ({ addVariant }) {
    //   addVariant("solana", "&:solana");
    // }),
    require("daisyui"),
    // require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
};
