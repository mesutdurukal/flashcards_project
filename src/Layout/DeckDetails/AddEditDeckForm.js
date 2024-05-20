import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {createDeck, readDeck, updateDeck} from "../../utils/api";
import {fetchDeck} from "../../utils/DeckUtils";

function DeckForm({ type }) {
    const navigate = useNavigate();
    const { deckId } = useParams(); // Move this outside the conditional block since it's used in multiple scopes.

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (type === "edit") {
            const controller = new AbortController(); // Move the controller inside the effect where it's needed.
            readDeck(deckId, controller.signal)
                .then((deck) => {
                    setName(deck.name);
                    setDescription(deck.description);
                })
                .catch((error) => console.error("Error reading deck:", error));
            return () => controller.abort(); // Cleanup
        }
    }, [deckId, type]); // Include `type` in the dependency array to ensure correct operation when it changes.

    const handleSubmit = async (e) => {
        e.preventDefault();
        const controller = new AbortController();
        try {
            if (type === "add") {
                await createDeck({ name, description }, controller.signal);
                navigate('/decks');
            } else {
                const updatedDeck = { id: deckId, name, description };
                await updateDeck(updatedDeck, controller.signal);
                navigate(`/decks/${deckId}`);
            }
        } catch (error) {
            console.error(`Error ${type === "add" ? "creating" : "updating"} deck:`, error);
        } finally {
            controller.abort(); // Properly abort in case there are still pending requests.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>{type === "add" ? "Create Deck" : "Edit Deck"}</legend>
                <label htmlFor="name">Name</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="description">Description</label>
                <textarea id="description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </fieldset>
        </form>
    );
}

export const AddDeck = ()=>{
    return(<div>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
            </ol>
        </nav>
        <DeckForm type={"add"}/>
    </div>)
}

export const EditDeck = () => {
    const { deckId } = useParams();
    const [name, setName] = useState("");

    useEffect(() => {
            const controller = new AbortController(); // Move the controller inside the effect where it's needed.
            readDeck(deckId, controller.signal)
                .then((deck) => {
                    setName(deck.name);
                })
                .catch((error) => console.error("Error reading deck:", error));
            return () => controller.abort(); // Cleanup
    }, []); // Include `type` in the dependency array to ensure correct operation when it changes.

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                </ol>
            </nav>
            <DeckForm type={"edit"}/>
        </div>
    );

};