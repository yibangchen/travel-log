/**
 * Created by yibang on 10/11/16.
 */

$(document).ready(function(){
    $(".text").hide();
    $(".keys").hide();

    $("#button1").click(function(){
        // get a random tag
        $(".text").show();
        $("#keylist").html("");
        linkcount = 1;
        unmodify();
        var txtid = Object.keys(keywordmap)[Math.floor(Math.random() * Object.keys(keywordmap).length)]
        modify(txtid, keywordmap[txtid]);
    });

    $(".text").on("click", "a", function(){
        nexttag = $(this).attr('href').substring(1);
        $("#keylist").html($("#keylist").html() + " - " +  $(this).text());
        unmodify();
        modify(nexttag, keywordmap[nexttag]);
    });

    if (linkcount == 10) {
        $(".text").hide();
        $(".keys").hide();
    }
});


// find the first index that there is a match
function findmatch(txtstr, key) {
    var m = txtstr.length;
    var n = key.length;
    for (i = 0; i < m - n+1; i++) {
        if (txtstr.charAt(i) === key.charAt(0)) {
            if (txtstr.substring(i, i+n) === key) {
                return [i, i+n];
            }
        }
    }
    return -1;
}

function findindex(txtstr, keywords) {
    var ret = [];
    for (var i in keywords) {
        ans = findmatch(txtstr, keywords[i].trim());
        if (ans !== -1)
            ret.push(ans);
    }
    ret.sort(function(a, b) {
        return a[0]-b[0];
    });
    return ret;
}

function findlink(key, tag) {
    for (var i in wordbag) {
        for (var j in wordbag[i]) {
            if (key == wordbag[i][j][0] && tag == wordbag[i][j][1]) {
                var ind = j;
                while (ind == j)
                    ind = Math.floor(Math.random() * wordbag[i].length);
                return wordbag[i][ind][1];
            }
        }
    }
    return "";
}

function addhref(txtstr, keywords, currtag) {
    var indexpairs = findindex(txtstr, keywords);
    var retstr = "";
    for (var i in indexpairs){
        var keyword = txtstr.substring(indexpairs[i][0],indexpairs[i][1]);
        if (i == 0) {
            retstr += txtstr.substring(0, indexpairs[0][0]);
        } else {
            retstr += txtstr.substring(indexpairs[i-1][1], indexpairs[i][0]);
        }
        //find where to link to
        var dest = "#"+findlink(keyword, currtag);
        retstr += "<a class='link' href='" + dest +"'>" + keyword + "</a>"
    }
    retstr += txtstr.substring(indexpairs[indexpairs.length-1][1]);
    return retstr;
}

function modify(tagname, keywords) {
    var newcss = {};
    prevtag = tagname;
    prevcss = {};
    prevtext = $("#"+tagname).text();

    // add hrefs
    var newhtml = addhref(prevtext, keywordmap[tagname], tagname);
    $("#"+tagname).text("");
    $("#"+tagname).append(newhtml);

    // fix font size
    var fontSize = parseInt($("#"+tagname).css("font-size"));
    prevcss["font-size"] = fontSize + "px";
    newcss["font-size"] = fontSize * 2 + "px";

    // fix color
    prevcss["color"] = $("#"+tagname).css("color");
    newcss["color"] = 'red';

    prevcss["z-index"] = $("#"+tagname).css("z-index");
    newcss["z-index"] = '2';

    prevcss["width"] = $("#"+tagname).css("width");
    newcss["width"] = '170%';

    $("#"+tagname).css(newcss);
    linkcount += 1;
}

function unmodify() {
    $("#"+prevtag).css(prevcss);
    $("#"+prevtag).text(prevtext);
}

var prevtag = "";
var prevtext = "";
var prevcss = {};
var linkcount = 0;

function getliststr(list){
    var ret = "";
    for (var i in list)
        ret += list[i];
    return ret;
}

var wordbag = [
    [["bright","6-5"], ["pale","6-9"],["shine","1-3"], ["dark","6-8"], ["light-pulses","2-11"]],
    [["Blue","6-9"], ["red","6-5"], ["colours","1-6"], ["Color","11-8"]],
    [["endless","1-3"], ["endlessly","10-5"], ["stopped","5-8"], ["ended","1-6"]],
    [["close","3-3"], ["opening","12-1"], ["starts","13-3"], ["intersections","11-8"]],
    [["circle","3-3"], ["circuit","2-9"], ["circulating","2-11"], ["around","1-3"]],
    [["waist","6-8"], ["leg","6-6"], ["cross-legged","6-14"], ["face","12-5"]],
    [["life","3-3"], ["life","10-5"], ["lives","10-3"], ["lived","5-5"], ["hard","6-8"]],
    [["door","4-8"], ["door","4-14"], ["window","12-1"]],
    [["wood","6-6"], ["wooden","4-8"], ["silk","6-14"]],
    [["felt","6-6"], ["joy","10-3"], ["Moody","1-3"]],
    [["mother","4-8"], ["father","13-3"], ["father","4-14"]],
    [["women","10-5"], ["feminists","10-3"],["gender","11-8"]],
    [["morning","12-5"], ["breakfast","4-14"], ["coffee","6-5"]],
    [["South","5-8"], ["North","5-5"]],
    [["protocol","2-9"], ["code","2-11"]],
    [["sun","1-3"],["Sun","6-9"]]
];

var keywordmap = {
    "1-3":["Moody","sun","shine","endless","around"],
    "1-6":["colours","ended"],
    "2-9":["circuit","protocol"],
    "2-11":["code","circulating","light-pulses"],
    "3-3":["close","circle","life"],
    "4-8":["wooden","door","mother"],
    "4-14":["father","door","breakfast"],
    "5-5":["lived","North"],
    "5-8":["stopped","South"],
    "6-5":["bright","red","coffee"],
    "6-6":["leg","wood","felt"],
    "6-8":["dark","hard","waist"],
    "6-9":["Blue","pale","Sun"],
    "6-14":["silk","cross-legged"],
    "10-3":["lives","feminists","joy"],
    "10-5":["endlessly","life","women"],
    "11-8":["intersections","gender","Color"],
    "12-1":["window","opening"],
    "12-5":["face","morning"],
    "13-3":["starts","father"]
};

function StringSet() {
    var setObj = {}, val = {};

    this.add = function(str) {
        setObj[str] = val;
    };

    this.contains = function(str) {
        return setObj[str] === val;
    };

    this.remove = function(str) {
        delete setObj[str];
    };

    this.values = function() {
        var values = [];
        for (var i in setObj) {
            if (setObj[i] === val) {
                values.push(i);
            }
        }
        return values;
    };
}
