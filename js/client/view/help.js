import React from "react";

export const Help = React.createClass({
    propTypes: {
        handleClose: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div className="help">
                <button className="closepopup"
                        name="close_json"
                        type="button"
                        onClick={this.props.handleClose}>
                    ×
                </button>

                <h1>Contexte</h1>
                <p>
                    Cette éditeur de timelines pour <a href="https://timeline.knightlab.com/">TimelineJS</a> a été réalisé pendant l'année scolaire 2015-2016 par Mikaël Fourrier et Andrès Franco, étudiants à <a href="http://web.polytech.univ-nantes.fr/">Polytech Nantes</a>, pour le cluster <a href="http://www.ouestmedialab.fr/">Ouest Médialab</a>. Le code source est disponible à l'adresse suivante : <a href="https://gitlab.univ-nantes.fr/E149324J/interface.js/">https://gitlab.univ-nantes.fr/E149324J/interface.js/</a>, sous licence <a href="https://www.mozilla.org/en-US/MPL/2.0/">MPL v2.0</a>
                </p>

                <h1>FAQ</h1>

                <h2>« J'y arrive pas ! »</h2>
                <p>Tant pis.</p>
            </div>
        );
    }
});
