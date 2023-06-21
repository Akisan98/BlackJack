import { Card } from "./card";
import { Deck } from "./deck";
import readline from "readline-promise";

export const MAX_POINTS = 21;
export const DEALER_DRAW_LIMIT = 17;

const readConsole = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

async function main(whenFinished: () => void) {
  const deck = new Deck();
  const playerHand = new Array<Card | undefined>();
  const dealerHand = new Array<Card | undefined>();

  dealerDraws(dealerHand, deck.cards);

  let playing = true;
  while (playing) {
    var card = drawRandom(deck.cards);
    playerHand.push(card);

    var total = playerHand.reduce((total, card) => total + calculateValue(total, (card?.rank || 0)), 0);
    console.log(`Hit with ${card?.Suit} ${ numberToSymbol(card?.rank) }. Total is ${total}`);

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

  // Dealer Plays
  let dealerTotal = dealerHand.reduce((total, card) => total + (card?.rank || 0), 0);
  
  while (dealerTotal < DEALER_DRAW_LIMIT) {
    dealerTotal = dealerDraws(dealerHand, deck.cards);
  }

  whenFinished();
}

main(() => {
  process.exit();
});

// Oppgave 2
function numberToSymbol(value: number) {
  // Enum - Alle
  // Switch - J-A
  // Map - J-A, Mer Kompakt, og bedre ytelse, ihvertfall når den vokser.

  if (value > 1 && value < 11) {
    return value;
  }

  var symbols = {
    11: "J",
    12: "Q",
    13: "K",
    1: "A"
  }

  return symbols[value];
}

// Oppgave 3
function calculateValue(total: number, value: number): number {
  if (value == 1) {
    return (total + 11) <= MAX_POINTS ? 11 : 1;
  }

  return value;
}

// Oppgave 4
function drawRandom(deck: Card[]) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  
  return deck.splice(randomIndex, 1)[0];
}

function dealerDraws(hand: Array<Card | undefined>, deck: Card[]) {
  // Dealer Draws
  const card = drawRandom(deck);
  hand.push(card);

  var total = hand.reduce((total, card) => total + (card?.rank || 0), 0);
  console.log(`Dealer hit with ${card?.Suit} ${numberToSymbol(card?.rank)}. Total is ${total}`);

  return total;
}