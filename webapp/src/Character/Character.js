 
const Character = (character) => {

    return (
        <div className="character-item-info" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                    <p>{character.charisma}</p>
                    <p>{character.streetCred}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
        </div>
    )
}
