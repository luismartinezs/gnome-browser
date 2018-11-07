import React from 'react';
import ReactModal from 'react-modal';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCaretDown, faCaretUp, faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faSearch, faCaretDown, faCaretUp, faTimes)

let json = require('./data.json');
let professionsArr = Array.from(listProfessions(json));
professionsArr = professionsArr.map((prof) => prof.trim());
const initialGnomes = json['Brastlewark'];


/*
* Stateful component App contains all the components of the UI
*
* States:
* gnomeNum {int} number of gnomes currently on display in the listing
* upBtnStyle {String} either 'none' or 'initial', defines whether the button to return to the top is displayed
* showMoreBtn {boolean} defines whether 'load more gnomes' button is displayed or not
* gnomes {Array} each element is an object 'gnome' that holds all properties of a single gnome
* professionsFilter {Set} list of all distinct professions among all gnomes
* searchInput {String} value of the name search field
* minAgeInput / maxAgeInput {int} min / max values of the age reange search input field
* professionsBorderToggler {String: boolean} where String is the name of a profession. Determines whether
*   a profession button is selected or not in the advanced search
*/
class App extends React.Component {
    constructor() {
        super();
        const professionsFilter = new Set();
        const professionsBorderToggler = {};
        professionsArr.forEach((prof) => professionsBorderToggler[prof] = false);
        this.state = {
            gnomeNum: 10,
            upBtnStyle: 'none',
            showMoreBtn: true,
            gnomes: [...initialGnomes],
            professionsFilter: professionsFilter,
            searchInput: '',
            minAgeInput: 0,
            maxAgeInput: 400,
            professionsBorderToggler: professionsBorderToggler,
        };

        this.showMoreGnomes = this.showMoreGnomes.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.filterGnomesByName = this.filterGnomesByName.bind(this);
        this.resetGnomes = this.resetGnomes.bind(this);
        this.toggleProfessionFilter = this.toggleProfessionFilter.bind(this);
        this.filterGnomesAdvancedSearch = this.filterGnomesAdvancedSearch.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMinAgeChange = this.handleMinAgeChange.bind(this);
        this.handleMaxAgeChange = this.handleMaxAgeChange.bind(this);
        this.shuffleGnomes = this.shuffleGnomes.bind(this);
        this.handleProfClick = this.handleProfClick.bind(this);
        this.toggleMoreBtn = this.toggleMoreBtn.bind(this);

    }

    /*
    * toggles the state of the 'load more gnomes' button to be displayed / hidden
    */
    toggleMoreBtn() {

        if (+this.state.gnomeNum >= this.state.gnomes.length) {
            this.setState({
                showMoreBtn: !this.state.showMoreBtn,
            });
        }

    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {

        if (window.pageYOffset > 300) {
            this.setState({
                upBtnStyle: 'initial',
            });
        } else {
            this.setState({
                upBtnStyle: 'none',
            });
        }

    }

    /*
    * When the "load more gnomes" button is clicked, this method is called
    */
    showMoreGnomes() {
        this.setState(
            {
                gnomeNum: this.state.gnomeNum + 20,
            }, this.toggleMoreBtn()
        );
    }

    scrollToTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera 
    }

    /*
    * Called when the search button on the basic search is clicked
    *
    * @param str {String} current value of the text input field next to the search button
    */
    filterGnomesByName(str) {
        let filteredGnomes = [];

        if (str === '') {
            filteredGnomes = initialGnomes
        } else {
            filteredGnomes = initialGnomes.filter((gnome) => gnome.name.toLowerCase().includes(str.trim().toLowerCase()));
        }

        this.setState(
            {
                gnomes: filteredGnomes,
                gnomeNum: 10,
            }, this.toggleMoreBtn()
        );
    }

    /*
    * resets the list of gnomes to its initial state, called when clicking the "reset filters" button
    * it also resets the order of gnomes in the list to its initial order
    */
    resetGnomes() {
        this.setState(
            {
                gnomes: [...initialGnomes],
                gnomeNum: 10,
                searchInput: '',
                professionsFilter: new Set(),
                minAgeInput: 0,
                maxAgeInput: 400,
                professionsBorderToggler: {},
            }, this.toggleMoreBtn()
        );
    }

    /*
    * adds / deletes given profession from Set professionsFilter
    * called when user clicks on profession buttons in advanced search
    * professionsFilter is used to filter the gnome list
    *
    * @param prof {String} profession name
    */
    toggleProfessionFilter(prof) {
        if (this.state.professionsFilter.has(prof)) {
            this.state.professionsFilter.delete(prof);
        } else {
            this.state.professionsFilter.add(prof);
        }
    }

    /*
    * Called when clicking 'search' button of advanced search
    * filters gnomes by:
    *   1. Name in the input field
    *   2. Selected professions (any gnomes having at least one of the selected profession will be displayed)
    *   3. Age range: any gnomes inside the age range will be selected
    */
    filterGnomesAdvancedSearch() {

        // Filter gnomes by name
        let str = this.state.searchInput;
        let filteredGnomes = [];

        if (str === '') {
            filteredGnomes = initialGnomes
        } else {
            filteredGnomes = initialGnomes.filter((gnome) => gnome.name.toLowerCase().includes(str.trim().toLowerCase()));
        }

        // Filter gnomes by profession
        let filterProfessions = Array.from(this.state.professionsFilter);
        let filteredGnomesByProfession = [];

        if (this.state.professionsFilter.size > 0) {

            for (let i = 0; i < filteredGnomes.length; i++) {

                if (filteredGnomes[i].professions.length + filterProfessions.length > new Set(filteredGnomes[i].professions.concat(filterProfessions)).size) {

                    filteredGnomesByProfession.push(filteredGnomes[i]);

                }

            }

        } else {
            filteredGnomesByProfession = filteredGnomes;
        }

        //Filter gnomes by age
        let filteredGnomesByAge = [];
        let minAge = +this.state.minAgeInput || 0;
        let maxAge = +this.state.maxAgeInput || 400;
        let orderedAgeRange = [+minAge, +maxAge].sort((a, b) => a - b);

        for (let i = 0; i < filteredGnomesByProfession.length; i++) {

            if (orderedAgeRange[0] > filteredGnomesByProfession[i].age || orderedAgeRange[1] < filteredGnomesByProfession[i].age) {
                continue;
            }

            filteredGnomesByAge.push(filteredGnomesByProfession[i]);

        }

        let advFilteredGnomes = filteredGnomesByAge;

        this.setState(
            {
                gnomes: advFilteredGnomes,
                gnomeNum: 10,
            }, this.toggleMoreBtn()
        );
    }

    handleNameChange(e) {
        this.setState(
            {
                searchInput: e.target.value,
            }
        );
    }

    handleMinAgeChange(e) {
        this.setState(
            // (state) => {
            //     return state.ageInput[0] = e.target.value;
            // }
            {
                minAgeInput: e.target.value,
            }
        );
    }

    handleMaxAgeChange(e) {
        this.setState(
            {
                maxAgeInput: e.target.value,
            }
        );
    }

    /*
    * Called when clicking the 'surprise me!' button.
    * Gnome order is randomized using a Fisher-Yates algorithm: https://bost.ocks.org/mike/shuffle/
    */
    shuffleGnomes() {

        let shuffledGnomes = [...initialGnomes];
        let m = shuffledGnomes.length;
        let i;

        while (m) {

            i = Math.floor(Math.random() * m--);

            ([shuffledGnomes[m], shuffledGnomes[i]] = [shuffledGnomes[i], shuffledGnomes[m]]);

        }

        this.setState(
            {
                gnomes: shuffledGnomes,
                gnomeNum: 10,
            }, this.toggleMoreBtn()
        );

    }

    /*
    * Called when user clicks on professions buttons in advanced search
    */
    handleProfClick(prof) {
        this.toggleProfessionFilter(prof);
        this.setState(
            (state) => {
                return (state.professionsBorderToggler[prof] = !this.state.professionsBorderToggler[prof])
            }
        );
    }


    render() {

        const moreBtnStyle = this.state.showMoreBtn ? 'initial' : 'none';

        return (
            <div>

                <SearchArea filterGnomes={this.filterGnomesByName} toggleProfessionFilter={this.toggleProfessionFilter} filterGnomesAdvancedSearch={this.filterGnomesAdvancedSearch} searchInput={this.state.searchInput} handleNameChange={this.handleNameChange} minAgeInput={this.state.minAgeInput} maxAgeInput={this.state.maxAgeInput} handleMinAgeChange={this.handleMinAgeChange} handleMaxAgeChange={this.handleMaxAgeChange} resetGnomes={this.resetGnomes} professionsBorderToggler={this.state.professionsBorderToggler} handleProfClick={this.handleProfClick} />

                <SupriseBtn shuffleGnomes={this.shuffleGnomes} />

                <List gnomeNum={this.state.gnomeNum} gnomes={this.state.gnomes} />

                <div className='d-flex justify-center align-center' id='moreBtn-wrapper'>
                    <button className='btn btn-wide' id='moreBtn' onClick={this.showMoreGnomes} style={{ display: moreBtnStyle }}>Load more Gnomes</button>
                </div>

                <div id='upBtn-wrapper'>
                    <button id='upBtn' className='btn' onClick={this.scrollToTop} style={{ display: this.state.upBtnStyle }}>< FontAwesomeIcon icon={faCaretUp} /></button>
                </div>

            </div>
        );
    }
}

/*
* states:
* showAdvSearch {boolean} determines whether advanced search is displayed or not, and direction where
*   caret next to 'advanced search' text is pointing
* showBasicSearchBtn {boolean} determines whether search button of basic search is displayed or not
*/
class SearchArea extends React.Component {
    constructor() {
        super();
        this.state = {
            showAdvSearch: false,
            showBasicSearchBtn: true,
        };
        this.toggleAdvSearch = this.toggleAdvSearch.bind(this);
    }

    toggleAdvSearch() {
        this.setState(
            {
                showAdvSearch: !this.state.showAdvSearch,
                showBasicSearchBtn: !this.state.showBasicSearchBtn,
            }
        )
    }

    render() {
        return (
            <div className='searchContainer d-flex d-col align-center'>

                <BasicSearch filterGnomes={this.props.filterGnomes} showBasicSearchBtn={this.state.showBasicSearchBtn} searchInput={this.props.searchInput} handleNameChange={this.props.handleNameChange} />

                <AdvSearchToggler filterGnomes={this.props.filterGnomes} showAdvSearch={this.state.showAdvSearch} toggleAdvSearch={this.toggleAdvSearch} searchInput={this.state.searchInput} filterGnomesAdvancedSearch={this.props.filterGnomesAdvancedSearch} toggleProfessionFilter={this.props.toggleProfessionFilter} minAgeInput={this.props.minAgeInput} maxAgeInput={this.props.maxAgeInput} handleMinAgeChange={this.props.handleMinAgeChange} handleMaxAgeChange={this.props.handleMaxAgeChange} resetGnomes={this.props.resetGnomes} professionsBorderToggler={this.props.professionsBorderToggler} handleProfClick={this.props.handleProfClick} />

            </div>
        );
    }
}

class BasicSearch extends React.Component {

    render() {

        const basicSearchBtnStyle = this.props.showBasicSearchBtn ? 'initial' : 'none';

        return (
            <div className='d-flex align-start justify-center' id='basicSearchContainer'>
                <div id='basicSearchInputContainer'>
                    <input type='text' id='basicSearchInput' value={this.props.searchInput} onChange={this.props.handleNameChange}></input>
                    <div>
                        <p className='basicSearchCue'>Try searching a Gnome e.g. 'Bitterbuster'</p>
                    </div>
                </div>

                <div>
                    <button className='btn' id='basicSearchBtn' onClick={() => this.props.filterGnomes(this.props.searchInput)} style={{ display: basicSearchBtnStyle }}>
                        < FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>
        );
    }
}

class AdvSearchToggler extends React.Component {

    render() {

        let caret = this.props.showAdvSearch ? faCaretUp : faCaretDown;

        return (

            <div className='d-flex d-col align-center'>

                {this.props.showAdvSearch && <AdvSearch filterGnomes={this.props.filterGnomes} basicSearchInput={this.props.basicSearchInput} toggleProfessionFilter={this.props.toggleProfessionFilter} filterGnomesAdvancedSearch={this.props.filterGnomesAdvancedSearch} minAgeInput={this.props.minAgeInput} maxAgeInput={this.props.maxAgeInput} handleMinAgeChange={this.props.handleMinAgeChange} handleMaxAgeChange={this.props.handleMaxAgeChange} resetGnomes={this.props.resetGnomes} professionsBorderToggler={this.props.professionsBorderToggler} handleProfClick={this.props.handleProfClick} />}

                <div className='text-center' id='toggleSearchBtn'>
                    <button className='btn-none'
                        onClick={this.props.toggleAdvSearch}
                    >
                        Advanced search < FontAwesomeIcon icon={caret} />
                    </button>
                </div>
            </div>

        );
    }
}

class AdvSearch extends React.Component {
    render() {

        const withBorder = '2px solid yellow';
        const withoutBorder = '2px solid transparent';

        const professions = professionsArr.map(
            (prof) =>
                <button key={prof} className='btn btn-none professionBtn' onClick={() => this.props.handleProfClick(prof)}>
                    <span
                        className={prof.trim().replace(' ', '-').toLowerCase()}
                        style={{ border: this.props.professionsBorderToggler[prof] ? withBorder : withoutBorder }}
                    >{prof}
                    </span>
                </button>);

        return (
            <div id='advSearch-wrapper'>
                <div id='advSearch-container' className='d-flex d-col justify-center'>
                    <div id='advSearc-professions-container'>
                        <h1 className='advSearch-h'>Professions <span className='basicSearchCue'>Select any number, follows OR logic</span></h1>

                        <p className='advSearch-professions'>
                            {professions}
                        </p>
                    </div>

                    <div id='advSearch-age-container'>
                        <h1 className='advSearch-h'>Age range <span className='basicSearchCue'>Valid range from 0 to 400</span></h1>
                        <span id='age-input-span'>
                            <input className='search-input' type='number' max='400' min='0' value={this.props.minAgeInput} onChange={this.props.handleMinAgeChange}></input> <span className='separator'>- </span>
                            <input className='search-input' type='number' max='400' min='0' value={this.props.maxAgeInput} onChange={this.props.handleMaxAgeChange}></input>
                        </span>
                    </div>

                    <div className='text-center'>
                        <button
                            className='btn btn-advSearch'
                            id='btn-advSearch-search'
                            onClick={
                                this.props.filterGnomesAdvancedSearch}
                        >
                            < FontAwesomeIcon icon={faSearch} /> Search</button>
                        <button className='btn btn-advSearch' id='btn-advSearch-reset' onClick={this.props.resetGnomes}>Reset filters</button>
                    </div>

                </div>
            </div>
        );
    }
}

class SupriseBtn extends React.Component {
    render() {
        return (
            <div className='d-flex justify-center align-center' id='surpriseMe-btn-wrapper'>
                <button className='btn btn-wide' id='surpirseMe-btn' onClick={this.props.shuffleGnomes}>Surprise me!</button>
            </div>
        );
    }
}

class List extends React.Component {
    render() {

        const gnomeArr = this.props.gnomes;
        const num = this.props.gnomes.length < this.props.gnomeNum ? this.props.gnomes.length : this.props.gnomeNum;

        const gnomeList = function () {
            let arr = [];
            for (let i = 0; i < num; i++) {
                arr.push(<ListItem key={i} gnome={gnomeArr[i]} />);
            }
            return arr;
        }

        return (
            <div className='d-flex d-col align-center' id='listContainer'>
                {gnomeList()}
            </div>
        );
    }
}

/*
* states:
* showModal {boolean} determines whether modal (detail) window is displayed or not
* 
*/
class ListItem extends React.Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState(
            {
                showModal: true,
            }
        );
    }

    handleCloseModal() {
        this.setState(
            {
                showModal: false,
            }
        );
    }

    render() {

        const professions = this.props.gnome.professions.map((prof) => <span key={prof} className={prof.trim().replace(' ', '-').toLowerCase()}>{prof} </span>);

        return (
            <div className='listItemWrapper'>
                <div className='listItemContainer d-flex justify-left'>

                    <div className='profile-img-wrapper'>
                        <img className='profile-img' src={this.props.gnome.thumbnail} alt='profile' />
                    </div>

                    <div className='profile-info-container'>
                        <div className='name-container'>
                            <span className='firstName'>{this.props.gnome.name.split(' ')[0]} </span>
                            <span className='lastName'>{this.props.gnome.name.split(' ')[1]}</span>
                        </div>
                        <div>
                            <p className='professions'>
                                {professions}
                            </p>
                        </div>
                    </div>

                    <div className='seeDetailBtnContainer'>
                        <button className='btn seeDetailBtn' onClick={this.handleOpenModal}><span className='btn-text'>+</span></button>

                        <ReactModal
                            isOpen={this.state.showModal}
                            contentLabel='Gnome detail'
                            onRequestClose={this.handleCloseModal}
                            className='modal'
                            overlayClassName='modal-overlay'
                            ariaHideApp={false}
                        >
                            <button className='closeDetailBtn btn' onClick={this.handleCloseModal}>< FontAwesomeIcon icon={faTimes} /></button>
                            <Detail gnome={this.props.gnome} />
                        </ReactModal>

                    </div>

                </div>
            </div>
        );
    }
}

class Detail extends React.Component {
    render() {
        return (
            <div className='detail-container'>
                <Profile gnome={this.props.gnome} />
            </div>
        );
    }
}

class Profile extends React.Component {
    render() {

        const professions = this.props.gnome.professions.map((prof) => <span key={prof} className={prof.trim().replace(' ', '-').toLowerCase()}>{prof} </span>);

        return (
            <div className='d-flex d-col'>

                <div className='gnome-data-wrapper'>
                    <div className='gnome-data-container d-flex align-start'>

                        <div className='detail-img-wrapper'>
                            <img className='profile-img' src={this.props.gnome.thumbnail} alt='profile' />
                        </div>

                        <div className='gnome-name-container d-flex d-col'>
                            <div className='detail-firstName'>{this.props.gnome.name.split(' ')[0]}</div>
                            <div className='detail-lastName'>{this.props.gnome.name.split(' ')[1]}</div>
                            <div className='age'>Age: {this.props.gnome.age}</div>
                            <div className='id'>Gnome ID: {('0000' + this.props.gnome.id).slice(-4)}</div>
                        </div>

                    </div>
                </div>

                <div className='gnome-appearance-wrapper'>
                    <div className='gnome-appearance-container'>
                        <div>
                            <h1>Appearance</h1>
                        </div>
                        <div className='d-flex justify-evenly'>
                            <div className='appearance-content-row'>
                                <div>Weight: {this.props.gnome.weight.toFixed(2)} </div>
                                <div>Height: {this.props.gnome.height.toFixed(2)}</div>
                            </div>
                            <div className='appearance-content-row'>
                                <span>Hair color: <span className='hair-color' style={{ backgroundColor: this.props.gnome.hair_color }}>{this.props.gnome.hair_color}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='gnome-professions-wrapper'>
                    <div className='gnome-professions-container'>
                        <div>
                            <h1>Professions</h1>
                        </div>
                        <div className='d-flex justify-evenly'>
                            <p className='professions detail-professions'>
                                {professions}
                            </p>
                        </div>
                    </div>
                </div>

                <FriendsList gnomeFriends={this.props.gnome.friends} />

            </div>
        );
    }
}

/*
* @props gnome.friends {[str]} array holding a list of gnome's friend's names
*/
class FriendsList extends React.Component {
    render() {

        const friendItems = this.props.gnomeFriends.map(
            (friend) => <FriendItem key={friend} friend={friend} />
        );

        return (
            <div className='gnome-friends-wrapper'>
                <div className='gnome-friends-container'>
                    <h1 id='h-friends'>Friends</h1>
                    {friendItems}
                </div>
            </div>
        );
    }
}

/**
 * @props {str} gnome.friend[index] name of a gnome's friend
 */
class FriendItem extends React.Component {
    render() {

        const gnome = initialGnomes.find(gnome => gnome.name === this.props.friend);
        const professions = gnome.professions.map((prof) => <span key={prof} className={prof.trim().replace(' ', '-').toLowerCase()}>{prof} </span>);

        return (
            <div className='listItemWrapper'>
                <div className='listItemContainer d-flex'>
                    <div className='profile-img-wrapper'>
                        <img className='profile-img' src={gnome.thumbnail} alt='profile' />
                    </div>
                    <div className='profile-info-container'>
                        <div className='name-container'>
                            <span className='firstName'>{this.props.friend.split(' ')[0]} </span>
                            <span className='lastName'>{this.props.friend.split(' ')[1]}</span>
                        </div>
                        <div>
                            <p className='professions'>
                                {professions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/*
* listProfessions creates a set whose values are any possible professions the gnomes have
*
* @param json {obj} where json['brastlewark'][index].professions is an array of professions (Strings) for any given gnome
* @return Set with distinct available professions
*/
function listProfessions(json) {

    let professionsSet = new Set();

    json['Brastlewark'].forEach(e => { return e.professions.forEach(p => professionsSet.add(p)) });

    return professionsSet;

}

export default App;