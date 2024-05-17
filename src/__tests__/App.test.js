import React from "react";
import { act, render, screen } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import {
  createCard,
  createDeck,
  deleteCard,
  deleteDeck,
  listDecks,
  readCard,
  readDeck,
  updateCard,
  updateDeck,
} from "../utils/api";

require("cross-fetch/polyfill");

jest.mock("../utils/api");

describe("App", () => {
  beforeEach(() => {
    createCard.mockResolvedValue({
      front:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    createDeck.mockResolvedValue({
      name:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    deleteCard.mockResolvedValue({
      front:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    deleteDeck.mockResolvedValue({
      name:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    listDecks.mockResolvedValue([
      {
        front:
          "Default mock response. If you see this, you probably do not need this API call.",
      },
    ]);
    readCard.mockResolvedValue({
      front:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    readDeck.mockResolvedValue({
      name:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    updateCard.mockResolvedValue({
      front:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
    updateDeck.mockResolvedValue({
      name:
        "Default mock response. If you see this, you probably do not need this API call.",
    });
  });

  test('landing on a bad page shows "Not Found" page', () => {

    render(
        <MemoryRouter initialEntries={["/some/bad/route"]}>
            <App />
        </MemoryRouter>      
    );
    expect(screen.getByText("Not Found")).toBeTruthy();
  });

  test("route for /", async () => {
    const mockDecks = [
      {
        id: 1,
        name: "Mock Rendering in React",
        description: "RIR",
        cards: [{ id: 2 }, { id: 3 }],
      },
      {
        name: "Mock React Router",
        description: "RR",
        id: 2,
        cards: [],
      },
    ];

    const mockDecksPromise = Promise.resolve(mockDecks);

    listDecks.mockImplementation(() => mockDecksPromise);


    render(
        <MemoryRouter initialEntries={["/"]}>
            <App />
        </MemoryRouter>
    );

    await act(() => mockDecksPromise);

    expect(screen.getByText("Mock Rendering in React")).toBeTruthy();
    expect(screen.getByText("2 cards")).toBeTruthy();
    expect(screen.getByText("Mock React Router")).toBeTruthy();
    expect(screen.getByText("0 cards")).toBeTruthy();
  });
});