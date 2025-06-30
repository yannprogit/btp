import dotenv from 'dotenv';
dotenv.config();

interface Route {
    url: string;
    auth: boolean;
    creditCheck: boolean;
    rateLimit?: {
        windowMs: number;
        max: number;
    };
    proxy: {
        target: string;
        router?: { [key: string]: string };
        changeOrigin: boolean;
        pathFilter?: string;
        pathRewrite?: { [key: string]: string };
    };
}

const ROUTES: Route[] = [
    {
        url: '/users',
        auth: false,
        creditCheck: false,
        proxy: {
            target: process.env.USERS_SERVICE_URL || "http://user-app:5555",
            changeOrigin: true,
        }
    },
    {
        url: '/teams',
        auth: false,
        creditCheck: false,
        proxy: {
            target: process.env.TEAMS_SERVICE_URL || "http://team-app:5050",
            changeOrigin: true,
        }
    },
    {
        url: '/pokeapi',
        auth: false,
        creditCheck: false,
        proxy: {
            target: process.env.POKEAPI_SERVICE_URL || "http://pokeapi-app:6000",
            changeOrigin: true,
        }
    }
];

export { ROUTES, Route };