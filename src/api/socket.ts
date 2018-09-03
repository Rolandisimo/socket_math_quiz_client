import openSocket from "socket.io-client";
import { BASE_URL } from "../consts/consts";

export const socket = openSocket(BASE_URL);
