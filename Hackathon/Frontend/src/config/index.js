const config = {
  production: {
    url: "",
    apiUrl: "https://10n8c9f374.execute-api.ap-south-1.amazonaws.com/dev/",
  },
  // develop: {
  //   url: "",
  //   apiUrl: "https://sns5pillars.in/api/v1/",
  //   bucketName: "okr-automation-dev",
  //   region: "ap-south-1",
  // },
  local: {
    // url: "https://okr-backend-1zq6.onrender.com",
    // apiUrl: "https://okr-backend-1zq6.onrender.com/api/v1/",
    url: "http://localhost:4050",
    apiUrl: "http://localhost:4050/api/v2/",
    bucketName: "okr-automation-dev",
    region: "ap-south-1",
  },
};

export const environment = "local";
// https://okr-automation-dev.s3.ap-south-1.amazonaws.com/documents/kanimozhi_1721034525135.pdf

const hostConfig = {
  WEB_URL: config[environment].url,
  IMAGE_URL: `https://${config[environment].bucketName}.s3.ap-south-1.amazonaws.com`,
  API_URL: config[environment].apiUrl,
  S3_BUCKET: `${config[environment].bucketName}`,
  REGION: `${config[environment].region}`,
};

export { hostConfig };
