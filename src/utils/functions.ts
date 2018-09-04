import { Players } from "@ducks/state";

export function checkIfNameExists(name: string, players: Players) {
    return Object.keys(players)
        .some(player => players[player].name === name);
}
