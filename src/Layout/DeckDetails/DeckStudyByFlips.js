import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchDeck} from "../../utils/DeckUtils";

export const DeckStudyWithFlips =()=>{
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState([]);
    const [cardId, setCardId] = useState([]);
    const [cardFlipped, setCardFlipped] = useState([]);

    useEffect(() => {fetchDeck(deckId, setDeck)}, []);
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

    const CardFlipper = ({cardList})=>{
        return <>
            {(!cardList || cardList.length < 3) ? (<>
                    <p>Not enough cards</p>
                    <button onClick={()=>{navigate(`/decks/${deck.id}/cards/new`)}}>Add cards</button>
                </>
            ) : (
                <>
                    <p>Card {cardId + 1} of {cardList.length}</p>
                    <p>{cardFlipped ? deck.cards[cardId].back : deck.cards[cardId].front}</p>
                    <button onClick={handleFlip}>Flip</button>
                    {cardFlipped && <button onClick={handleNext}>Next</button>}
                    <button onClick={() => {navigate('edit')}}>Edit</button>
                </>
            )}
        </>
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
        <p>{deck.description}</p>
        <CardFlipper cardList={deck.cards} />


    </div>)



}
