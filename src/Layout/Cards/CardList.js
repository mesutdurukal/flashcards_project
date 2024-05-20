import {useNavigate} from "react-router-dom";
import {handleDelete} from "../../utils/DeckUtils";
import React from "react";

export function CardList({cardList}) {
    const navigate = useNavigate();
    return (
        <ul>
            {cardList && cardList.length > 0 ? (
                cardList.map((card) => (
                    <li key={card.id}>
                        <p>{card.front}</p>
                        <p>{card.back}</p>
                        <button onClick={() => navigate(`cards/${card.id}/edit`)}>Edit</button>
                        <button onClick={() => handleDelete("card", card.id)}>Delete</button>
                    </li>
                ))
            ) : (
                <p>No cards available.</p>
            )}
        </ul>
    );
}

