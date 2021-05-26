import React from 'react';
var PDF = require('./PDF');

var App = React.createClass({
    getInitialState: function() {
        return {
            currentPage: 1,
            pages: 0,
            file: 'example.pdf'
        };
    },
    prevPage: function(ev) {
        ev.preventDefault();
        this.setState({
            currentPage: this.state.currentPage > 1 ? this.state.currentPage - 1 : 1
        });
    },
    nextPage: function(ev) {
        ev.preventDefault();
        this.setState({ currentPage: this.state.currentPage < this.state.pages ? this.state.currentPage + 1 : this.state.pages });
    },
    onFileChange: function(ev) {
        this.setState({
            file: ev.target.files[0]
        });
    },
    render: function() {
        return (
            <div className="container">
                <h1>PDF.js + React = &lt;3</h1>
                <div>
                    <label>
                        Change file<br />
                        <input type="file" onChange={this.onFileChange} />
                    </label>
                </div>
                <PDF  file={this.state.file} onDocumentComplete={this._onDocumentComplete} />
                <div>
                    <button onClick={this.prevPage}>Previous page</button>
                    <button onClick={this.nextPage}>Next page</button>
                </div>
            </div>
        );
    },
    _onDocumentComplete: function(pages) {
        this.setState({ pages: pages });
    }
});

module.exports = App