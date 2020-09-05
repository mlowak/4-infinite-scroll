let endOfThePage = 0;

// zdarza się, że dane pobierają się dwukrotnie za pomocą preloading (i w getData) można działać przeciwko temu
// zabezpieczenie przed podwójnym pobieraniem danych
let preloading = false;

// Preloader
const showPreloader = () => {

    let preloader = document.getElementById('preloader');
    console.log(`showPreloader()`);
    preloader.style.display = 'block';
    preloading = true;
}

const hidePreloader = () => {

    let preloader = document.getElementById('preloader');
    console.log(`hidePreloader()`);
    preloader.style.display = 'none';
    preloading = false;
}



const getData = () => {

    // sprawdzanie czy preloading nie jest na false, musi być z zaprzeczeniem '!', ponieważ jeśli będzie miało wartość false to wtedy chcemy aby ten warunek został spełniony
    // kiedy warunek jest zaprzeczony (czyli nie jest się w trakcie preloadingu) to powinno się odpalić funckję fetch
    if (!preloading) {

        showPreloader();

        fetch('https://akademia108.pl/api/ajax/get-users.php')
            .then(res => res.json())
            .then(data => {

                // tutaj hr pokazuje miejsce, od którego pobrały się nowe dane
                let body = document.body;
                let hr = document.createElement('hr');
                body.appendChild(hr);

                // dane są pobrane w tablicy, dlatego też robi się pętlę
                for (let user of data) {
                    let pId = document.createElement('p');
                    let pName = document.createElement('p');
                    let pWebsite = document.createElement('p');

                    pId.innerText = `User ID: ${user.id}`;
                    pName.innerText = `Name: ${user.name}`;
                    pWebsite.innerHTML = `User URL: ${user.website}<br />-----------`;

                    body.appendChild(pId);
                    body.appendChild(pName);
                    body.appendChild(pWebsite);
                }

                // Perloader znika kiedy dane zostały już pobrane i pojawiły się
                hidePreloader();

                console.log(data);
            })
            .catch(error => {
                console.log(error);
            });
    }

}

const scrollToEndOfPage = () => {

    let d = document.documentElement;

    // wysokość zawartości elementu (np strony), włączając do tego zawartość niewidoczną na ekranie
    let scrollHeight = d.scrollHeight;

    // wartość liczby pikseli, o którą element został przeskrollowany od góry
    let scrollTop = d.scrollTop;

    // wewnętrzna wysokość elementu w pikselach (np w stronie - wewnętrzna wysokość okna przeglądarki)
    let clientHeight = d.clientHeight;

    // trzeba wypisać sumę scrollTop i clientHeight, po to aby potem sprawdzać czy one wynoszą tyle co scrollHeight
    // Math.ceil = są przypadki gdzie przeglądarka sumę pokazuje poniżej scrollHeight, wtedy używa się to do zaokrąglenia tej sumy w górę
    let sumScrollTopClientHeight = Math.ceil(scrollTop + clientHeight);

    console.log(`scrollHeight: ${scrollHeight}`);
    console.log(`sumScrollTopClientHeight: ${sumScrollTopClientHeight}`);
    console.log(`scrollTop: ${scrollTop}`);
    console.log(`clientHeight: ${clientHeight}`);
    console.log(`=======================`);

    // niesktóre przeglądarki pokazują tylko wartość w ułamkach lub liczby całkowite, dlatego też trzeba wziąć pod uwagę obydwie opcje (większe niż lub równe)
    if (sumScrollTopClientHeight >= scrollHeight) {

        endOfThePage += 1;

        console.log(`Scrolled to the end of page: ${endOfThePage}`);

        getData();
    }
}

window.addEventListener('scroll', scrollToEndOfPage);