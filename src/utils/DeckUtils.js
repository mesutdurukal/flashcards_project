import {deleteCard, deleteDeck, readDeck} from "./api";

export const handleDelete = async (type, id) =>{
    const controller = new AbortController();
    const signal = controller.signal;
    const confirmed = window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`);
    const deleteCallBack = type === "deck" ? deleteDeck : deleteCard;
    if (confirmed) {
        await deleteCallBack(id, signal);
    }
    return () => controller.abort();
}

export function fetchDeck(deckId, setDeck) {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchDeck = async () => {
        try {
            setDeck(await readDeck(deckId, signal));
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching deck:", error);
            }
        }
    };
    fetchDeck();

    return () => controller.abort();
}