import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        owner: string;
        repository: string;
        contributors_per_page: string;
        analyze: string;
        // Adicione outras chaves conforme necessário
      };
    };
  }
}
