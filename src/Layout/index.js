import React, {useState, useEffect} from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import {Link, Route, Routes, useParams, useNavigate} from "react-router-dom";
import {deleteCard, deleteDeck, listDecks, readDeck, createDeck, updateDeck, createCard, readCard, updateCard} from "../utils/api";

function Layout() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/decks/new/*" element={<AddDeck />} />
                <Route path="/decks/:deckId/*" element={<Deck />} />
                <Route path="/decks/:deckId/study/*" element={<DeckStudy />} />
                <Route path="/decks/:deckId/edit/*" element={<EditDeck />} />
                <Route path="/decks/:deckId/cards/new/*" element={<AddCard />} />
                <Route path="/decks/:deckId/cards/:cardId/edit/*" element={<EditCard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

function Home() {
    const navigate = useNavigate();
    const [deckList, setDeckList] = useState([]);

    useEffect(() => {
        listDecks().then(setDeckList)
    }, []);

    const handleDelete = async (deckId) => {
        const confirmed = window.confirm('Are you sure you want to delete this deck? This action cannot be undone.');
        if (confirmed) {
            //await deleteDeck(deckId);
            setDeckList(deckList.filter(deck => deck.id !== deckId));
        }
    };

    return (
        <div>
            <Header />
            <button onClick={() => {navigate('decks/new')}}>Create Deck</button>
            <div>
                <ul>
                    {deckList.map((deck) => (
                        <li>
                            <p> {deck.name} </p>
                            <p> {deck.description} </p>
                            <p>{deck.cards.length} cards</p>
                            <button onClick={() => {navigate(`/decks/${deck.id}`)}}>View</button>
                            <button onClick={() => {navigate(`/decks/${deck.id}/study`)}}>Study</button>
                            <button onClick={()=>handleDelete(deck.id)}>Delete</button> {/* warning delete */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

const DeckStudy =()=>{
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState([]);
    const [cardId, setCardId] = useState([]);
    const [cardFlipped, setCardFlipped] = useState([]);

    useEffect(() => {readDeck(deckId).then(setDeck)}, []);
    useEffect(() => {setCardId(0)}, []);
    useEffect(() => {setCardFlipped(false)}, []);

    const handleFlip =()=>{setCardFlipped(!cardFlipped)}
    const handleNext =()=>{
        if (cardId < deck.cards.length-1)
            setCardId(cardId+1);
        else{
            const confirmed = window.confirm('Restart cards? Click cancel to return to the homepage.');
            if (confirmed)
                setCardId(0);
            else
                navigate('/');
        }
    }

    return (<div>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to={`/decks/${deck.id}`}>{deck.name}</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Study</li>
            </ol>
        </nav>
        <p>{deck.id}</p>
        <p>Study: {deck.name}</p>
        <p>{deck.description}</p>¥
        <>
            {(!deck.cards || deck.cards.length < 3) ? (<>
                <p>Not enough cards</p>
                <button onClick={()=>{navigate(`/decks/${deck.id}/cards/new`)}}>Add cards</button>
                </>
            ) : (
                <>
                    <p>Card {cardId + 1} of {deck.cards.length}</p>
                    <p>{cardFlipped ? deck.cards[cardId].back : deck.cards[cardId].front}</p>
                    <button onClick={handleFlip}>Flip</button>
                    {cardFlipped && <button onClick={handleNext}>Next</button>}
                    <button onClick={() => {navigate('edit')}}>Edit</button>
                </>
            )}
        </>

    </div>)
}

const Deck =()=>{
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState([]);

    const handleDelete = async (deckId) => {
        const confirmed = window.confirm('Are you sure you want to delete this deck? This action cannot be undone.');
        if (confirmed) {
            await deleteDeck(deckId);
            //setDeckList(deckList.filter(deck => deck.id !== deckId));
        }
    };

    const handleCardDelete =async (cardId) => {
        const confirmed = window.confirm('Are you sure you want to delete this deck? This action cannot be undone.');
        if (confirmed) {
            await deleteCard(cardId)
        }
    }

    useEffect(() => {readDeck(deckId).then(setDeck)}, []);
    return(<div>
        <p>{deck.name}</p>
        <p>{deck.description}</p>
        <button onClick={() => {navigate(`edit`)}}>Edit</button>
        <button onClick={() => {navigate(`study`)}}>Study</button>
        <button onClick={()=>{navigate(`cards/new`)}}>Add Cards</button> {/* warning delete */}
        <button onClick={()=>handleDelete(deck.id)}>Delete</button> {/* warning delete */}
        <h1>Cards</h1>
        <ul>
            {deck.cards && deck.cards.length > 0 ?
                (
                    deck.cards.map((card) => (
                        <li>
                            <p> {card.front} </p>
                            <p> {card.back} </p>
                            <button onClick={() => {navigate(`cards/${card.id}/edit`)}}>Edit</button>
                            <button onClick={() => {handleCardDelete(card.id)}}>Delete</button>
                        </li>
                    ))
                ): null
            }
        </ul>
    </div>)
}

const AddDeck = ()=>{

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const controller = new AbortController();
    const signal = controller.signal;
    const handleSubmit =()=>{
        createDeck({"name": name, "description": description}, signal);
        navigate('/decks');}
    return(<div>
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
            </ol>
        </nav>
        <form name="create" onSubmit={handleSubmit}>
            <fieldset>
                <legend>Create Deck</legend>
                <label>Name </label>
                <input required value={"Deck Name"} onChange={(e) => setName(e.target.value)}/>
                <label>Description </label>
                <textarea required rows={3} value={"content"} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit">Submit</button>

            </fieldset>
        </form>
        <button onClick={() => {navigate('/')}}>Cancel</button>
    </div>)

}

const AddCard = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [deck, setDeck] = useState(null); // State to store deck data

    useEffect(() => {
        // Fetch deck data when component mounts
        readDeck(deckId)
            .then((data) => setDeck(data))
            .catch((error) => console.error("Error fetching deck:", error));
    }, [deckId]);

    const handleSubmit = () => {
        const controller = new AbortController();
        const signal = controller.signal;
        createCard(deckId, { front, back }, signal);
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck ? deck.name : ""}</Link> {/* Render deck name only when available */}
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Add Card
                    </li>
                </ol>
            </nav>
            <form name="create" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Create Deck</legend>
                    <label>Front </label>
                    <textarea
                        required
                        rows={3}
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                    />
                    <label>Back </label>
                    <textarea
                        required
                        rows={3}
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                    />
                    <button type="submit">Save</button>
                </fieldset>
            </form>
            <button onClick={() => navigate("/decks")}>Done</button>
        </div>
    );
};

const EditCard = () => {
    const { deckId, cardId } = useParams();
    const navigate = useNavigate();
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    useEffect(() => {
        readCard(cardId)
            .then((card) => {
                setFront(card.front);
                setBack(card.back);
            })
            .catch((error) => console.error("Error reading card:", error));
    }, [cardId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedCard = { id: cardId, front, back, deckId };
        try {
            await updateCard(updatedCard);
            navigate(`/decks/${deckId}`);
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>Deck</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}/cards/${cardId}/edit`}>Edit Card</Link></li>
                </ol>
            </nav>
            <form onSubmit={handleSubmit}>
                <label htmlFor="front">Front</label>
                <textarea id="front" value={front} onChange={(e) => setFront(e.target.value)} required />
                <label htmlFor="back">Back</label>
                <textarea id="back" value={back} onChange={(e) => setBack(e.target.value)} required />
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(`/decks/${deckId}`)}>Cancel</button>
            </form>
        </div>
    );
};


const EditDeck = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        readDeck(deckId)
            .then((deck) => {
                setName(deck.name);
                setDescription(deck.description);
            })
            .catch((error) => console.error("Error reading deck:", error));
    }, [deckId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedDeck = { id: deckId, name, description };
        try {
            await updateDeck(updatedDeck);
            navigate(`/decks/${deckId}`);
        } catch (error) {
            console.error("Error updating deck:", error);
        }
    };

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                </ol>
            </nav>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(`/decks/${deckId}`)}>Cancel</button>
            </form>
        </div>
    );
};


export default Layout;
