enum Environment {
    Development = "development",
    Production = "production",
}

let baseUrl;
if (process.env.NODE_ENV === Environment.Development) {
    baseUrl = "http://localhost:8000";
} else if (process.env.NODE_ENV === Environment.Production) {
    baseUrl = "https://mathyquiz-server.herokuapp.com/";
}

// Endpoints
export const BASE_URL = baseUrl;

// Player
export const MAX_PLAYER_COUNT = 10;

// Keyboard keys
export const ENTER_KEY_CODE = "13";
export const ENTER_KEY_NAME = "Enter";

// Sizes
export const MOBILE_WIDTH = 768;
