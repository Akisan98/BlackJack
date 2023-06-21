import { describe, expect, test } from "@jest/globals";
import { Deck } from "../src/deck";
import { mainModule } from "process";
import { calculateValue, drawCard } from "../src/main";
import { Card } from "../src/card";

describe("Test deck", () => {
  test("Should have 52 cards", () => {
    expect(new Deck().cards.length).toBe(52);
  });

  test("Should have 4 distinct suits", () => {
    expect(new Set(new Deck().cards.map((card) => card.Suit)).size).toBe(4);
  });

  test("draw cards, should lower remaining", () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(52);

    const playerHand = new Array<Card | undefined>();

    drawCard(playerHand, deck.cards, false);

    expect(deck.cards.length).toBe(51);

    drawCard(playerHand, deck.cards, true);

    expect(deck.cards.length).toBe(50);
  });

  test("calculate value will return 1, when card is A, and total is high", () => {
    const total = calculateValue(19, 1);
    expect(total).toBe(1);
  });

  test("calculate value will return 11, when card is A, and total is low", () => {
    const total = calculateValue(1, 1);
    expect(total).toBe(11);
  });
});
