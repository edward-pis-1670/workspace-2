import React from 'react'
import { connect } from 'react-redux'
import { setGenres } from '../actions'
import { Link } from 'react-router'
import { getAllGenres } from '../apis/genres'


class SubGenre extends React.Component {
    render() {
        return (
            <li>
                <Link to={'/courses/' + this.props.genreId + '/' + Number(this.props.subgenre._id)}>
                    {this.props.subgenre.name}
                </Link>
            </li>
        );
    }
}
class ListSubGenre extends React.Component {
    render() {
        let arrColor = ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo']
        let subgenres = this.props.genre.subgenres.map((subgenre) => {
            return (
                <SubGenre key={subgenre._id} subgenre={subgenre} genreId={this.props.genre._id} />
            )
        })
        return (
            <li>
                <Link to={'/courses/' + this.props.genre._id}>
                    {this.props.genre.name}
                    <span className='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>
                </Link>
                <ul className='sub-list'
                    style={{ backgroundColor: arrColor[Math.floor(Math.random() * arrColor.length)] }}>
                    <li className='sub-title'>{this.props.genre.name}</li>
                    {subgenres}
                </ul>
            </li>
        );
    }
}
class ListGenre extends React.Component {

    componentDidMount() {
        if (this.props.genreList.length > 0) {
            return
        }
        getAllGenres((result) => {
            this.props.dispatch(setGenres(JSON.parse(result)))
        })
    }

    render() {
        let genres
        if (this.props.genreList) {
            genres = this.props.genreList.map((genre) => {
                return (
                    <ListSubGenre key={genre._id} genre={genre} />
                )
            })
        }
        return (
            <div id='wrapper'>
                <link rel="stylesheet" href="/stylesheets/simple-sidebar-courses.css" />
                <ul className="sidebar">
                    {genres}
                </ul>
                <div className='main-content'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

ListGenre = connect((state) => {
    return { genreList: state.genreList }
})(ListGenre)

export default ListGenre