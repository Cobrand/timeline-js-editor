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

                <h2>A quoi sert le champ "groupe" ?</h2>
                <p>Le champ groupe sert à regrouper vos évenements dans votre
                timeline. Les élements du même groupe seront si possible placés
                sur la même ligne.<br /> Si ce n'est pas possible, vos
                évenements seront placés le plus proche possible les uns des
                autres </p>
                <h2>J'ai oublié mon mot de passe; comment puis-je récupérer mon compte ?</h2>
                <p> Bien que cette fonctionnalité soit prévue pour le futur,
                il n'est pas possible de réinitialiser un mot de passe perdu
                pour l'instant. Il est en revanche possible de demander aux
                administrateurs du site de remplacer le mot de passe actuel par
                un nouveau généré aléatoirement </p>
                <h2> Quels sont les médias supportés par timeline ? </h2>
                <p> Les médias supportés par timeline sont indiqués sur
                <a href="https://timeline.knightlab.com/docs/media-types.html">
                cette page </a>.<br /> Il est possible que des médias de cette
                liste ne supportent pas la prévisualisation intégrée dans l'éditeur;
                les médias indiqués dans la liste ci dessus marcheront quand
                même dans la timeline exportée ! Seule la prévisualisation dans
                l'éditeur est indisponible dans ce type cas.</p>
                <h2> J'ai une suggestion / un problème ! Qui puis-je contacter </h2>
                <p> Pour l'instant, vous pouvez nous contacter aux adresses suivantes :
                andres.franco@etu.univ-nantes.fr , mikael.fourrier@etu.univ-nantes.fr
                <br /> Nous ferons de notre mieux pour intégrer les suggestions et améliorations proposées
                <br /> Prenez en compte que cet éditeur <b> est un éditeur en bêta</b>
                et que des problèmes peuvent arriver. Si jamais vous avez une
                timeline importante, pensez à la sauvegarder sur votre machine
                pour éviter toute mauvaise surprise !</p>
            </div>
        );
    }
});
