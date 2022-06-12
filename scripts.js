// 1. Assessment Details: 
//         Display the latest movie list in the page (Name, image, brief details, rating, language etc). 
//         Provide options to filter based on rating or language; option to add new movies to the list. 
//         Shall be able to sort the list based on rating or language etc

(function () {
    let moviesList = [];

    let templates = document.querySelector("#templates");
    let cardGallery = document.querySelector("#cardGallery");
    let searchBox = document.querySelector("#searchBox");
    let searchBtn = document.querySelector("#searchBtn");
    let spanAlert = document.querySelector(".spanAlert");

    let ratingRange = document.querySelector("#customRange3");
    let userBreif = document.querySelector("#userBreif");
    let inputTitle = document.querySelector("#inputTitle");
    let inputLanguage = document.querySelector("#inputLanguage");
    let inputGenre = document.querySelector("#inputGenre");
    let userRating = document.querySelector("#userRating");
    let inputLink = document.querySelector("#inputLink");

    let submitBtn = document.querySelector(".submitBtn");
    
    let closeBtn = document.querySelector("button[aria-label=Close]");

    userRating.innerText = ratingRange.value;


    let filterByLanguage = document.querySelector(".filterByLanguage");

    let filterByGenre = document.querySelector(".filterByGenre");

    let filterLanguage = [];
    let filterGenre = [];

    
    let sortByRating = document.querySelector(".sortByRating");
    let sortByName = document.querySelector(".sortByName");
    let flipR = false;
    let flipN = false;

    filterByLanguage.addEventListener("change", (event)=>{
        

        let checkboxInputs = filterByLanguage.querySelectorAll("input");
        filterLanguage = [];
        for(let i=0;i<checkboxInputs.length; i++){
            if(checkboxInputs[i].checked==true){
                filterLanguage.push(checkboxInputs[i].value);
            }
        }
        filterUtile();

    });


    filterByGenre.addEventListener("change", (event)=>{
        filterGenre = [];
        let checkboxInputs = filterByGenre.querySelectorAll("input");
        
        for(let i=0;i<checkboxInputs.length; i++){
            if(checkboxInputs[i].checked==true){
                filterGenre.push(checkboxInputs[i].value);
            }
        }
        filterUtile();

    });

    function filterUtile(){
        let newMoviesList = []

        if(filterLanguage.length==0 && filterGenre.length==0){
            return ;
        }
        else if(filterGenre.length==0){
            newMoviesList = moviesList.filter((movie,index,moviesList)=>{
                return filterLanguage.includes(movie.language);
            });
        }
        else if(filterLanguage.length==0){
            newMoviesList = moviesList.filter((movie,index,moviesList)=>{
                return filterGenre.includes(movie.language);
            });
        }
        else{
            newMoviesList = moviesList.filter((movie,index,moviesList)=>{
                return filterLanguage.includes(movie.language) && filterGenre.includes(movie.genre);
            });
        }

        cardGallery.innerHTML = null;

        newMoviesList.forEach((movie)=>{
            loadMovieCardToPage(movie);
        })
    }


    loadFromStorage();

    function loadFromStorage(){
        let sMoveList = localStorage.getItem('data');
        if(!!sMoveList){
            moviesList = JSON.parse(sMoveList);            
        }
        else{
            let noMovieTemplate = templates.content.querySelector(".noMovie");
            let noMovie = document.importNode(noMovieTemplate, true);
            spanAlert.appendChild(noMovie);

            setTimeout(()=>{
                spanAlert.removeChild(noMovie);
            }, 5000);
        }
    }

    loadToPage();

    function loadMovieCardToPage(movie) {
        let cardItemTemplate = templates.content.querySelector("#cardItem");
        let cardItem = document.importNode(cardItemTemplate, true);

        let cardImg = cardItem.querySelector("#cardImg");
        let cardTitle = cardItem.querySelector("#cardTitle");
        let cardText = cardItem.querySelector("#cardText");
        let rating = cardItem.querySelector("#rating");
        let language = cardItem.querySelector("#language");
        let genre = cardItem.querySelector("#genre");

        cardImg.setAttribute("src", movie.image);
        cardTitle.innerText = movie.name;
        cardText.innerText = movie.brief;
        rating.innerText = movie.rating;
        language.innerText = movie.language;
        genre.innerText = movie.genre;

        cardGallery.appendChild(cardItem);
    }


    function loadToPage() {
        cardGallery.innerHTML = null;
        moviesList.forEach((movie) => { loadMovieCardToPage(movie) });

    }

    searchBox.addEventListener("input", (event) => {
        let searchTitle = searchBox.value.trim();
        let cardsList = document.querySelectorAll("#cardItem");

        for (let i = 0; i < cardsList.length; i++) {
            let cardItem = cardsList[i];
            let movieTitle = cardItem.querySelector("#cardTitle").innerText;
            if (movieTitle.includes(searchTitle) == false) {
                cardItem.style.display = "none";
            }
            else {
                cardItem.style.display = "block";
            }
        }
    });

    searchBtn.addEventListener("click", () => {
        let alertTemplate = templates.content.querySelector(".alert");
        let alert = document.importNode(alertTemplate, true);

        spanAlert.appendChild(alert);

    });

    

    ratingRange.addEventListener("input", () => {
        userRating.innerText = ratingRange.value;
    });

    submitBtn.addEventListener("click", () => {

        if(inputTitle.value.trim()=="" ||inputLink.value.trim()==""|| inputLanguage.selectedIndex==0 || inputGenre.selectedIndex==0){
            let form = document.querySelector(".offcanvas-body > form");
            form.style.border = "3px solid red";
            setTimeout(()=>{
                form.style.border = "none";
            },1000);
            return ;
        }


        let newCardItem = {
            name: inputTitle.value.trim(),
            image: inputLink.value.trim(),
            brief: userBreif.value.trim(),
            rating: ratingRange.value.trim(),
            language: inputLanguage.options[inputLanguage.selectedIndex].value.trim(),
            genre: inputGenre.options[inputGenre.selectedIndex].value.trim(),
        };

        inputTitle.innerText = "";
        inputLink.innerText = "";
        userBreif.innerText = "";
        userRating.innerText = 5;
        ratingRange.value = 5;
        inputLanguage.selectedIndex = 0;
        inputGenre.selectedIndex = 0;


        moviesList.push(newCardItem);
        loadMovieCardToPage(newCardItem);

        savemoveList(moviesList);

        closeBtn.dispatchEvent(new Event("click"));
    });

    function savemoveList(){
        let sMoveList = JSON.stringify(moviesList);
        localStorage.setItem("data",sMoveList);
    }

    
    sortByRating.addEventListener("click",(event)=>{
        let currentMoviesList = document.querySelectorAll("#cardItem");
        if(flipR==true){
            flipR = false;
            sortByRating.querySelector(".material-icons").style.transform = 'scale(-1)'; 
        }
        else{
            flipR=true;
            sortByRating.querySelector(".material-icons").style.transform = 'scale(1)'; 
        }
        sortUtill(currentMoviesList, flipR, "#rating");
    });

    sortByName.addEventListener("click", (event)=>{
        let currentMoviesList = document.querySelectorAll("#cardItem");
        if(flipN==true){
            flipN = false;
            sortByName.querySelector(".material-icons").style.transform = 'scale(-1)'; 
        }
        else{
            flipN=true;
            sortByName.querySelector(".material-icons").style.transform = 'scale(1)'; 
        }
        sortUtill(currentMoviesList, flipN, "#cardTitle");
    });
    

    function sortUtill(currentMoviesList, isAssignding, id){
        let itemsArr = [];
        for(let i in currentMoviesList){
            if(currentMoviesList[i].nodeType==1){
                itemsArr.push(currentMoviesList[i]);
            }   
        }
        let f = (isAssignding?-1:1);
        itemsArr.sort(function(a, b) {
            ar = a.querySelector(id);
            br = b.querySelector(id);
            return ar.innerText == br.innerText
                    ? 0
                    : (ar.innerText > br.innerText ? 1 : -1)*f;
          });
          cardGallery.innerHTML = null;
          for (i = 0; i < itemsArr.length; ++i) {
            cardGallery.appendChild(itemsArr[i]);
          }
    }
}
)();
