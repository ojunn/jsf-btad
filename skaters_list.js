/*
 * Copyright (c) 2016 ojunn
 * https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
 * 
 * This file is distributed under MIT License.
 * See LICENSE for more information.
 */
// ==UserScript==
// @name         JSF btad Skaters List
// @author       ojunn
// @namespace    http://ojunn.github.io/jsf-btad/
// @updateURL    https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
// @downloadURL  https://raw.githubusercontent.com/ojunn/jsf-btad/master/skaters_list.js
// @version      1.1
// @match        https://www.skatingjapan.jp/btad/admin_test_entry_list.aspx
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @grant        GM_addStyle
// @noframes
// ==/UserScript==
/* jshint -W097 */

'use strict';

//CSS
GM_addStyle("\
	table {border-collapse: collapse;}\
	#aspnetForm > div:nth-child(9) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table > tbody > tr:nth-child(2) > td > div ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > table:nth-child(2) > tbody > tr > td > div ,#aspnetForm > div:nth-child(18) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > contenttemplate > table:nth-child(1) > tbody > tr:nth-child(2) > td > div {height: 1000px !important; overflow-y: scroll;}\
	#ctl00_ContentPlaceHolder1_UpdatePanel2 tr:nth-child(2n) {background-color: #eee !important ;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr th:nth-child(2) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(1) ,#ctl00_ContentPlaceHolder1_UpdatePanel2 > div > table#ctl00_ContentPlaceHolder1_GridView tr td:nth-child(2) {display: none;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 tr.memo_raw { background-color: white !important;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 td.memo_cell { background-color: #ffffdd !important;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 td.has_memo { background-color: orange;}\
    #ctl00_ContentPlaceHolder1_UpdatePanel2 td.provisional_member { background-color: orange !important;}\
");

//幅指定解除
$('table#ctl00_ContentPlaceHolder1_GridView').css('width','')

var previousRank = ''
var numberInRank = 1
var bikouQueue = [];
var es = [[],[],[],[],[],[],[],[],[]];//elements or steps
var sp       = [[],[],[],[],[],[],[],[],[]];//6SP 7SP 8SP
var fs       = [[],[],[],[],[],[],[],[],[]];

$('table#ctl00_ContentPlaceHolder1_GridView tr').each(function(i,e){
    var td = $(e).children('td,th')
    var currentRank = $(td[3]).text()
    numberInRank++

    //受験者リスト
    var rank = currentRank == '初級' ? 0 : parseInt(currentRank.replace(/級/,''))
    if(rank >=0){//アイスダンスは未対応
        if( $(td[9]).text() == '受験' || $(td[10]).text() == '受験' && rank < 6 ){
            es[rank].push($(td[4]).text())
        }
        if($(td[10]).text() == '受験' && rank >= 6){
            sp[rank].push($(td[4]).text())
        }
        if($(td[11]).text() == '受験'){
            fs[rank].push($(td[4]).text())
        }
    }

    //級で分ける
    if(previousRank != "" && currentRank != previousRank){
        $('<tr><td colspan='+(td.length)+'></td></tr><tr style="height:4px;background-color:white !important;"><td></td><td></td><td colspan='+(td.length -2)+'></td>').insertBefore($(e))
        numberInRank = 1
    }
    if(currentRank == previousRank) $(td[3]).text(numberInRank).css("font-size","x-small")
    
    //詳細ボタンを連番にする
    $($(td[2]).children('input')).val(i).css({
        width: '34px',
        height: '30px',
        fontWeight: 'bold'
    }).parent().css('padding','0')

    //省スペース、強調
    $(td[3]).css('width','30px').text($(td[3]).text().replace(/受験/,""))
    $(td[4]).css('width','80px')//名前
    $(td[5]).css({width:'16px'}).text($(td[5]).text().replace(/備考/,"備"))//備考
    if($(td[5]).text() == "○") $(td[5]).text('備').addClass('has_memo')
    $(td[6]).css({width:'16px'}).text($(td[6]).text().replace(/^\s*$/,"仮").replace(/◎/,"-").replace(/登録/,"登"))//登録
    if($(td[6]).text() == "仮") $(td[6]).addClass('provisional_member')
    $(td[9]).text($(td[9]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[10]).text($(td[10]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[11]).text($(td[11]).text().replace(/20([0-9][0-9])/,"'$1"))
    $(td[12]).css('width','240px')
    if(!$(this).text().match(/受験/)){$(this).css({color: 'gray'})}//キャンセル

    //備考取得の準備
    if(i>0 && $(td[5]).text()=="備"){
        bikouQueue.push({number: i, onloadiframe: function(){
            if(this.contentWindow.location.href.match(/admin_test_entry_list.aspx/)){
                $('#ctl00_ContentPlaceHolder1_GridView tr:nth-child('+(i+1)+') td:nth-child(3) input', this.contentWindow.document).click()
            }
            if(this.contentWindow.location.href.match(/admin_test_entry_edit.aspx/)){
                var bikou = $('#ctl00_ContentPlaceHolder1_txtNote1', this.contentWindow.document).val();
                $('<tr id="bikou_'+i+'" class="memo_raw"><td></td><td></td><td></td><td></td><td colspan="9" class="memo_cell">'+bikou+'</td></tr><tr style="display:none;"><td colspan=13"></td></tr>').insertAfter(e);//アイスダンスで動かない
                //$(td[5]).prop('title', bikou).css({backgroundColor: 'yellow'}).click(function(){$('#bikou_'+i).toggle();});
            }
        }});
    }
    
    previousRank = currentRank
})

//ボタン追加
$('\
  <tr>\
  <td><input type="button" name="" value="備考一括取得" onclick="javascript:return false;" id="button_for_bikou" style="font-family:ＭＳ Ｐゴシック;font-size:Small;width:150px;"></td>\
  <td><input type="button" name="" value="手控え印刷" onclick="javascript:return false;" id="button_for_marking_sheets" style="font-family:ＭＳ Ｐゴシック;font-size:Small;width:150px;"></td>\
  <td><input type="button" name="" value="級別リスト" onclick="javascript:return false;" id="button_for_list" style="font-family:ＭＳ Ｐゴシック;font-size:Small;width:150px;"></td>\
  <td>&nbsp;</td></tr>\
  <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>\
').insertAfter($('#aspnetForm > div:nth-child(9) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2)'))

//備考取得
$('#button_for_bikou').click(function(){
    for(var i=0; i<bikouQueue.length; i++){
        $('<iframe id="'+"detail_frame_"+bikouQueue[i].number+'" style="width:1px;height:1px;visibility:hidden;"></iframe>').appendTo($('body')).load(bikouQueue[i].onloadiframe).prop('src', window.location.href);
    }
})

//年月日
var matches = $('#ctl00_ContentPlaceHolder1_lblTest').text().match(/\[([0-9]+)\/([0-9]+)\/([0-9]+)\]/)
var year = matches[1]
var month = matches[2]
var day = matches[3]

//実施連盟
matches = $('#ctl00_lblUser').text().match(/【(.+[都道府県])/)
var host = matches[1]

//テスト種別
var isSingleTest  = !! $('#ctl00_ContentPlaceHolder1_lblTest').text().match(/シングル/)
var isSpecialTest = !! $('#ctl00_ContentPlaceHolder1_lblTest').text().match(/特別/)

//手控え作成
if(isSingleTest && !isSpecialTest){
    showMarkingSheet('https://raw.githubusercontent.com/ojunn/jsf-btad/master/template/es.html', es, "es")
    showMarkingSheet('https://raw.githubusercontent.com/ojunn/jsf-btad/master/template/sp.html', sp, "sp")
    showMarkingSheet('https://raw.githubusercontent.com/ojunn/jsf-btad/master/template/fs.html', fs, "fs")
}else{
    $('#button_for_marking_sheets').prop('disabled', true)
}
    
//受験者リスト作成
if(isSingleTest){
    if(isSpecialTest){
        $('#button_for_list').click(function(){
            var print = window.open('', "popupWindow", "width=832,height=650,scrollbars=no");
            print.document.write('<html><body><table><tr><td>&nbsp;</td><th>7級</th><th>8級</th></tr><tr><th>要素</th><td id="es-7"></td><td id="es-8"></td></tr><tr><th>SP</th><td id="sp-7"></td><td id="sp-8"></td></tr><tr><th>FS</th><td id="fs-7"></td><td id="fs-8"></td></tr></body></html>')
            var template = '<textarea style="width:8em; height: 15em; display:inline-block;"></textarea>';
            $(es).each(function(i,val){
                if(i>6 && val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#es-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#es-'+i, print.document))
                }
            })
            $('<br>').appendTo($('body', print.document))
            $(sp).each(function(i,val){
                if(i>6 && val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#sp-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#sp-'+i, print.document))
                }
            })
            $('<br>').appendTo($('body', print.document))
            $(fs).each(function(i,val){
                if(i>6 && val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#fs-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#fs-'+i, print.document))
                }
            })
        })
    }else{
        $('#button_for_list').click(function(){
            var print = window.open('', "popupWindow", "width=832,height=650,scrollbars=no");
            print.document.write('<html><body><table><tr><td>&nbsp;</td><th>初級</th><th>1級</th><th>2級</th><th>3級</th><th>4級</th><th>5級</th><th>6級</th></tr><tr><th>要素<br>ST</th><td id="es-0"></td><td id="es-1"></td><td id="es-2"></td><td id="es-3"></td><td id="es-4"></td><td id="es-5"></td><td id="es-6"></td></tr><tr><th>SP</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td id="sp-6"></td></tr><tr><th>FS</th><td>&nbsp;</td><td>&nbsp;</td><td id="fs-2"></td><td id="fs-3"></td><td id="fs-4"></td><td id="fs-5"></td><td id="fs-6"></td></tr></body></html>')
            var template = '<textarea style="width:8em; height: 15em; display:inline-block;"></textarea>';
            $(es).each(function(i,val){
                if(val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#es-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#es-'+i, print.document))
                }
            })
            $('<br>').appendTo($('body', print.document))
            $(sp).each(function(i,val){
                if(val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#sp-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#sp-'+i, print.document))
                }
            })
            $('<br>').appendTo($('body', print.document))
            $(fs).each(function(i,val){
                if(val.length >0){
                    $(template).html(val.join("\n")).appendTo($('body td#fs-'+i, print.document)).focus(function(){this.select()})
                }else{
                    $(template).html("").appendTo($('body td#fs-'+i, print.document))
                }
            })
        })
    }
}else{
    $('#button_for_list').prop('disabled', true)
}

/**
 * 
 * @param String templateUrl
 * @param String[] skaters
 * @param String type : es | sp | fs
 * @returns null 
 */
function showMarkingSheet(templateUrl, skaters, type){
    $.ajax({
        url: templateUrl,
        success: function(data){
            $('#button_for_marking_sheets').click(function(){
                var print = window.open('', "popupWindow", "width=1160,height=830,scrollbars=no");
                print.document.write(data)
                $('.basic_information .host', print.document).text(host)
                $('.basic_information .date .year', print.document).text(year)
                $('.basic_information .date .month', print.document).text(month)
                $('.basic_information .date .day', print.document).text(day)
                
                for(var i=0;i<9;i++){
                	var className = "grade-"+i+( i > 1 ? type : "" );
                    if(skaters[i].length <1){
                        $("section."+className, print.document).hide();
                    }else{
                        $(skaters[i]).each(function(j,val){
                            var raw = $("section."+className+" table.marking_sheet tbody tr:nth-child("+(j+1)+")", print.document);
                            $("th", raw)[0].innerHTML = j+1
                            $("td", raw)[0].innerHTML = val
                        })
                    }
                }
                return false;
            })
        }
    })
}

//$('<iframe id="sheet" style="" src="https://uunf.o.mize.jp/jsf-btad/template/1.html"></iframe>').appendTo($('body')).ready(function(){console.log('hi')})
