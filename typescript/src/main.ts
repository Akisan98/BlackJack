import { Card } from "./card";
import { Deck } from "./deck";
import readline from "readline-promise";

export const MAX_POINTS = 21;

const readConsole = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

async function main(whenFinished: () => void) {
  const deck = new Deck();
  const hand = new Array<Card | undefined>();

  let playing = true;
  while (playing) {
    var card = deck.cards.pop();
    hand.push(card);

    var total = hand.reduce((total, card) => total + (card?.rank || 0), 0);
    console.log(`Hit with ${card?.Suit} ${card?.rank}. Total is ${total}`);

    // Oppgave 1 - 21 poeng grense.
    if (total > MAX_POINTS) {
      console.log(`Exceeded ${MAX_POINTS} points, player lost.`);
      break;
    }
    
    await readConsole.questionAsync("Stand, Hit (s/h) \n").then((read) => {
      if (read !== "h") {
        playing = false;
      }
    });
  }
  whenFinished();
}

main(() => {
  process.exit();
});
