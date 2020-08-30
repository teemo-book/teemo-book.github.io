// Get document element
const textDisplay = document.querySelector('#text-display');

// Initialize typing mode variables
let typingMode = 'word';
let wordCount;
let timeCount;

// Initialize dynamic variables
let teemoBook = [];
let dropDown = [];

function fetchBook() {
    fetch(`assets/teemobook.json`)
        .then(response => response.json())
        .then(json => {
            $.each(json, function (key, value) {
                teemoBook[value["Champion"]] = value;
            });
            var dropDown = $.map(json, function (value, key) {
                var obj = {};
                obj.id = key;
                obj.text = value.Champion; // replace name with the property used for the text
                return obj;
            });
            $("#champ-dropdown").select2({
                data: dropDown,
                width: 400,
                templateResult: formatState
            })
        })
        .catch(err => console.error(err));
}

function formatState(state) {
    if (!state.id) {
        return state.text;
    }
    var champName = state.text.replace(/( |\.|')/g, '');
    if(champName === "Wukong"){
        champName = 'monkeyking'
    }
    var baseUrl = "https://cdn.communitydragon.org/latest/champion";
    var $state = $(
        '<span><img src="' + baseUrl + '/' + champName  + '/square.png" class="img-flag" /> ' + state.text + '</span>'
    );
    return $state;
};

function formatHtml(bookEntry) {
    var $formatted = $(document.createElement('span'));
    var portraitUrl = "https://cdn.communitydragon.org/latest/champion";
    var runesUrl = "/assets/runes";
    var itemsUrl = "/assets/items";
    var sumsUrl = "/assets/sums";

    var champName = bookEntry.Champion.replace(/( |\.|')/g, '');
    if (champName === "Wukong") {
        champName = 'monkeyking'
    }

    // Portrait
    var portraitHtml = $(
        '<span><img src="' + portraitUrl + '/' + champName + '/square.png" class="img-flag" /> ' + champName + '</span>'
    );
    $formatted.append(portraitHtml);

    //runes
    var $runeHtml = $(
        '<div>Runes:</div>'
    );
    if (bookEntry['Rune 1v1']){
        var runes = bookEntry['Rune 1v1'].split(',');
        var rune11Html = $(
            '<div>1v1:</div>'
        );
        runes.forEach(element => {
            rune11Html.append($('<img height="75" src="' + runesUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $runeHtml.append(rune11Html);
    }
    if (bookEntry['Rune vs Burst JG']) {
        var runes = bookEntry['Rune vs Burst JG'].split(',');
        var runebjgHtml = $(
            '<div>vs Burst JG:</div>'
        );
        runes.forEach(element => {
            runebjgHtml.append($('<img height="75" src="' + runesUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $runeHtml.append(runebjgHtml);
    }
    if (bookEntry['Runes vs MS JG']) {
        var runes = bookEntry['Runes vs MS JG'].split(',');
        var runemsjgHtml = $(
            '<div>vs MS JG:</div>'
        );
        runes.forEach(element => {
            runemsjgHtml.append($('<img height="75" src="' + runesUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $runeHtml.append(runemsjgHtml);
    }
    $formatted.append($runeHtml);

    //items
    if (bookEntry['1st Core item']){
        var items = bookEntry['1st Core item'].split(',');
        var itemsHtml = $(
            '<div>1st Item:</div>'
        );
        items.forEach(element => {
            itemsHtml.append($('<img height="75" src="' + itemsUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $formatted.append(itemsHtml);
    }

    //boots
    if (bookEntry['Boots']) {
        var boots = bookEntry['Boots'].split(',');
        var bootsHtml = $(
            '<div>Boot Choices:</div>'
        );
        boots.forEach(element => {
            bootsHtml.append($('<img src="' + itemsUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $formatted.append(bootsHtml);
    }

    //sums
    if (bookEntry['Summoner Spells']) {
        var ss = bookEntry['Summoner Spells'].split(',');
        var ssHtml = $(
            '<div>Sums:</div>'
        );
        ssHtml.append($('<img src="' + sumsUrl + '/Flash.png" class="img-flag" />'));
        ss.forEach(element => {
            ssHtml.append($('<img src="' + sumsUrl + '/' + element + '.png" class="img-flag" />'));
        });
        $formatted.append(ssHtml);
    }


    return $formatted;


}



$('#champ-dropdown').on('select2:select', function (e) {
    var bookEntry = teemoBook[e.params.data.text];
    console.log(bookEntry);

    $('#guide').html(formatHtml(bookEntry));

});

$(document).ready(function () {
    fetchBook();
});