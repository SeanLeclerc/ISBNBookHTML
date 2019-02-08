var bibliotheque = (function() {
    // Liste des livres
    var livres = [];

    // Ajouter un livre
    var addLivre = function(livre) {
        // Ajouter le livre dans la liste
        livres.push(livre);

        // Ajouter le livre dans l'interface graphique
        var select = document.getElementById("bookSelector");
        var option = document.createElement("option");
        option.text = livre.titre;
        option.value = livre.isbn;
        select.add(option);

        // Vider les champs
        clearFields();
    };

    // Modifier un livre
    var modifierLivre = function(index, livre) {
        // Modifier le livre dans la liste
        livres.splice(index, 1, livre);

        // Modifier le livre dans l'interface graphique
        var selecteur = document.getElementById("bookSelector");
        selecteur.options[selecteur.selectedIndex].text = livre.titre;
        selecteur.options[selecteur.selectedIndex].value = livre.isbn;

        // Vider les champs
        clearFields();
    };

    // Supprimer un livre
    var supprimerLivre = function(index) {
        // Supprimer le livre de la liste
        livres.splice(index, 1);

        // Supprimer le livre dans l'interface graphique
        document.getElementById("bookSelector").remove(index);

        // Vider les champs
        clearFields();
    };

    // Vider les champs
    var clearFields = function() {
        // Vider les valeurs dans les champs
        document.getElementById("isbn").value = "";
        document.getElementById("titre").value = "";
        document.getElementById("auteur").value = "";
        document.getElementById("editeur").value = "";
        document.getElementById("date").value = "";
        document.getElementById("description").value = "";
        document.getElementById("categorie").selectedIndex = 0;

        // Déselectionner le livre sélectionné
        document.getElementById("bookSelector").selectedIndex = -1;

        // Désactiver les boutons modifier et supprimer
        document.getElementById("modifier").disabled = true;
        document.getElementById("supprimer").disabled = true;
    };

    // Créer un livre à partir des inputs
    var getLivreFromChamps = function() {
        // Créer le livre à partir des champs
        var livre = {};
        livre["isbn"] = document.getElementById("isbn").value;
        livre["titre"] = document.getElementById("titre").value;
        livre["auteur"] = document.getElementById("auteur").value;
        livre["editeur"] = document.getElementById("editeur").value;
        livre["date"] = document.getElementById("date").value;
        livre["description"] = document.getElementById("description").value;
        livre["categorie"] = document.getElementById("categorie").value;

        // Retourner le livre créé
        return livre;
    };

    // Valide qu'un champ n'est pas vide
    var champRequis = function(input) {
        if (input.value.trim() === "") {
            input.value = "";
            input.classList.add("is-invalid");
            return false;
        }
        else {
            input.classList.remove("is-invalid");
            return true;
        }
    };

    // Valide qu'un champ est une date
    var champDate = function (input) {
        if (moment(input.value, "YYYY-MM-DD").isValid()) {
            input.classList.remove("is-invalid");
            return true;
        }
        else {
            input.classList.add("is-invalid");
            return false;
        }
    };

    // Valide tous les champs
    var estValide = function() {
        var isbnValide = champRequis(document.getElementById("isbn"));
        var titreValide = champRequis(document.getElementById("titre"));
        var auteurValide = champRequis(document.getElementById("auteur"));
        var editeurValide = champRequis(document.getElementById("editeur"));
        var dateValide = champRequis(document.getElementById("date")) &&
                         champDate(document.getElementById("date"));
        var descriptionValide = champRequis(document.getElementById("description"));

        return isbnValide &&
            titreValide &&
            auteurValide &&
            editeurValide &&
            dateValide &&
            descriptionValide;
    };

    return {
        // Ajouter un livre
        ajouter: function() {
            // Valider les champs
            if (estValide()) {
                // Créer le livre
                var livre = getLivreFromChamps();
                
                // Ajouter le livre dans la base de données
                serveurBiblio.ajouterLivre(livre);

                // Ajouter le livre
                addLivre(livre);
            }
        },

        // Modifier un livre
        modifier: function() {
            // Valider les champs
            if (estValide()) {
                // Index de l'élément sélectionné
                var bookSelector = document.getElementById("bookSelector");
                var index = bookSelector.selectedIndex;
                var isbn = bookSelector.value;

                // Créer le livre modifié
                var livre = getLivreFromChamps();

                // Modifier le livre dans la base de données
                serveurBiblio.modifierLivre(isbn);

                // Modifier le livre
                modifierLivre(index, livre);
            }
        },

        // Supprimer un livre
        supprimer: function() {
            // Index de l'élément sélectionné
            var bookSelector = document.getElementById("bookSelector");
            var index = bookSelector.selectedIndex;
            var isbn = bookSelector.value;

            // Supprimer le livre dans la base de données
            serveurBiblio.supprimerLivre(isbn);

            // Supprimer le livre
            supprimerLivre(index);
        },

        // Sélectionner un livre
        selection: function() {
            // Index de l'élément sélectionné
            var index = document.getElementById("bookSelector").selectedIndex;

            // Mettre les valeurs dans les champs
            document.getElementById("isbn").value = livres[index].isbn;
            document.getElementById("titre").value = livres[index].titre;
            document.getElementById("auteur").value = livres[index].auteur;
            document.getElementById("editeur").value = livres[index].editeur;
            document.getElementById("date").value = livres[index].date;
            document.getElementById("description").value = livres[index].description;
            document.getElementById("categorie").value = livres[index].categorie;

            // Activer les boutons modifier et supprimer
            document.getElementById("modifier").disabled = false;
            document.getElementById("supprimer").disabled = false;
        },

        // Chercher les catégories sur le serveur
        onload: function () {
            serveurBiblio.getCategories(function (response) {
                var select = document.getElementById("categorie");
                for (var i = 0; i < response.length; i++) {
                    var option = document.createElement("option");
                    option.text = response[i].nom;
                    option.value = response[i].id;
                    select.add(option);
                }
            });

            serveurBiblio.getListeLivres(function (response) {
                var select = document.getElementById("bookSelector");
                for (var i = 0; i < response.length; i++) {
                    var livre = {
                        isbn: response[i].isbn,
                        titre: response[i].titre,
                        auteur: response[i].auteur,
                        editeur: response[i].editeur,
                        date: response[i].date_sortie,
                        description: response[i].description,
                        categorie: response[i].id_categorie
                    };

                    addLivre(livre);
                }
            });
        }
    };
})();