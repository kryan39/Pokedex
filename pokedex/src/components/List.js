import React, { Component } from 'react';
import '../components/List.css';
import Popup from "reactjs-popup";


export class PokeList extends Component {
    constructor() {
        super();
        this.state = {
            initialPokemon: [],
            showInitial: true,
            weaknesses: [],
            types: [],
            search: "",
            selected: false,
            w: "",
            t: "",
            selectweak: [{ value: '', display: 'Select Weakness' }],
            selecttype: [{ value: '', display: 'Select Types' }]
        };
    }

    componentDidMount() {
        fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
            .then(results => {
                return results.json();
            }).then(data => {
                let pokemon = data.pokemon;
                //retrieving all unique weaknesses
                let weaknesses = pokemon
                    .map(item => item.weaknesses)
                    .reduce((prev, curr) => prev.concat(curr), [])
                    .filter((item, i, arr) => arr.indexOf(item) === i);
                //retrieving all unique types
                let types = pokemon
                    .map(item => item.type)
                    .reduce((prev, curr) => prev.concat(curr), [])
                    .filter((item, i, arr) => arr.indexOf(item) === i);

                this.setState({ initialPokemon: pokemon, weaknesses: weaknesses, types: types });
                let weaklist = this.state.weaknesses.map(obj => {
                    return { value: obj, display: obj }
                });
                let typelist = this.state.types.map(obj => {
                    return { value: obj, display: obj }
                });

                this.setState({
                    selectweak: [{ value: '', display: '(Select Weaknesses)' }].concat(weaklist),
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

        this.setState({ selected: true, w: event.target.value, showInitial: false });
    };

    handleTypeChange = event => {

        this.setState({ selected: true, t: event.target.value, showInitial: false });
    };


    render() {
        const { initialPokemon } = this.state;
        //full list 
        const filteredData = initialPokemon.filter((poke) => {
            return poke.name.indexOf(this.state.search) !== -1;
        });
        //gets all poke with weaknesses that match the state
        const filteredweakness = initialPokemon.filter((poke) => {

            return poke.weaknesses.indexOf(this.state.w) !== -1

        });

        //gets all poke with types that match the state 
        const filteredtypes = initialPokemon.filter((poke) => {
            return poke.type.indexOf(this.state.t) !== -1

        });

        //combining the weakness and types filters
        const merged = [...filteredweakness, ...filteredtypes];

        const distinctmerge = merged.filter((item, index) => merged.indexOf(item) === index)

        //merged filtered list
        const filteredNameData = distinctmerge.filter((poke) => {
            return poke.name.indexOf(this.state.search) !== -1;
        });



        return (
            <div>
                <input type="text" onChange={this.handleChange} value={this.state.search} />
                <div>
                    <select onChange={this.handleWeakChange}>
                        {this.state.selectweak.map((weakness) => <option key={weakness.value} value={weakness.value}>{weakness.display}</option>)}
                    </select>
                </div>
                <div>
                    <select onChange={this.handleTypeChange}>
                        {this.state.selecttype.map((type) => <option key={type.value} value={type.value}>{type.display}</option>)}
                    </select>
                </div>
                <br />
                <div>
                    {this.state.showInitial ? filteredData.map((poke, index) => (
                        <PokemonInfo object={poke} key={index} value={this.state.search} selected={this.state.selected} />
                    ))
                        : null}
                </div>
                <br />
                <div>
                    {
                        filteredNameData.map((poke, index) => (
                            <PokemonInfo object={poke} key={index} value={this.state.search} selected={this.state.selected} />
                        ))
                    }
                </div>

            </div>

        )
    }
}



export class PokemonInfo extends Component {

    render() {
        return (
            <div>

                <div><Popup modal trigger={<button>{this.props.object.name}</button>}>
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
                    <div>

                        <div>{this.props.object.num}</div>
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

                    </div>
                </div>
                <br />
            </div>
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

