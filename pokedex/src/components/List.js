import React, { Component } from 'react';
import '../components/List.css';
import PropTypes from 'prop-types';


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
                let weaknesses = pokemon
                    .map(item => item.weaknesses)
                    .reduce((prev, curr) => prev.concat(curr), [])
                    .filter((item, i, arr) => arr.indexOf(item) === i);

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
        const filteredData = initialPokemon.filter((poke) => {
            return poke.name.indexOf(this.state.search) !== -1;
        });
        const filteredweakness = initialPokemon.filter((poke) => {

            return poke.weaknesses.indexOf(this.state.w) !== -1

        });
        const filteredtypes = initialPokemon.filter((poke) => {

            return poke.type.indexOf(this.state.t) !== -1

        });
        const merged = [...filteredweakness, ...filteredtypes];

        const distinctmerge = merged.filter((item, index) => merged.indexOf(item) === index)

        const filteredNameData = distinctmerge.filter((poke) => {
            return poke.name.indexOf(this.state.search) !== -1;
        });

        console.log("weak")

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
                        )
                        )
                    }
                </div>

            </div>

        )
    }
}

export class Unique extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    mergeArrays(...arrays) {
        let jointArray = []

        arrays.forEach(array => {
            jointArray = [...jointArray, ...arrays]
        })
        const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index)
        return uniqueArray
    }

    render() {
        const newArray = this.mergeArrays(this.props.filteredweakness, this.props.filteredNameData)

        return (
            <div>
                {
                    newArray.map((poke, index) => (
                        <PokemonInfo object={poke} key={index} value={this.state.search} selected={this.state.selected} />
                    )
                    )
                }
            </div>
        )
    }


}



export class PokemonInfo extends Component {
    render() {
        return (
            <div>

                <div>{this.props.object.name}
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



const Checkbox = ({ type = 'checkbox', name, checked = false, onChange }) => (
    <input type={type} name={name} checked={checked} onChange={onChange} />
);

Checkbox.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
}

export class PokemonDetailedList extends Component {
    render() {
        return (
            <div>{this.props.object}</div>
        )
    }
}

