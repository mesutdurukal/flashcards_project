import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {listDecks} from "../utils/api";
import Header from "./Header";

function DeckList({ deckList, handleDelete }) {
    const navigate = useNavigate();
    return (
        <div>
            <ul>
                {deckList.map((deck) => (
                    <li key={deck.id}>
                        <p>{deck.name}</p>
                        <p>{deck.description}</p>
                        <p>{deck.cards.length} cards</p>
                        <button onClick={() => navigate(`/decks/${deck.id}`)}>View</button>
                        <button onClick={() => navigate(`/decks/${deck.id}/study`)}>Study</button>
                        <button onClick={() => handleDelete(deck.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function HomeWithDeckList() {
    const navigate = useNavigate();
    const [deckList, setDeckList] = useState([]);

    useEffect(() => {
        listDecks().then(setDeckList)
    }, []);

    const handleDelete = async (deckId) => {
        const confirmed = window.confirm('Are you sure you want to delete this deck? This action cannot be undone.');
        if (confirmed) {
            setDeckList(deckList.filter(deck => deck.id !== deckId));
        }
    };

    return (
        <div>
            <Header />
            <button onClick={() => {navigate('/decks/new')}}>Create Deck</button>
            <DeckList deckList={deckList} handleDelete={handleDelete} />
        </div>
    );
}

