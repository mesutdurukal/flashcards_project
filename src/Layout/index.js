import React from "react";
import NotFound from "./NotFound";
import {HomeWithDeckList} from "./HomePageWithDeckList";
import {DeckViewWithCards} from "./DeckDetails/DeckDescription";
import {DeckStudyWithFlips} from "./DeckDetails/DeckStudyByFlips";
import {AddDeck, EditDeck} from "./DeckDetails/AddEditDeckForm";
import {AddCard, EditCard} from "./Cards/AddEditCardForm";
import {Route, Routes} from "react-router-dom";

function Layout() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomeWithDeckList />} />
                <Route path="/decks/new/*" element={<AddDeck />} />
                <Route path="/decks/:deckId/*" element={<DeckViewWithCards />} />
                <Route path="/decks/:deckId/study/*" element={<DeckStudyWithFlips />} />
                <Route path="/decks/:deckId/edit/*" element={<EditDeck />} />
                <Route path="/decks/:deckId/cards/new/*" element={<AddCard />} />
                <Route path="/decks/:deckId/cards/:cardId/edit/*" element={<EditCard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default Layout;
