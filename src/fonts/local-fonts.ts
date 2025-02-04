import localFont from "next/font/local";

export const IRANYekan = localFont({
  src: [
    {
      path: "./IranYekan/iranyekan_thin.woff",
      weight: "100",
    },
    {
      path: "./IranYekan/iranyekan_light.woff2",
      weight: "300",
    },
    {
      path: "./IranYekan/iranyekan_regular.woff2",
      weight: "400",
    },
    {
      path: "./IranYekan/iranyekan_medium.woff",
      weight: "500",
    },
    {
      path: "./IranYekan/iranyekan_bold.woff2",
      weight: "700",
    },
    {
      path: "./IranYekan/iranyekan_extrabold.woff",
      weight: "800",
    },
    {
      path: "./IranYekan/iranyekan_black.woff",
      weight: "900",
    },
    {
      path: "./IranYekan/iranyekan_extrablack.woff",
      weight: "950",
    },
  ],
  variable: "--font-iranyekan",
});
