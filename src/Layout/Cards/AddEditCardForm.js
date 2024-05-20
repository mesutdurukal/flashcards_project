import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {createCard, readCard, readDeck, updateCard} from "../../utils/api";
import {fetchDeck} from "../../utils/DeckUtils";

export const AddCard = () => {
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {fetchDeck(deckId, setDeck)}, []);

    const handleSave = async (card) => {
        await createCard(deckId, card);
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck ? deck.name : ""}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Add Card
                    </li>
                </ol>
            </nav>
            <FormComponent deckId={deckId} onSave={handleSave} />
            <button onClick={() => navigate(`/decks/${deckId}`)}>Done</button>
        </div>
    );
};

export const EditCard = () => {
    const { deckId, cardId } = useParams();

    const handleSave = async (card) => {
        const updatedCard = { id: cardId, ...card, deckId };
        const controller = new AbortController();
        const signal = controller.signal;
        await updateCard(updatedCard, signal);
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>Deck</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Card</li>
                </ol>
            </nav>
            <FormComponent deckId={deckId} cardId={cardId} onSave={handleSave} />
        </div>
    );
};

const FormComponent = ({ deckId, cardId, onSave, initialFront = "", initialBack = "" }) => {
    const [front, setFront] = useState(initialFront);
    const [back, setBack] = useState(initialBack);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (cardId) {
            const fetchCard = async () => {
                try {
                    const card = await readCard(cardId, signal);
                    setFront(card.front);
                    setBack(card.back);
                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error("Error reading card:", error);
                    }
                }
            };
            fetchCard();
        }

        return () => controller.abort();
    }, [cardId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onSave({ front, back });
        navigate(`/decks/${deckId}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="front">Front</label>
            <textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                required
            />
            <label htmlFor="back">Back</label>
            <textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => navigate(`/decks/${deckId}`)}>Cancel</button>
        </form>
    );
};