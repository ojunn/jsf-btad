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
$('table#ctl00_ContentPlaceHolder1_GridView tr').each(function(i,e){
    var td = $(e).children('td,th')
    var currentRank = $(td[3]).text()
    numberInRank++
    
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

    if(i>0 && $(td[5]).text()=="備"){
        bikouQueue.push({number: i, onloadiframe: function(){
            if(this.contentWindow.location.href.match(/admin_test_entry_list.aspx/)){
                $('#ctl00_ContentPlaceHolder1_GridView tr:nth-child('+(i+1)+') td:nth-child(3) input', this.contentWindow.document).click()
            }
            if(this.contentWindow.location.href.match(/admin_test_entry_edit.aspx/)){
                var bikou = $('#ctl00_ContentPlaceHolder1_txtNote1', this.contentWindow.document).val();
                $('<tr id="bikou_'+i+'" class="memo_raw"><td></td><td></td><td></td><td></td><td colspan="9" class="memo_cell">'+bikou+'</td></tr><tr style="display:none;"><td colspan=13"></td></tr>').insertAfter(e);
                //$(td[5]).prop('title', bikou).css({backgroundColor: 'yellow'}).click(function(){$('#bikou_'+i).toggle();});
            }
        }});
    }
    
    previousRank = currentRank
})

for(var i=0; i<bikouQueue.length; i++){
    $('<iframe id="'+"detail_frame_"+bikouQueue[i].number+'" style="width:1px;height:1px;visibility:hidden;"></iframe>').appendTo($('body')).load(bikouQueue[i].onloadiframe).prop('src', window.location.href);
}

