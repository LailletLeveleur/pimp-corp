import './PimpList.css';

const PimpList = ({userNFTs}) => {

    return (

        <div className=''>
            {userNFTs && userNFTs.map((character) => {
                <div className="character-item" key={character.name}>
                    <div className="name-container">
                        <p>{character.name}</p>
                        <p>{character.charisma}</p>
                        <p>{character.streetCred}</p>
                    </div>
                    <img src={character.imageURI} alt={character.name} />
                </div>
            }
            )
            }
        </div>
    )

}

export default PimpList;