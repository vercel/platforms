export const PCD_GITHUB_URL = "https://github.com/proofcarryingdata/pcd";

export const IS_PROD = process.env.NODE_ENV === "production";

export const ZUPASS_URL = IS_PROD
  ? "https://zupass.org/"
  : "https://zupass.org/";

export const PCDPASS_URL = IS_PROD
  ? "https://zupass.org/"
  : "http://localhost:3000/";

export const ZUPASS_SERVER_URL = IS_PROD
  ? "https://api.zupass.org/"
  : "https://api.zupass.org/";

export const PCDPASS_SERVER_URL = IS_PROD
  ? "https://api.pcdpass.xyz/"
  : "http://localhost:3002/";

export const ZUZALU_SEMAPHORE_GROUP_URL = IS_PROD
  ? "https://api.zupass.org/semaphore/1"
  : "http://localhost:3002/semaphore/1";

export const PCDPASS_SEMAPHORE_GROUP_URL = IS_PROD
  ? "https://api.pcdpass.xyz/semaphore/5"
  : "http://localhost:3002/semaphore/5";


export const PASSPORT_SERVER_URL = "https://api.pcd-passport.com/"