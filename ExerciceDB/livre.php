<?php
    // Initialiser la connexion � la base de donn�es
    try{
		$conn = new PDO(
			"mysql:host=localhost;port=3306;dbname=bibliotheque",
			"root",
			""
		);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e){
		echo "Erreur: ".$e->getMessage();
	}

    // Retourner tous les livres de la base de donn�es
    function getLivres(){
        try{
			global $conn;
			$stmt = $conn->prepare("SELECT * FROM livre");
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		}
		catch(PDOException $e){
			echo "Erreur: ".$e->getMessage();
		}
    }

    // Ajouter un livre dans la base de donn�es
    function ajouterLivre($isbn, $titre, $auteur, $editeur, $date, $desc, $categorie){
        try{
			global $conn;
			$stmt = $conn->prepare(
				"INSERT INTO livre(isbn, titre, auteur, editeur, date_sortie, description, id_categorie) ".
				"VALUES(:isbn, :titre, :auteur, :editeur, :date, :desc, :categorie);"
			);
			$stmt->bindParam(":isbn", $isbn);
			$stmt->bindParam(":titre", $titre);
			$stmt->bindParam(":auteur", $auteur);
			$stmt->bindParam(":editeur", $editeur);
			$stmt->bindParam(":date", $date);
			$stmt->bindParam(":desc", $desc);
			$stmt->bindParam(":categorie", $categorie);
			$stmt->execute();
		}
		catch(PDOException $e){
			echo "Erreur: ".$e->getMessage();
		}
    }

    // Modifier un livre dans la base de donn�es
    function modifierLivre($oldIsbn, $isbn, $titre, $auteur, $editeur, $date, $desc, $categorie){
               try{
			global $conn;
			$stmt = $conn->prepare(
				"PUT INTO livre(isbn, titre, auteur, editeur, date_sortie, description, id_categorie) ".
				"VALUES(:isbn, :titre, :auteur, :editeur, :date, :desc, :categorie);"
			);
			$stmt->bindParam(":isbn", $isbn);
			$stmt->bindParam(":titre", $titre);
			$stmt->bindParam(":auteur", $auteur);
			$stmt->bindParam(":editeur", $editeur);
			$stmt->bindParam(":date", $date);
			$stmt->bindParam(":desc", $desc);
			$stmt->bindParam(":categorie", $categorie);
			$stmt->execute();
		}
		catch(PDOException $e){
			echo "Erreur: ".$e->getMessage();
		}
    }

    // Supprimer un livre de la base de donn�es
    function supprimerLivre($isbn){
                try{
			global $conn;
			$stmt = $conn->prepare("DELETE FROM livre WHERE isbn = :isbn;");
			$stmt->bindParam(":isbn", $isbn);
			$stmt->execute();
		}
		catch(PDOException $e){
			echo "Erreur: ".$e->getMessage();
		}
    }

    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        // Appel � ce fichier avec la m�thode GET
        header('Content-Type: application/json');
        echo json_encode(getLivres());
    }
    else if($_SERVER['REQUEST_METHOD'] == 'POST'){
        // Appel � ce fichier avec la m�thode POST
        $livre = json_decode(file_get_contents("php://input"), true);
        if($livre != null){
            ajouterLivre(
                $livre['isbn'], 
                $livre['titre'], 
                $livre['auteur'], 
                $livre['editeur'], 
                $livre['date'], 
                $livre['description'], 
                $livre['categorie']
            );
        }
    }
    else if($_SERVER['REQUEST_METHOD'] == 'PUT'){
        // Appel � ce fichier avec la m�thode PUT
        $modification = json_decode(file_get_contents("php://input"), true);
        if($modification != null){
            $oldIsbn = $modification["isbn"];
            $livre = $modification["livre"];

            modifierLivre(
                $oldIsbn,
                $livre['isbn'], 
                $livre['titre'], 
                $livre['auteur'], 
                $livre['editeur'], 
                $livre['date'], 
                $livre['description'], 
                $livre['categorie']
            );
        }
    }
    else if($_SERVER['REQUEST_METHOD'] == 'DELETE'){
        // Appel � ce fichier avec la m�thode DELETE
        $isbn = json_decode(file_get_contents("php://input"), true);
        if($isbn != null){
            supprimerLivre($isbn);
        }
    }

    // Fermer la connexion � la base de donn�es
    $conn = null;
?>