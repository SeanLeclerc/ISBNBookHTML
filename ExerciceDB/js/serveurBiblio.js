var serveurBiblio = (function() {
    var httpBase = function (methode, url, traitement, donnees) {
        var httpReq = new XMLHttpRequest();

        httpReq.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                traitement(this.response);
            }
        };

        httpReq.responseType = "json";
        httpReq.open(methode, url, true);
        httpReq.setRequestHeader("Content-Type", "application/json");
        httpReq.send(JSON.stringify(donnees));

        return httpReq;
    };

    return {
        getCategories: function (traitement) {
            httpBase("GET", "categorie.php", traitement);
        },

        getListeLivres: function(traitement) {
            httpBase("GET", "livre.php", traitement);
        },

        ajouterLivre: function (livre) {
            httpBase("POST", "livre.php", function () { }, livre)
        },

        modifierLivre: function(isbn, livre) {
            // ... code ici ...
        },

        supprimerLivre: function(isbn) {
            httpBase("DELETE", "livre.php", function () { }, isbn)
        }
    };
})();