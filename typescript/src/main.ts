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

  // Dealer Draws
  drawCard(dealerHand, deck.cards, true);

  let playing = true;
  while (playing) {
    // Player Draws
    var total = drawCard(playerHand, deck.cards, false);

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
    dealerTotal = drawCard(dealerHand, deck.cards, true);
  }

  whoWon(total, dealerTotal);

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
export function calculateValue(total: number, value: number): number {
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

export function drawCard(hand: Array<Card | undefined>, deck: Card[], isDealer: boolean) {
  // Draw Card
  const card = drawRandom(deck);
  hand.push(card);

  // Calculate Score
  var total = hand.reduce((total, card) => isDealer ? 
      total + (card?.rank == 1 ? 11 : card?.rank || 0) : 
      total + calculateValue(total, (card?.rank || 0)), 
  0);

  console.log(`${isDealer ? "Dealer" : "Player"} hit with ${card?.Suit} ${numberToSymbol(card?.rank)}. Total is ${total}`);
  return total;
}

function whoWon(playerTotal: number, dealerTotal: number) {
  if (dealerTotal > MAX_POINTS) {
    console.log(`Dealer exceeded ${MAX_POINTS} points, player won.`);
    return;
  }

  const difference = playerTotal - dealerTotal;

  if (difference > 0) {
    console.log(`Player won.`);
    return;
  }

  console.log(`Dealer won.`);
}