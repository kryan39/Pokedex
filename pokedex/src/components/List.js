import React, { Component } from 'react';
import '../components/List.css';
import Popup from "reactjs-popup";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';


export class PokeList extends Component {
    constructor() {
        super();
        this.state = {
            initialPokemon: [],
            showInitial: true,
            weaknesses: [],
            types: [],
            search: "",
            weaknessInput: "",
            typeInput: "",
            selectweakness: [{ value: '', display: 'Select Weakness' }],
            selecttype: [{ value: '', display: 'Select Types' }]
        };
    }

    componentDidMount() {
        fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
            .then(results => {
                return results.json();
            }).then(data => {
                const pokemon = data.pokemon;
                //retrieving all unique weaknesses
                const weaknesses = pokemon
                    .map(item => item.weaknesses)
                    .reduce((prev, curr) => prev.concat(curr), [])
                    .filter((item, i, arr) => arr.indexOf(item) === i);
                //retrieving all unique types
                const types = pokemon
                    .map(item => item.type)
                    .reduce((prev, curr) => prev.concat(curr), [])
                    .filter((item, i, arr) => arr.indexOf(item) === i);

                this.setState({ initialPokemon: pokemon, weaknesses: weaknesses, types: types });
                const weaklist = this.state.weaknesses.map(obj => {
                    return { value: obj, display: obj }
                });
                const typelist = this.state.types.map(obj => {
                    return { value: obj, display: obj }
                });

                this.setState({
                    selectweakness: [{ value: '', display: '(Select Weaknesses)' }].concat(weaklist),
                    selecttype: [{ value: '', display: '(Select Types)' }].concat(typelist)
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleChange = event => {
        this.setState({ search: event.target.value, selected: true });
    };
    handleWeakChange = event => {

        this.setState({ selected: true, weaknessInput: event.target.value, showInitial: false });
    };

    handleTypeChange = event => {

        this.setState({ selected: true, typeInput: event.target.value, showInitial: false });
    };


    render() {
        const { initialPokemon } = this.state;
        //full list 
        const filteredData = initialPokemon.filter((poke) => poke.name.indexOf(this.state.search) !== -1);
        //gets all poke with weaknesses that match the state
        const filteredweakness = initialPokemon.filter((poke) => poke.weaknesses.indexOf(this.state.weaknessInput) !== -1);

        //gets all poke with types that match the state 
        const filteredtypes = initialPokemon.filter((poke) => poke.type.indexOf(this.state.typeInput) !== -1);

        //combining the weakness and types filters
        const merged = [...filteredweakness, ...filteredtypes];

        const distinctmerge = merged.filter((item, index) => merged.indexOf(item) === index)

        //merged filtered list
        const filteredNameData = distinctmerge.filter((poke) => poke.name.indexOf(this.state.search) !== -1);



        return (
            <Container>
                <div className="filterContainer">
                    <div className="filterMethod">
                        <input type="text" onChange={this.handleChange} value={this.state.search} />
                    </div>
                    <div className="filterMethod">
                        <select onChange={this.handleWeakChange}>
                            {this.state.selectweakness.map((weakness) => <option key={weakness.value} value={weakness.value}>{weakness.display}</option>)}
                        </select>
                    </div>
                    <div className="filterMethod">
                        <select onChange={this.handleTypeChange}>
                            {this.state.selecttype.map((type) => <option key={type.value} value={type.value}>{type.display}</option>)}
                        </select>
                    </div>
                </div>

                <br />
                <div className="pokeList">
                    <div className="pokeListWrapper">

                        {this.state.showInitial ? filteredData.map((poke, index) => (
                            <PokemonInfo object={poke} key={index} />
                        ))
                            : null}
                    </div>
                    <br />
                    <div className="pokeListWrapper">
                        {
                            filteredNameData.map((poke, index) => (
                                <PokemonInfo object={poke} key={index} />
                            ))
                        }
                    </div>
                </div>
            </Container>

        )
    }
}



export class PokemonInfo extends Component {

    render() {
        return (
            <Card border="success" className="pokeCard" style={{ width: '16.6rem', margin: '2rem' }}>
                <Card.Header className="cardHeader">{this.props.object.name}</Card.Header>
                <Card.Body>
                    <div> {this.props.object.num}</div>
                    <ListGroup horizontal>
                        <ListGroup.Item><div className="sectionTitle">Types:</div>
                            {this.props.object.type.map((item, index) => (
                                <PokemonDetailedList object={item} key={index} />
                            ))
                            }</ListGroup.Item>

                        <ListGroup.Item><div className="sectionTitle">Weaknesses:</div>{this.props.object.weaknesses.map((item, index) => (
                            <PokemonDetailedList object={item} key={index} />
                        ))
                        }</ListGroup.Item>

                    </ListGroup>

                    <Popup modal trigger={<Button className="detailButton" variant="success">Details</Button>}>
                        <div>{this.props.object.name}</div>
                        <div>{this.props.object.num}</div>
                        <div><img src={this.props.object.img} /></div>
                        Types:
                        <div>{this.props.object.type.map((item, index) => (
                            <PokemonDetailedList object={item} key={index} />
                        ))
                        }</div>
                        Weaknesses:
                        <div>{this.props.object.weaknesses.map((item, index) => (
                            <PokemonDetailedList object={item} key={index} />
                        ))
                        }</div>
                        <div>{this.props.object.height}</div>
                        <div>{this.props.object.weight}</div>
                        <div>{this.props.object.prev_evolution}</div>

                    </Popup>

                </Card.Body>
                <br />
            </Card>
        )
    }
}



export class PokemonDetailedList extends Component {
    render() {
        return (
            <div>{this.props.object}</div>
        )
    }
}

