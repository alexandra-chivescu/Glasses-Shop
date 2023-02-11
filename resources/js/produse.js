window.onload = function () {
    document.getElementById("filtrare").onclick = function () {

        //verif inputuri
        condValidare=true;
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        condValidare = condValidare && inpNume.match(new RegExp("^[a-zA-Z]*$"));

        if(!condValidare) {
            alert("Inputuri gresite");
            return; 
        }

        var inpCategorie = document.getElementById("inp-categorie").value;

        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            var cond1 = false, cond2 = false;
            produs.style.display = "none";

            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if (nume.includes(inpNume)) {
                var cond1 = true;
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML;
            if (inpCategorie == "toate" || categorie == inpCategorie) {
                var cond2 = true;
            }

            if (cond1 && cond2) {
                produs.style.display = "block";
            }
        }
    }

    document.getElementById("resetare").onclick = function () {
        //resetare produse
        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            produs.style.display = "block";
        }

        //resetare filtre 
        document.getElementById("inp-nume").value;
        document.getElementById("sel-toate").selected = true;
    }

    document.getElementById("sortCrescNume").onclick = function () {

        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse); 

        var p = document.createElement("p");
        p.innerHTML="hello world"; 
        document.body.appendChild(p);

        v_produse.sort(function(a,b) {
            var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a == pret_b) {
               var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
               var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
               return nume_a.localeCompare(nume_b);
            }
            return pret_a - pret_b;
        })
    }

    document.getElementById("sortCrescNume").onclick = function () {
        sorteaza(1); 
    }

    document.getElementById("sortDescrescNume").onclick = function () {
        sorteaza(-1); 
    }

    window.onkeydown = function(e) {
        if(e.key=='c' && e.altKey) {
            var produse = document.getElementsByClassName("produs");
            let suma = 0;
            for(let prod of produse) {
                if(prod.style.display!="none") {
                  suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                }
            }
            if(!document.getElementById("rezultat")) {
                rezultat = document.createElement("p");
                rezultat.id = "rezultat";
                rezultat.innerHTML = "<b>Pret total: </b>" + suma; 
                document.getElementById("produse").appendChild(rezultat); 
                var ps = document.getElementById("p-suma"); 
                ps.parentNode.insertBefore(rezultat, ps.nextSibling);
                rezultat.style.border="1px solid purple";
                rezultat.onclick= function() {
                    this.remove;
                }

                setTimeout(function () {
                    document.getElementById("rezultat").remove(); 
                }, 2000);
            }
        }
    }
}