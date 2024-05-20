import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {handleDelete} from "../../utils/DeckUtils";
import {fetchDeck} from "../../utils/DeckUtils";
import {CardList} from "../Cards/CardList";

export const DeckViewWithCards =()=>{
    const {deckId} = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState([]);

    useEffect(() => {fetchDeck(deckId, setDeck)}, []);

    return(<div>
        <p>{deck.name}</p>
        <p>{deck.description}</p>
        <button onClick={() => {navigate(`edit`)}}>Edit</button>
        <button onClick={() => {navigate(`study`)}}>Study</button>
        <button onClick={()=>{navigate(`cards/new`)}}>Add Cards</button> {/* warning delete */}
        <button onClick={()=>handleDelete("deck", deck.id)}>Delete</button> {/* warning delete */}
        <h1>Cards</h1>
        <CardList cardList={deck.cards}/>
    </div>)
}

