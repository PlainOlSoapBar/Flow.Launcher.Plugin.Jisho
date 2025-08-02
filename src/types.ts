export interface GetPackagesResponse {
  data: {
    data: [
      {
        japanese: [
          {
            word: string;
            reading: string;
          }
        ];
        senses: [
          {
            english_definitions: string;
          }
        ];
      }
    ];
  };
}
